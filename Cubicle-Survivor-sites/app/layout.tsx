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
    title: "工位幸存者 Demo V3.3",
    description: "选择马克笔、保温杯、剪刀或修正液，在高频敌群与霓虹战场中完成 17 关挑战；修正液前期新增近邻溅写以更快建立错误循环。",
    openGraph: {
      type: "website",
      title: "工位幸存者 Demo V3.3",
      description: "修正液主喷涂保留单锁定，并以一次近邻溅写改善前期错误循环。",
    },
    twitter: {
      card: "summary",
      title: "工位幸存者 Demo V3.3",
      description: "修正液主喷涂保留单锁定，并以一次近邻溅写改善前期错误循环。",
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
