import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FileUp, Percent, Search, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SafeImage } from '../../components/SafeImage';

export const StoreHomePage: React.FC = () => {
  const { lang, isRTL, t, storeMainSections, productCategories, products } = useLanguage();
  const { cartCount, cartSubtotalYER, formatPrice } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainSection, setActiveMainSection] = useState<string>('all');

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const offersCount = useMemo(
    () =>
      products.filter(
        (p) => p.isOnSale || (p.originalPriceYER !== undefined && p.originalPriceYER > p.priceYER)
      ).length,
    [products]
  );

  const displayedSections = useMemo(() => {
    if (activeMainSection === 'all') return storeMainSections;
    return storeMainSections.filter((s) => s.id === activeMainSection);
  }, [storeMainSections, activeMainSection]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => {
      if (activeMainSection !== 'all' && p.mainSectionId !== activeMainSection) return false;
      const cat = productCategories.find((c) => c.id === p.categoryId);
      const sec = storeMainSections.find((s) => s.id === p.mainSectionId);
      return (
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        (cat && cat.nameAr.toLowerCase().includes(q)) ||
        (sec && sec.nameAr.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, products, productCategories, storeMainSections, activeMainSection]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-10">
      <div>
        <Breadcrumbs items={[{ label: t('nav.store') }]} />

        {/* Store Header + Search + Offers + Prescription + Cart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="font-display font-bold text-3xl text-slate-900">{t('store.title')}</h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">{t('store.subtitle')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                to="/store/offers"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <Percent className="w-4 h-4 text-rose-600" />
                <span>{t('nav.offers')}</span>
                {offersCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold tabular-nums">
                    {offersCount}
                  </span>
                )}
              </Link>
              <Link
                to="/store/prescription"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#0F4C5C] text-[#0F4C5C] hover:bg-sky-50 text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <FileUp className="w-4 h-4" />
                <span>{t('nav.prescriptionOrder')}</span>
              </Link>
              <Link
                to="/store/cart"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors tabular-nums whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {t('nav.cart')} ({cartCount}) · {formatPrice(cartSubtotalYER)}
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('store.searchPlaceholder')}
                aria-label={t('store.searchPlaceholder')}
                className="w-full ps-10 pe-4 py-3 rounded-lg border border-slate-300 text-sm focus:border-[#0F4C5C]"
              />
            </div>

            {/* Standalone Main Store Groups Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveMainSection('all')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                  activeMainSection === 'all'
                    ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#0F4C5C]'
                }`}
              >
                {lang === 'ar'
                  ? `جميع المجموعات (${storeMainSections.length})`
                  : `All Groups (${storeMainSections.length})`}
              </button>
              {storeMainSections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveMainSection(sec.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                    activeMainSection === sec.id
                      ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-[#0F4C5C]'
                  }`}
                >
                  {sec.nameAr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Offers Banner Highlight */}
      {!searchQuery.trim() && offersCount > 0 && (
        <Link
          to="/store/offers"
          className="block bg-gradient-to-l from-[#093542] to-[#0F4C5C] rounded-xl p-5 sm:p-6 text-white hover:opacity-95 transition-opacity"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <span className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 inline-flex items-center justify-center shrink-0">
                <Percent className="w-5 h-5 text-sky-200" />
              </span>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-sky-200 block">
                  {lang === 'ar'
                    ? `${offersCount} عروض فعالة الآن في الصيدلية`
                    : `${offersCount} Active Pharmacy Discounts`}
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl">
                  {t('store.offers.title')} — {t('store.offers.bannerCta')}
                </h2>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-[#093542] text-xs font-bold shrink-0 self-start sm:self-auto whitespace-nowrap">
              <span>{t('store.offers.viewOffers')}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      )}

      {/* Search Results View OR Standalone Groups Layout */}
      {searchQuery.trim() ? (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-2xl text-slate-900">
              {lang === 'ar'
                ? `نتائج البحث في المتجر (${searchResults.length})`
                : `Store Search Results (${searchResults.length})`}
            </h2>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveMainSection('all');
              }}
              className="text-sm font-semibold text-[#0F4C5C] hover:underline"
            >
              {t('common.reset')}
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
              <p className="text-sm font-medium text-slate-800">{t('common.noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.map((prd) => {
                const cat = productCategories.find((c) => c.id === prd.categoryId);
                const hasDiscount =
                  prd.originalPriceYER !== undefined && prd.originalPriceYER > prd.priceYER;
                return (
                  <Link
                    key={prd.id}
                    to={`/store/product/${prd.slug}`}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#0F4C5C]/40"
                  >
                    <div>
                      <SafeImage src={prd.image} alt={prd.name} aspectClass="aspect-[4/3]" />
                      <div className="p-4 space-y-1.5">
                        <span className="text-xs text-slate-500 block">{cat?.nameAr}</span>
                        <h3 className="font-display font-semibold text-base text-slate-900 group-hover:text-[#0F4C5C] line-clamp-2">
                          {prd.name}
                        </h3>
                        <p className="text-xs text-slate-500">{prd.unit}</p>
                      </div>
                    </div>
                    <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100">
                      <div className="flex items-baseline gap-2">
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
                        className={`text-xs font-medium ${
                          prd.inStock ? 'text-emerald-700' : 'text-red-600'
                        }`}
                      >
                        {prd.inStock ? t('store.product.inStock') : t('store.product.outOfStock')}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-10">
          {displayedSections.map((sec) => {
            const subCats = productCategories.filter((c) => c.mainSectionId === sec.id);
            const secProducts = products.filter((p) => p.mainSectionId === sec.id);
            const previewProducts = secProducts.slice(0, 4);

            return (
              <section
                key={sec.id}
                className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 space-y-6"
              >
                {/* Standalone Group Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                      {sec.nameAr}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                      {sec.description}
                    </p>
                  </div>
                  <Link
                    to={`/store/category/${sec.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-[#0F4C5C] text-slate-800 hover:text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
                  >
                    <span>
                      {lang === 'ar'
                        ? `عرض المجموعة (${secProducts.length})`
                        : `Browse Group (${secProducts.length})`}
                    </span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Branching Sub-Categories Row */}
                {subCats.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {subCats.map((cat) => {
                      const catCount = secProducts.filter((p) => p.categoryId === cat.id).length;
                      return (
                        <Link
                          key={cat.id}
                          to={`/store/category/${cat.slug}`}
                          className="group flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-[#0F4C5C]/45 transition-colors"
                        >
                          <div className="w-14 h-12 rounded-md overflow-hidden shrink-0 border border-slate-200">
                            <SafeImage
                              src={cat.image}
                              alt={cat.nameAr}
                              aspectClass="aspect-[4/3]"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-display font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#0F4C5C] truncate">
                              {cat.nameAr}
                            </h3>
                            <span className="text-[11px] text-slate-500 tabular-nums block mt-0.5">
                              {catCount} {lang === 'ar' ? 'منتج' : 'items'}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Featured / Top Products in This Standalone Group */}
                {previewProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {previewProducts.map((prd) => {
                      const cat = subCats.find((c) => c.id === prd.categoryId);
                      const hasDiscount =
                        prd.originalPriceYER !== undefined && prd.originalPriceYER > prd.priceYER;
                      const discountPct = hasDiscount
                        ? Math.round(
                            ((prd.originalPriceYER! - prd.priceYER) / prd.originalPriceYER!) * 100
                          )
                        : 0;

                      return (
                        <Link
                          key={prd.id}
                          to={`/store/product/${prd.slug}`}
                          className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#0F4C5C]/40"
                        >
                          <div>
                            <div className="relative">
                              <SafeImage
                                src={prd.image}
                                alt={prd.name}
                                aspectClass="aspect-[4/3]"
                              />
                              {discountPct > 0 && (
                                <span
                                  dir="ltr"
                                  className="absolute top-2.5 start-2.5 px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold tabular-nums"
                                >
                                  -{discountPct}%
                                </span>
                              )}
                            </div>
                            <div className="p-4 space-y-1.5">
                              <span className="text-[11px] text-slate-500 block">
                                {cat?.nameAr}
                              </span>
                              <h3 className="font-display font-semibold text-sm text-slate-900 group-hover:text-[#0F4C5C] line-clamp-2">
                                {prd.name}
                              </h3>
                              <p className="text-[11px] text-slate-500">{prd.unit}</p>
                            </div>
                          </div>
                          <div className="px-4 pb-3.5 pt-2.5 flex items-center justify-between border-t border-slate-100">
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
                              className={`text-[11px] font-medium ${
                                prd.inStock ? 'text-emerald-700' : 'text-red-600'
                              }`}
                            >
                              {prd.inStock
                                ? t('store.product.inStock')
                                : t('store.product.outOfStock')}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}

          <div className="text-center pt-2">
            <Link
              to="/store/category/all"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 bg-white hover:border-[#0F4C5C] text-slate-800 text-sm font-semibold transition-colors"
            >
              <span>
                {t('store.allProducts')} ({products.length})
              </span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
