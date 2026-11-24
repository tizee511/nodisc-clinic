import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  Percent,
  ShoppingBag,
  Tag,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SafeImage } from '../../components/SafeImage';
import { Product } from '../../types/clinic';

type OfferTypeFilter = 'all' | 'discount' | 'bundle' | 'medical';

function getDaysRemaining(expiresAt?: string): number | null {
  if (!expiresAt) return null;
  const end = new Date(`${expiresAt}T23:59:59`);
  if (Number.isNaN(end.getTime())) return null;
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

interface OfferCardProps {
  product: Product;
  sectionName?: string;
  categoryName?: string;
  lang: 'ar' | 'en';
  formatPrice: (yer: number) => string;
  onAddToCart: (productId: string, option?: string) => void;
  isAdded: boolean;
  addedLabel: string;
  saveLabel: string;
  outOfStockLabel: string;
}

const OfferCard: React.FC<OfferCardProps> = ({
  product,
  sectionName,
  categoryName,
  lang,
  formatPrice,
  onAddToCart,
  isAdded,
  addedLabel,
  saveLabel,
  outOfStockLabel,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(product.options?.[0]);

  const hasDiscount =
    product.originalPriceYER !== undefined && product.originalPriceYER > product.priceYER;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPriceYER! - product.priceYER) / product.originalPriceYER!) * 100)
    : 0;
  const savingsYER = hasDiscount ? product.originalPriceYER! - product.priceYER : 0;
  const daysLeft = getDaysRemaining(product.offerExpiresAt);

  const offerTypeText =
    product.offerType === 'bundle'
      ? lang === 'ar'
        ? 'باقة توفير'
        : 'Bundle Deal'
      : product.offerType === 'medical'
      ? lang === 'ar'
        ? 'أجهزة ومستلزمات'
        : 'Medical & Rehab'
      : lang === 'ar'
      ? 'خصم مئوي'
      : 'Direct Discount';

  return (
    <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#0F4C5C]/45">
      <div>
        <Link to={`/store/product/${product.slug}`} className="block relative">
          <SafeImage src={product.image} alt={product.name} aspectClass="aspect-[4/3]" />
          {discountPct > 0 && (
            <span
              dir="ltr"
              className="absolute top-3 start-3 px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-bold tabular-nums shadow-xs"
            >
              -{discountPct}%
            </span>
          )}
          <span className="absolute top-3 end-3 px-2 py-0.5 rounded bg-white/95 backdrop-blur-xs border border-slate-200 text-[11px] font-semibold text-slate-700">
            {offerTypeText}
          </span>
        </Link>

        <div className="p-5 space-y-2.5">
          <div className="text-[11px] text-slate-500">
            {sectionName}
            {categoryName ? ` · ${categoryName}` : ''}
          </div>

          <Link to={`/store/product/${product.slug}`} className="block">
            <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#0F4C5C] line-clamp-2 transition-colors">
              {product.name}
            </h2>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2">{product.shortDesc}</p>

          {/* Interactive Variant / Option Selector directly inside Offer Card */}
          {product.options && product.options.length > 1 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {product.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedOption(opt)}
                  className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
                    selectedOption === opt
                      ? 'border-[#0F4C5C] bg-sky-50 text-[#0F4C5C] font-semibold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Expiration Date & Offer Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
            {product.offerLabelAr && (
              <span className="inline-flex items-center gap-1 font-semibold text-rose-700">
                <Tag className="w-3 h-3 shrink-0" />
                <span>{product.offerLabelAr}</span>
              </span>
            )}
            {product.offerExpiresAt && (
              <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 tabular-nums">
                <CalendarClock className="w-3 h-3 text-[#0F4C5C] shrink-0" />
                <span>
                  {lang === 'ar' ? 'ينتهي:' : 'Ends:'}{' '}
                  <strong dir="ltr">{product.offerExpiresAt}</strong>
                  {daysLeft !== null && (
                    <span className="text-[#0284C7] ms-1">
                      ({daysLeft} {lang === 'ar' ? 'يوم' : 'd'})
                    </span>
                  )}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base text-[#0F4C5C] tabular-nums">
              {formatPrice(product.priceYER)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {formatPrice(product.originalPriceYER!)}
              </span>
            )}
          </div>
          {savingsYER > 0 ? (
            <span className="text-[11px] font-medium text-emerald-700 tabular-nums block">
              {saveLabel} {formatPrice(savingsYER)}
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 block">{product.unit}</span>
          )}
        </div>

        {product.inStock ? (
          <button
            type="button"
            onClick={() => onAddToCart(product.id, selectedOption)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0F4C5C] hover:bg-[#093542] text-white'
            }`}
          >
            {isAdded && <Check className="w-3.5 h-3.5" />}
            <span>{isAdded ? addedLabel : lang === 'ar' ? 'أضف للسلة' : 'Add'}</span>
          </button>
        ) : (
          <span className="text-xs font-semibold text-red-600 whitespace-nowrap shrink-0">
            {outOfStockLabel}
          </span>
        )}
      </div>
    </article>
  );
};

export const StoreOffersPage: React.FC = () => {
  const { lang, isRTL, t, storeMainSections, productCategories, products } = useLanguage();
  const { addToCart, formatPrice, cartCount, cartSubtotalYER } = useClinic();

  const [offerTypeFilter, setOfferTypeFilter] = useState<OfferTypeFilter>('all');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const discountedProducts = useMemo(() => {
    return products.filter(
      (p) => p.isOnSale || (p.originalPriceYER !== undefined && p.originalPriceYER > p.priceYER)
    );
  }, [products]);

  const visibleOffers = useMemo(() => {
    return discountedProducts.filter((p) => {
      if (selectedSectionId !== 'all' && p.mainSectionId !== selectedSectionId) return false;
      if (offerTypeFilter !== 'all') {
        const resolvedType = p.offerType || 'discount';
        if (resolvedType !== offerTypeFilter) return false;
      }
      return true;
    });
  }, [discountedProducts, selectedSectionId, offerTypeFilter]);

  const handleQuickAdd = (prdId: string, option?: string) => {
    const res = addToCart(prdId, 1, option);
    if (res.ok) {
      setJustAddedId(prdId);
      setTimeout(() => setJustAddedId(null), 1500);
    }
  };

  const offerTypeOptions: { id: OfferTypeFilter; ar: string; en: string }[] = [
    { id: 'all', ar: 'جميع العروض', en: 'All Offers' },
    { id: 'discount', ar: 'خصومات مئوية', en: 'Percentage Discounts' },
    { id: 'bundle', ar: 'باقات وأطقم التوفير', en: 'Value Bundles' },
    { id: 'medical', ar: 'الأجهزة والمستلزمات الطبية', en: 'Medical & Rehab' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Breadcrumbs
            items={[
              { label: t('nav.store'), to: '/store' },
              { label: t('store.offers.title') },
            ]}
          />
          <div className="flex items-center gap-2.5 mt-1">
            <span className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 inline-flex items-center justify-center shrink-0">
              <Percent className="w-4 h-4" />
            </span>
            <h1 className="font-display font-bold text-3xl text-slate-900">
              {t('store.offers.title')}
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">{t('store.offers.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/store"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold whitespace-nowrap"
          >
            <span>{t('store.offers.backToStore')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
          <Link
            to="/store/cart"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold tabular-nums whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {t('nav.cart')} ({cartCount}) · {formatPrice(cartSubtotalYER)}
            </span>
          </Link>
        </div>
      </div>

      {/* Simple Top Filter Bar: Classify Offers by Type & Store Group */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {offerTypeOptions.map((opt) => {
            const count =
              opt.id === 'all'
                ? discountedProducts.length
                : discountedProducts.filter((p) => (p.offerType || 'discount') === opt.id).length;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setOfferTypeFilter(opt.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                  offerTypeFilter === opt.id
                    ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#0F4C5C]'
                }`}
              >
                {lang === 'ar' ? opt.ar : opt.en} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <select
            aria-label={lang === 'ar' ? 'تصنيف حسب المجموعة' : 'Filter by group'}
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-medium text-slate-700"
          >
            <option value="all">
              {lang === 'ar' ? 'كل المجموعات' : 'All Store Groups'}
            </option>
            {storeMainSections.map((sec) => {
              const count = discountedProducts.filter((p) => p.mainSectionId === sec.id).length;
              if (count === 0) return null;
              return (
                <option key={sec.id} value={sec.id}>
                  {sec.nameAr} ({count})
                </option>
              );
            })}
          </select>

          <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap">
            {lang === 'ar'
              ? `${visibleOffers.length} عرض متاح`
              : `${visibleOffers.length} active offers`}
          </span>
        </div>
      </div>

      {/* Discounted Offers Cards Grid */}
      {visibleOffers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-sm font-medium text-slate-800">{t('store.offers.empty')}</p>
          <button
            type="button"
            onClick={() => {
              setOfferTypeFilter('all');
              setSelectedSectionId('all');
            }}
            className="inline-flex px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold"
          >
            {t('common.reset')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleOffers.map((prd) => {
            const sec = storeMainSections.find((s) => s.id === prd.mainSectionId);
            const cat = productCategories.find((c) => c.id === prd.categoryId);
            return (
              <OfferCard
                key={prd.id}
                product={prd}
                sectionName={sec?.nameAr}
                categoryName={cat?.nameAr}
                lang={lang}
                formatPrice={formatPrice}
                onAddToCart={handleQuickAdd}
                isAdded={justAddedId === prd.id}
                addedLabel={t('store.product.addedFeedback')}
                saveLabel={t('store.offers.saveLabel')}
                outOfStockLabel={t('store.product.outOfStock')}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
