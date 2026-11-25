import React, { useEffect, useMemo, useState } from 'react';
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
import { SafeImage } from '../SafeImage';
import { StockStatusBadge } from './StockStatusBadge';

export const StoreOffersCarousel: React.FC = () => {
  const { lang, isRTL, t, products, storeMainSections, productCategories } = useLanguage();
  const { addToCart, formatPrice } = useClinic();

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
  const [isPaused, setIsPaused] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  }, []);

  const visibleSlots = Math.min(itemsPerView, Math.max(1, offerProducts.length));
  const maxIndex = Math.max(0, offerProducts.length - visibleSlots);

  useEffect(() => {
    setActiveIndex((curr) => Math.min(curr, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (isPaused || maxIndex === 0) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);
    return () => window.clearInterval(timer);
  }, [isPaused, maxIndex]);

  if (offerProducts.length === 0) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleQuickAdd = (productId: string, option?: string) => {
    const res = addToCart(productId, 1, option);
    if (res.ok) {
      setJustAddedId(productId);
      setTimeout(() => setJustAddedId(null), 1400);
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const totalCount = offerProducts.length;
  const trackWidthPct = (totalCount / visibleSlots) * 100;
  const translateXPct = (activeIndex * 100) / totalCount;

  return (
    <section
      aria-label={t('store.offers.title')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-gradient-to-br from-[#093542] via-[#0F4C5C] to-[#115E70] rounded-2xl p-5 sm:p-7 text-white space-y-5 overflow-hidden"
    >
      {/* Top Bar: Title + Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 inline-flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5 text-sky-200" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg sm:text-2xl text-white">
                {lang === 'ar' ? 'أحدث العروض والتخفيضات' : 'Latest Pharmacy Offers'}
              </h2>
              <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[11px] font-bold tabular-nums">
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-[#093542] hover:bg-sky-50 text-xs font-bold transition-colors whitespace-nowrap"
          >
            <span>{t('store.offers.viewOffers')}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Sliding Strip Viewport with Left/Right Arrow Buttons Overlaid on Image Band */}
      <div className="relative" dir="ltr">
        <div className="overflow-hidden -mx-2">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              width: `${trackWidthPct}%`,
              transform: `translateX(-${translateXPct}%)`,
            }}
          >
          {offerProducts.map((prd) => {
            const sec = storeMainSections.find((s) => s.id === prd.mainSectionId);
            const cat = productCategories.find((c) => c.id === prd.categoryId);
            const hasDiscount =
              prd.originalPriceYER !== undefined && prd.originalPriceYER > prd.priceYER;
            const discountPct = hasDiscount
              ? Math.round(((prd.originalPriceYER! - prd.priceYER) / prd.originalPriceYER!) * 100)
              : 0;
            const isAdded = justAddedId === prd.id;

            return (
              <div
                key={prd.id}
                style={{ width: `${100 / totalCount}%` }}
                className="px-2 shrink-0"
              >
                <article
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="bg-white text-slate-900 rounded-xl border border-white/20 overflow-hidden h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <Link to={`/store/product/${prd.slug}`} className="block relative group">
                      <SafeImage src={prd.image} alt={prd.name} aspectClass="aspect-[4/3]" />
                      {discountPct > 0 && (
                        <span
                          dir="ltr"
                          className="absolute top-2.5 start-2.5 px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-bold tabular-nums shadow-xs"
                        >
                          -{discountPct}%
                        </span>
                      )}
                    </Link>

                    <div className="p-4 space-y-1.5">
                      <span className="text-[11px] font-medium text-[#0284C7] block truncate">
                        {sec?.nameAr}
                        {cat ? ` · ${cat.nameAr}` : ''}
                      </span>

                      <Link to={`/store/product/${prd.slug}`} className="block">
                        <h3 className="font-display font-bold text-sm text-slate-900 hover:text-[#0F4C5C] line-clamp-2 min-h-[2.5rem]">
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

                  <div className="px-4 pb-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0F4C5C] hover:bg-[#093542] text-white'
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
            );
          })}
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
                    ? 'العرض التالي'
                    : 'Next offer'
                  : lang === 'ar'
                  ? 'العرض السابق'
                  : 'Previous offer'
              }
              className="absolute left-2 sm:left-3 top-24 sm:top-28 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#093542] border border-slate-200 shadow-lg flex items-center justify-center transition-all hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={isRTL ? handlePrev : handleNext}
              aria-label={
                isRTL
                  ? lang === 'ar'
                    ? 'العرض السابق'
                    : 'Previous offer'
                  : lang === 'ar'
                  ? 'العرض التالي'
                  : 'Next offer'
              }
              className="absolute right-2 sm:right-3 top-24 sm:top-28 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-[#093542] border border-slate-200 shadow-lg flex items-center justify-center transition-all hover:scale-105"
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
                activeIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/35 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
