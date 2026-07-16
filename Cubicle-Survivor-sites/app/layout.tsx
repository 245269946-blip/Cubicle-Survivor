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
    title: "工位幸存者 Demo V2.9",
    description: "选择马克笔、保温杯、剪刀或修正液，在浏览器中完成 17 关办公室异化生存挑战。",
    openGraph: {
      type: "website",
      title: "工位幸存者 Demo V2.9",
      description: "四种异化办公武器、双路线模块成长、五阶段17关在线试玩。",
      images: [`${origin}/og.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: "工位幸存者 Demo V2.9",
      description: "四种异化办公武器、双路线模块成长、五阶段17关在线试玩。",
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
