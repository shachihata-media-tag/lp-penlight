'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type TorchState = 'idle' | 'starting' | 'ready' | 'on' | 'off' | 'error';

const COLORS = [
  { name: "Red", value: "#FF0000", bg: "bg-red-600" },
  { name: "Blue", value: "#0000FF", bg: "bg-blue-600" },
  { name: "White", value: "#FFFFFF", bg: "bg-white" },
  { name: "Orange", value: "#FFA500", bg: "bg-orange-500" },
  { name: "Green", value: "#008000", bg: "bg-green-600" },
  { name: "Purple", value: "#800080", bg: "bg-purple-700" },
  { name: "Pink", value: "#FFC0CB", bg: "bg-pink-300" },
  { name: "Yellow", value: "#FFFF00", bg: "bg-yellow-400" },
  { name: "Light Green", value: "#90EE90", bg: "bg-green-300" },
  { name: "Light Blue", value: "#ADD8E6", bg: "bg-blue-300" },
  { name: "Light Pink", value: "#FFB6C1", bg: "bg-pink-200" },
  { name: "Violet", value: "#EE82EE", bg: "bg-violet-400" },
  { name: "Lime", value: "#00FF00", bg: "bg-lime-400" },
  { name: "Turquoise", value: "#40E0D0", bg: "bg-emerald-400" },
  { name: "OFF", value: "transparent", bg: "bg-gray-800" },
];

// GIF list - can be extended to fetch from API/database in the future
const GIFS = [
  { id: 'dunk', name: 'Dunk', path: '/gif/dunk.gif' },
  { id: 'keisei_tominaga', name: '富永 啓生', path: '/gif/富永啓生.gif' },
  { id: 'hiroto_takahashi', name: '髙橋 宏人', path: '/gif/髙橋宏人.gif' },
];

