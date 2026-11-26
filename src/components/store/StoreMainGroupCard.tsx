import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Layers,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { useDataStore } from '../../context/DataStoreContext';
import { Product, ProductCategory, StoreMainSection } from '../../types/clinic';
import { SafeImage } from '../SafeImage';
import { ScrollableFilterBar } from '../ScrollableFilterBar';
import { StockStatusBadge } from './StockStatusBadge';

interface StoreMainGroupCardProps {
  section: StoreMainSection;
  subCategories: ProductCategory[];
  products: Product[];
  hideGroupHeader?: boolean;
}

export const StoreMainGroupCard: React.FC<StoreMainGroupCardProps> = ({
  section,
  subCategories,
  products,
  hideGroupHeader = false,
}) => {
  const { lang, isRTL, t } = useLanguage();
  const { addToCart, formatPrice, isInWishlist, toggleWishlist } = useClinic();
  const { getProductReviews } = useDataStore();

  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedSubCatId, setSelectedSubCatId] = useState<string>('all');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const activeSubCat = subCategories.find((c) => c.id === selectedSubCatId);

  const visibleProducts = useMemo(() => {
    if (selectedSubCatId === 'all') {
      return hideGroupHeader ? products : products.slice(0, 4);
    }
    return products.filter((p) => p.categoryId === selectedSubCatId);
  }, [products, selectedSubCatId, hideGroupHeader]);

  const handleQuickAdd = (productId: string, option?: string) => {
    const res = addToCart(productId, 1, option);
    if (res.ok) {
      setJustAddedId(productId);
      setTimeout(() => setJustAddedId(null), 1400);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Main Group Banner Header (shown only when viewing all groups together) */}
      {!hideGroupHeader && (
        <div className="p-5 sm:p-6 bg-gradient-to-l from-slate-50 via-white to-sky-50/40 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            {section.image && (
              <Link
                to={`/store/category/${section.slug}`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-xs bg-white"
              >
                <SafeImage
                  src={section.image}
                  alt={section.nameAr}
                  aspectClass="aspect-square"
                />
              </Link>
            )}
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0F4C5C]/10 text-[#0F4C5C] font-semibold">
                  <Layers className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'مجموعة رئيسية' : 'Main Group'}</span>
                </span>
                <span className="text-slate-500 tabular-nums">
                  {subCategories.length} {lang === 'ar' ? 'فروع' : 'branches'} · {products.length}{' '}
                  {lang === 'ar' ? 'منتج' : 'items'}
                </span>
              </div>

              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                {section.nameAr}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl line-clamp-2">
                {section.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to={`/store/category/${section.slug}`}
              className="btn-interactive btn-sheen inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border border-sky-300/35 text-xs font-bold shadow-xs whitespace-nowrap"
            >
              <span>
                {lang === 'ar'
                  ? `عرض المجموعة (${products.length})`
                  : `Browse Group (${products.length})`}
              </span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setIsExpanded((v) => !v)}
              aria-expanded={isExpanded}
              className="btn-interactive inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border-2 border-[#0F4C5C]/20 bg-white hover:border-[#0284C7] text-[#0F4C5C] text-xs font-bold whitespace-nowrap"
            >
              <span>
                {isExpanded
                  ? lang === 'ar'
                    ? 'طي الفروع'
                    : 'Collapse'
                  : lang === 'ar'
                  ? 'عرض الفروع'
                  : 'Expand'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Expandable Sub-Categories Tree + Live Filtered Products */}
      {(hideGroupHeader || isExpanded) && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Interactive Branching Sub-Categories Tab Strip */}
          {subCategories.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500">
                  {lang === 'ar'
                    ? 'الأقسام الفرعية المتفرعة (اختر للتصفية الفورية):'
                    : 'Branching Subcategories (click to filter):'}
                </span>
                {activeSubCat && (
                  <Link
                    to={`/store/category/${activeSubCat.slug}`}
                    className="text-xs font-semibold text-[#0284C7] hover:underline inline-flex items-center gap-1"
                  >
                    <span>
                      {lang === 'ar'
                        ? `فتح صفحة ${activeSubCat.nameAr}`
                        : `Open ${activeSubCat.nameAr}`}
                    </span>
                    <ArrowIcon className="w-3 h-3" />
                  </Link>
                )}
              </div>

              <ScrollableFilterBar
                surface="inset"
                ariaLabel={
                  lang === 'ar'
                    ? `فروع ${section.nameAr}`
                    : `${section.nameAr} subcategories`
                }
              >
                <button
                  type="button"
                  onClick={() => setSelectedSubCatId('all')}
                  className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold whitespace-nowrap shrink-0 ${
                    selectedSubCatId === 'all'
                      ? 'btn-sheen bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border-[#0284C7] shadow-[0_4px_12px_-3px_rgba(2,132,199,0.45)]'
                      : 'bg-white text-slate-700 border-slate-200/80 hover:border-[#0284C7]/50 hover:text-[#0F4C5C]'
                  }`}
                >
                  <span>{lang === 'ar' ? 'جميع الفروع' : 'All'}</span>
                  <span
                    className={`text-[11px] tabular-nums ${
                      selectedSubCatId === 'all' ? 'text-sky-200' : 'text-slate-400'
                    }`}
                  >
                    ({products.length})
                  </span>
                </button>

                {subCategories.map((cat) => {
                  const catCount = products.filter((p) => p.categoryId === cat.id).length;
                  const isActive = selectedSubCatId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedSubCatId(cat.id)}
                      className={`btn-interactive flex items-center gap-2 px-3 py-1.5 rounded-xl border text-start whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'btn-sheen bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border-[#0284C7] shadow-[0_4px_12px_-3px_rgba(2,132,199,0.45)]'
                          : 'bg-white text-slate-700 border-slate-200/80 hover:border-[#0284C7]/50 hover:text-[#0F4C5C]'
                      }`}
                    >
                      <img
                        src={cat.image}
                        alt={cat.nameAr}
                        className={`w-7 h-7 rounded-lg object-cover shrink-0 ${
                          isActive ? 'border border-white/30' : 'border border-slate-200'
                        }`}
                      />
                      <div className="min-w-0">
                        <span className="block text-xs font-bold leading-tight whitespace-nowrap">
                          {cat.nameAr}
                        </span>
                        <span
                          className={`block text-[10px] tabular-nums mt-0.5 ${
                            isActive ? 'text-sky-200' : 'text-slate-500'
                          }`}
                        >
                          {catCount} {lang === 'ar' ? 'منتج' : 'items'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </ScrollableFilterBar>
            </div>
          )}

          {/* Live Filtered Products Grid inside this Group */}
          {visibleProducts.length === 0 ? (
            <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
              {lang === 'ar'
                ? 'لا توجد منتجات مضافة في هذا التصنيف الفرعي حالياً.'
                : 'No products in this subcategory yet.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {visibleProducts.map((prd) => {
                const cat = subCategories.find((c) => c.id === prd.categoryId);
                const hasDiscount =
                  prd.originalPriceYER !== undefined && prd.originalPriceYER > prd.priceYER;
                const discountPct = hasDiscount
                  ? Math.round(
                      ((prd.originalPriceYER! - prd.priceYER) / prd.originalPriceYER!) * 100
                    )
                  : 0;
                const isAdded = justAddedId === prd.id;
                const reviews = getProductReviews(prd.id);
                const avgRating =
                  reviews.length > 0
                    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                    : 0;

                return (
                  <article
                    key={prd.id}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0F4C5C]/40"
                  >
                    <div>
                      <div className="relative">
                        <Link to={`/store/product/${prd.slug}`} className="block">
                          <SafeImage
                            src={prd.image}
                            alt={prd.name}
                            aspectClass="aspect-[4/3]"
                          />
                        </Link>
                        {discountPct > 0 && (
                          <span
                            dir="ltr"
                            className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold tabular-nums pointer-events-none"
                          >
                            -{discountPct}%
                          </span>
                        )}
                        {reviews.length > 0 && (
                          <span
                            dir="ltr"
                            className="absolute top-2.5 end-2.5 px-2 py-0.5 rounded bg-white/95 border border-slate-200 text-slate-800 text-[11px] font-bold tabular-nums inline-flex items-center gap-1 shadow-xs pointer-events-none"
                          >
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>{avgRating.toFixed(1)}</span>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleWishlist(prd.id)}
                          aria-pressed={isInWishlist(prd.id)}
                          aria-label={
                            isInWishlist(prd.id)
                              ? lang === 'ar'
                                ? `إزالة ${prd.name} من المفضلة`
                                : `Remove ${prd.name} from favorites`
                              : lang === 'ar'
                              ? `حفظ ${prd.name} في المفضلة`
                              : `Save ${prd.name} to favorites`
                          }
                          className={`absolute bottom-2.5 end-2.5 w-8 h-8 rounded-full border shadow-xs flex items-center justify-center transition-colors ${
                            isInWishlist(prd.id)
                              ? 'bg-rose-50 border-rose-200 text-rose-600'
                              : 'bg-white/95 hover:bg-rose-50 border-slate-200 text-slate-600 hover:text-rose-600'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isInWishlist(prd.id) ? 'fill-rose-500 text-rose-600' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <span className="text-[11px] text-[#0284C7] font-medium block">
                          {cat?.nameAr}
                        </span>
                        <Link to={`/store/product/${prd.slug}`} className="block">
                          <h3 className="font-display font-semibold text-sm text-slate-900 group-hover:text-[#0F4C5C] line-clamp-2 min-h-[2.5rem]">
                            {prd.name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <p className="text-[11px] text-slate-500 truncate">{prd.unit}</p>
                          <StockStatusBadge product={prd} />
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-3.5 pt-2.5 flex items-center justify-between gap-2 border-t border-slate-100">
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
                          className={`btn-interactive btn-sheen px-3 py-1.5 rounded-xl text-[11px] font-bold border inline-flex items-center gap-1 whitespace-nowrap shrink-0 ${
                            isAdded
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-xs'
                              : 'bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border-sky-300/35 shadow-2xs'
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
                        <span className="text-[11px] font-medium text-red-600">
                          {t('store.product.outOfStock')}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
