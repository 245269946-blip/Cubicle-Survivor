import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";
  const origin = host
    ? `${protocol}://${host}`
    : "https://245269946-blip.github.io/Cubicle-Survivor";

  return {
    metadataBase: new URL(origin),
    title: "工位幸存者 Demo V3.15 正式版",
    description: "统一卡通角色、敌人、场景、特效与音频，并保留简短、结果导向的四武器成长选择。",
    openGraph: {
      type: "website",
      title: "工位幸存者 Demo V3.15 正式版",
      description: "统一卡通正式版：看清结果，选完立即回到战斗。",
    },
    twitter: {
      card: "summary",
      title: "工位幸存者 Demo V3.15 正式版",
      description: "四武器、敌人与场景统一为可直接游玩的卡通帧动画版本。",
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
