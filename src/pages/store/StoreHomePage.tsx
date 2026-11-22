import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Search, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SafeImage } from '../../components/SafeImage';

export const StoreHomePage: React.FC = () => {
  const { lang, t, storeMainSections, productCategories, products } = useLanguage();
  const { cartCount, cartSubtotalYER, formatPrice } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMainSection, setActiveMainSection] = useState<string>('all');

  const visibleCategories = useMemo(() => {
    if (activeMainSection === 'all') return productCategories;
    return productCategories.filter((c) => c.mainSectionId === activeMainSection);
  }, [productCategories, activeMainSection]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (activeMainSection !== 'all' && p.mainSectionId !== activeMainSection) return false;
      if (!q) return p.featured;
      const cat = productCategories.find((c) => c.id === p.categoryId);
      return (
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        (cat && cat.nameAr.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, products, productCategories, activeMainSection]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-10">
      <div>
        <Breadcrumbs items={[{ label: t('nav.store') }]} />

        {/* Store Header + Search + Cart + Prescription CTA */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="font-display font-bold text-3xl text-slate-900">{t('store.title')}</h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">{t('store.subtitle')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/store/prescription"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#0F4C5C] text-[#0F4C5C] hover:bg-sky-50 text-sm font-semibold transition-colors"
              >
                <FileUp className="w-4 h-4" />
                <span>{t('nav.prescriptionOrder')}</span>
              </Link>
              <Link
                to="/store/cart"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors tabular-nums"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {t('nav.cart')} ({cartCount}) · {formatPrice(cartSubtotalYER)}
                </span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
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

            {/* 2 Main Store Sections Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveMainSection('all')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  activeMainSection === 'all'
                    ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#0F4C5C]'
                }`}
              >
                {lang === 'ar' ? 'جميع الأقسام الرئيسية' : 'All Main Sections'}
              </button>
              {storeMainSections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveMainSection(sec.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
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

      {/* Categories Grid */}
      {!searchQuery.trim() && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-2xl text-slate-900">
              {t('store.categories')}
            </h2>
            <Link
              to="/store/category/all"
              className="text-sm font-semibold text-[#0F4C5C] hover:underline"
            >
              {t('store.allProducts')} ({products.length})
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleCategories.map((cat) => {
              const sec = storeMainSections.find((s) => s.id === cat.mainSectionId);
              return (
                <Link
                  key={cat.id}
                  to={`/store/category/${cat.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#0F4C5C]/40 transition-colors"
                >
                  <SafeImage src={cat.image} alt={cat.nameAr} aspectClass="aspect-[4/3]" />
                  <div className="p-4 space-y-1">
                    {sec && (
                      <span className="text-[11px] font-medium text-[#0284C7] block">
                        {sec.nameAr}
                      </span>
                    )}
                    <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#0F4C5C]">
                      {cat.nameAr}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured / Search Results Products */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {searchQuery.trim()
              ? `${lang === 'ar' ? 'نتائج البحث في المتجر' : 'Store Search Results'} (${filteredProducts.length})`
              : t('store.featuredProducts')}
          </h2>
          <Link
            to="/store/category/all"
            className="text-sm font-semibold text-[#0F4C5C] hover:underline"
          >
            {t('common.viewAll')}
          </Link>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
            <p className="text-sm font-medium text-slate-800">{t('common.noResults')}</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveMainSection('all');
              }}
              className="px-4 py-2 rounded-lg bg-slate-100 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              {t('common.reset')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prd) => {
              const cat = productCategories.find((c) => c.id === prd.categoryId);
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
                    <span className="font-bold text-sm text-[#0F4C5C] tabular-nums">
                      {formatPrice(prd.priceYER)}
                    </span>
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
    </div>
  );
};
