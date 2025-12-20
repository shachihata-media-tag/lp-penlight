"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Copy, Wifi, BatteryMedium, Signal, CheckCircle2 } from "lucide-react";

export interface PhoneSimulatorProps {
  color: string;
  pattern: "steady" | "blink" | "fast-blink" | "random";
  status: "waiting" | "detecting" | "synced";
  logoUrl?: string; // Optional custom logo
  className?: string;
  intensity?: number; // 0-1
}

export function PhoneSimulator({
  color,
  pattern,
  status,
  logoUrl,
  className,
  intensity = 1,
}: PhoneSimulatorProps) {
  // Pattern animation class
  const getAnimationClass = () => {
    switch (pattern) {
      case "blink":
        return "animate-pulse";
      case "fast-blink":
        return "animate-pulse-fast"; // Need to define this custom animation
      case "random":
        return "animate-flicker"; // Need to define
      default:
        return "";
    }
  };

  // Status text map
  const statusText = {
    waiting: "待機中...",
    detecting: "音響信号を検出中...",
    synced: "同期完了",
  };

  return (
    <div
      className={cn(
        "relative mx-auto w-[280px] h-[580px] bg-black rounded-[48px] border-[8px] border-[#2a2a2a] shadow-2xl overflow-hidden",
        "ring-1 ring-white/10", // Subtle premium shimmer
        className
      )}
    >
      {/* Notch / Dynamic Island */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 pointer-events-none" />

      {/* Screen Content */}
      <div className="relative w-full h-full flex flex-col bg-bg text-text">
        
        {/* Status Bar (Fake) */}
        <div className="h-12 px-6 flex items-end justify-between pb-2 text-[10px] font-medium text-white/60 select-none z-10">
          <span>19:00</span>
          <div className="flex gap-1.5">
            <Signal size={12} />
            <Wifi size={12} />
            <BatteryMedium size={12} />
          </div>
        </div>

        {/* Main Penlight Area (Full Screen Color) */}
        <div
          className={cn(
            "flex-1 flex flex-col items-center justify-center relative transition-colors duration-300",
            getAnimationClass()
          )}
          style={{
            backgroundColor: color === "#000000" ? "#1a1a1a" : color,
            boxShadow:
              color !== "#000000" && color !== "#FFFFFF"
                ? `inset 0 0 60px ${color}`
                : "none",
          }}
        >
          {/* Logo/Mark Overlay */}
          <div className="relative z-10 p-6 bg-black/10 backdrop-blur-[2px] rounded-full">
             {/* If logoUrl provided use Image, else Shachihata brand */}
             {logoUrl ? (
                 <Image src={logoUrl} alt="Logo" width={96} height={96} className="w-24 h-24 object-contain" />
             ) : (
                <div className="w-24 h-24 flex items-center justify-center border-2 border-white/80 rounded-full">
                    <span className="font-bold text-lg tracking-widest text-white">LOGO</span>
                </div>
             )}
          </div>

          {/* Particle Effects (CSS only for now) */}
          {status === "synced" && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>
          )}
        </div>

        {/* Bottom Status Area */}
        <div className="h-32 bg-surface/90 backdrop-blur-md border-t border-white/5 p-4 flex flex-col items-center justify-between z-10">
          <div className="flex flex-col items-center gap-2">
             <div className={cn(
               "w-2 h-2 rounded-full",
               status === "detecting" ? "bg-accent animate-ping" : 
               status === "synced" ? "bg-green-500" : "bg-muted"
             )} />
             <p className="text-xs font-mono tracking-wider text-muted">
               {statusText[status]}
             </p>
          </div>

          {status === "detecting" && (
             <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent animate-progress-indeterminate" />
             </div>
          )}
        </div>

        {/* Home Bar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-20" />
      </div>

      {/* Reflections / Gloss */}
      <div className="absolute inset-0 rounded-[40px] pointer-events-none ring-1 ring-inset ring-white/5 opacity-50" />
    </div>
  );
}
