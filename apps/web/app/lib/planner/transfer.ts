import type { TransportMode, RangeDensity } from './types';

/**
 * 장소 간 고정 이동 버퍼 (분).
 * Place 데이터에 좌표가 없어 실제 거리 계산이 불가능하므로,
 * 교통수단별 평균 이동시간을 고정값으로 사용한다.
 */
const BASE_TRANSFER: Record<TransportMode, number> = {
  walk: 15,
  transit: 35,
  car: 20,
};

/** 코스 밀도 → 이동버퍼 배율. 좁게=가까이 모아 짧게, 넓게=멀리 길게. */
const RANGE_MULTIPLIER: Record<RangeDensity, number> = {
  tight: 0.7,
  normal: 1.0,
  wide: 1.4,
};

/** 장소 수 상한. 좁게=촘촘히 많이, 넓게=여유있게 적게. */
const MAX_STOPS: Record<RangeDensity, number> = {
  tight: 6,
  normal: 5,
  wide: 4,
};

/** 교통수단 + 코스 밀도 → 장소 간 이동 버퍼(분). */
export function transferMinutes(transport: TransportMode, range: RangeDensity): number {
  return Math.round(BASE_TRANSFER[transport] * RANGE_MULTIPLIER[range]);
}

/** 코스 밀도 → 추천 장소 수 상한. */
export function maxStops(range: RangeDensity): number {
  return MAX_STOPS[range];
}
