import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const getFilterTabClass = (isActive: boolean, compact = false) =>
  `btn-interactive inline-flex items-center gap-1.5 rounded-xl font-semibold border whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C] ${
    compact ? 'px-3.5 py-1.5 text-xs' : 'px-4 py-2 text-xs sm:text-sm'
  } ${
    isActive
      ? 'btn-sheen bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border-[#0284C7] shadow-[0_6px_16px_-4px_rgba(2,132,199,0.45)]'
      : 'bg-white/90 text-slate-700 border-slate-200/80 hover:text-[#0F4C5C] hover:border-[#0F4C5C]/40 hover:bg-sky-50/90 shadow-2xs'
  }`;

interface ScrollableFilterBarProps {
  children: React.ReactNode;
  ariaLabel: string;
  role?: 'tablist' | 'group' | 'region';
  surface?: 'elevated' | 'inset' | 'featured';
  fullWidth?: boolean;
  showFilterIcon?: boolean;
  className?: string;
}

export const ScrollableFilterBar: React.FC<ScrollableFilterBarProps> = ({
  children,
  ariaLabel,
  role = 'tablist',
  surface = 'elevated',
  fullWidth = false,
  showFilterIcon,
  className = '',
}) => {
  const { isRTL, lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const shouldShowIcon = showFilterIcon ?? surface === 'elevated';

  const dragState = useRef<{
    active: boolean;
    startX: number;
    startScrollLeft: number;
    didDrag: boolean;
  }>({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    didDrag: false,
  });

  const updateScrollBounds = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const containerRect = el.getBoundingClientRect();
    const childrenEls = Array.from(el.children) as HTMLElement[];
    if (childrenEls.length === 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    let leftHidden = false;
    let rightHidden = false;
    for (const child of childrenEls) {
      const rect = child.getBoundingClientRect();
      if (rect.left < containerRect.left - 3) leftHidden = true;
      if (rect.right > containerRect.right + 3) rightHidden = true;
    }
    setCanScrollLeft(leftHidden);
    setCanScrollRight(rightHidden);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollBounds();
    const raf = requestAnimationFrame(updateScrollBounds);

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateScrollBounds())
        : null;
    observer?.observe(el);

    window.addEventListener('resize', updateScrollBounds);
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('resize', updateScrollBounds);
    };
  }, [children, isRTL, updateScrollBounds]);

  const scrollPhysically = (deltaX: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: deltaX, behavior: 'smooth' });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = {
      active: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      didDrag: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragState.current;
    if (!st.active) return;
    const el = scrollRef.current;
    if (!el) return;

    const dx = e.clientX - st.startX;
    if (!st.didDrag && Math.abs(dx) > 6) {
      st.didDrag = true;
      setIsDragging(true);
    }
    if (st.didDrag) {
      el.scrollLeft = st.startScrollLeft - dx;
    }
  };

  const endDrag = () => {
    dragState.current.active = false;
    if (isDragging) {
      setIsDragging(false);
    }
    setTimeout(() => {
      dragState.current.didDrag = false;
    }, 0);
  };

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragState.current.didDrag) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.didDrag = false;
    }
  };

  const hasOverflow = canScrollLeft || canScrollRight;
  const startEnabled = isRTL ? canScrollRight : canScrollLeft;
  const endEnabled = isRTL ? canScrollLeft : canScrollRight;
  const StartIcon = isRTL ? ChevronRight : ChevronLeft;
  const EndIcon = isRTL ? ChevronLeft : ChevronRight;

  const containerSurfaceClass =
    surface === 'featured'
      ? 'bg-gradient-to-b from-white via-white to-sky-50/55 border border-[#0F4C5C]/25 rounded-2xl p-2 shadow-[0_12px_30px_-12px_rgba(15,76,92,0.28)] ring-2 ring-sky-200/45'
      : surface === 'elevated'
      ? 'bg-gradient-to-b from-white to-sky-50/30 border border-[#0F4C5C]/22 rounded-2xl p-1.5 shadow-[0_10px_26px_-10px_rgba(15,76,92,0.22)] ring-1 ring-sky-200/40'
      : 'bg-slate-50/90 border border-slate-200/90 rounded-xl p-1.5 shadow-xs ring-1 ring-white/70';

  const fadeFrom =
    surface === 'inset'
      ? 'from-slate-50 via-slate-50/80'
      : 'from-white via-white/80';

  const arrowBtnSize = surface === 'featured' ? 'w-9 h-9' : 'w-9 h-9 sm:w-8 sm:h-8';

  return (
    <div
      className={`relative overflow-hidden ${fullWidth ? 'w-full' : 'w-fit max-w-full'} flex items-center gap-1.5 sm:gap-2 ${containerSurfaceClass} ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#0284C7]/35 to-transparent"
      />
      {shouldShowIcon && (
        <span
          aria-hidden="true"
          className="hidden sm:inline-flex w-8 h-8 rounded-xl bg-sky-50 border border-sky-200/70 text-[#0F4C5C] items-center justify-center shrink-0 ms-0.5"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </span>
      )}

      {hasOverflow && (
        <button
          type="button"
          onClick={() => scrollPhysically(isRTL ? 260 : -260)}
          disabled={!startEnabled}
          aria-label={lang === 'ar' ? 'تحريك الشريط للخلف' : 'Scroll filters back'}
          className={`btn-interactive ${arrowBtnSize} rounded-xl border flex items-center justify-center shrink-0 transition-all duration-150 ${
            startEnabled
              ? 'bg-white/95 backdrop-blur-xs border-slate-200 text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white hover:border-[#0F4C5C] shadow-xs'
              : 'bg-slate-50/80 border-slate-100 text-slate-300 cursor-default'
          }`}
        >
          <StartIcon className="w-4 h-4" />
        </button>
      )}

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-10 z-10 bg-gradient-to-r ${fadeFrom} to-transparent transition-opacity duration-200 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-10 z-10 bg-gradient-to-l ${fadeFrom} to-transparent transition-opacity duration-200 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          ref={scrollRef}
          role={role}
          aria-label={ariaLabel}
          onScroll={updateScrollBounds}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={handleClickCapture}
          className={`flex items-center flex-nowrap gap-2 overflow-x-auto max-w-full select-none scroll-smooth snap-x snap-proximity touch-pan-y py-0.5 px-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            hasOverflow ? (isDragging ? 'cursor-grabbing scroll-auto' : 'cursor-grab') : ''
          }`}
        >
          {children}
        </div>
      </div>

      {hasOverflow && (
        <button
          type="button"
          onClick={() => scrollPhysically(isRTL ? -260 : 260)}
          disabled={!endEnabled}
          aria-label={lang === 'ar' ? 'تحريك الشريط للأمام' : 'Scroll filters forward'}
          className={`btn-interactive ${arrowBtnSize} rounded-xl border flex items-center justify-center shrink-0 transition-all duration-150 ${
            endEnabled
              ? 'bg-white/95 backdrop-blur-xs border-slate-200 text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white hover:border-[#0F4C5C] shadow-xs'
              : 'bg-slate-50/80 border-slate-100 text-slate-300 cursor-default'
          }`}
        >
          <EndIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
