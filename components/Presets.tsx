'use client';

import { useState, useEffect } from 'react';
import { PhoneSimulator } from './PhoneSimulator';
import { DEMO_PRESETS, PENLIGHT_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';

export function Presets() {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [simulatorColor, setSimulatorColor] = useState('#000000');
  const [simulatorPattern, setSimulatorPattern] = useState<any>('steady');

  // Mock sequence runner
  useEffect(() => {
    if (!activePreset) return;

    const preset = DEMO_PRESETS.find((p) => p.id === activePreset);
    if (!preset) return;

    let step = 0;
    const interval = setInterval(() => {
      // Simple mock sequence logic
      const colorName = preset.sequence[step % preset.sequence.length];
      const colorVal = PENLIGHT_COLORS.find((c) => c.name === colorName)?.value || '#000000';
      setSimulatorColor(colorVal);
      step++;
    }, 800); // Change every 800ms

    return () => clearInterval(interval);
  }, [activePreset]);

  return (
    <section id='demos' className='py-24 bg-bg relative'>
      <div className='container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
        <div>
          <span className='text-accent text-sm font-bold tracking-widest uppercase mb-2 block'>Presets</span>
          <h2 className='text-3xl md:text-4xl font-bold mb-8'>演出パターン例</h2>
          <p className='text-muted mb-8 leading-relaxed'>
            楽曲の展開に合わせたプリセット演出をご用意。
            <br />
            これらを組み合わせるだけで、プロフェッショナルな演出が可能です。
          </p>

          <div className='space-y-4'>
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  if (activePreset === preset.id) {
                    setActivePreset(null);
                    setSimulatorColor('#000000');
                  } else {
                    setActivePreset(preset.id);
                  }
                }}
                className={cn(
                  'w-full text-left p-6 rounded-xl border transition-all flex items-center justify-between group',
                  activePreset === preset.id ? 'bg-surface2 border-accent/50 shadow-glow' : 'bg-surface border-white/5 hover:border-white/20'
                )}>
                <div>
                  <h3 className={cn('text-lg font-bold mb-1', activePreset === preset.id ? 'text-white' : 'text-white')}>{preset.label}</h3>
                  <p className='text-sm text-muted'>{preset.description}</p>
                </div>
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border transition-all',
                    activePreset === preset.id ? 'bg-accent border-accent text-bg' : 'border-white/20 group-hover:border-white text-white'
                  )}>
                  <Play size={16} fill={activePreset === preset.id ? 'currentColor' : 'none'} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mini Simulator for Preview */}
        <div className='flex justify-center bg-surface/30 p-8 rounded-3xl border border-white/5'>
          <PhoneSimulator
            color={simulatorColor}
            pattern={simulatorPattern}
            status='synced'
            logoUrl='/shachihata-logo.png' // Placeholder
            className='transform scale-90'
          />
        </div>
      </div>
    </section>
  );
}
