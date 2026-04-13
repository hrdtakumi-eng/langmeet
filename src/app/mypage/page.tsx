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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">マイページ</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>

        {/* 参加済みイベント */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            参加済みイベント
            <span className="ml-2 text-base font-normal text-gray-400">
              {myEvents.length}件
            </span>
          </h2>

          {myEvents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
              <p className="text-lg mb-3">まだ参加したイベントがありません</p>
              <a
                href="/events"
                className="text-blue-600 hover:underline text-sm font-semibold"
              >
                イベントを探す →
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myEvents.map(({ created_at, events: event }) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {event.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-0.5">{event.name_en}</p>
                    </div>
                    <span className="shrink-0 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                      参加済み ✓
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500 mt-4">
                    <span>📅 {formatDate(event.date)}　{event.time}〜</span>
                    <span>📍 {event.location}</span>
                  </div>

                  <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                    参加登録日:{" "}
                    {new Date(created_at).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
