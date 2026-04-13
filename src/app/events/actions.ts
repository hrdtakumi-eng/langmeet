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

  // 現在の参加者数を取得（満員チェック）
  const { data: event, error: fetchError } = await supabase
    .from("events")
    .select("participants_current, participants_max")
    .eq("id", eventId)
    .single();

  if (fetchError || !event) {
    return { error: "イベントが見つかりません。" };
  }

  if (event.participants_current >= event.participants_max) {
    return { error: "満員です。" };
  }

  const { error } = await supabase
    .from("events")
    .update({ participants_current: event.participants_current + 1 })
    .eq("id", eventId);

  if (error) {
    return { error: "参加登録に失敗しました。" };
  }

  revalidatePath("/events");
}
