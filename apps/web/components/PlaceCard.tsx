import type { Place } from '@zendi/shared';
import { placeTypeLabels } from '../app/lib/labels';

/** 동행/편의 배지 정의 */
function badges(place: Place): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  if (place.petFriendly) out.push({ key: 'pet', label: '🐶 반려견' });
  if (place.kidsZone) out.push({ key: 'kids', label: '🧒 키즈존' });
  if (place.noKidsZone) out.push({ key: 'nokids', label: '🚫 노키즈' });
  return out;
}

export function PlaceCard({ place }: { place: Place }) {
  const type = placeTypeLabels[place.type];
  const extras = badges(place);

  return (
    <article className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      {/* 이모지 썸네일 */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zendi-blue-50 text-3xl">
        {place.emoji}
      </div>

      <div className="min-w-0 flex-1">
        {/* 이름 + 평점 */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-bold text-gray-900">{place.name}</h3>
          <span className="shrink-0 text-sm font-semibold text-zendi-orange-600">
            ⭐ {place.rating.toFixed(1)}
          </span>
        </div>

        {/* 타입 배지 + 동행 배지 */}
        <div className="mt-1 flex flex-wrap items-center gap-1">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${type.badge}`}>
            {type.emoji} {type.label}
          </span>
          {extras.map((b) => (
            <span
              key={b.key}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
            >
              {b.label}
            </span>
          ))}
        </div>

        {/* 설명 (2줄 클램프) */}
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">{place.desc}</p>
      </div>
    </article>
  );
}
