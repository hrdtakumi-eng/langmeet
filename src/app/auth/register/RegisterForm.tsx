"use client";

import { useActionState } from "react";
import { signUp } from "../actions";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(signUp, null);

  if (state && "success" in state) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
          <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
            📧
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-3">
            確認メールを送信しました
          </h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            {state.message}
          </p>
          <a
            href="/auth/login"
            className="inline-block bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-sky-600 transition-all shadow-sm"
          >
            ログインページへ →
          </a>
        </div>
      </main>
    );
  }

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
          <p className="text-slate-500 text-sm">新規アカウント作成</p>
        </div>

        <form
          action={action}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col gap-5"
        >
          {state && "error" in state && (
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
              minLength={6}
              autoComplete="new-password"
              placeholder="••••••••"
              className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-400 transition bg-slate-50"
            />
            <p className="text-xs text-slate-400 pl-1">6文字以上で入力してください</p>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white py-3 rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-sky-600 transition-all shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {pending ? "登録中..." : "アカウントを作成"}
          </button>

          <p className="text-center text-sm text-slate-500 pt-1">
            すでにアカウントをお持ちの方は{" "}
            <a
              href="/auth/login"
              className="text-sky-600 hover:text-sky-700 font-semibold hover:underline"
            >
              ログイン
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
