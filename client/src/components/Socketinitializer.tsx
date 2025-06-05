"use client";

import { useSocketStore } from "@/stores/SocketStore";
import { useEffect } from "react";

export default function SocketInitializer() {
  const initializeSocket = useSocketStore((state) => state.initializesocket);
  useEffect(() => {
    initializeSocket();
  }, [initializeSocket]);
  return null;
}
