import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SafeImage } from '../../components/SafeImage';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, products, productCategories, storeMainSections } = useLanguage();
  const { addToCart, formatPrice } = useClinic();

  const product = products.find((p) => p.slug === slug || p.id === slug);

  const [selectedOption, setSelectedOption] = useState<string | undefined>(product?.options?.[0]);
  const [qty, setQty] = useState(1);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  React.useEffect(() => {
    setSelectedOption(product?.options?.[0]);
    setQty(1);
    setFeedback(null);
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

  const handleAdd = () => {
    const res = addToCart(product.id, qty, selectedOption);
    if (res.ok) {
      setFeedback({ type: 'ok', text: t('store.product.addedFeedback') });
    } else {
      setFeedback({ type: 'err', text: res.message || t('store.product.maxReached') });
    }
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
            <SafeImage
              src={product.image}
              alt={product.name}
              aspectClass="aspect-[4/3]"
              className="rounded-xl border border-slate-200"
            />
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
              <span
                className={`text-xs font-semibold ms-auto ${
                  product.inStock ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {product.inStock
                  ? `${t('store.product.inStock')} (${product.stockQty})`
                  : t('store.product.outOfStock')}
              </span>
            </div>

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
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        selectedOption === opt
                          ? 'border-[#0F4C5C] bg-sky-50 text-[#0F4C5C] font-semibold'
                          : 'border-slate-300 text-slate-700 hover:border-slate-400'
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
                  <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label={lang === 'ar' ? 'إنقاص الكمية' : 'Decrease quantity'}
                      className="p-2.5 text-slate-600 hover:text-slate-900"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-semibold tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(product.stockQty + 1, q + 1))}
                      aria-label={lang === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}
                      className="p-2.5 text-slate-600 hover:text-slate-900"
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

                {feedback && (
                  <div
                    role="status"
                    className={`p-3 rounded-lg text-xs font-medium flex items-center justify-between gap-2 ${
                      feedback.type === 'ok'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {feedback.type === 'ok' && <Check className="w-4 h-4" />}
                      {feedback.text}
                    </span>
                    {feedback.type === 'ok' && (
                      <Link to="/store/cart" className="font-bold underline">
                        {t('nav.cart')}
                      </Link>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('store.product.addToCart')}</span>
                  </button>

                  <Link
                    to="/store/cart"
                    className="px-5 py-3.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                  >
                    {t('nav.cart')}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
                {t('store.product.outOfStock')} —{' '}
                {lang === 'ar'
                  ? 'يمكنك تصفح بدائل أخرى في نفس الفئة أو إرسال صورة وصفة طبية.'
                  : 'Please browse alternatives in this category or submit a prescription photo.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
