"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

type Props = { next?: string };

export default function LoginForm({ next }: Props) {
  const [state, action, pending] = useActionState(signIn, null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-gray-900">
            LangMeet
          </a>
          <p className="text-gray-500 mt-1">アカウントにログイン</p>
        </div>

        <form
          action={action}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-5"
        >
          {next && <input type="hidden" name="next" value={next} />}

          {state?.error && (
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
              autoComplete="current-password"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-blue-700 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? "ログイン中..." : "ログイン"}
          </button>

          <p className="text-center text-sm text-gray-500">
            アカウントをお持ちでない方は{" "}
            <a
              href="/auth/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              新規登録
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
