import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface StoreGlyphProps {
  className?: string;
}

export const StoreGlyph: React.FC<StoreGlyphProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {/* Pharmacy Storefront Awning & Bag Emblem */}
    <path d="M4 9.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.5" />
    <path d="M3 7.5 4.8 3.8A1.5 1.5 0 0 1 6.15 3h11.7a1.5 1.5 0 0 1 1.35.8L21 7.5a2.25 2.25 0 0 1-4.5 0 2.25 2.25 0 0 1-4.5 0 2.25 2.25 0 0 1-4.5 0A2.25 2.25 0 0 1 3 7.5Z" />
    {/* Subtle Medical Plus Inside Storefront */}
    <path d="M12 12.75v4.5M9.75 15h4.5" />
  </svg>
);

interface StoreLogoBadgeProps {
  size?: 'sm' | 'md';
  tone?: 'light' | 'dark';
}

export const StoreLogoBadge: React.FC<StoreLogoBadgeProps> = ({ size = 'md', tone = 'light' }) => {
  const boxSize =
    size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5';

  return (
    <span
      className={`${boxSize} inline-flex items-center justify-center shrink-0 shadow-xs ${
        tone === 'dark'
          ? 'bg-white/15 border border-sky-300/35 text-[#7DD3FC]'
          : 'bg-gradient-to-br from-[#062B35] via-[#0F4C5C] to-[#0284C7] text-white ring-1 ring-[#0F4C5C]/20'
      }`}
      aria-hidden="true"
    >
      <StoreGlyph className={iconSize} />
    </span>
  );
};

export const StoreLogoMark: React.FC<{ tone?: 'light' | 'dark' }> = ({ tone = 'light' }) => {
  const { lang } = useLanguage();
  const isDark = tone === 'dark';

  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5 min-w-0">
      <StoreLogoBadge size="md" tone={tone} />
      <span className="flex flex-col leading-tight min-w-0">
        <span
          className={`font-display font-bold text-sm sm:text-lg truncate ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {lang === 'ar' ? 'متجر نوديسك' : 'NODISC Store'}
        </span>
        <span
          className={`hidden min-[380px]:block text-[10px] sm:text-[11px] font-medium truncate ${
            isDark ? 'text-sky-300' : 'text-[#0F4C5C]'
          }`}
        >
          {lang === 'ar' ? 'الصيدلية والمستلزمات الطبية' : 'Pharmacy & Medical Store'}
        </span>
      </span>
    </span>
  );
};
