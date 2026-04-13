import { createSupabaseServerClient } from "@/lib/supabase-server";
import { signOut } from "@/app/auth/actions";

export default async function Header() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-extrabold text-xl tracking-tight">
          Lang
          <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            Meet
          </span>
        </a>

        <nav className="flex items-center gap-5">
          <a
            href="/events"
            className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            イベント一覧
          </a>

          {user ? (
            <>
              <a
                href="/mypage"
                className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                マイページ
              </a>
              <a
                href="/events/new"
                className="bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm px-5 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-sky-600 transition-all shadow-sm hover:shadow"
              >
                イベントを作成
              </a>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <>
              <a
                href="/auth/login"
                className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                ログイン
              </a>
              <a
                href="/auth/register"
                className="bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm px-5 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-sky-600 transition-all shadow-sm hover:shadow"
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
