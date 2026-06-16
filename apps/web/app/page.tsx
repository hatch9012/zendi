export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zendi-blue-600 to-zendi-blue-900 p-6">
      <div className="max-w-mobile w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zendi-blue-600 mb-6"><span className="text-3xl">🌅</span></div>
        <h1 className="text-4xl font-bold text-zendi-blue-600 mb-3">Zendi</h1>
        <p className="text-gray-600 text-sm mb-8">눈 뜨자마자 나의 하루가 시작된다</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zendi-orange-50 text-zendi-orange-700 rounded-full text-xs font-medium">✨ v14 Alpha - Next.js + TypeScript</div>
      </div>
    </main>
  );
}
