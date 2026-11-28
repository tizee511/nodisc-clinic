import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Pause, Play, Sparkles, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useReducedMotionPref } from '../hooks/useCarouselSwipe';

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
  const { isRTL, lang } = useLanguage();
  const reducedMotion = useReducedMotionPref();
  const [userPaused, setUserPaused] = useState(false);

  if (items.length === 0) return null;

  const isStore = variant === 'store';
  const ItemIcon = isStore ? Tag : Activity;
  const isPaused = userPaused || reducedMotion;

  const renderGroup = (isClone: boolean) => (
    <div
      className="flex items-center shrink-0 py-1.5"
      aria-hidden={isClone ? true : undefined}
    >
      {items.map((item) => (
        <div
          key={`${isClone ? 'clone' : 'main'}-${item.id}`}
          className="inline-flex items-center shrink-0"
        >
          {/* Individually Sculpted Outer Gradient Frame Tile */}
          <Link
            to={item.to}
            tabIndex={isClone ? -1 : undefined}
            dir={isRTL ? 'rtl' : 'ltr'}
            className={`group rounded-xl p-[1px] transition-all duration-200 hover:-translate-y-[1px] ${
              isStore
                ? 'bg-gradient-to-r from-rose-300/65 via-sky-300/65 to-[#0F4C5C]/30 hover:from-rose-400 hover:via-[#0284C7] hover:to-[#0F4C5C] shadow-[0_3px_10px_-4px_rgba(225,29,72,0.2)]'
                : 'bg-gradient-to-r from-[#0F4C5C]/30 via-sky-300/75 to-[#0284C7]/35 hover:from-[#0F4C5C]/70 hover:via-[#0284C7]/75 hover:to-teal-500/65 shadow-[0_3px_10px_-4px_rgba(15,76,92,0.18)]'
            }`}
          >
            <span className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-[11px] bg-white/95 group-hover:bg-white whitespace-nowrap text-[11px] sm:text-xs font-medium">
              <span
                aria-hidden="true"
                className={`w-5 h-5 rounded-md inline-flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200 group-hover:scale-105 ${
                  isStore
                    ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white'
                    : 'bg-gradient-to-br from-[#0F4C5C] to-[#0284C7] text-white'
                }`}
              >
                <ItemIcon className="w-3 h-3" />
              </span>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold leading-none tabular-nums border ${
                    isStore
                      ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                      : 'bg-sky-50 text-[#0F4C5C] border-sky-200/80'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              <span
                className={`font-semibold transition-colors duration-200 ${
                  isStore
                    ? 'text-[#062B35] group-hover:text-rose-700'
                    : 'text-[#093542] group-hover:text-[#0284C7]'
                }`}
              >
                {item.text}
              </span>
            </span>
          </Link>

          {/* Geometric Double-Wing Diamond Connector */}
          <span
            aria-hidden="true"
            className="mx-2 sm:mx-3 inline-flex items-center gap-1 shrink-0"
          >
            <span
              className={`w-2 h-px rounded-full ${
                isStore ? 'bg-rose-300/70' : 'bg-[#0284C7]/35'
              }`}
            />
            <span
              className={`w-1.5 h-1.5 rotate-45 rounded-[1px] border ${
                isStore
                  ? 'border-rose-400 bg-rose-100'
                  : 'border-[#0284C7]/60 bg-sky-100'
              }`}
            />
            <span
              className={`w-2 h-px rounded-full ${
                isStore ? 'bg-rose-300/70' : 'bg-[#0284C7]/35'
              }`}
            />
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <section
      aria-label={ariaLabel}
      className={`relative overflow-hidden border-y select-none ${
        isStore
          ? 'bg-gradient-to-r from-rose-50/50 via-white to-sky-50/50 border-[#0F4C5C]/15 shadow-[0_6px_18px_-12px_rgba(9,53,66,0.22)]'
          : 'bg-gradient-to-r from-sky-50/75 via-white to-cyan-50/60 border-[#0F4C5C]/15 shadow-[0_6px_18px_-12px_rgba(15,76,92,0.22)]'
      }`}
    >
      {/* Top Specular Accent Line */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[1.5px] ${
          isStore
            ? 'bg-gradient-to-r from-transparent via-rose-400/50 to-transparent'
            : 'bg-gradient-to-r from-transparent via-[#38BDF8]/65 to-transparent'
        }`}
      />

      <div className="relative max-w-[1600px] mx-auto flex items-center">
        {/* Leading Framed Context Ribbon Tag (visible cleanly on tablet/desktop) */}
        <div className="hidden sm:flex items-center ps-3 lg:ps-5 pe-2 z-20 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs border ${
              isStore
                ? 'bg-gradient-to-r from-[#062B35] to-rose-700 text-white border-rose-300/30'
                : 'bg-gradient-to-r from-[#093542] to-[#0284C7] text-white border-sky-300/35'
            }`}
          >
            <Sparkles className="w-3 h-3 text-sky-200 shrink-0" />
            <span className="whitespace-nowrap">
              {isStore
                ? lang === 'ar'
                  ? 'مزايا المتجر'
                  : 'Store Deals'
                : lang === 'ar'
                  ? 'نبض العيادة'
                  : 'Highlights'}
            </span>
          </span>
        </div>

        {/* Marquee / Scrollable Viewport */}
        <div
          className={`relative flex-1 min-w-0 group/ticker ${
            reducedMotion
              ? 'overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
              : 'overflow-hidden'
          }`}
          dir="ltr"
        >
          {/* Left & Right Feathered Edge Fades */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-7 sm:w-14 z-10 bg-gradient-to-r from-white via-white/85 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-7 sm:w-14 z-10 bg-gradient-to-l from-white via-white/85 to-transparent"
          />

          <div
            className={`flex w-max ${
              reducedMotion
                ? ''
                : isRTL
                  ? 'animate-ticker-scroll-rtl'
                  : 'animate-ticker-scroll'
            } group-hover/ticker:[animation-play-state:paused] group-focus-within/ticker:[animation-play-state:paused]`}
            style={{
              animationDuration: `${Math.max(30, items.length * 8)}s`,
              animationPlayState: isPaused ? 'paused' : undefined,
            }}
          >
            {renderGroup(false)}
            {!reducedMotion && renderGroup(true)}
          </div>
        </div>

        {/* Framed Pause / Play Control */}
        {!reducedMotion && (
          <div className="relative z-20 shrink-0 pe-2.5 sm:pe-4 ps-1.5 flex items-center">
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
              aria-label={
                userPaused
                  ? lang === 'ar'
                    ? 'استئناف الشريط المتحرك'
                    : 'Resume highlights ticker'
                  : lang === 'ar'
                    ? 'إيقاف الشريط المتحرك مؤقتاً'
                    : 'Pause highlights ticker'
              }
              title={
                userPaused
                  ? lang === 'ar'
                    ? 'استئناف'
                    : 'Play'
                  : lang === 'ar'
                    ? 'إيقاف مؤقت'
                    : 'Pause'
              }
              className="btn-interactive w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200/90 bg-white/95 hover:bg-sky-50 hover:border-[#0284C7]/50 text-[#0F4C5C] shadow-2xs inline-flex items-center justify-center"
            >
              {userPaused ? (
                <Play className="w-3 h-3 fill-current" />
              ) : (
                <Pause className="w-3 h-3" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
