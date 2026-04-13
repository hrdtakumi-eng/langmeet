import { createSupabaseServerClient } from "@/lib/supabase-server";
import { type DbEvent } from "@/lib/supabase";
import JoinButton from "./JoinButton";

function isFull(current: number, max: number) {
  return current >= max;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export default async function EventsPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: events, error }, { data: { user } }] = await Promise.all([
    supabase.from("events").select("*").order("date", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  // ログイン中なら参加済みイベントIDを取得
  let joinedIds = new Set<string>();
  if (user) {
    const { data: participations } = await supabase
      .from("participations")
      .select("event_id");
    joinedIds = new Set(
      (participations ?? []).map((p) => (p as { event_id: string }).event_id)
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-red-500">イベントの取得に失敗しました。</p>
        </div>
      </main>
    );
  }

  const eventList: DbEvent[] = events ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-blue-600 text-sm hover:underline">
            ← ホームに戻る
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-1">
            イベント一覧
          </h1>
          <p className="text-gray-500">
            {eventList.length}件のイベントが開催予定です
          </p>
        </div>

        {/* Event Cards */}
        {eventList.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">まだイベントがありません</p>
            <a
              href="/events/new"
              className="mt-4 inline-block text-blue-600 hover:underline text-sm"
            >
              最初のイベントを作成する →
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {eventList.map((event) => {
              const full = isFull(event.participants_current, event.participants_max);
              const ratio = event.participants_current / event.participants_max;
              const hasJoined = joinedIds.has(event.id);

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        {event.name}
                      </h2>
                      <p className="text-sm text-gray-400 mt-0.5">{event.name_en}</p>
                    </div>
                    <span className="shrink-0 bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                      🇯🇵 日本語 ↔ English 🇺🇸
                    </span>
                  </div>

                  {/* Info row */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1.5">
                      <span>📅</span>
                      {formatDate(event.date)}　{event.time}〜
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span>📍</span>
                      {event.location}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-4">{event.description}</p>

                  {/* Participants */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>参加者</span>
                        <span className={full ? "text-red-500 font-semibold" : ""}>
                          {event.participants_current} / {event.participants_max}名
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            full
                              ? "bg-red-400"
                              : ratio >= 0.8
                              ? "bg-amber-400"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${Math.min(ratio * 100, 100).toFixed(0)}%` }}
                        />
                      </div>
                    </div>

                    <JoinButton
                      eventId={event.id}
                      full={full}
                      hasJoined={hasJoined}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
