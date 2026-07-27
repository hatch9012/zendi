import type { PlaceType } from '@zendi/shared';

/** PlaceType → 한글 라벨 + 배지 색상(Tailwind 클래스) */
export const placeTypeLabels: Record<
  PlaceType,
  { label: string; emoji: string; badge: string }
> = {
  nature: { label: '자연', emoji: '🌿', badge: 'bg-emerald-50 text-emerald-700' },
  culture: { label: '문화', emoji: '🏛️', badge: 'bg-violet-50 text-violet-700' },
  meal: { label: '맛집', emoji: '🍽️', badge: 'bg-zendi-orange-50 text-zendi-orange-700' },
  cafe: { label: '카페', emoji: '☕', badge: 'bg-amber-50 text-amber-700' },
  shopping: { label: '쇼핑', emoji: '🛍️', badge: 'bg-sky-50 text-sky-700' },
};
