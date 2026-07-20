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
    title: "工位幸存者 Demo V3.1",
    description: "选择马克笔、保温杯、剪刀或修正液，在高频攻击与密集敌群中完成 17 关霓虹办公室生存挑战。",
    openGraph: {
      type: "website",
      title: "工位幸存者 Demo V3.1",
      description: "更小更快的攻击事件、持续补位的敌群，以及轮廓分离的四武器技能在线试玩。",
    },
    twitter: {
      card: "summary",
      title: "工位幸存者 Demo V3.1",
      description: "更小更快的攻击事件、持续补位的敌群，以及轮廓分离的四武器技能在线试玩。",
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
