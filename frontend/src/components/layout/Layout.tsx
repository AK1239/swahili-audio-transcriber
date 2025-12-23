/** Layout component */
import React from 'react';
import { Link } from 'react-router-dom';
import { TopNav } from './TopNav';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-background-light text-[#0d101b] font-display min-h-screen flex flex-col overflow-x-hidden">
      {/* Top Navigation */}
      <TopNav
        paddingYClass="py-4"
        rightContent={
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
        }
      />
      <main className="px-4 sm:px-10 lg:px-40 flex flex-1 justify-center py-5">
        {children}
      </main>
    </div>
  );
};

