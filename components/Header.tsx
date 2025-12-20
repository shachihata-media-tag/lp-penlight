import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 h-16 flex items-center border-b border-white/5 bg-bg/80 backdrop-blur-md'>
      <div className='container-custom flex items-center justify-between w-full h-full'>
        {/* Brand */}
        <div className='flex items-center gap-3'>
          <Image src='/shachihata-logo.png' alt='Shachihata' width={120} height={40} className='h-8 w-auto object-contain' priority />
          <span className='text-xs text-muted border-l border-white/10 pl-3 py-1 hidden sm:block'>ルミオ</span>
        </div>

        {/* Desktop Nav */}
        <nav className='hidden md:flex items-center gap-6 text-sm font-medium'>
          <Link href='#features' className='text-muted hover:text-text transition-colors'>
            特徴
          </Link>
          <Link href='#demos' className='text-muted hover:text-text transition-colors'>
            デモ・体験
          </Link>
          <Link href='#pricing' className='text-muted hover:text-text transition-colors'>
            費用感
          </Link>
          <Link href='#faq' className='text-muted hover:text-text transition-colors'>
            FAQ
          </Link>
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-3'>
          <a
            href='https://www.shachihata.co.jp/'
            target='_blank'
            rel='noopener noreferrer'
            className='hidden sm:flex items-center justify-center px-4 py-2 text-xs font-bold text-text border border-white/20 rounded-pill hover:bg-white/5 transition-colors'>
            概要資料
          </a>
          <Link
            href='#contact'
            className='flex items-center justify-center px-5 py-2 text-xs font-bold text-bg bg-white rounded-pill hover:bg-white/90 transition-colors shadow-glow'>
            お問い合わせ
          </Link>
        </div>
      </div>
    </header>
  );
}
