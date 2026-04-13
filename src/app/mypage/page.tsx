import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { type DbEvent } from "@/lib/supabase";

type Participation = {
  created_at: string;
  events: DbEvent;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

export default async function MyPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/mypage");
  }

  const { data: participations } = await supabase
    .from("participations")
    .select("created_at, events(*)")
    .order("created_at", { ascending: false });

  const myEvents = (participations ?? []) as unknown as Participation[];

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Profile header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 px-8 py-7 mb-8 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
            {user.email?.[0].toUpperCase() ?? "U"}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">マイページ</h1>
            <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* 参加済みイベント */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-extrabold text-gray-900">
              参加済みイベント
            </h2>
            <span className="bg-sky-50 text-sky-600 text-sm font-bold px-3 py-0.5 rounded-full border border-sky-100">
              {myEvents.length}件
            </span>
          </div>

          {myEvents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-4xl mb-4">🎫</p>
              <p className="text-lg font-semibold text-slate-500 mb-2">
                まだ参加したイベントがありません
              </p>
              <a
                href="/events"
                className="inline-block mt-2 text-sky-600 hover:text-sky-700 text-sm font-semibold hover:underline"
              >
                イベントを探す →
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myEvents.map(({ created_at, events: event }) => (
                <a
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg leading-snug">
                          {event.name}
                        </h3>
                        <p className="text-sm text-slate-400 mt-0.5 truncate">
                          {event.name_en}
                        </p>
                      </div>
                      <span className="shrink-0 bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-100">
                        参加済み ✓
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                      <span>📅 {formatDate(event.date)}　{event.time}〜</span>
                      <span>📍 {event.location}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-50">
                      参加登録日：
                      {new Date(created_at).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
