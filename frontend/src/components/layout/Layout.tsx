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
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7e9f3] px-6 lg:px-10 py-3 bg-white shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4">
            <div className="size-8 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">graphic_eq</span>
            </div>
            <h2 className="text-[#0d101b] text-lg font-bold leading-tight tracking-[-0.015em]">Swahili AI Scribe</h2>
          </Link>
        </div>
        <div className="flex flex-1 justify-end gap-8 items-center">
          <nav className="hidden md:flex items-center gap-9">
            <Link to="/upload" className="text-[#0d101b] text-sm font-medium hover:text-primary transition-colors leading-normal">
              Dashboard
            </Link>
            <a href="#" className="text-[#0d101b] text-sm font-medium hover:text-primary transition-colors leading-normal">
              History
            </a>
            <a href="#" className="text-[#0d101b] text-sm font-medium hover:text-primary transition-colors leading-normal">
              Settings
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center text-[#0d101b] hover:bg-gray-100 rounded-full p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzrf3v2ApMdT6Rf2iidQvKbiDYntSE3cljhjMUYI0DtO1u6i17EehzIqV5Wgemtv91JcaxhJU91HxwNS8V1iHpAUaVK7jqGeWyI_2d-pUBBR1unFNri44NiGAmApLq2ISBZhNsiPxyQ7obZKpjUMllU_6afTGCx5gzD9dgqGdCGpHkmkE_CwkEdln0Uo6ptnV7Fth36Mf0l4f9WIlX-at_JzD83GHOL066UQib-5-ouHXsRCGI28CSLCBJQ6IVj_xTvq_yHc_vFTxf")' }}></div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-8 lg:px-40 w-full max-w-[1440px] mx-auto">
        {children}
      </main>
    </div>
  );
};

