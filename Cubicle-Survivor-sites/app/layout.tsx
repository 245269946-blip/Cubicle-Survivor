import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  const origin = host
    ? `${protocol}://${host}`
    : "https://cubicle-survivor-play-v1.hazy-corgi-0850.chatgpt.site";

  return {
    metadataBase: new URL(origin),
    title: "工位幸存者 Demo V3.2",
    description: "选择马克笔、保温杯、剪刀或修正液，在更深的高频低伤预算、持续敌群与增强霓虹辉光中完成 17 关挑战。",
    openGraph: {
      type: "website",
      title: "工位幸存者 Demo V3.2",
      description: "更小更快的攻击事件、更高有效敌群地板，以及事件驱动的双层霓虹辉光。",
    },
    twitter: {
      card: "summary",
      title: "工位幸存者 Demo V3.2",
      description: "更小更快的攻击事件、更高有效敌群地板，以及事件驱动的双层霓虹辉光。",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
