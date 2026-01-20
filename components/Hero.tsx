"use client";

import { useState } from "react";
import { PhoneSimulator, PhoneSimulatorProps } from "./PhoneSimulator";
import { PENLIGHT_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight, Play, Settings2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const [activeColor, setActiveColor] = useState<string>(PENLIGHT_COLORS[0].value);
  const [pattern, setPattern] = useState<PhoneSimulatorProps["pattern"]>("steady");
  const [status, setStatus] = useState<PhoneSimulatorProps["status"]>("detecting");
  const [mode, setMode] = useState<"venue" | "stream">("venue");

  const toggleMode = () => setMode((p) => (p === "venue" ? "stream" : "venue"));

  return (
    <section id="hero" className="relative z-0 pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
      
      {/* Video Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/video/webpenlight.mp4" type="video/mp4" />
        </video>
        {/* Overlay for readability */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/60" />
      </div>

      <div className="container-custom relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Text Content */}
        <div className="lg:col-span-7 flex flex-col gap-8 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 w-fit">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-xs font-medium text-text/80">特許技術「音響透かし」採用</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            会場と配信を<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">“ひとつ”にする、</span><br/>
            音響連動WEBペンライト
          </h1>

          <p className="text-lg text-muted max-w-xl leading-relaxed">
            専用アプリ不要。QRコードを読み取るだけで、スマホがペンライトに早変わり。
            会場の歓声も、配信越しの熱狂も、音に込めた信号で一斉にシンクロします。
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
             <Link
               href="#contact"
               className="flex items-center justify-center px-8 py-4 text-sm font-bold text-bg bg-white rounded-md hover:bg-white/90 transition-all shadow-glow hover:shadow-lg hover:-translate-y-0.5"
             >
               お問い合わせ
             </Link>
             <Link
               href="#demos"
               className="flex items-center justify-center px-8 py-4 text-sm font-bold text-text border border-white/20 rounded-md hover:bg-white/5 transition-all"
             >
               デモを体験
               <ArrowRight className="w-4 h-4 ml-2" />
             </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
             <div>
               <div className="text-2xl font-bold mb-1">0秒</div>
               <div className="text-xs text-muted">アプリDL不要<br/>即座に参加</div>
             </div>
             <div>
               <div className="text-2xl font-bold mb-1">∞</div>
               <div className="text-xs text-muted">会場・配信<br/>どこでも連動</div>
             </div>
             <div>
               <div className="text-2xl font-bold mb-1">安価</div>
               <div className="text-xs text-muted">専用端末不要<br/>コスト大幅減</div>
             </div>
          </div>
        </div>

        {/* Right: Simulator + Controls */}
        <div className="lg:col-span-5 flex flex-col items-center order-1 lg:order-2">
          <div className="relative">
             <PhoneSimulator
               color={activeColor}
               pattern={pattern}
               status={status}
               className="transform scale-90 md:scale-100 transition-transform"
             />
             
             {/* Floating Controls for Demo A */}
             <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-3 bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-subtle">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted text-center font-mono">COLOR</span>
                  {PENLIGHT_COLORS.slice(0, 5).map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setActiveColor(c.value);
                        setStatus("synced");
                      }}
                      className={cn(
                        "w-8 h-8 rounded-full border transition-transform hover:scale-110",
                        activeColor === c.value ? "border-white scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                  <button
                     onClick={() => {
                       setActiveColor("#000000");
                       setStatus("waiting");
                     }}
                     className="w-8 h-8 rounded-full border border-white/20 bg-black flex items-center justify-center text-[8px] text-muted hover:border-white"
                  >OFF</button>
                </div>
                
                <div className="h-px bg-white/10 w-full my-1" />

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted text-center font-mono">MODE</span>
                   <button
                     onClick={() => setPattern((p) => p === "steady" ? "blink" : "steady")}
                     className={cn(
                       "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                       pattern === "blink" ? "bg-white text-bg" : "bg-white/5 text-white"
                     )}
                   >
                     <Settings2 size={14} />
                   </button>
                </div>
             </div>
          </div>
          
          <div className="mt-8 flex items-center gap-4 bg-surface p-1 rounded-full border border-white/10">
             <button
               onClick={() => { setMode("venue"); setStatus("detecting"); }}
               className={cn(
                 "px-6 py-2 rounded-full text-xs font-bold transition-all",
                 mode === "venue" ? "bg-white text-bg shadow-sm" : "text-muted hover:text-text"
               )}
             >
               会場モード
             </button>
             <button
               onClick={() => { setMode("stream"); setStatus("detecting"); }}
               className={cn(
                 "px-6 py-2 rounded-full text-xs font-bold transition-all",
                 mode === "stream" ? "bg-white text-bg shadow-sm" : "text-muted hover:text-text"
               )}
             >
               配信モード
             </button>
          </div>
          <p className="mt-4 text-xs text-muted text-center max-w-xs">
            {mode === "venue" 
              ? "会場スピーカーからの非可聴音波を検出して連動します。" 
              : "PCやTVから流れる配信音声に反応して同期します。"}
          </p>
        </div>
      </div>
    </section>
  );
}
