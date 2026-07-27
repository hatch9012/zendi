import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isRegion, regionMeta, placesByRegion, REGION_ORDER } from '@zendi/shared';
import { PlaceCard } from '../../../components/PlaceCard';

/** 14개 지역을 정적 생성 */
export function generateStaticParams() {
  return REGION_ORDER.map((id) => ({ id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  if (!isRegion(params.id)) return { title: 'Zendi' };
  const meta = regionMeta[params.id];
  return { title: `${meta.name} 여행 - Zendi`, description: meta.tagline };
}

export default function RegionPage({ params }: { params: { id: string } }) {
  if (!isRegion(params.id)) notFound();

  const meta = regionMeta[params.id];
  const places = placesByRegion[params.id];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto min-h-screen max-w-mobile bg-gray-50">
        {/* 헤더 */}
        <header className="bg-gradient-to-br from-zendi-blue-600 to-zendi-blue-800 px-5 pb-6 pt-10 text-white">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-zendi-blue-100">
            ← 지역 선택
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-4xl">{meta.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold">{meta.name}</h1>
              <p className="text-sm text-zendi-blue-100">{meta.tagline}</p>
            </div>
          </div>
          <p className="mt-3 text-sm font-medium text-zendi-blue-100">총 {places.length}곳</p>
          <Link
            href={`/plan?region=${meta.code}`}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-white py-3 text-sm font-bold text-zendi-blue-700 transition active:scale-[0.98]"
          >
            🗺️ {meta.name} 하루 코스 만들기
          </Link>
        </header>

        {/* 장소 리스트 */}
        <section className="space-y-3 px-5 py-6">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </section>
      </div>
    </main>
  );
}
