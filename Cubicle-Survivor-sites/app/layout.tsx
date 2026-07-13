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
    title: "工位幸存者 Demo V1",
    description: "选择马克笔、保温杯或即时贴，在浏览器中完成 16 关办公室生存挑战。",
    openGraph: {
      type: "website",
      title: "工位幸存者 Demo V1",
      description: "三种办公武器、五阶段构筑成长、16 关在线试玩。",
      images: [`${origin}/og.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: "工位幸存者 Demo V1",
      description: "三种办公武器、五阶段构筑成长、16 关在线试玩。",
      images: [`${origin}/og.png`],
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
