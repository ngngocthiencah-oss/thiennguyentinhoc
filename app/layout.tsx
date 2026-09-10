import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nguyễn Ngọc Thiện - ThienNguyenTinhoc | Quản Trị Mục Tiêu & Dịch Vụ Tin Học",
  description: "Hệ thống quản trị hiệu suất cá nhân, dịch vụ hỗ trợ tin học văn phòng, Excel, Access, Power BI và lập báo cáo chuyên nghiệp của Nguyễn Ngọc Thiện.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}