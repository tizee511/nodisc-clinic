import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { useDataStore } from '../../context/DataStoreContext';
import { useCarouselSwipe, useReducedMotionPref } from '../../hooks/useCarouselSwipe';
import { Product } from '../../types/clinic';
import { SafeImage } from '../SafeImage';
import { StockStatusBadge } from './StockStatusBadge';

interface RelatedProductsCarouselProps {
  currentProduct: Product;
}

const RELATED_INTERVAL_MS = 4000;

const COMPLEMENTARY_SECTIONS: Record<string, string[]> = {
  'sec-rehab-equipment': ['sec-medical-supplies', 'sec-vitamins-supplements'],
  'sec-medical-supplies': ['sec-rehab-equipment', 'sec-vitamins-supplements'],
  'sec-mother-baby': ['sec-vitamins-supplements', 'sec-beauty-care'],
  'sec-vitamins-supplements': ['sec-beauty-care', 'sec-medical-supplies'],
  'sec-beauty-care': ['sec-vitamins-supplements', 'sec-mother-baby'],
};

export const RelatedProductsCarousel: React.FC<RelatedProductsCarouselProps> = ({
  currentProduct,
}) => {
  const { lang, isRTL, t, products, productCategories, storeMainSections } = useLanguage();
  const { addToCart, formatPrice, isInWishlist, toggleWishlist } = useClinic();
  const { getProductReviews } = useDataStore();
  const reducedMotion = useReducedMotionPref();

  const relatedProducts = useMemo(() => {
    const complementaryIds = COMPLEMENTARY_SECTIONS[currentProduct.mainSectionId] || [];

    const scored = products
      .filter((p) => p.id !== currentProduct.id)
      .map((p) => {
        let score = 0;
        if (p.categoryId === currentProduct.categoryId) score += 100;
        else if (p.mainSectionId === currentProduct.mainSectionId) score += 50;
        else if (complementaryIds.includes(p.mainSectionId)) score += 25;

        if (p.inStock) score += 5;
        if (p.featured) score += 2;
        return { product: p, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 8).map((entry) => entry.product);
  }, [products, currentProduct.id, currentProduct.categoryId, currentProduct.mainSectionId]);

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
    setActiveIndex(0);
  }, [currentProduct.id]);

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

  const totalCount = relatedProducts.length;
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
    }, RELATED_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoPaused, maxIndex]);

  if (relatedProducts.length === 0) return null;

  const currentCategory = productCategories.find((c) => c.id === currentProduct.categoryId);
  const currentSection = storeMainSections.find((s) => s.id === currentProduct.mainSectionId);

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
  const browseTarget = currentCategory || currentSection;

  return (
    <section
      aria-label={lang === 'ar' ? 'المنتجات المرتبطة بالمنتج' : 'Related Products'}
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHoveredOrFocused(true)}
      onMouseLeave={() => setIsHoveredOrFocused(false)}
      onFocusCapture={() => setIsHoveredOrFocused(true)}
      onBlurCapture={() => setIsHoveredOrFocused(false)}
      className="bg-white rounded-xl border border-slate-200 p-5 sm:p-8 space-y-5 overflow-hidden"
    >
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
            {lang === 'ar' ? 'منتجات مرتبطة بهذا المنتج' : 'Related Products'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'ar'
              ? `منتجات ومستلزمات مترابطة ضمن ${currentCategory?.nameAr || currentSection?.nameAr || 'نفس التخصص'}`
              : `Curated alternatives and companions in ${currentCategory?.nameAr || currentSection?.nameAr || 'this section'}`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {browseTarget && (
            <Link
              to={`/store/category/${browseTarget.slug}`}
              className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#0F4C5C]/20 bg-white hover:border-[#0284C7] hover:bg-sky-50/70 text-[#0F4C5C] text-xs sm:text-sm font-bold shadow-2xs whitespace-nowrap"
            >
              <span>
                {lang === 'ar' ? `تصفح ${browseTarget.nameAr}` : `Browse ${browseTarget.nameAr}`}
              </span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Sequential Horizontal Sliding Track with Swipe & Frosted Arrows */}
      <div
        className={`relative touch-pan-y select-none focus-visible:outline-none ${
          maxIndex > 0 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab sm:cursor-default') : ''
        }`}
        dir="ltr"
        tabIndex={maxIndex > 0 ? 0 : undefined}
        {...viewportProps}
      >
            <div className="overflow-hidden -mx-2 sm:-mx-2.5 py-1">
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
                {relatedProducts.map((prd) => {
                  const cat = productCategories.find((c) => c.id === prd.categoryId);
                  const sec = storeMainSections.find((s) => s.id === prd.mainSectionId);
                  const hasDiscount =
                    prd.originalPriceYER !== undefined && prd.originalPriceYER > prd.priceYER;
                  const discountPct = hasDiscount
                    ? Math.round(
                        ((prd.originalPriceYER! - prd.priceYER) / prd.originalPriceYER!) * 100
                      )
                    : 0;
                  const isAdded = justAddedId === prd.id;
                  const inWishlist = isInWishlist(prd.id);
                  const reviews = getProductReviews(prd.id);
                  const avgRating =
                    reviews.length > 0
                      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                      : 0;

                  return (
                    <div
                      key={prd.id}
                      style={{ width: `${100 / totalCount}%` }}
                      className="px-2 sm:px-2.5 shrink-0 flex"
                    >
                      <div className="w-full flex rounded-2xl p-[1.5px] bg-gradient-to-br from-[#0F4C5C]/20 via-sky-200/75 to-teal-200/50 hover:from-[#0F4C5C]/60 hover:via-[#0284C7]/65 hover:to-emerald-400/55 shadow-[0_8px_22px_-12px_rgba(15,76,92,0.22)] transition-all duration-200 hover:-translate-y-0.5">
                        <article
                          dir={isRTL ? 'rtl' : 'ltr'}
                          className="group bg-white rounded-[14.5px] overflow-hidden w-full flex flex-col justify-between"
                        >
                          <span
                            aria-hidden="true"
                            className="h-[3px] w-full bg-gradient-to-r from-[#0F4C5C] via-[#0284C7] to-[#38BDF8] shrink-0 opacity-85 group-hover:opacity-100 transition-opacity"
                          />

                          <div>
                            <div className="p-1.5 pb-0">
                              <div className="relative overflow-hidden rounded-xl border border-slate-100">
                                <Link to={`/store/product/${prd.slug}`} className="block">
                                  <SafeImage
                                    src={prd.image}
                                    alt={prd.name}
                                    aspectClass="aspect-[4/3]"
                                    className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                  />
                                </Link>
                                {discountPct > 0 && (
                                  <span
                                    dir="ltr"
                                    className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[11px] font-bold tabular-nums pointer-events-none shadow-xs"
                                  >
                                    -{discountPct}%
                                  </span>
                                )}
                                {reviews.length > 0 && (
                                  <span
                                    dir="ltr"
                                    className="absolute top-2.5 end-2.5 px-2 py-0.5 rounded-md bg-white/95 border border-slate-200 text-slate-800 text-[11px] font-bold tabular-nums inline-flex items-center gap-1 shadow-xs pointer-events-none"
                                  >
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                    <span>{avgRating.toFixed(1)}</span>
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => toggleWishlist(prd.id)}
                                  aria-pressed={inWishlist}
                                  aria-label={
                                    inWishlist
                                      ? lang === 'ar'
                                        ? `إزالة ${prd.name} من المفضلة`
                                        : `Remove ${prd.name} from favorites`
                                      : lang === 'ar'
                                      ? `حفظ ${prd.name} في المفضلة`
                                      : `Save ${prd.name} to favorites`
                                  }
                                  className={`absolute bottom-2.5 end-2.5 w-8 h-8 rounded-full border shadow-xs flex items-center justify-center transition-colors ${
                                    inWishlist
                                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                                      : 'bg-white/95 hover:bg-rose-50 border-slate-200 text-slate-600 hover:text-rose-600'
                                  }`}
                                >
                                  <Heart
                                    className={`w-4 h-4 ${
                                      inWishlist ? 'fill-rose-500 text-rose-600' : ''
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>

                            <div className="p-4 space-y-1.5">
                              <span className="text-[11px] font-medium text-[#0284C7] block truncate">
                                {cat?.nameAr || sec?.nameAr}
                              </span>
                              <Link to={`/store/product/${prd.slug}`} className="block">
                                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0F4C5C] line-clamp-2 min-h-[2.6rem] transition-colors">
                                  {prd.name}
                                </h3>
                              </Link>
                              <div className="flex items-center justify-between gap-2 pt-0.5">
                                <p className="text-xs text-slate-500 truncate">{prd.unit}</p>
                                <StockStatusBadge product={prd} />
                              </div>
                            </div>
                          </div>

                          <div className="px-4 pb-4 pt-2.5 border-t border-slate-100 bg-slate-50/55 flex items-center justify-between gap-2">
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

                            {prd.inStock ? (
                              <button
                                type="button"
                                onClick={() => handleQuickAdd(prd.id, prd.options?.[0])}
                                className={`btn-interactive px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0 shadow-2xs ${
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
                              <span className="text-[11px] font-semibold text-red-600 whitespace-nowrap shrink-0">
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
                        ? 'المنتج التالي'
                        : 'Next related product'
                      : lang === 'ar'
                      ? 'المنتج السابق'
                      : 'Previous related product'
                  }
                  className="flex absolute left-2 sm:left-3 top-[27%] sm:top-[29%] -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#0F4C5C] border border-[#0F4C5C]/25 ring-2 ring-sky-200/60 backdrop-blur-md shadow-lg items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={
                    isRTL
                      ? lang === 'ar'
                        ? 'المنتج السابق'
                        : 'Previous related product'
                      : lang === 'ar'
                      ? 'المنتج التالي'
                      : 'Next related product'
                  }
                  className="flex absolute right-2 sm:right-3 top-[27%] sm:top-[29%] -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#0F4C5C] border border-[#0F4C5C]/25 ring-2 ring-sky-200/60 backdrop-blur-md shadow-lg items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}
        </div>

        {/* Minimal Framed Progress Indicator Pill */}
        {maxIndex > 0 && (
          <div className="flex items-center justify-center pt-0.5" dir="ltr">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0F4C5C]/15 ring-1 ring-sky-100/80 bg-white/95 backdrop-blur-md shadow-[0_6px_18px_-8px_rgba(15,76,92,0.18)]">
              <div className="inline-flex items-center gap-1.5">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`${lang === 'ar' ? 'خطوة' : 'Step'} ${idx + 1}`}
                      aria-current={isActive ? 'true' : undefined}
                      className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                        isActive
                          ? 'w-7 bg-[#0F4C5C]/20'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                    >
                      {isActive && (
                        <span
                          key={`${activeIndex}-${autoPaused ? 'paused' : 'run'}`}
                          className={`absolute inset-0 rounded-full bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] ${
                            !autoPaused ? 'animate-dot-progress' : ''
                          }`}
                          style={
                            !autoPaused
                              ? { animationDuration: `${RELATED_INTERVAL_MS}ms` }
                              : undefined
                          }
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] font-mono font-semibold tabular-nums text-slate-600 ps-1.5 border-s border-slate-200">
                {String(activeIndex + 1).padStart(2, '0')}/{String(maxIndex + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}
    </section>
  );
};
