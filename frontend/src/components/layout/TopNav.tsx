/** Shared top navigation bar */
import React from 'react';
import { Link } from 'react-router-dom';

interface TopNavProps {
  /** Right-hand content: nav links, buttons, etc. */
  rightContent?: React.ReactNode;
  /** Optional override for the max-width container (e.g. max-w-5xl, max-w-[1280px]) */
  maxWidthClass?: string;
  /** Optional override for vertical padding (e.g. py-3 vs py-4) */
  paddingYClass?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  rightContent,
  maxWidthClass = 'max-w-[1280px]',
  paddingYClass = 'py-3',
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-solid border-b-[#e7e9f3] bg-white/80 backdrop-blur-md">
      <div
        className={`mx-auto flex w-full ${maxWidthClass} items-center justify-between whitespace-nowrap px-4 sm:px-10 ${paddingYClass} gap-4`}
      >
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-4 text-[#0d101b]">
            <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">graphic_eq</span>
            </div>
            <h2 className="text-[#0d101b] text-lg font-bold leading-tight tracking-[-0.015em]">Sauti AI</h2>
          </Link>
        </div>
        {rightContent}
      </div>
    </header>
  );
};


