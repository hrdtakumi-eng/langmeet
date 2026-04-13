"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function joinEvent(eventId: string): Promise<{ error: string } | void> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/events");
  }

  // RPC 関数でアトミックに処理（RLS・競合・重複参加をまとめてハンドリング）
  const { data, error } = await supabase.rpc("join_event", {
    p_event_id: eventId,
  });

  if (error) {
    return { error: "参加登録に失敗しました。時間をおいて再度お試しください。" };
  }

  const result = data as { error?: string; success?: boolean };
  if (result?.error) {
    return { error: result.error };
  }

  revalidatePath("/events");
  revalidatePath("/mypage");
}
