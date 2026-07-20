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
    title: "工位幸存者 Demo V3.4",
    description: "选择马克笔、保温杯、剪刀或修正液，从战场中心迎战环形随机来敌，并在Boss战中躲避锁定走廊与缺口弹幕。",
    openGraph: {
      type: "website",
      title: "工位幸存者 Demo V3.4",
      description: "完整环形来敌与可读、可躲的Boss特殊攻击，让17关挑战拥有更公平也更明确的空间压力。",
    },
    twitter: {
      card: "summary",
      title: "工位幸存者 Demo V3.4",
      description: "从战场中心迎战环形随机来敌，读取Boss预警并躲开锁定走廊与缺口弹幕。",
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
