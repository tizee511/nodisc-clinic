import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Search, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SafeImage } from '../../components/SafeImage';

export const StoreCategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, storeMainSections, productCategories, products } = useLanguage();
  const { addToCart, formatPrice, cartCount, cartSubtotalYER } = useClinic();

  const currentCat = productCategories.find((c) => c.slug === slug || c.id === slug);
  const [selectedMainSecId, setSelectedMainSecId] = useState<string>(
    currentCat?.mainSectionId || 'all'
  );
  const [selectedCatId, setSelectedCatId] = useState<string>(currentCat?.id || 'all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [query, setQuery] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Sync if URL changes
  React.useEffect(() => {
    const matched = productCategories.find((c) => c.slug === slug || c.id === slug);
    setSelectedCatId(matched ? matched.id : 'all');
    if (matched) setSelectedMainSecId(matched.mainSectionId);
  }, [slug, productCategories]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = products.filter((p) => {
      if (selectedMainSecId !== 'all' && p.mainSectionId !== selectedMainSecId) return false;
      if (selectedCatId !== 'all' && p.categoryId !== selectedCatId) return false;
      if (inStockOnly && !p.inStock) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.shortDesc.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.priceYER - b.priceYER);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.priceYER - a.priceYER);
    } else {
      result = [...result].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    }
    return result;
  }, [products, selectedMainSecId, selectedCatId, inStockOnly, sortBy, query]);

  const activeCategoryObj = productCategories.find((c) => c.id === selectedCatId);

  const handleQuickAdd = (prdId: string, option?: string) => {
    const res = addToCart(prdId, 1, option);
    if (res.ok) {
      setJustAddedId(prdId);
      setTimeout(() => setJustAddedId(null), 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Breadcrumbs
            items={[
              { label: t('nav.store'), to: '/store' },
              { label: activeCategoryObj?.nameAr || t('store.allProducts') },
            ]}
          />
          <h1 className="font-display font-bold text-3xl text-slate-900">
            {activeCategoryObj?.nameAr || t('store.allProducts')}
          </h1>
          {activeCategoryObj && (
            <p className="text-sm text-slate-600 mt-1">{activeCategoryObj.description}</p>
          )}
        </div>

        <Link
          to="/store/cart"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold tabular-nums"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {t('nav.cart')} ({cartCount}) · {formatPrice(cartSubtotalYER)}
          </span>
        </Link>
      </div>

      {/* Filter & Sort Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('store.searchPlaceholder')}
              className="ps-9 pe-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm w-56"
            />
          </div>

          <select
            aria-label={lang === 'ar' ? 'القسم الرئيسي' : 'Main Section'}
            value={selectedMainSecId}
            onChange={(e) => {
              setSelectedMainSecId(e.target.value);
              setSelectedCatId('all');
            }}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
          >
            <option value="all">{lang === 'ar' ? 'كل الأقسام الرئيسية' : 'All Sections'}</option>
            {storeMainSections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameAr}
              </option>
            ))}
          </select>

          <select
            aria-label={t('store.filter.category')}
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
          >
            <option value="all">{t('store.allProducts')}</option>
            {productCategories
              .filter((c) => selectedMainSecId === 'all' || c.mainSectionId === selectedMainSecId)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr}
                </option>
              ))}
          </select>

          <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span>{t('store.filter.inStockOnly')}</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-slate-500">
            {t('store.filter.sortBy')}:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
          >
            <option value="featured">{t('store.filter.sortFeatured')}</option>
            <option value="price-asc">{t('store.filter.sortPriceAsc')}</option>
            <option value="price-desc">{t('store.filter.sortPriceDesc')}</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {list.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
          <p className="text-sm font-medium text-slate-800">{t('common.noResults')}</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCatId('all');
              setInStockOnly(false);
            }}
            className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700"
          >
            {t('common.reset')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((prd) => {
            const cat = productCategories.find((c) => c.id === prd.categoryId);
            const isAdded = justAddedId === prd.id;
            return (
              <div
                key={prd.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
              >
                <Link to={`/store/product/${prd.slug}`} className="group block">
                  <SafeImage src={prd.image} alt={prd.name} aspectClass="aspect-[4/3]" />
                  <div className="p-5 space-y-2">
                    <span className="text-xs text-slate-500 block">{cat?.nameAr}</span>
                    <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#0F4C5C]">
                      {prd.name}
                    </h2>
                    <p className="text-xs text-slate-600 line-clamp-2">{prd.shortDesc}</p>
                  </div>
                </Link>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-base text-[#0F4C5C] tabular-nums block">
                      {formatPrice(prd.priceYER)}
                    </span>
                    <span className="text-[11px] text-slate-500">{prd.unit}</span>
                  </div>

                  {prd.inStock ? (
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(prd.id, prd.options?.[0])}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-[#0F4C5C] text-slate-800 hover:text-white'
                      }`}
                    >
                      {isAdded && <Check className="w-3.5 h-3.5" />}
                      <span>
                        {isAdded
                          ? t('store.product.addedFeedback')
                          : lang === 'ar'
                          ? 'أضف للسلة'
                          : 'Add'}
                      </span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-red-600">
                      {t('store.product.outOfStock')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
