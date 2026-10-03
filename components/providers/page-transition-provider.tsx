
"use client";

import { useRef } from "react";
import { animate } from "framer-motion";
import { TransitionRouter } from "next-transition-router";

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <TransitionRouter
      auto
      leave={async (next) => {
        const element = pageRef.current;

        if (!element) {
          next();
          return;
        }

        await animate(
          element,
          {
            opacity: [1, 0],
            y: [0, -6],
          },
          {
            duration: 0.18,
            ease: "easeIn",
          },
        );

        next();
      }}
      enter={async (next) => {
        const element = pageRef.current;

        if (!element) {
          next();
          return;
        }

        await animate(
          element,
          {
            opacity: [0, 1],
            y: [8, 0],
          },
          {
            duration: 0.3,
            ease: "easeOut",
          },
        );

        next();
      }}
    >
      <div ref={pageRef} className="min-h-screen">
        {children}
      </div>
    </TransitionRouter>
  );
}
