import { createSupabaseServerClient } from "@/lib/supabase-server";
import { signOut } from "@/app/auth/actions";

export default async function Header() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
        <a href="/" className="font-bold text-lg text-gray-900">
          LangMeet
        </a>

        <nav className="flex items-center gap-4">
          <a
            href="/events"
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            イベント一覧
          </a>

          {user ? (
            <>
              <span className="text-sm text-gray-400 hidden sm:block truncate max-w-[160px]">
                {user.email}
              </span>
              <a
                href="/events/new"
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                イベントを作成
              </a>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <>
              <a
                href="/auth/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition"
              >
                ログイン
              </a>
              <a
                href="/auth/register"
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                新規登録
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
