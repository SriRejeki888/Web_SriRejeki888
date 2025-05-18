import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      position: "relative",
      overflowX: "hidden"
    }}>
      {/* Custom Background Layer */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: -1,
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Gradient Atas */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: isMobile ? "40%" : "30%",
          background: "linear-gradient(180deg, #fff 60%, #f8f8f8 100%)",
          zIndex: 0
        }} />
        {/* Putih (atas) */}
        <div style={{ flex: isMobile ? 10 : 6, background: "#fff", position: "relative", zIndex: 1 }} />
        {/* Strip Merah */}
        <div style={{ flex: isMobile ? 0.2 : 0.4, background: "red", boxShadow: "0 2px 12px rgba(255,0,0,0.10)", position: "relative", zIndex: 1 }} />
        {/* Putih (tengah) */}
        <div style={{ flex: isMobile ? 0.2 : 0.4, background: "#fff", position: "relative", zIndex: 1 }} />
        {/* Hijau (bawah) */}
        <div style={{ flex: isMobile ? 1.2 : 2, background: "#00897b", boxShadow: "0 -2px 12px rgba(0,137,123,0.10)", position: "relative", zIndex: 1 }} />
      </div>
      {/* Main Content */}
      <Component {...pageProps} />
    </div>
  );
}