export default function GoodsPage() {
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [lightMode, setLightMode] = useState<'solid' | 'pulse'>('solid');
  const [selectedGifIndex, setSelectedGifIndex] = useState(0);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  
  // Swipe detection for GIF (next/prev)
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  // Swipe detection for bottom sheet
  const sheetTouchStartY = useRef<number>(0);
  const sheetTouchEndY = useRef<number>(0);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  
  // Torch related state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const [torchState, setTorchState] = useState<TorchState>('idle');
  const [torchMsg, setTorchMsg] = useState('');

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setTorchMsg('');
    setTorchState('starting');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera needs HTTPS or Localhost');
      
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Environment only for torch
        },
        audio: false,
      });

      streamRef.current = stream;
      
      // Hidden video element is required for torch to work on many browsers
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      const track = stream.getVideoTracks()[0];
      if (!track) throw new Error('No video track found');
      
      // Check if torch is supported
      const capabilities: any = track.getCapabilities?.() || {};
      if (!capabilities.torch) {
        // Fallback for browsers that don't expose torch capability in getCapabilities
        // but might still work with applyConstraints (some iOS versions)
      }
      
      trackRef.current = track;
      setTorchState('ready');
    } catch (e: any) {
      setTorchState('error');
      setTorchMsg(e.message || 'Failed to start camera');
    }
  };

  const setTorch = async (on: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    try {
      await (track as any).applyConstraints({
        advanced: [{ torch: on }]
      });
      setTorchState(on ? 'on' : 'off');
    } catch (e) {
      // Ignore failures during pulse/toggle
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    trackRef.current = null;
    setTorchState('idle');
  };

  const isWhite = selectedColor === '#FFFFFF';

  // Swipe handlers for GIF (next/prev)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 30; // Minimum distance for swipe

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swipe left - next GIF
        setSelectedGifIndex((prev) => (prev + 1) % GIFS.length);
      } else {
        // Swipe right - previous GIF
        setSelectedGifIndex((prev) => (prev - 1 + GIFS.length) % GIFS.length);
      }
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Swipe handlers for bottom sheet
  const handleSheetTouchStart = (e: React.TouchEvent) => {
    sheetTouchStartY.current = e.touches[0].clientY;
  };

  const handleSheetTouchMove = (e: React.TouchEvent) => {
    sheetTouchEndY.current = e.touches[0].clientY;
  };

  const handleSheetTouchEnd = () => {
    if (!sheetTouchStartY.current || !sheetTouchEndY.current) return;
    
    const distance = sheetTouchEndY.current - sheetTouchStartY.current;
    const minSwipeDistance = 50; // Minimum distance for swipe

    if (distance > minSwipeDistance) {
      // Swipe down - close sheet
      setIsBottomSheetOpen(false);
    }
    
    sheetTouchStartY.current = 0;
    sheetTouchEndY.current = 0;
  };

  // Synchronize torch with lightMode and selectedColor
  useEffect(() => {
    if (torchState === 'idle' || torchState === 'starting' || torchState === 'error') return;
    
    let interval: NodeJS.Timeout | null = null;

    if (selectedColor === 'transparent') {
      setTorch(false);
    } else if (lightMode === 'solid') {
      setTorch(true);
    } else if (lightMode === 'pulse') {
      let isOn = true;
      setTorch(true);
      interval = setInterval(() => {
        isOn = !isOn;
        setTorch(isOn);
      }, 100); 
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, lightMode, torchState]);

  return (
    <main 
      className="flex h-[100dvh] flex-col items-center justify-between p-6 overflow-hidden transition-none"
      style={{ backgroundColor: (lightMode === 'solid' && selectedColor !== 'transparent') ? selectedColor : '#000' }}
    >
      {/* Strobe pulse effect overlay */}
      {selectedColor !== 'transparent' && lightMode === 'pulse' && (
        <div 
          className="fixed inset-0 pointer-events-none animate-strobe z-0"
          style={{ '--strobe-color': selectedColor } as React.CSSProperties}
        />
      )}

      {/* Header Info */}
      <div className="w-full text-center z-10 pt-4 px-6 flex flex-col items-center">
        <h2 className="text-xs font-bold tracking-widest uppercase mb-1 text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          Penlight Mode
        </h2>
        <div className="h-0.5 w-12 mx-auto bg-white/20 mb-4" />

        {/* Torch Connection Button */}
        <div className="flex flex-col items-center gap-2 mb-2">
          {torchState === 'idle' || torchState === 'error' ? (
            <button 
              onClick={startCamera}
              className="px-6 py-2 bg-white text-black text-[10px] font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
            >
              トーチと連動させる
            </button>
          ) : (
            <div className="flex gap-2 items-center">
              <div className={`px-4 py-2 text-[10px] font-bold rounded-full border backdrop-blur-md flex items-center gap-2 ${
                selectedColor !== 'transparent' ? "bg-yellow-400/20 border-yellow-400 text-yellow-400" : "bg-white/5 border-white/10 text-white/40"
              }`}>
                <span className={`w-2 h-2 rounded-full ${selectedColor !== 'transparent' && torchState === 'on' ? 'bg-yellow-400 animate-ping' : 'bg-gray-600'}`} />
                {torchState === 'on' ? 'トーチ点灯中' : '連動待機中'}
              </div>
              <button 
                onClick={stopCamera}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-full shadow-lg transition-all"
              >
                接続解除
              </button>
            </div>
          )}
        </div>
        {torchMsg && <p className="text-[9px] text-red-500 mb-2">{torchMsg}</p>}
      </div>

      <video ref={videoRef} playsInline muted autoPlay className="hidden" />

      {/* Main GIF Container */}
      <div className="relative w-full max-w-sm aspect-square flex flex-col items-center justify-center z-10 overflow-hidden">
        <div 
          className="relative w-full h-full touch-pan-x"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            key={GIFS[selectedGifIndex].id}
            src={GIFS[selectedGifIndex].path}
            alt={GIFS[selectedGifIndex].name}
            fill
            className="object-contain"
            unoptimized
            priority
          />
        </div>
        
        {/* Open Sheet Button */}
        <div className="flex flex-col items-center gap-2 mt-6">
          <button
            onClick={() => setIsBottomSheetOpen(true)}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-xl border border-white/30 text-white text-[11px] font-black tracking-widest rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            ライブラリーから選択
          </button>
        </div>
      </div>
      
      {/* Footer Controls Container */}
      <div className="w-full -mx-6 z-20 shrink-0 backdrop-blur-xl border-t border-white/10 px-6">
        {/* Mode Selector Tabs */}
        <div className="flex justify-center gap-1 p-2">
          <button
            onClick={() => setLightMode('solid')}
            className={`flex-1 max-w-[120px] py-2 rounded-xl text-[10px] font-bold transition-all ${
              lightMode === 'solid' 
                ? "bg-white text-black shadow-lg" 
                : "text-white/80 hover:bg-white/10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
            }`}
          >
            SOLID (常灯)
          </button>
          <button
            onClick={() => setLightMode('pulse')}
            className={`flex-1 max-w-[120px] py-2 rounded-xl text-[10px] font-bold transition-all ${
              lightMode === 'pulse' 
                ? "bg-white text-black shadow-lg" 
                : "text-white/80 hover:bg-white/10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
            }`}
          >
            PULSE (点滅)
          </button>
        </div>

        {/* Color Selector - Horizontal Scrollable Row */}
        <div className="w-full py-4">
          <div className="flex overflow-x-auto gap-4 pl-0 pr-0 no-scrollbar scroll-smooth w-screen -ml-6">
            {COLORS.map((color, index) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.value)}
                className={`flex flex-col items-center gap-1.5 shrink-0 group p-1 ${index === 0 ? 'ml-6' : ''}`}
              >
                <div 
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    selectedColor === color.value 
                      ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.8)]" 
                      : "border-transparent scale-100 opacity-60 group-hover:opacity-100"
                  } ${color.bg}`}
                />
                <span className="text-[10px] font-bold tracking-tight whitespace-nowrap px-1 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sheet for GIF Selector */}
      {isBottomSheetOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsBottomSheetOpen(false)}
          />
          
          {/* Bottom Sheet */}
          <div 
            ref={bottomSheetRef}
            className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/20 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] animate-slide-up"
            onTouchStart={handleSheetTouchStart}
            onTouchMove={handleSheetTouchMove}
            onTouchEnd={handleSheetTouchEnd}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-white/30 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="px-6 pb-4">
              <h3 className="text-sm font-bold text-white text-center">GIFを選択</h3>
            </div>
            
            {/* GIF Grid */}
            <div className="px-6 pt-2 pb-8 max-h-[60vh] overflow-y-auto no-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                {GIFS.map((gif, index) => (
                  <button
                    key={gif.id}
                    onClick={() => {
                      setSelectedGifIndex(index);
                      setIsBottomSheetOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div 
                      className={`relative w-28 h-28 mx-auto rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                        selectedGifIndex === index 
                          ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-105" 
                          : "border-white/30 scale-100 opacity-70 group-hover:opacity-100 group-hover:border-white/50"
                      }`}
                    >
                      <Image
                        src={gif.path}
                        alt={gif.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className={`text-[10px] font-bold tracking-tight transition-all ${
                      selectedGifIndex === index
                        ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                        : "text-white/70 group-hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                    }`}>
                      {gif.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-center {
          scroll-snap-align: center;
        }

        .animate-strobe {
          animation: strobe 0.2s steps(2, start) infinite;
        }

        @keyframes strobe {
          0%, 100% { background-color: var(--strobe-color); }
          50% { background-color: #000000; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
