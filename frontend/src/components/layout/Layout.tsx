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
      <header className="sticky top-0 z-50 border-b border-solid border-b-[#e7e9f3] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between whitespace-nowrap px-4 sm:px-10 py-3 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-4 text-[#0d101b]">
              <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">graphic_eq</span>
              </div>
              <h2 className="text-[#0d101b] text-lg font-bold leading-tight tracking-[-0.015em]">Sauti AI</h2>
            </Link>
          </div>
          <nav className="hidden md:flex flex-1 items-center justify-end gap-9">
            <Link
              to="/"
              className="text-[#0d101b] text-sm font-medium leading-normal hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link to="/upload" className="text-primary text-sm font-bold leading-normal">
              Transcription
            </Link>
          </nav>
        </div>
      </header>
      <main className="px-4 sm:px-10 lg:px-40 flex flex-1 justify-center py-5">
        {children}
      </main>
    </div>
  );
};

