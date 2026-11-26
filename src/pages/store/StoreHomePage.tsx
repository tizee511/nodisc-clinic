import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SafeImage } from '../../components/SafeImage';
import { StoreOffersCarousel } from '../../components/store/StoreOffersCarousel';
import { StoreMainGroupCard } from '../../components/store/StoreMainGroupCard';
import { StoreMainGroupsFilterBar } from '../../components/store/StoreMainGroupsFilterBar';
import { StockStatusBadge } from '../../components/store/StockStatusBadge';

export const StoreHomePage: React.FC = () => {
  const { lang, isRTL, t, storeMainSections, productCategories, products } = useLanguage();
  const { formatPrice } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainSection, setActiveMainSection] = useState<string>('all');

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 space-y-8">
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: t('nav.store') }]} />
        <h1 className="sr-only">{t('store.title')}</h1>

        {/* Auto-Sliding Offers Carousel at the very head of the Store Page */}
        <StoreOffersCarousel />

        {/* Prominent Store Main Groups Filter Bar + Search */}
        <StoreMainGroupsFilterBar
          selectedMainSectionId={activeMainSection}
          onSelectMainSection={setActiveMainSection}
          headerAction={
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('store.searchPlaceholder')}
                aria-label={t('store.searchPlaceholder')}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-[#0F4C5C] shadow-xs"
              />
            </div>
          }
        />
      </div>

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
                      <StockStatusBadge product={prd} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        <div className="space-y-8">
          {displayedSections.map((sec) => {
            const subCats = productCategories.filter((c) => c.mainSectionId === sec.id);
            const secProducts = products.filter((p) => p.mainSectionId === sec.id);

            return (
              <StoreMainGroupCard
                key={sec.id}
                section={sec}
                subCategories={subCats}
                products={secProducts}
                hideGroupHeader={activeMainSection !== 'all'}
              />
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
