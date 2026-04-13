import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { type DbEvent } from "@/lib/supabase";
import JoinButton from "./JoinButton";

function isFull(current: number, max: number) {
  return current >= max;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
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
      <main className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <p className="text-red-500">イベントの取得に失敗しました。</p>
        </div>
      </main>
    );
  }

  const eventList: DbEvent[] = events ?? [];

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            イベント一覧
          </h1>
          <p className="text-slate-500">
            {eventList.length}件のイベントが開催予定です
          </p>
        </div>

        {eventList.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-semibold text-slate-600 mb-2">
              まだイベントがありません
            </p>
            <a
              href="/events/new"
              className="mt-2 inline-block text-sky-600 hover:text-sky-700 text-sm font-semibold hover:underline"
            >
              最初のイベントを作成する →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventList.map((event) => {
              const full = isFull(event.participants_current, event.participants_max);
              const ratio = event.participants_current / event.participants_max;
              const hasJoined = joinedIds.has(event.id);

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col"
                >
                  {/* Thumbnail */}
                  {event.image_url ? (
                    <a href={`/events/${event.id}`}>
                      <div className="relative w-full h-44">
                        <Image
                          src={event.image_url}
                          alt={event.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </a>
                  ) : (
                    <a href={`/events/${event.id}`}>
                      <div className="w-full h-28 bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                        <span className="text-4xl">🗣️</span>
                      </div>
                    </a>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    {/* Badge + Title */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <a href={`/events/${event.id}`}>
                          <h2 className="text-lg font-bold text-gray-900 leading-snug hover:text-blue-600 transition-colors">
                            {event.name}
                          </h2>
                        </a>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {event.name_en}
                        </p>
                      </div>
                      <span className="shrink-0 bg-sky-50 text-sky-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-sky-100">
                        🇯🇵↔🇺🇸
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col gap-1 text-sm text-slate-500 mb-3">
                      <span>📅 {formatDate(event.date)}　{event.time}〜</span>
                      <span>📍 {event.location}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                      {event.description}
                    </p>

                    {/* Progress + Join */}
                    <div className="flex items-center gap-4 mt-auto">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>参加者</span>
                          <span className={full ? "text-red-400 font-semibold" : "font-medium text-slate-600"}>
                            {event.participants_current}/{event.participants_max}名
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              full
                                ? "bg-red-400"
                                : ratio >= 0.8
                                ? "bg-amber-400"
                                : "bg-gradient-to-r from-blue-500 to-sky-400"
                            }`}
                            style={{ width: `${Math.min(ratio * 100, 100).toFixed(0)}%` }}
                          />
                        </div>
                      </div>
                      <JoinButton eventId={event.id} full={full} hasJoined={hasJoined} />
                    </div>
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
