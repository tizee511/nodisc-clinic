import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarouselSwipe, useReducedMotionPref } from '../hooks/useCarouselSwipe';

interface SequentialCarouselProps<T> {
  items: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  desktopCols?: 1 | 2 | 3;
  tabletCols?: 1 | 2;
  intervalMs?: number;
  ariaLabel: string;
  isRTL: boolean;
  lang: 'ar' | 'en';
  headerLeft?: React.ReactNode;
  headerRightLink?: React.ReactNode;
  compactHeader?: boolean;
  theme?: 'light' | 'dark';
}

export function SequentialCarousel<T>({
  items,
  keyExtractor,
  renderItem,
  desktopCols = 3,
  tabletCols = 2,
  intervalMs = 4200,
  ariaLabel,
  isRTL,
  lang,
  headerLeft,
  headerRightLink,
  compactHeader = false,
  theme = 'light',
}: SequentialCarouselProps<T>) {
  const reducedMotion = useReducedMotionPref();
  const [itemsPerView, setItemsPerView] = useState<number>(() => {
    if (typeof window === 'undefined') return desktopCols;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return tabletCols;
    return desktopCols;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);

  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(tabletCols);
      else setItemsPerView(desktopCols);
    };
    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, [desktopCols, tabletCols]);

  const totalCount = items.length;
  const visibleSlots = Math.min(itemsPerView, Math.max(1, totalCount));
  const maxIndex = Math.max(0, totalCount - visibleSlots);

  useEffect(() => {
    setActiveIndex((curr) => Math.min(curr, maxIndex));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const { dragOffsetPx, isDragging, viewportProps } = useCarouselSwipe({
    activeIndex,
    maxIndex,
    onNext: handleNext,
    onPrev: handlePrev,
  });

  const autoPaused = isHoveredOrFocused || isDragging || reducedMotion;

  useEffect(() => {
    if (autoPaused || maxIndex === 0) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [autoPaused, maxIndex, intervalMs]);

  if (totalCount === 0) return null;

  const trackWidthPct = (totalCount / visibleSlots) * 100;
  const translateXPct = (activeIndex * 100) / totalCount;
  const isDark = theme === 'dark';

  return (
    <div
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHoveredOrFocused(true)}
      onMouseLeave={() => setIsHoveredOrFocused(false)}
      onFocusCapture={() => setIsHoveredOrFocused(true)}
      onBlurCapture={() => setIsHoveredOrFocused(false)}
      className="space-y-4 sm:space-y-5"
    >
      {(headerLeft || headerRightLink) && (
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${
            compactHeader ? 'mb-1' : 'mb-3'
          }`}
        >
          {headerLeft ? <div className="min-w-0">{headerLeft}</div> : <div />}
          {headerRightLink && <div className="shrink-0">{headerRightLink}</div>}
        </div>
      )}

      {/* Sliding Strip Viewport with Touch/Pointer Swipe & Desktop Frosted Arrows */}
      <div
        className={`relative group/carousel touch-pan-y select-none focus-visible:outline-none ${
          maxIndex > 0 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab sm:cursor-default') : ''
        }`}
        dir="ltr"
        tabIndex={maxIndex > 0 ? 0 : undefined}
        {...viewportProps}
      >
        <div className="overflow-hidden -mx-2 sm:-mx-2.5 py-1.5">
          <div
            className={`flex items-stretch ${
              isDragging
                ? 'transition-none'
                : 'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
            }`}
            style={{
              width: `${trackWidthPct}%`,
              transform: `translate3d(calc(-${translateXPct}% + ${dragOffsetPx}px), 0, 0)`,
              willChange: 'transform',
            }}
          >
            {items.map((item, idx) => (
              <div
                key={keyExtractor(item, idx)}
                style={{ width: `${100 / totalCount}%` }}
                className="px-2 sm:px-2.5 shrink-0 flex"
              >
                <div dir={isRTL ? 'rtl' : 'ltr'} className="w-full flex">
                  {renderItem(item, idx)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dual-Ring Frosted Image-Overlay Navigation Arrows (Mobile + Tablet + Desktop) */}
        {maxIndex > 0 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label={
                isRTL
                  ? lang === 'ar'
                    ? 'العنصر التالي'
                    : 'Next item'
                  : lang === 'ar'
                    ? 'العنصر السابق'
                    : 'Previous item'
              }
              className={`flex absolute left-2 sm:left-3 top-[27%] sm:top-[29%] -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
                isDark
                  ? 'bg-[#05222B]/85 hover:bg-[#093542] text-white border border-sky-300/45 ring-2 ring-white/20'
                  : 'bg-white/90 hover:bg-white text-[#0F4C5C] border border-[#0F4C5C]/25 ring-2 ring-sky-200/60'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label={
                isRTL
                  ? lang === 'ar'
                    ? 'العنصر السابق'
                    : 'Previous item'
                  : lang === 'ar'
                    ? 'العنصر التالي'
                    : 'Next item'
              }
              className={`flex absolute right-2 sm:right-3 top-[27%] sm:top-[29%] -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
                isDark
                  ? 'bg-[#05222B]/85 hover:bg-[#093542] text-white border border-sky-300/45 ring-2 ring-white/20'
                  : 'bg-white/90 hover:bg-white text-[#0F4C5C] border border-[#0F4C5C]/25 ring-2 ring-sky-200/60'
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}
      </div>

      {/* Minimal Framed Progress Indicator Pill */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center pt-0.5" dir="ltr">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-xs ${
              isDark
                ? 'bg-[#05222B]/65 border-sky-300/25 ring-1 ring-white/10'
                : 'bg-white/95 border-[#0F4C5C]/15 ring-1 ring-sky-100/80 shadow-[0_6px_18px_-8px_rgba(15,76,92,0.18)]'
            }`}
          >
            {/* Animated Progress Indicator Dots */}
            <div className="inline-flex items-center gap-1.5">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`${lang === 'ar' ? 'شريحة' : 'Slide'} ${idx + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                      isDark
                        ? isActive
                          ? 'w-7 bg-white/30'
                          : 'w-2 bg-white/35 hover:bg-white/60'
                        : isActive
                          ? 'w-7 bg-[#0F4C5C]/20'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  >
                    {isActive && (
                      <span
                        key={`${activeIndex}-${autoPaused ? 'paused' : 'run'}`}
                        className={`absolute inset-0 rounded-full ${
                          isDark ? 'bg-white' : 'bg-gradient-to-r from-[#0F4C5C] to-[#0284C7]'
                        } ${!autoPaused ? 'animate-dot-progress' : ''}`}
                        style={
                          !autoPaused
                            ? { animationDuration: `${intervalMs}ms` }
                            : undefined
                        }
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Numeric Step Readout */}
            <span
              className={`text-[11px] font-mono font-semibold tabular-nums ps-1 border-s ${
                isDark
                  ? 'text-sky-100/85 border-white/15'
                  : 'text-slate-600 border-slate-200'
              }`}
            >
              {String(activeIndex + 1).padStart(2, '0')}/{String(maxIndex + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
