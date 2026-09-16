"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function ActivityTracker() {
  useEffect(() => {
    let isChecking = false;

    const sendHeartbeat = async () => {
      if (isChecking) return;

      isChecking = true;

      try {
        const response = await fetch("/api/auth/heartbeat", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401 || response.status === 403) {
          const data = await response.json().catch(() => null);

          if (
            data?.message === "ACCOUNT_NOT_ACTIVE" ||
            response.status === 401
          ) {
            await signOut({
              callbackUrl: "/login?reason=account-disabled",
            });

            return;
          }
        }
      } catch (error) {
        console.error("Heartbeat failed:", error);
      } finally {
        isChecking = false;
      }
    };

    // Check immediately
    sendHeartbeat();

    // Then every 5 minutes
    const interval = setInterval(
      sendHeartbeat,
      5 * 60 * 1000
    );

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}