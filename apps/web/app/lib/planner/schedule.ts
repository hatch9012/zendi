import type { Place } from '@zendi/shared';
import type { ScheduledStop, TransportMode, RangeDensity } from './types';
import { transferMinutes } from './transfer';

/**
 * 순수 함수: 장소 순서 + 출발시각 → 각 정거장의 도착/출발 시각 파생.
 *
 * 추천 생성(recommend)과 드래그 재정렬에서 **동일하게** 사용한다.
 * 시간을 상태로 들지 않고 순서로부터 매번 파생하므로, 순서만 바꾸면
 * 시간은 항상 일관되게 재계산된다.
 */
export function schedule(
  places: Place[],
  departMin: number,
  transport: TransportMode,
  range: RangeDensity,
): ScheduledStop[] {
  const transfer = transferMinutes(transport, range);
  const stops: ScheduledStop[] = [];
  let cursor = departMin;

  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const isLast = i === places.length - 1;
    const arriveMin = cursor;
    const stopDepartMin = arriveMin + place.stay;
    stops.push({
      place,
      arriveMin,
      departMin: stopDepartMin,
      transferToNextMin: isLast ? 0 : transfer,
    });
    cursor = stopDepartMin + (isLast ? 0 : transfer);
  }

  return stops;
}
