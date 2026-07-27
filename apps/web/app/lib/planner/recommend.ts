import type { Place } from '@zendi/shared';
import { placesByRegion } from '@zendi/shared';
import type { PlanInput, DayPlan, CompanionType, ScheduledStop } from './types';
import { schedule } from './schedule';
import { transferMinutes, maxStops } from './transfer';
import { hourOf } from './time';

/** 동행 유형 → goodFor 태그. */
const COMPANION_GOODFOR: Record<CompanionType, string> = {
  couple: '연인',
  friends: '친구',
  family: '가족',
  pet: '반려견',
};

/** 한 정거장 최소 의미 체류시간 — 이보다 적게 남으면 코스 종료. */
const MIN_REMAINING = 30;

/** 점심/저녁 슬롯 시간대 (시). */
const LUNCH_WINDOW = { start: 11, end: 13 };
const DINNER_WINDOW = { start: 17, end: 19 };

/** 반려동물 동반 가능 여부 (강한 필터). */
function isPetOk(place: Place): boolean {
  return place.goodFor.includes('반려견') || place.petFriendly === true;
}

/**
 * 후보 풀 구성.
 * - pet 선택 시: 반려동물 가능 장소만 (강한 필터)
 * - couple/friends/family: 필터하지 않음 (대부분 장소에 붙어있어 점수 가산으로 처리)
 */
function candidatePool(input: PlanInput): Place[] {
  const all = placesByRegion[input.region] ?? [];
  if (input.companions.includes('pet')) {
    return all.filter(isPetOk);
  }
  return all;
}

/** 동행 가산점 — couple/friends/family 매칭 시 가산 (pet 은 이미 필터됨). */
function companionBonus(place: Place, companions: CompanionType[]): number {
  let b = 0;
  for (const c of companions) {
    if (c === 'pet') continue;
    if (place.goodFor.includes(COMPANION_GOODFOR[c])) b += 1.2;
  }
  return b;
}

/** 시간대 적합도 — bestTime 에 해당 시각이 들어있으면 높게. */
function timeFit(place: Place, hour: number): number {
  if (place.bestTime.includes(hour)) return 2;
  if (place.bestTime.some((h) => Math.abs(h - hour) <= 1)) return 1;
  return 0;
}

/** 식사/다양성 보정 — 슬롯 시각·이전 타입에 따른 가감점. */
function slotBoost(
  place: Place,
  hour: number,
  hasLunch: boolean,
  hasDinner: boolean,
  prevType: Place['type'] | null,
): number {
  let b = 0;
  const inLunch = hour >= LUNCH_WINDOW.start && hour <= LUNCH_WINDOW.end && !hasLunch;
  const inDinner = hour >= DINNER_WINDOW.start && hour <= DINNER_WINDOW.end && !hasDinner;

  if (inLunch || inDinner) {
    const want = inLunch ? '점심' : '저녁';
    if (place.type === 'meal' && place.mealType?.includes(want)) b += 6;
    else if (place.type === 'meal') b += 3;
    else b -= 1; // 식사 슬롯엔 식사를 우선
  } else if (place.type === 'meal') {
    b -= 2; // 식사 시간대가 아니면 식사 장소는 후순위
  }

  // 타입 다양성: 직전과 같은 타입이면 약한 감점
  if (prevType && place.type === prevType) b -= 1.5;

  return b;
}

/** 종합 점수. */
function score(
  place: Place,
  hour: number,
  companions: CompanionType[],
  hasLunch: boolean,
  hasDinner: boolean,
  prevType: Place['type'] | null,
): number {
  const ratingScore = place.rating * 1.5; // ~6.0~7.5
  const popScore = Math.min(place.visitors / 100, 4) * 0.5;
  return (
    ratingScore +
    popScore +
    timeFit(place, hour) +
    companionBonus(place, companions) +
    slotBoost(place, hour, hasLunch, hasDinner, prevType)
  );
}

/** 식사 시간대를 코스가 지나는지(식사 슬롯 필요 여부). */
function windowCoversHour(departMin: number, returnMin: number, hour: number): boolean {
  return hourOf(departMin) <= hour && hourOf(returnMin) >= hour;
}

/**
 * 규칙 기반 하루 동선 추천 (MVP, AI API 없음).
 *
 * 1) 지역 + 동행(pet) 필터로 후보 풀 구성
 * 2) 출발→복귀 예산 안에서 greedy 로 한 정거장씩 선택
 *    (시간대 적합도 · 평점/인기 · 동행 가산 · 식사슬롯 · 타입 다양성 점수화)
 * 3) 선택된 순서를 schedule() 에 넣어 시각 파생 → 드래그 경로와 동일 산출
 */
export function recommendPlan(input: PlanInput): DayPlan {
  const { departMin, returnMin, transport, range, companions } = input;
  const transfer = transferMinutes(transport, range);
  const cap = maxStops(range);

  const needLunch = windowCoversHour(departMin, returnMin, 12);
  const needDinner = windowCoversHour(departMin, returnMin, 18);

  const pool = candidatePool(input);
  const used = new Set<string>();
  const ordered: Place[] = [];

  let cursor = departMin;
  let hasLunch = !needLunch; // 코스가 점심을 안 지나면 이미 충족 처리
  let hasDinner = !needDinner;
  let prevType: Place['type'] | null = null;

  while (ordered.length < cap) {
    const remaining = returnMin - cursor;
    if (remaining < MIN_REMAINING) break;

    const hour = hourOf(cursor);
    let best: Place | null = null;
    let bestScore = -Infinity;

    for (const place of pool) {
      if (used.has(place.id)) continue;
      if (place.stay > remaining) continue; // 복귀시각 초과 방지
      const s = score(place, hour, companions, hasLunch, hasDinner, prevType);
      if (s > bestScore) {
        bestScore = s;
        best = place;
      }
    }

    if (!best) break;

    used.add(best.id);
    ordered.push(best);
    prevType = best.type;

    // 식사 충족 갱신
    if (best.type === 'meal') {
      if (!hasLunch && hour >= LUNCH_WINDOW.start && hour <= LUNCH_WINDOW.end) hasLunch = true;
      else if (!hasDinner && hour >= DINNER_WINDOW.start && hour <= DINNER_WINDOW.end)
        hasDinner = true;
    }

    cursor = cursor + best.stay + transfer;
  }

  const stops = schedule(ordered, departMin, transport, range);
  return summarize(input, stops);
}

/** 정거장 목록 → DayPlan 요약. */
function summarize(input: PlanInput, stops: ScheduledStop[]): DayPlan {
  const totalStayMin = stops.reduce((sum, s) => sum + s.place.stay, 0);
  const totalTransferMin = stops.reduce((sum, s) => sum + s.transferToNextMin, 0);
  const endMin = stops.length ? stops[stops.length - 1].departMin : input.departMin;
  return {
    input,
    stops,
    totalStayMin,
    totalTransferMin,
    endMin,
    leftoverMin: input.returnMin - endMin,
  };
}

/**
 * 드래그 재정렬용: 이미 선택된 장소들의 새 순서로 시각만 재계산.
 * recommend 와 동일한 schedule() 을 써서 시간 산출이 항상 일관된다.
 */
export function reschedulePlan(input: PlanInput, places: Place[]): DayPlan {
  const stops = schedule(places, input.departMin, input.transport, input.range);
  return summarize(input, stops);
}
