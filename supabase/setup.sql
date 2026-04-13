-- =============================================================
-- LangMeet: 参加機能セットアップ
-- Supabase ダッシュボード > SQL Editor で実行してください
-- =============================================================

-- 1. participations テーブル（参加履歴）
create table if not exists participations (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references auth.users(id) on delete cascade not null,
  event_id    uuid        references events(id)     on delete cascade not null,
  created_at  timestamptz default now(),
  unique (user_id, event_id)
);

alter table participations enable row level security;

-- 自分の参加記録だけ参照できる
create policy "自分の参加記録を参照" on participations
  for select using (auth.uid() = user_id);

-- 自分の参加記録だけ追加できる
create policy "自分の参加記録を追加" on participations
  for insert with check (auth.uid() = user_id);


-- 2. 参加処理 RPC 関数
--    SECURITY DEFINER で実行するため RLS を回避して events を更新できる
create or replace function join_event(p_event_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id  uuid := auth.uid();
  v_current  int;
  v_max      int;
begin
  -- 未ログインチェック
  if v_user_id is null then
    return jsonb_build_object('error', 'ログインが必要です');
  end if;

  -- 参加済みチェック
  if exists (
    select 1 from participations
    where user_id = v_user_id and event_id = p_event_id
  ) then
    return jsonb_build_object('error', 'すでに参加済みです');
  end if;

  -- 満員チェック（行ロックで競合防止）
  select participants_current, participants_max
    into v_current, v_max
    from events
   where id = p_event_id
     for update;

  if not found then
    return jsonb_build_object('error', 'イベントが見つかりません');
  end if;

  if v_current >= v_max then
    return jsonb_build_object('error', '満員です');
  end if;

  -- 参加記録を追加
  insert into participations (user_id, event_id)
  values (v_user_id, p_event_id);

  -- 参加者数をアトミックに更新
  update events
     set participants_current = v_current + 1
   where id = p_event_id;

  return jsonb_build_object('success', true);
end;
$$;
