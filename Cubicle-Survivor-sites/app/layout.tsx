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
    title: "工位幸存者 Demo V3.11",
    description: "降低前两关接触压力，修正剪刀空挥与近战风险，并加快修正液的错误状态启动。",
    openGraph: {
      type: "website",
      title: "工位幸存者 Demo V3.11",
      description: "前期容错与四武器平衡版：保留割草密度，缩小武器强度断层。",
    },
    twitter: {
      card: "summary",
      title: "工位幸存者 Demo V3.11",
      description: "前两关更适合首次上手，四把武器拥有更接近的开局兑现能力。",
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
