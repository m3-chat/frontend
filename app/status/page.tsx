"use client";

import { useEffect } from "react";

export default function Redirect() {
  useEffect(() => {
    window.location.href = "https://m3-chat-status.vercel.app";
  });
  return <></>;
}
