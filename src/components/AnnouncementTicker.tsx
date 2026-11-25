import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface TickerItem {
  id: string;
  text: string;
  to: string;
  badge?: string;
}

interface AnnouncementTickerProps {
  items: TickerItem[];
  variant: 'clinic' | 'store';
  ariaLabel: string;
}

export const AnnouncementTicker: React.FC<AnnouncementTickerProps> = ({
  items,
  variant,
  ariaLabel,
}) => {
  const { isRTL } = useLanguage();

  if (items.length === 0) return null;

  const isStore = variant === 'store';
  const ItemIcon = isStore ? Tag : Activity;

  const renderGroup = (isClone: boolean) => (
    <div
      className="flex items-center shrink-0"
      aria-hidden={isClone ? true : undefined}
    >
      {items.map((item) => (
        <Link
          key={`${isClone ? 'clone' : 'main'}-${item.id}`}
          to={item.to}
          tabIndex={isClone ? -1 : undefined}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2 whitespace-nowrap text-xs font-medium transition-colors"
        >
          <ItemIcon
            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
              isStore ? 'text-rose-600' : 'text-[#0284C7]'
            }`}
            aria-hidden="true"
          />
          {item.badge && (
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold leading-none tabular-nums ${
                isStore
                  ? 'bg-rose-600 text-white'
                  : 'bg-[#0F4C5C] text-white'
              }`}
            >
              {item.badge}
            </span>
          )}
          <span
            className={`transition-colors ${
              isStore
                ? 'text-[#062B35] group-hover:text-rose-700'
                : 'text-[#093542] group-hover:text-[#0284C7]'
            }`}
          >
            {item.text}
          </span>
          <span
            aria-hidden="true"
            className={`ms-3 text-[11px] font-light shrink-0 ${
              isStore ? 'text-rose-300' : 'text-sky-300'
            }`}
          >
            |
          </span>
        </Link>
      ))}
    </div>
  );

  return (
    <section
      aria-label={ariaLabel}
      className={`relative overflow-hidden border-b select-none ${
        isStore
          ? 'bg-gradient-to-r from-sky-50 via-white to-rose-50/75 border-[#0F4C5C]/20'
          : 'bg-gradient-to-r from-sky-50/90 via-white to-sky-100/70 border-sky-200/80'
      }`}
    >
      {/* Left & Right Soft Edge Fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-14 z-10 bg-gradient-to-r from-sky-50 to-transparent"
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-14 z-10 bg-gradient-to-l ${
          isStore ? 'from-rose-50/90' : 'from-sky-100/80'
        } to-transparent`}
      />

      {/* Seamless Marquee Track (Pause on Hover/Focus) */}
      <div className="w-full overflow-hidden group/ticker" dir="ltr">
        <div
          className="flex w-max animate-ticker-scroll group-hover/ticker:[animation-play-state:paused] group-focus-within/ticker:[animation-play-state:paused]"
          style={{
            animationDuration: `${Math.max(26, items.length * 7)}s`,
          }}
        >
          {renderGroup(false)}
          {renderGroup(true)}
        </div>
      </div>
    </section>
  );
};
