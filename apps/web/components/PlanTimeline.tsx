'use client';

import { useRef, useState } from 'react';
import type { Place } from '@zendi/shared';
import type { ScheduledStop } from '../app/lib/planner/types';
import { toHHMM, formatDuration } from '../app/lib/planner/time';
import { placeTypeLabels } from '../app/lib/labels';

/**
 * 드래그 재정렬 가능한 하루 타임라인.
 *
 * 의존성 없이 Pointer 이벤트로 구현 — 마우스/터치 모두 동작한다.
 * 시각은 들고 있지 않고 `stops` 로 내려받아 표시만 하며, 순서가 바뀌면
 * `onReorder(새 순서)` 로 부모에 알려 reschedulePlan() 으로 시각이 재파생된다.
 *
 * 드래그 동작:
 *  - 그립(≡)을 눌러 끌면 해당 행만 손가락을 따라 움직이고(translateY),
 *  - 행들 사이에 삽입 위치 표시선이 나타난다(행 높이가 달라도 정확).
 *  - 놓으면 새 순서를 커밋한다.
 */
export function PlanTimeline({
  stops,
  onReorder,
}: {
  stops: ScheduledStop[];
  onReorder: (places: Place[]) => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  /** 드래그 시작 시점에 캡처한 각 행 중심 Y좌표 (원래 위치 기준). */
  const centersRef = useRef<number[]>([]);
  const startYRef = useRef(0);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  /** 끌고 있는 행의 Y 이동량(px). */
  const [offset, setOffset] = useState(0);
  /** 삽입 위치 (0..n, 행 j 앞). */
  const [insertAt, setInsertAt] = useState<number | null>(null);

  function measureCenters(): number[] {
    const list = listRef.current;
    if (!list) return [];
    return Array.from(list.children).map((li) => {
      const r = (li as HTMLElement).getBoundingClientRect();
      return r.top + r.height / 2;
    });
  }

  function handlePointerDown(index: number, e: React.PointerEvent) {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    centersRef.current = measureCenters();
    startYRef.current = e.clientY;
    setDragIndex(index);
    setOffset(0);
    setInsertAt(index);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (dragIndex === null) return;
    const centers = centersRef.current;
    const dy = e.clientY - startYRef.current;
    setOffset(dy);

    const draggedCenter = centers[dragIndex] + dy;
    let at = centers.length;
    for (let j = 0; j < centers.length; j++) {
      if (draggedCenter < centers[j]) {
        at = j;
        break;
      }
    }
    setInsertAt(at);
  }

  function handlePointerUp() {
    if (dragIndex === null || insertAt === null) {
      reset();
      return;
    }
    // 삽입 위치가 제자리(자기 앞/뒤)면 변화 없음.
    if (insertAt !== dragIndex && insertAt !== dragIndex + 1) {
      const places = stops.map((s) => s.place);
      const [moved] = places.splice(dragIndex, 1);
      const adj = insertAt > dragIndex ? insertAt - 1 : insertAt;
      places.splice(adj, 0, moved);
      onReorder(places);
    }
    reset();
  }

  function reset() {
    setDragIndex(null);
    setOffset(0);
    setInsertAt(null);
  }

  return (
    <ul ref={listRef} className="relative">
      {stops.map((stop, i) => {
        const type = placeTypeLabels[stop.place.type];
        const dragging = i === dragIndex;
        const showLineBefore = dragIndex !== null && insertAt === i && i !== dragIndex;
        const showLineAfterLast =
          dragIndex !== null && insertAt === stops.length && i === stops.length - 1;

        return (
          <li
            key={stop.place.id}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative pb-3 last:pb-0"
            style={
              dragging
                ? { transform: `translateY(${offset}px)`, zIndex: 20, position: 'relative' }
                : undefined
            }
          >
            {/* 삽입 위치 표시선 */}
            {showLineBefore && (
              <span className="absolute -top-1.5 left-0 right-0 h-0.5 rounded-full bg-zendi-blue-500" />
            )}

            <div
              className={`flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 transition-shadow ${
                dragging ? 'ring-2 ring-zendi-blue-400 shadow-lg' : 'ring-gray-100'
              }`}
            >
              {/* 시각 컬럼 */}
              <div className="flex w-12 shrink-0 flex-col items-center pt-1">
                <span className="text-sm font-bold text-zendi-blue-700">
                  {toHHMM(stop.arriveMin)}
                </span>
                <span className="mt-0.5 text-[10px] text-gray-400">
                  {formatDuration(stop.place.stay)}
                </span>
              </div>

              {/* 이모지 */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zendi-blue-50 text-2xl">
                {stop.place.emoji}
              </div>

              {/* 본문 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate text-sm font-bold text-gray-900">{stop.place.name}</h3>
                  <span className="shrink-0 text-xs font-semibold text-zendi-orange-600">
                    ⭐ {stop.place.rating.toFixed(1)}
                  </span>
                </div>
                <span
                  className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${type.badge}`}
                >
                  {type.emoji} {type.label}
                </span>
              </div>

              {/* 드래그 그립 */}
              <button
                type="button"
                aria-label="순서 변경"
                onPointerDown={(e) => handlePointerDown(i, e)}
                className="flex w-7 shrink-0 cursor-grab touch-none items-center justify-center text-gray-300 active:cursor-grabbing"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
                  <circle cx="6" cy="4" r="1.4" />
                  <circle cx="12" cy="4" r="1.4" />
                  <circle cx="6" cy="9" r="1.4" />
                  <circle cx="12" cy="9" r="1.4" />
                  <circle cx="6" cy="14" r="1.4" />
                  <circle cx="12" cy="14" r="1.4" />
                </svg>
              </button>
            </div>

            {/* 이동 버퍼 (마지막 정거장 제외) */}
            {stop.transferToNextMin > 0 && !dragging && (
              <div className="flex items-center gap-1.5 pl-12 pt-2 text-[11px] text-gray-400">
                <span>↓</span>
                <span>이동 {formatDuration(stop.transferToNextMin)}</span>
              </div>
            )}

            {/* 맨 끝 삽입선 */}
            {showLineAfterLast && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-zendi-blue-500" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
