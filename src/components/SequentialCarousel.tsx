import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  intervalMs = 3800,
  ariaLabel,
  isRTL,
  lang,
  headerLeft,
  headerRightLink,
  compactHeader = false,
  theme = 'light',
}: SequentialCarouselProps<T>) {
  const [itemsPerView, setItemsPerView] = useState<number>(() => {
    if (typeof window === 'undefined') return desktopCols;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return tabletCols;
    return desktopCols;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  useEffect(() => {
    if (isPaused || maxIndex === 0) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [isPaused, maxIndex, intervalMs]);

  if (totalCount === 0) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const trackWidthPct = (totalCount / visibleSlots) * 100;
  const translateXPct = (activeIndex * 100) / totalCount;

  return (
    <div
      aria-label={ariaLabel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="space-y-5"
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

      {/* Sliding Strip Viewport with Left/Right Arrows Overlaid on the Image Band */}
      <div className="relative group/carousel" dir="ltr">
        <div className="overflow-hidden -mx-2.5 py-1">
          <div
            className="flex items-stretch transition-transform duration-500 ease-out"
            style={{
              width: `${trackWidthPct}%`,
              transform: `translateX(-${translateXPct}%)`,
            }}
          >
            {items.map((item, idx) => (
              <div
                key={keyExtractor(item, idx)}
                style={{ width: `${100 / totalCount}%` }}
                className="px-2.5 shrink-0 flex"
              >
                <div dir={isRTL ? 'rtl' : 'ltr'} className="w-full flex">
                  {renderItem(item, idx)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {maxIndex > 0 && (
          <>
            <button
              type="button"
              onClick={isRTL ? handleNext : handlePrev}
              aria-label={
                isRTL
                  ? lang === 'ar'
                    ? 'العنصر التالي'
                    : 'Next item'
                  : lang === 'ar'
                  ? 'العنصر السابق'
                  : 'Previous item'
              }
              className="absolute left-2 sm:left-3 top-24 sm:top-32 lg:top-36 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#0F4C5C] border border-slate-200/90 shadow-lg flex items-center justify-center transition-all hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={isRTL ? handlePrev : handleNext}
              aria-label={
                isRTL
                  ? lang === 'ar'
                    ? 'العنصر السابق'
                    : 'Previous item'
                  : lang === 'ar'
                  ? 'العنصر التالي'
                  : 'Next item'
              }
              className="absolute right-2 sm:right-3 top-24 sm:top-32 lg:top-36 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#0F4C5C] border border-slate-200/90 shadow-lg flex items-center justify-center transition-all hover:scale-105"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`${lang === 'ar' ? 'شريحة' : 'Slide'} ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                theme === 'dark'
                  ? activeIndex === idx
                    ? 'w-6 bg-white'
                    : 'w-2 bg-white/35 hover:bg-white/60'
                  : activeIndex === idx
                  ? 'w-6 bg-[#0F4C5C]'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
