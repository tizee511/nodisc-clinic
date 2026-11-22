import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const { isRTL, t } = useLanguage();
  const Separator = isRTL ? ChevronLeft : ChevronRight;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-500">
        <li>
          <Link to="/" className="hover:text-[#0F4C5C] transition-colors">
            {t('nav.home')}
          </Link>
        </li>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <li aria-hidden="true" className="text-slate-400">
              <Separator className="w-3.5 h-3.5" />
            </li>
            <li>
              {item.to ? (
                <Link to={item.to} className="hover:text-[#0F4C5C] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-900 font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
