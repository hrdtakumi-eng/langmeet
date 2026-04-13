"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type LocationType = "offline" | "online";

const supabase = createSupabaseBrowserClient();

export default function NewEventPage() {
  const [locationType, setLocationType] = useState<LocationType>("offline");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("画像は5MB以内にしてください。");
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);

    // 画像アップロード
    let imageUrl: string | null = null;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(filename, imageFile, { cacheControl: "3600" });

      if (uploadError) {
        setError(`画像のアップロードに失敗しました: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("event-images")
        .getPublicUrl(uploadData.path);

      imageUrl = publicUrl;
    }

    // イベント保存
    const { error: sbError } = await supabase.from("events").insert({
      name: data.get("name") as string,
      name_en: data.get("name_en") as string,
      date: data.get("date") as string,
      time: data.get("time") as string,
      location: data.get("location") as string,
      location_type: locationType,
      participants_max: parseInt(data.get("participants_max") as string, 10),
      participants_current: 0,
      description: data.get("description") as string,
      image_url: imageUrl,
    });

    setLoading(false);

    if (sbError) {
      setError(`保存に失敗しました: ${sbError.message}`);
    } else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="text-5xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            イベントを投稿しました！
          </h2>
          <p className="text-gray-500 mb-8">
            イベントの審査後、一覧に掲載されます。
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/events"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              イベント一覧へ
            </a>
            <button
              onClick={() => { setSubmitted(false); removeImage(); }}
              className="border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              続けて投稿する
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <a href="/events" className="text-blue-600 text-sm hover:underline">
            ← イベント一覧に戻る
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mt-3 mb-1">
            イベントを作成
          </h1>
          <p className="text-gray-500">
            言語交換イベントの情報を入力してください
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6"
        >
          {/* イベント名（日本語） */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              イベント名（日本語）<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="例：渋谷カフェで英会話"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* イベント名（英語） */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              イベント名（English）<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="name_en"
              required
              placeholder="e.g. English Conversation at Shibuya Café"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* 日時 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                開催日<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="date"
                required
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                開始時間<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="time"
                name="time"
                required
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* 場所タイプ */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              開催形式<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-3">
              {(["offline", "online"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLocationType(type)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition ${
                    locationType === type
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
                  }`}
                >
                  {type === "offline" ? "📍 オフライン" : "💻 オンライン"}
                </button>
              ))}
            </div>
          </div>

          {/* 場所 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              {locationType === "offline" ? "場所" : "開催URL / ツール"}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="location"
              required
              placeholder={
                locationType === "offline"
                  ? "例：渋谷区カフェスペース"
                  : "例：Zoom / Google Meet"
              }
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* 定員 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              定員人数<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="participants_max"
                required
                min={2}
                max={200}
                placeholder="例：20"
                className="w-36 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <span className="text-sm text-gray-500">名（2〜200名）</span>
            </div>
          </div>

          {/* 説明 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              イベントの説明<span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="イベントの内容、対象レベル、持ち物などを記入してください。"
              className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* 画像アップロード */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              イベント画像（任意）
            </label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="プレビュー"
                  className="w-full h-52 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow text-sm transition"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                <span className="text-3xl mb-2">📷</span>
                <span className="text-sm text-gray-500 font-medium">クリックして画像を選択</span>
                <span className="text-xs text-gray-400 mt-1">JPG・PNG・WebP / 5MB以内</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* Language badge */}
          <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-3">
            <span className="text-sm text-gray-600">言語：</span>
            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
              🇯🇵 日本語 ↔ English 🇺🇸
            </span>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-blue-700 active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "投稿中..." : "イベントを投稿する"}
          </button>
        </form>
      </div>
    </main>
  );
}
