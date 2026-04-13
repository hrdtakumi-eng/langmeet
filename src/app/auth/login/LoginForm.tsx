"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

type Props = { next?: string };

export default function LoginForm({ next }: Props) {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block font-extrabold text-2xl tracking-tight mb-2">
            Lang
            <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
              Meet
            </span>
          </a>
          <p className="text-slate-500 text-sm">アカウントにログイン</p>
        </div>

        <form
          action={action}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col gap-5"
        >
          {next && <input type="hidden" name="next" value={next} />}

          {state?.error && (
            <div className="flex items-start gap-2.5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <span className="mt-0.5">⚠️</span>
              <span>{state.error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition bg-slate-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              パスワード
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition bg-slate-50"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white py-3 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-sky-600 transition-all shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {pending ? "ログイン中..." : "ログイン"}
          </button>

          <p className="text-center text-sm text-slate-500 pt-1">
            アカウントをお持ちでない方は{" "}
            <a
              href="/auth/register"
              className="text-sky-600 hover:text-sky-700 font-semibold hover:underline"
            >
              新規登録
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
