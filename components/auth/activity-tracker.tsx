"use client";

import { useEffect } from "react";

export default function ActivityTracker() {
  useEffect(() => {

    const sendHeartbeat = async () => {
      try {
        await fetch("/api/auth/heartbeat", {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Heartbeat failed:", error);
      }
    };

    // Send immediately when the app loads
    sendHeartbeat();

    // Then every 5 minutes
    const interval = setInterval(
      sendHeartbeat,
      1 * 60 * 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}