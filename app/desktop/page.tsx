"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as Fa from "react-icons/fa6";
import Image from "next/image";
import { Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [platform, setPlatform] = useState<"mac" | "win" | "linux" | "other">(
    "other"
  );

  useEffect(() => {
    const plt = navigator.userAgent.toLowerCase();
    if (plt.includes("mac")) setPlatform("mac");
    else if (plt.includes("win")) setPlatform("win");
    else if (plt.includes("linux")) setPlatform("linux");
  }, []);

  const getDownloadIcon = () => {
    if (platform === "mac") return <Fa.FaApple />;
    if (platform === "win") return <Fa.FaWindows />;

    return <Download />;
  };
  const getDownloadText = () => {
    if (platform === "mac") return "Download for macOS";
    if (platform === "win") return "Download for Windows";
    return "Download";
  };

  const getDownloadLink = () => {
    if (platform === "mac")
      return "https://github.com/m3-chat/desktop/releases/latest/download/M3.Chat_0.1.0_aarch64.dmg";
    if (platform === "win")
      return "https://github.com/m3-chat/desktop/releases/latest/download/M3.Chat_0.1.0_x64-setup.exe";
    return "https://github.com/m3-chat/desktop/releases/latest";
  };

  return (
    <main className="text-white min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Your AI chat.
            <br className="hidden md:block" />
            Now on <span className="underline">desktop</span>.
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-lg">
            Private, blazing fast, and open source. M3 Chat Desktop is powered
            by Tauri and runs natively on your machine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href={getDownloadLink()}>
              <Button className="hover:cursor-pointer">
                {getDownloadIcon()}
                {getDownloadText()}
              </Button>
            </Link>
            <Link href="/">
              <Button variant={"secondary"} className="hover:cursor-pointer">
                Try web version
              </Button>
            </Link>
          </div>

          <div className="text-sm text-gray-400 mt-4">
            <a
              href="https://github.com/m3-chat/desktop/releases/latest"
              className="underline hover:text-white"
            >
              GitHub releases
            </a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
            <Image
              src="/screenshot.png"
              alt="App Screenshot"
              width={1000}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
