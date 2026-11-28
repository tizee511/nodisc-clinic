import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import storeLogoImg from '../../assets/images/nodisc_store_logo_1795875752599.jpg';

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
    size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl';

  return (
    <span
      className={`${boxSize} inline-flex items-center justify-center shrink-0 overflow-hidden bg-white transition-transform duration-200 ${
        tone === 'dark'
          ? 'ring-1 ring-[#9CE5CC]/70 shadow-[0_2px_12px_-2px_rgba(56,189,248,0.3)]'
          : 'ring-1 ring-slate-200/90 shadow-xs'
      }`}
      aria-hidden="true"
    >
      <img
        src={storeLogoImg}
        alt=""
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover scale-[1.03]"
      />
    </span>
  );
};

export const StoreLogoMark: React.FC<{ tone?: 'light' | 'dark' }> = ({ tone = 'light' }) => {
  const { lang } = useLanguage();
  const isDark = tone === 'dark';

  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5 min-w-0 group">
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
          className={`block text-[10px] sm:text-[11px] font-medium truncate ${
            isDark ? 'text-sky-300' : 'text-[#0F4C5C]'
          }`}
        >
          {lang === 'ar' ? 'صيدلية نوديسك' : 'NODISC Pharmacy'}
        </span>
      </span>
    </span>
  );
};
