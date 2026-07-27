import { regions, placesByRegion, allPlaces } from '@zendi/shared';
import { RegionCard } from '../components/RegionCard';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto min-h-screen max-w-mobile bg-gray-50">
        {/* 헤더 */}
        <header className="bg-gradient-to-br from-zendi-blue-600 to-zendi-blue-800 px-5 pb-8 pt-10 text-white">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-xl">
              🌅
            </span>
            <span className="text-xl font-bold">Zendi</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold leading-snug">
            오늘 어디로
            <br />
            떠나볼까요?
          </h1>
          <p className="mt-2 text-sm text-zendi-blue-100">
            전국 {regions.length}개 지역 · {allPlaces.length}곳의 여행지
          </p>
        </header>

        {/* 지역 그리드 */}
        <section className="px-5 py-6">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">지역 선택</h2>
          <div className="grid grid-cols-2 gap-3">
            {regions.map((region) => (
              <RegionCard
                key={region.code}
                region={region}
                count={placesByRegion[region.code].length}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
