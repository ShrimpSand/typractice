import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "カスタム配列タイピング練習",
  description: "様々なキーボード配列でタイピング練習ができるアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
