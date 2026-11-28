import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { useDataStore } from '../../context/DataStoreContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SafeImage } from '../../components/SafeImage';
import {
  ProductReviewsSection,
  StarRatingDisplay,
} from '../../components/store/ProductReviewsSection';
import { RelatedProductsCarousel } from '../../components/store/RelatedProductsCarousel';
import { StockStatusBadge } from '../../components/store/StockStatusBadge';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, products, productCategories, storeMainSections } = useLanguage();
  const { addToCart, formatPrice, isInWishlist, toggleWishlist } = useClinic();
  const { getProductReviews } = useDataStore();

  const product = products.find((p) => p.slug === slug || p.id === slug);

  const [selectedOption, setSelectedOption] = useState<string | undefined>(product?.options?.[0]);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  React.useEffect(() => {
    setSelectedOption(product?.options?.[0]);
    setQty(1);
    setJustAdded(false);
    setAddError(null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
        </h1>
        <Link to="/store" className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold">
          {t('nav.store')}
        </Link>
      </div>
    );
  }

  const category = productCategories.find((c) => c.id === product.categoryId);
  const mainSection = storeMainSections.find((s) => s.id === product.mainSectionId);
  const hasDiscount =
    product.originalPriceYER !== undefined && product.originalPriceYER > product.priceYER;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPriceYER! - product.priceYER) / product.originalPriceYER!) * 100)
    : 0;

  const productReviews = getProductReviews(product.id);
  const reviewCount = productReviews.length;
  const averageRating =
    reviewCount > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  const inWishlist = isInWishlist(product.id);

  const handleAdd = () => {
    const res = addToCart(product.id, qty, selectedOption);
    if (res.ok) {
      setAddError(null);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    } else {
      setJustAdded(false);
      setAddError(res.message || t('store.product.maxReached'));
    }
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-10">
      <div>
        <Breadcrumbs
          items={[
            { label: t('nav.store'), to: '/store' },
            ...(mainSection
              ? [{ label: mainSection.nameAr, to: `/store/category/${mainSection.slug}` }]
              : []),
            ...(category
              ? [{ label: category.nameAr, to: `/store/category/${category.slug}` }]
              : []),
            { label: product.name },
          ]}
        />

        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Product Gallery */}
          <div className="lg:col-span-6">
            <div className="relative">
              <SafeImage
                src={product.image}
                alt={product.name}
                aspectClass="aspect-[4/3]"
                className="rounded-xl border border-slate-200"
              />
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-pressed={inWishlist}
                aria-label={
                  inWishlist
                    ? lang === 'ar'
                      ? 'إزالة من القائمة المفضلة'
                      : 'Remove from favorites'
                    : lang === 'ar'
                    ? 'إضافة إلى القائمة المفضلة'
                    : 'Save to favorites'
                }
                title={
                  inWishlist
                    ? lang === 'ar'
                      ? 'إزالة من المفضلة'
                      : 'Remove from favorites'
                    : lang === 'ar'
                    ? 'حفظ في المفضلة'
                    : 'Save to favorites'
                }
                className={`absolute top-3 end-3 w-10 h-10 rounded-full border shadow-sm flex items-center justify-center transition-all ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white/95 hover:bg-rose-50 border-slate-200 text-slate-600 hover:text-rose-600'
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-transform ${
                    inWishlist ? 'fill-rose-500 text-rose-600 scale-105' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Contiguous Purchase Module */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              {category && (
                <Link
                  to={`/store/category/${category.slug}`}
                  className="text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  {category.nameAr}
                </Link>
              )}
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-1">
                {product.name}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {t('store.product.unit')}: {product.unit}
              </p>

              {/* Clickable Star Rating Summary */}
              <a
                href="#product-reviews"
                className="inline-flex items-center gap-2 mt-2.5 text-xs text-slate-600 hover:text-[#0F4C5C] transition-colors"
              >
                <StarRatingDisplay rating={averageRating} size="sm" />
                {reviewCount > 0 ? (
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {averageRating.toFixed(1)}{' '}
                    <span className="font-normal text-slate-500">
                      ({reviewCount}{' '}
                      {lang === 'ar'
                        ? reviewCount === 1
                          ? 'تقييم'
                          : 'تقييمات'
                        : reviewCount === 1
                        ? 'review'
                        : 'reviews'}
                      )
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-500 underline-offset-2 hover:underline">
                    {lang === 'ar' ? 'كن أول من يقيّم هذا المنتج' : 'Be the first to review'}
                  </span>
                )}
              </a>
            </div>

            <div className="flex flex-wrap items-baseline gap-3 pb-4 border-b border-slate-100">
              <span className="font-display font-bold text-2xl text-[#0F4C5C] tabular-nums">
                {formatPrice(product.priceYER)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    {formatPrice(product.originalPriceYER!)}
                  </span>
                  <span
                    dir="ltr"
                    className="px-2 py-0.5 rounded bg-rose-600 text-white text-xs font-bold tabular-nums"
                  >
                    -{discountPct}%
                  </span>
                </>
              )}
              {product.offerLabelAr && (
                <span className="text-xs font-semibold text-rose-700">
                  {product.offerLabelAr}
                </span>
              )}
            </div>

            <StockStatusBadge product={product} variant="detailed" />

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {product.fullDesc}
            </p>

            {product.requiresNote && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                {product.requiresNote}
              </p>
            )}

            {/* Options */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-700">
                  {t('store.product.options')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedOption(opt)}
                      className={`btn-interactive px-4 py-2 rounded-xl text-xs font-bold border ${
                        selectedOption === opt
                          ? 'border-[#0284C7] bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white shadow-xs'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-[#0F4C5C]/60 hover:text-[#0F4C5C]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            {product.inStock ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate-700">
                    {t('store.product.quantity')}
                  </span>
                  <div className="inline-flex items-center border border-slate-300 rounded-xl bg-white">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label={lang === 'ar' ? 'إنقاص الكمية' : 'Decrease quantity'}
                      className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-600 hover:text-slate-900"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-semibold tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(product.stockQty + 1, q + 1))}
                      aria-label={lang === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}
                      className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center text-slate-600 hover:text-slate-900"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {qty > product.stockQty && (
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    {t('store.product.maxReached')} ({product.stockQty})
                  </p>
                )}

                {addError && (
                  <p role="alert" className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {addError}
                  </p>
                )}

                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleAdd}
                    className={`btn-interactive btn-sheen w-full sm:w-auto sm:flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl border text-white text-sm font-bold shadow-sm ${
                      justAdded
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 shadow-[0_8px_18px_-6px_rgba(16,185,129,0.5)]'
                        : 'bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] border-sky-300/35 shadow-[0_8px_20px_-6px_rgba(15,76,92,0.48)]'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{t('store.product.addedFeedback')}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t('store.product.addToCart')}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-pressed={inWishlist}
                    className={`btn-interactive flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                      inWishlist
                        ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
                        : 'border-slate-300 text-slate-700 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/60'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        inWishlist ? 'fill-rose-500 text-rose-600' : ''
                      }`}
                    />
                    <span>
                      {inWishlist
                        ? lang === 'ar'
                          ? 'في المفضلة'
                          : 'Saved'
                        : lang === 'ar'
                        ? 'حفظ في المفضلة'
                        : 'Save'}
                    </span>
                  </button>

                  <Link
                    to="/store/cart"
                    className="btn-interactive flex-1 sm:flex-none min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                  >
                    {t('nav.cart')}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
                  {t('store.product.outOfStock')} —{' '}
                  {lang === 'ar'
                    ? 'يمكنك تصفح بدائل أخرى في نفس الفئة أو إرسال صورة وصفة طبية.'
                    : 'Please browse alternatives in this category or submit a prescription photo.'}
                </div>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-pressed={inWishlist}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                    inWishlist
                      ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
                      : 'border-slate-300 text-slate-700 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/60'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      inWishlist ? 'fill-rose-500 text-rose-600' : ''
                    }`}
                  />
                  <span>
                    {inWishlist
                      ? lang === 'ar'
                        ? 'في المفضلة'
                        : 'Saved in Favorites'
                      : lang === 'ar'
                      ? 'حفظ في المفضلة لإشعار التوفر'
                      : 'Save to Favorites'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Star Ratings & Reviews Section */}
      <ProductReviewsSection productId={product.id} productName={product.name} />

      {/* Sequential Related Products Carousel Below Customer Reviews */}
      <RelatedProductsCarousel currentProduct={product} />
    </div>
  );
};
