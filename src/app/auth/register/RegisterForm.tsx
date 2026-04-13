"use client";

import { useActionState } from "react";
import { signUp } from "../actions";

export default function RegisterForm() {
  const [state, action, pending] = useActionState(signUp, null);

  if (state && "success" in state) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
          <div className="text-5xl mb-6">📧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            確認メールを送信しました
          </h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            {state.message}
          </p>
          <a
            href="/auth/login"
            className="text-blue-600 hover:underline font-semibold text-sm"
          >
            ログインページへ →
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-gray-900">
            LangMeet
          </a>
          <p className="text-gray-500 mt-1">新規アカウント作成</p>
        </div>

        <form
          action={action}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-5"
        >
          {state && "error" in state && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
              {state.error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              パスワード
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <p className="text-xs text-gray-400">6文字以上で入力してください</p>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-blue-700 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? "登録中..." : "アカウントを作成"}
          </button>

          <p className="text-center text-sm text-gray-500">
            すでにアカウントをお持ちの方は{" "}
            <a
              href="/auth/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              ログイン
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
