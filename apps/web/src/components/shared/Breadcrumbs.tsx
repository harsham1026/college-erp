'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-4 select-none">
      <Link
        href="/admin"
        className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 flex-shrink-0" />
            {isLast || !item.href ? (
              <span className={isLast ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
export default Breadcrumbs;
