import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Percent,
  ShoppingBag,
  Star,
  Trash2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { useDataStore } from '../../context/DataStoreContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SafeImage } from '../../components/SafeImage';

export const StoreWishlistPage: React.FC = () => {
  const { lang, isRTL, t, products, productCategories } = useLanguage();
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    formatPrice,
    cartCount,
  } = useClinic();
  const { getProductReviews } = useDataStore();

  const [addedId, setAddedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const savedProducts = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return wishlist
      .map((id) => map.get(id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, [wishlist, products]);

  const handleAddToCart = (productId: string, defaultOption?: string) => {
    const res = addToCart(productId, 1, defaultOption);
    if (res.ok) {
      setErrorMsg(null);
      setAddedId(productId);
      setTimeout(() => {
        setAddedId((curr) => (curr === productId ? null : curr));
      }, 1500);
    } else {
      setErrorMsg(res.message || t('store.product.maxReached'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10 space-y-8">
      <div className="space-y-4">
        <Breadcrumbs
          items={[
            { label: t('nav.store'), to: '/store' },
            { label: lang === 'ar' ? 'القائمة المفضلة' : 'Favorites' },
          ]}
        />

        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 fill-rose-500 text-rose-600" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                  {lang === 'ar' ? 'القائمة المفضلة' : 'My Favorites'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold tabular-nums">
                  {savedProducts.length}{' '}
                  {lang === 'ar'
                    ? savedProducts.length === 1
                      ? 'منتج'
                      : 'منتجات'
                    : savedProducts.length === 1
                    ? 'item'
                    : 'items'}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                {lang === 'ar'
                  ? 'المنتجات الطبية ومستلزمات العناية التي قمت بحفظها للرجوع إليها لاحقاً أو إضافتها إلى سلة الطلبات.'
                  : 'Products and pharmacy essentials you saved for quick access later.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/store/cart"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs sm:text-sm font-semibold transition-colors tabular-nums"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {t('nav.cart')} ({cartCount})
              </span>
            </Link>

            {savedProducts.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 hover:border-rose-300 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs sm:text-sm font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'مسح القائمة' : 'Clear All'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between"
        >
          <span>{errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-red-800 font-bold hover:underline"
          >
            {lang === 'ar' ? 'إغلاق' : 'Dismiss'}
          </button>
        </div>
      )}

      {savedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-14 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900">
            {lang === 'ar' ? 'قائمتك المفضلة فارغة حالياً' : 'Your favorites list is empty'}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {lang === 'ar'
              ? 'يمكنك حفظ أي منتج يعجبك بالضغط على أيقونة القلب داخل صفحة المنتج أو بطاقات المتجر لتجده هنا في أي وقت.'
              : 'Tap the heart icon on any product page or store card to save items here for later.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/store"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
            >
              <span>{lang === 'ar' ? 'تصفح المتجر' : 'Browse Store'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/store/offers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-sm font-semibold transition-colors"
            >
              <Percent className="w-4 h-4" />
              <span>{t('nav.offers')}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedProducts.map((prd) => {
            const cat = productCategories.find((c) => c.id === prd.categoryId);
            const hasDiscount =
              prd.originalPriceYER !== undefined && prd.originalPriceYER > prd.priceYER;
            const discountPct = hasDiscount
              ? Math.round(
                  ((prd.originalPriceYER! - prd.priceYER) / prd.originalPriceYER!) * 100
                )
              : 0;
            const reviews = getProductReviews(prd.id);
            const avgRating =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;
            const isAdded = addedId === prd.id;

            return (
              <article
                key={prd.id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0F4C5C]/40"
              >
                <div>
                  <div className="relative">
                    <Link to={`/store/product/${prd.slug}`} className="block">
                      <SafeImage src={prd.image} alt={prd.name} aspectClass="aspect-[4/3]" />
                    </Link>

                    {discountPct > 0 && (
                      <span
                        dir="ltr"
                        className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold tabular-nums pointer-events-none"
                      >
                        -{discountPct}%
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(prd.id)}
                      aria-label={
                        lang === 'ar'
                          ? `إزالة ${prd.name} من المفضلة`
                          : `Remove ${prd.name} from favorites`
                      }
                      title={lang === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites'}
                      className="absolute top-2.5 end-2.5 w-8 h-8 rounded-full bg-white/95 hover:bg-rose-50 border border-slate-200 text-rose-600 flex items-center justify-center shadow-xs transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-600" />
                    </button>

                    {reviews.length > 0 && (
                      <span
                        dir="ltr"
                        className="absolute bottom-2.5 start-2.5 px-2 py-0.5 rounded bg-white/95 border border-slate-200 text-slate-800 text-[11px] font-bold tabular-nums inline-flex items-center gap-1 shadow-xs pointer-events-none"
                      >
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{avgRating.toFixed(1)}</span>
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-1.5">
                    {cat && (
                      <span className="text-[11px] text-[#0284C7] font-medium block">
                        {cat.nameAr}
                      </span>
                    )}
                    <Link to={`/store/product/${prd.slug}`} className="block">
                      <h2 className="font-display font-semibold text-sm text-slate-900 group-hover:text-[#0F4C5C] line-clamp-2 min-h-[2.5rem]">
                        {prd.name}
                      </h2>
                    </Link>
                    <p className="text-[11px] text-slate-500">{prd.unit}</p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2.5 space-y-3 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-2">
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
                    <span
                      className={`text-[11px] font-semibold ${
                        prd.inStock ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {prd.inStock ? t('store.product.inStock') : t('store.product.outOfStock')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {prd.inStock ? (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(prd.id, prd.options?.[0])}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5 ${
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
                            : t('store.product.addToCart')}
                        </span>
                      </button>
                    ) : (
                      <Link
                        to={`/store/product/${prd.slug}`}
                        className="flex-1 py-2 px-3 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold text-center hover:bg-slate-50"
                      >
                        {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFromWishlist(prd.id)}
                      aria-label={lang === 'ar' ? 'حذف من المفضلة' : 'Remove'}
                      className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
