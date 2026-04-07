import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LangMeet - 日英言語交換イベント",
  description: "日本語と英語の言語交換イベントプラットフォーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
