import Image from 'next/image';

export function Footer() {
  return (
    <footer className='bg-surface py-12 border-t border-white/5 text-sm text-muted'>
      <div className='container-custom'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
          <div className='col-span-1 md:col-span-2'>
            <Image src='/shachihata-logo.png' alt='Shachihata' width={120} height={40} className='h-8 w-auto object-contain mb-4' />
            <p className='leading-relaxed opacity-80'>
              音響連動WEBペンライト
              <br />
              世界中の会場と配信を、ひとつの光でつなぐ。
            </p>
          </div>
          <div>
            <h4 className='text-text font-bold mb-4'>Product</h4>
            <ul className='space-y-2'>
              <li>
                <a href='#hero' className='hover:text-text transition-colors'>
                  Top
                </a>
              </li>
              <li>
                <a href='#features' className='hover:text-text transition-colors'>
                  Features
                </a>
              </li>
              <li>
                <a href='#pricing' className='hover:text-text transition-colors'>
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='text-text font-bold mb-4'>Company</h4>
            <ul className='space-y-2'>
              <li>
                <a href='https://www.shachihata.co.jp/' target='_blank' rel='noopener noreferrer' className='hover:text-text transition-colors'>
                  Corporate Site
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-text transition-colors'>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Company Overview for AI Search / Trust */}
        <div className='border-t border-white/5 py-8 mb-4'>
          <h4 className='text-text font-bold mb-4 text-sm'>運営会社概要</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted/80 leading-relaxed'>
            <div>
              <p>
                <span className='font-semibold text-text/80'>社名：</span>シヤチハタ株式会社 (Shachihata Inc.)
              </p>
              <p>
                <span className='font-semibold text-text/80'>創業：</span>1925年 (大正14年)
              </p>
              <p>
                <span className='font-semibold text-text/80'>設立：</span>1941年 (昭和16年) 9月
              </p>
            </div>
            <div>
              <p>
                <span className='font-semibold text-text/80'>代表者：</span>代表取締役 舟橋 正剛
              </p>
              <p>
                <span className='font-semibold text-text/80'>本社所在地：</span>〒451-0021 愛知県名古屋市西区天塚町四丁目69番地
              </p>
            </div>
          </div>
        </div>

        <div className='flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5'>
          <p>&copy; {new Date().getFullYear()} Shachihata Inc. All rights reserved.</p>
          <p className='text-xs mt-2 md:mt-0 opacity-50'>Design for intended functionality demo only.</p>
        </div>
      </div>
    </footer>
  );
}
