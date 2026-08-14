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
    title: "工位幸存者 Demo V3.14",
    description: "四武器战斗与成长保持不变，购买和选择页面改为简短、结果导向的轻量决策。",
    openGraph: {
      type: "website",
      title: "工位幸存者 Demo V3.14",
      description: "轻量决策版：少读说明，先看结果，选完立即回到战斗。",
    },
    twitter: {
      card: "summary",
      title: "工位幸存者 Demo V3.14",
      description: "武器、模块、经验与组件选择只保留当前决策需要的信息。",
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
