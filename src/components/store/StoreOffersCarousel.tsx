import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Percent,
  ShoppingBag,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { useCarouselSwipe, useReducedMotionPref } from '../../hooks/useCarouselSwipe';
import { SafeImage } from '../SafeImage';
import { StockStatusBadge } from './StockStatusBadge';

const OFFERS_INTERVAL_MS = 3800;

export const StoreOffersCarousel: React.FC = () => {
  const { lang, isRTL, t, products, storeMainSections, productCategories } = useLanguage();
  const { addToCart, formatPrice } = useClinic();
  const reducedMotion = useReducedMotionPref();

  const offerProducts = useMemo(
    () =>
      products.filter(
        (p) => p.isOnSale || (p.originalPriceYER !== undefined && p.originalPriceYER > p.priceYER)
      ),
    [products]
  );

  const [itemsPerView, setItemsPerView] = useState<number>(() => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    updateView();
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  const totalCount = offerProducts.length;
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
    }, OFFERS_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoPaused, maxIndex]);

  if (offerProducts.length === 0) return null;

  const handleQuickAdd = (productId: string, option?: string) => {
    const res = addToCart(productId, 1, option);
    if (res.ok) {
      setJustAddedId(productId);
      setTimeout(() => setJustAddedId(null), 1400);
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const trackWidthPct = (totalCount / visibleSlots) * 100;
  const translateXPct = (activeIndex * 100) / totalCount;

  return (
    <section
      aria-label={t('store.offers.title')}
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHoveredOrFocused(true)}
      onMouseLeave={() => setIsHoveredOrFocused(false)}
      onFocusCapture={() => setIsHoveredOrFocused(true)}
      onBlurCapture={() => setIsHoveredOrFocused(false)}
      className="relative bg-gradient-to-br from-[#062B35] via-[#0F4C5C] to-[#115E70] rounded-2xl p-4 sm:p-7 text-white space-y-5 overflow-hidden border border-sky-300/25 shadow-[0_16px_38px_-16px_rgba(9,53,66,0.55)]"
    >
      {/* Subtle Ambient Specular & Geometric Corner Highlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -end-20 w-56 h-56 rounded-full bg-[#38BDF8]/18 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -start-24 w-56 h-56 rounded-full bg-rose-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-300/55 to-transparent"
      />

      {/* Top Bar: Title + Controls */}
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500/90 to-rose-600 border border-white/25 ring-2 ring-rose-400/25 inline-flex items-center justify-center shrink-0 shadow-sm">
            <Percent className="w-5 h-5 text-white" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display font-bold text-lg sm:text-2xl text-white leading-tight">
                {lang === 'ar' ? 'أحدث العروض والتخفيضات' : 'Latest Pharmacy Offers'}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-rose-500 border border-rose-300/40 text-white text-[11px] font-bold tabular-nums shadow-xs">
                {totalCount}
              </span>
            </div>
            <p className="text-xs text-sky-100/90 mt-0.5">
              {lang === 'ar'
                ? 'عروض حصرية متجددة على منتجات التجميل والفيتامينات ومستلزمات الأم والطفل والتأهيل.'
                : 'Exclusive seasonal savings across skincare, vitamins, mother & baby care, and rehab gear.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/store/offers"
            className="btn-interactive btn-sheen inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-white to-sky-50 text-[#093542] border border-sky-200/80 text-xs font-extrabold shadow-sm whitespace-nowrap"
          >
            <span>{t('store.offers.viewOffers')}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Sliding Strip Viewport with Touch/Pointer Swipe & Desktop Frosted Arrows */}
      <div
        className={`relative touch-pan-y select-none focus-visible:outline-none ${
          maxIndex > 0 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab sm:cursor-default') : ''
        }`}
        dir="ltr"
        tabIndex={maxIndex > 0 ? 0 : undefined}
        {...viewportProps}
      >
            <div className="overflow-hidden -mx-2 py-1">
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
                {offerProducts.map((prd) => {
                  const sec = storeMainSections.find((s) => s.id === prd.mainSectionId);
                  const cat = productCategories.find((c) => c.id === prd.categoryId);
                  const hasDiscount =
                    prd.originalPriceYER !== undefined && prd.originalPriceYER > prd.priceYER;
                  const discountPct = hasDiscount
                    ? Math.round(
                        ((prd.originalPriceYER! - prd.priceYER) / prd.originalPriceYER!) * 100
                      )
                    : 0;
                  const isAdded = justAddedId === prd.id;

                  return (
                    <div
                      key={prd.id}
                      style={{ width: `${100 / totalCount}%` }}
                      className="px-2 shrink-0 flex"
                    >
                      {/* Double-Layered Luminous Product Frame */}
                      <div className="w-full flex rounded-2xl p-[1.5px] bg-gradient-to-br from-sky-300/60 via-white/40 to-rose-300/50 hover:from-[#7DD3FC] hover:via-white/80 hover:to-rose-400/75 shadow-[0_12px_26px_-12px_rgba(0,0,0,0.45)] transition-all duration-200 hover:-translate-y-0.5">
                        <article
                          dir={isRTL ? 'rtl' : 'ltr'}
                          className="relative bg-white text-slate-900 rounded-[14.5px] overflow-hidden w-full flex flex-col justify-between"
                        >
                          {/* Top Dual-Tone Accent Hairline */}
                          <span
                            aria-hidden="true"
                            className="h-[3px] w-full bg-gradient-to-r from-rose-500 via-[#38BDF8] to-[#0F4C5C] shrink-0"
                          />

                          <div>
                            <div className="p-1.5 pb-0">
                              <Link
                                to={`/store/product/${prd.slug}`}
                                className="block relative group overflow-hidden rounded-xl border border-slate-100"
                              >
                                <SafeImage
                                  src={prd.image}
                                  alt={prd.name}
                                  aspectClass="aspect-[4/3]"
                                  className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                />
                                {discountPct > 0 && (
                                  <span
                                    dir="ltr"
                                    className="absolute top-2.5 start-2.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 border border-rose-300/40 text-white text-xs font-bold tabular-nums shadow-sm"
                                  >
                                    -{discountPct}%
                                  </span>
                                )}
                              </Link>
                            </div>

                            <div className="p-4 space-y-1.5">
                              <span className="text-[11px] font-medium text-[#0284C7] block truncate">
                                {sec?.nameAr}
                                {cat ? ` · ${cat.nameAr}` : ''}
                              </span>

                              <Link to={`/store/product/${prd.slug}`} className="block">
                                <h3 className="font-display font-bold text-sm text-slate-900 hover:text-[#0F4C5C] line-clamp-2 min-h-[2.5rem] transition-colors">
                                  {prd.name}
                                </h3>
                              </Link>

                              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                                <StockStatusBadge product={prd} />
                                {prd.offerExpiresAt && (
                                  <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 tabular-nums">
                                    <CalendarClock className="w-3 h-3 text-[#0F4C5C] shrink-0" />
                                    <span>
                                      {lang === 'ar' ? 'حتى:' : 'Until:'}{' '}
                                      <span dir="ltr">{prd.offerExpiresAt}</span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="px-4 pb-3.5 pt-2.5 border-t border-slate-100 bg-slate-50/55 flex items-center justify-between gap-2">
                            <div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-bold text-sm text-[#0F4C5C] tabular-nums">
                                  {formatPrice(prd.priceYER)}
                                </span>
                                {hasDiscount && (
                                  <span className="text-[11px] text-slate-400 line-through tabular-nums">
                                    {formatPrice(prd.originalPriceYER!)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {prd.inStock ? (
                              <button
                                type="button"
                                onClick={() => handleQuickAdd(prd.id, prd.options?.[0])}
                                className={`btn-interactive px-3 py-2 min-h-[38px] rounded-xl text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0 shadow-2xs ${
                                  isAdded
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] hover:from-[#093542] hover:to-[#0369A1] text-white'
                                }`}
                              >
                                {isAdded ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {isAdded
                                    ? t('store.product.addedFeedback')
                                    : lang === 'ar'
                                    ? 'أضف للسلة'
                                    : 'Add'}
                                </span>
                              </button>
                            ) : (
                              <span className="text-[11px] font-semibold text-red-600">
                                {t('store.product.outOfStock')}
                              </span>
                            )}
                          </div>
                        </article>
                      </div>
                    </div>
                  );
                })}
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
                        ? 'العرض التالي'
                        : 'Next offer'
                      : lang === 'ar'
                      ? 'العرض السابق'
                      : 'Previous offer'
                  }
                  className="flex absolute left-2 sm:left-3 top-[27%] sm:top-[29%] -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#05222B]/85 hover:bg-[#093542] text-white border border-sky-300/45 ring-2 ring-white/20 backdrop-blur-md shadow-lg items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={
                    isRTL
                      ? lang === 'ar'
                        ? 'العرض السابق'
                        : 'Previous offer'
                      : lang === 'ar'
                      ? 'العرض التالي'
                      : 'Next offer'
                  }
                  className="flex absolute right-2 sm:right-3 top-[27%] sm:top-[29%] -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#05222B]/85 hover:bg-[#093542] text-white border border-sky-300/45 ring-2 ring-white/20 backdrop-blur-md shadow-lg items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}
        </div>

        {/* Minimal Framed Progress Indicator Pill */}
        {maxIndex > 0 && (
          <div className="relative flex items-center justify-center pt-0.5" dir="ltr">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-300/25 ring-1 ring-white/10 bg-[#05222B]/65 backdrop-blur-md shadow-xs">
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
                        isActive ? 'w-7 bg-white/30' : 'w-2 bg-white/35 hover:bg-white/60'
                      }`}
                    >
                      {isActive && (
                        <span
                          key={`${activeIndex}-${autoPaused ? 'paused' : 'run'}`}
                          className={`absolute inset-0 rounded-full bg-white ${
                            !autoPaused ? 'animate-dot-progress' : ''
                          }`}
                          style={
                            !autoPaused
                              ? { animationDuration: `${OFFERS_INTERVAL_MS}ms` }
                              : undefined
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] font-mono font-semibold tabular-nums text-sky-100/85 ps-1.5 border-s border-white/15">
                {String(activeIndex + 1).padStart(2, '0')}/{String(maxIndex + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}
    </section>
  );
};
