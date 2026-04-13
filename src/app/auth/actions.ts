"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export type LoginState = { error: string } | null;
export type RegisterState =
  | { error: string }
  | { success: true; message: string }
  | null;

export async function signIn(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/events";

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "メールアドレスまたはパスワードが正しくありません。" };
  }

  redirect(next);
}

export async function signUp(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "このメールアドレスはすでに登録されています。" };
    }
    return { error: error.message };
  }

  return {
    success: true,
    message:
      "確認メールを送信しました。メール内のリンクをクリックしてログインしてください。",
  };
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
