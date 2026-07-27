import type { Place, Region } from '@zendi/shared';

/** 교통수단 — 좌표 데이터가 없어 거리계산 대신 고정 이동버퍼 모델에 매핑된다. */
export type TransportMode = 'walk' | 'transit' | 'car';

/** 이동 범위 = 코스 밀도. 이동버퍼 배율 + 장소 수 상한을 조절한다. */
export type RangeDensity = 'tight' | 'normal' | 'wide';

/** 동행 유형. pet 은 강한 필터, 나머지는 점수 가산. */
export type CompanionType = 'couple' | 'friends' | 'family' | 'pet';

/** 플랜 생성 입력값 (입력 화면에서 수집). */
export interface PlanInput {
  region: Region;
  /** 출발 시각 (00:00 기준 분). 예: 09:00 → 540 */
  departMin: number;
  /** 복귀 시각 (00:00 기준 분). 예: 19:00 → 1140 */
  returnMin: number;
  transport: TransportMode;
  range: RangeDensity;
  /** 복수 선택. pet 포함 시 반려동물 동반 가능 장소만 후보. */
  companions: CompanionType[];
}

/** 타임라인의 한 정거장 — 장소 + 파생된 도착/출발 시각. */
export interface ScheduledStop {
  place: Place;
  /** 도착 시각 (분) */
  arriveMin: number;
  /** 출발 시각 (분) = 도착 + 체류시간 */
  departMin: number;
  /** 다음 장소까지 이동 버퍼 (분). 마지막 정거장은 0. */
  transferToNextMin: number;
}

/** 하루 플랜 = 정거장 목록 + 요약. */
export interface DayPlan {
  input: PlanInput;
  stops: ScheduledStop[];
  /** 체류시간 합 (분) */
  totalStayMin: number;
  /** 이동시간 합 (분) */
  totalTransferMin: number;
  /** 마지막 정거장 출발 시각 (분). 정거장 없으면 departMin. */
  endMin: number;
  /** 복귀시각 대비 여유 (분). 음수면 복귀시각 초과. */
  leftoverMin: number;
}
