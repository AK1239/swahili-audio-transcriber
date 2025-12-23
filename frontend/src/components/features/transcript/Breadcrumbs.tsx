/** Breadcrumbs component */
import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link
              to={item.href}
              className="text-[#4c599a] text-sm font-medium leading-normal hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#0d101b] text-sm font-medium leading-normal">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="text-[#4c599a] text-sm font-medium leading-normal">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

