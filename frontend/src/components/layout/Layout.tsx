/** Layout component */
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-background-light text-[#0d101b] font-display min-h-screen flex flex-col overflow-x-hidden">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7e9f3] bg-white/80 backdrop-blur-md px-4 sm:px-10 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4 text-[#0d101b]">
            <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">graphic_eq</span>
            </div>
            <h2 className="text-[#0d101b] text-lg font-bold leading-tight tracking-[-0.015em]">Sauti AI</h2>
          </Link>
        </div>
        <div className="flex flex-1 justify-end gap-8 items-center">
          <nav className="hidden md:flex items-center gap-9">
            <Link to="/" className="text-[#0d101b] text-sm font-medium leading-normal hover:text-primary transition-colors">
              Nyumbani
            </Link>
            <Link to="/upload" className="text-primary text-sm font-bold leading-normal">
              Transkripsheni
            </Link>
            <a href="#" className="text-[#0d101b] text-sm font-medium leading-normal hover:text-primary transition-colors">
              Mipangilio
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-[#f8f9fc] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors shadow-sm">
              <span className="truncate">Pakua</span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAIeTARj-3TMu670v2sQqXla00A2f6h-KXsLz0X02ySjqzpTUG8DzdsyyawnlCQfbHxEIF1nSNlOMmxm-5TAybbrXQEV_mnR39Xp5K-ozM1-Ss5DnAU7366QaV00wl3iIEWG6K_Ntsa5S-1SnWAzdcY2IAZTWswXchzd8WtxpcCqXOU6dvmXHnWnslAK62EI_iiWNQYWh5HjAD6srFiJ0ydmS6HPUIG32dgi4s8y1q8abM8_gvETOo3J3M_gDFPvUeUCDBqSsI8Gqwa")' }}></div>
          </div>
        </div>
      </header>
      <main className="px-4 sm:px-10 lg:px-40 flex flex-1 justify-center py-5">
        {children}
      </main>
    </div>
  );
};

