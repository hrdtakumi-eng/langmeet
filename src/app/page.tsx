export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          LangMeet
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          日英言語交換イベントプラットフォーム
        </p>
        <p className="text-lg text-gray-500 mb-10">
          Japanese–English Language Exchange
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/events"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            イベントを探す
          </a>
          <a
            href="/events/new"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            イベントを作成
          </a>
        </div>
      </div>
    </main>
  );
}
