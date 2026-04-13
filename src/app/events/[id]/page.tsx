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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <a href="/events" className="text-blue-600 text-sm hover:underline">
          ← イベント一覧に戻る
        </a>

        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* メイン画像 */}
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
            <div className="w-full h-40 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
              <span className="text-5xl">🗣️</span>
            </div>
          )}

          <div className="p-8">
            {/* タイトル */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-1">
                  {e.name}
                </h1>
                <p className="text-gray-400">{e.name_en}</p>
              </div>
              <span className="shrink-0 bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                🇯🇵 日本語 ↔ English 🇺🇸
              </span>
            </div>

            {/* イベント情報 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-xl">📅</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">開催日時</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatDate(e.date)}　{e.time}〜
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-xs text-gray-400 font-medium">場所</p>
                  <p className="text-sm font-semibold text-gray-800">{e.location}</p>
                </div>
              </div>
            </div>

            {/* 説明 */}
            <div className="mb-8">
              <h2 className="text-base font-bold text-gray-900 mb-2">イベント詳細</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {e.description}
              </p>
            </div>

            {/* 参加状況 + 参加ボタン */}
            <div className="border-t border-gray-100 pt-6 flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">参加者</span>
                  <span className={`font-bold ${full ? "text-red-500" : "text-gray-800"}`}>
                    {e.participants_current} / {e.participants_max}名
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      full ? "bg-red-400" : ratio >= 0.8 ? "bg-amber-400" : "bg-blue-500"
                    }`}
                    style={{ width: `${Math.min(ratio * 100, 100).toFixed(0)}%` }}
                  />
                </div>
                {full && (
                  <p className="text-xs text-red-500 mt-1">このイベントは満員です</p>
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
