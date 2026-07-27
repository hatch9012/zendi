import Link from 'next/link';

export default function RegionNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-mobile rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
        <span className="text-4xl">🧭</span>
        <h1 className="mt-4 text-lg font-bold text-gray-900">지역을 찾을 수 없어요</h1>
        <p className="mt-2 text-sm text-gray-500">존재하지 않는 지역이에요.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-zendi-blue-600 px-5 py-2 text-sm font-semibold text-white active:scale-95"
        >
          지역 선택으로
        </Link>
      </div>
    </main>
  );
}
