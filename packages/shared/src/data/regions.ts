import type { Region } from '../types/place';

/** 지역 메타데이터 (표시용 한글명 + 대표 이모지 + 한 줄 소개) */
export interface RegionMeta {
  /** 지역 코드 */
  code: Region;
  /** 한글 지역명 */
  name: string;
  /** 대표 이모지 */
  emoji: string;
  /** 한 줄 소개 */
  tagline: string;
}

/** 14개 지역 메타. 배열 순서 = 홈 화면 노출 순서(장소 수 많은 곳 우선). */
export const regions: RegionMeta[] = [
  { code: 'sokcho', name: '속초', emoji: '🌊', tagline: '설악과 동해 사이' },
  { code: 'gangneung', name: '강릉', emoji: '☕', tagline: '커피와 바다의 도시' },
  { code: 'yangyang', name: '양양', emoji: '🏄', tagline: '서핑의 성지' },
  { code: 'gyeongju', name: '경주', emoji: '🏯', tagline: '천년 고도' },
  { code: 'yangpyeong', name: '양평', emoji: '🌿', tagline: '남한강 자연 휴식' },
  { code: 'busan', name: '부산', emoji: '🌉', tagline: '바다 위 도시 야경' },
  { code: 'yeoju', name: '여주', emoji: '🏺', tagline: '도자기와 강변 들판' },
  { code: 'gapyeong', name: '가평', emoji: '🚠', tagline: '북한강 레저 천국' },
  { code: 'paju', name: '파주', emoji: '📚', tagline: '책과 평화의 길' },
  { code: 'jeonju', name: '전주', emoji: '🍲', tagline: '한옥과 비빔밥' },
  { code: 'ilsan', name: '일산', emoji: '🏙️', tagline: '호수공원의 도시' },
  { code: 'namyangju', name: '남양주', emoji: '🚲', tagline: '북한강 라이딩' },
  { code: 'yeosu', name: '여수', emoji: '🌃', tagline: '낭만의 밤바다' },
  { code: 'gimpo', name: '김포', emoji: '✈️', tagline: '도심 속 들녘' },
];

/** 지역 코드 → 메타 매핑 (O(1) 조회) */
export const regionMeta: Record<Region, RegionMeta> = regions.reduce(
  (acc, r) => {
    acc[r.code] = r;
    return acc;
  },
  {} as Record<Region, RegionMeta>,
);

/** 노출 순서대로 정렬된 지역 코드 목록 */
export const REGION_ORDER: Region[] = regions.map((r) => r.code);

/** 유효한 지역 코드인지 확인 (동적 라우트 검증용) */
export function isRegion(value: string): value is Region {
  return value in regionMeta;
}
