export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
        <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-600 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          🌐 日英言語交換プラットフォーム
        </div>

        <h1 className="text-6xl font-extrabold text-gray-900 mb-5 tracking-tight leading-tight">
          Lang
          <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            Meet
          </span>
        </h1>

        <p className="text-xl text-slate-500 mb-3 max-w-lg mx-auto leading-relaxed">
          日本語と英語を学びたい人が集まる
        </p>
        <p className="text-lg text-slate-400 mb-12">
          Japanese–English Language Exchange
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/events"
            className="bg-gradient-to-r from-blue-600 to-sky-500 text-white px-9 py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-sky-600 transition-all shadow-md hover:shadow-lg"
          >
            イベントを探す
          </a>
          <a
            href="/events/new"
            className="bg-white border border-slate-200 text-slate-700 px-9 py-3.5 rounded-xl font-semibold hover:border-sky-300 hover:text-sky-600 transition-all shadow-sm hover:shadow"
          >
            イベントを作成
          </a>
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: "🗓️",
              title: "イベントを探す",
              desc: "近くで開催される言語交換イベントを見つけよう",
              color: "from-blue-50 to-sky-50 border-sky-100",
            },
            {
              icon: "✋",
              title: "参加する",
              desc: "気軽にイベントへ参加して新しい仲間を作ろう",
              color: "from-sky-50 to-cyan-50 border-cyan-100",
            },
            {
              icon: "🎉",
              title: "主催する",
              desc: "あなた自身がイベントを企画して仲間を集めよう",
              color: "from-indigo-50 to-blue-50 border-indigo-100",
            },
          ].map(({ icon, title, desc, color }) => (
            <div
              key={title}
              className={`bg-gradient-to-br ${color} border rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-bold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
