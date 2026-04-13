-- =============================================================
-- LangMeet: 画像アップロード機能セットアップ
-- Supabase ダッシュボード > SQL Editor で実行してください
-- =============================================================

-- 1. events テーブルに image_url カラムを追加
alter table events add column if not exists image_url text;

-- 2. event-images ストレージバケットを作成（公開）
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

-- 3. ストレージポリシー
-- 誰でも画像を参照できる
create policy "誰でも画像を参照"
  on storage.objects for select
  using (bucket_id = 'event-images');

-- ログイン済みユーザーのみアップロード可能
create policy "認証済みユーザーがアップロード"
  on storage.objects for insert
  with check (
    bucket_id = 'event-images'
    and auth.role() = 'authenticated'
  );

-- アップロードしたユーザーのみ削除可能
create policy "アップロードしたユーザーが削除"
  on storage.objects for delete
  using (
    bucket_id = 'event-images'
    and auth.uid()::text = owner_id
  );
