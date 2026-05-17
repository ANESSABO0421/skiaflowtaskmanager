"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { fadeUp } from "@/src/animations/fadeUp";

gsap.registerPlugin(useGSAP);

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        backgroundPosition: "100% 100%",
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "none",
      });
    }
    if (cardRef.current) {
      fadeUp(cardRef.current.querySelectorAll("[data-auth-field]"));
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050106] overflow-hidden">
      <div
        ref={bgRef}
        className="absolute inset-0 bg-[length:200%_200%] bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.2),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.15),transparent_45%)]"
      />
      <div
        ref={cardRef}
        className="relative w-full max-w-md mx-4 p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-pink-950/20"
      >
        <div className="mb-8 space-y-2 text-center md:text-left" data-auth-field>
          <h1 className="text-3xl font-light tracking-tight text-white/90">{title}</h1>
          <p className="text-sm text-neutral-400">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}