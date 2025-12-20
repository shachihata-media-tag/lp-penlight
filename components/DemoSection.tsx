"use client";

import { Smartphone, Volume2 } from "lucide-react";

export function DemoSection() {
  return (
    <section className="py-24 bg-bg border-t border-white/5 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <span className="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">
            DEMO EXPERIENCE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            実際の連動を体験
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            お手持ちのスマートフォンで、ペンライトの動作を実際に体験できます。<br className="hidden md:block"/>
            QRコードを読み取り、下記の動画を再生してください。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Step 1: QR Code */}
          <div className="bg-surface border border-white/5 rounded-card p-8 text-center relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/50 to-transparent opacity-50" />
            
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-6">
              <Smartphone size={24} />
            </div>

            <h3 className="text-xl font-bold mb-4">1. スマホでスキャン</h3>
            <p className="text-sm text-muted mb-8">
              カメラアプリでQRコードを読み取ってください。<br/>
              ブラウザで専用ページが開きます。
            </p>

            <div className="bg-white p-4 rounded-xl inline-block mx-auto mb-4">
              {/* Placeholder QR Code - Replace with actual URL */}
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://d2gj7fm9gwjygp.cloudfront.net" 
                alt="Demo QR Code" 
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
              />
            </div>
            <p className="text-xs text-muted/50">※画面はイメージです</p>
          </div>

          {/* Step 2: Vimeo */}
          <div className="bg-surface border border-white/5 rounded-card p-8 text-center relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-accent/50 opacity-50" />

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-6">
              <Volume2 size={24} />
            </div>

            <h3 className="text-xl font-bold mb-4">2. 音源を再生</h3>
            <p className="text-sm text-muted mb-8">
              スマホの画面を開いたまま、<br/>
              この動画を再生すると光が連動します。
            </p>

            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden border border-white/10 relative">
               <iframe 
                src="https://player.vimeo.com/video/812654612?title=0&byline=0&portrait=0" 
                className="absolute top-0 left-0 w-full h-full" 
                frameBorder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen
                title="Demo Sound Source"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
