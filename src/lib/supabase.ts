import { createClient } from "@supabase/supabase-js";

export type DbEvent = {
  id: string;
  name: string;
  name_en: string;
  date: string;
  time: string;
  location: string;
  participants_max: number;
  participants_current: number;
  description: string;
  image_url: string | null;
  created_at: string;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
