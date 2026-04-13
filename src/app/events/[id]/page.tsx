import Image from "next/image";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { type DbEvent } from "@/lib/supabase";
import JoinButton from "../JoinButton";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function isFull(current: number, max: number) {
  return current >= max;
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: event }, { data: { user } }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).single(),
    supabase.auth.getUser(),
  ]);

  if (!event) notFound();

  const e = event as DbEvent;
  const full = isFull(e.participants_current, e.participants_max);
  const ratio = e.participants_current / e.participants_max;

  let hasJoined = false;
  if (user) {
    const { data } = await supabase
      .from("participations")
      .select("id")
      .eq("event_id", id)
      .single();
    hasJoined = !!data;
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <a
          href="/events"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors mb-6"
        >
          ← イベント一覧に戻る
        </a>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Hero image */}
          {e.image_url ? (
            <div className="relative w-full h-72">
              <Image
                src={e.image_url}
                alt={e.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          ) : (
            <div className="w-full h-44 bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 flex items-center justify-center">
              <span className="text-6xl">🗣️</span>
            </div>
          )}

          <div className="p-8">
            {/* Badge + Title */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">
                  {e.name}
                </h1>
                <p className="text-slate-400 text-sm">{e.name_en}</p>
              </div>
              <span className="shrink-0 bg-sky-50 text-sky-600 text-sm font-semibold px-3 py-1.5 rounded-full border border-sky-100">
                🇯🇵 日本語 ↔ English 🇺🇸
              </span>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-3 bg-sky-50 rounded-2xl px-4 py-3.5 border border-sky-100">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-xs text-sky-500 font-semibold uppercase tracking-wide">
                    開催日時
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {formatDate(e.date)}　{e.time}〜
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-sky-50 rounded-2xl px-4 py-3.5 border border-sky-100">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="text-xs text-sky-500 font-semibold uppercase tracking-wide">
                    場所
                  </p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {e.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                イベント詳細
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {e.description}
              </p>
            </div>

            {/* Participants + Join */}
            <div className="bg-slate-50 rounded-2xl px-6 py-5 flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-600">参加者</span>
                  <span
                    className={`font-bold ${full ? "text-red-500" : "text-slate-800"}`}
                  >
                    {e.participants_current} / {e.participants_max}名
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      full
                        ? "bg-red-400"
                        : ratio >= 0.8
                        ? "bg-amber-400"
                        : "bg-gradient-to-r from-blue-500 to-sky-400"
                    }`}
                    style={{ width: `${Math.min(ratio * 100, 100).toFixed(0)}%` }}
                  />
                </div>
                {full && (
                  <p className="text-xs text-red-400 mt-1.5 font-medium">
                    このイベントは満員です
                  </p>
                )}
              </div>
              <JoinButton eventId={e.id} full={full} hasJoined={hasJoined} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
