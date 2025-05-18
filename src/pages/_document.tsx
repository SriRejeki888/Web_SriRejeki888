import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {/* Preload DNS untuk domain gambar */}
        <link rel="dns-prefetch" href="https://i.ibb.co" />
        <link rel="preconnect" href="https://i.ibb.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.jsonbin.io" />
        <link rel="preconnect" href="https://api.jsonbin.io" crossOrigin="anonymous" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
