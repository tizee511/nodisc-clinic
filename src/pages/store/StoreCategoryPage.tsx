import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Search, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SafeImage } from '../../components/SafeImage';
import { getFilterTabClass, ScrollableFilterBar } from '../../components/ScrollableFilterBar';
import { StoreMainGroupsFilterBar } from '../../components/store/StoreMainGroupsFilterBar';
import { StockStatusBadge } from '../../components/store/StockStatusBadge';

export const StoreCategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, storeMainSections, productCategories, products } = useLanguage();
  const { addToCart, formatPrice, cartCount, cartSubtotalYER } = useClinic();

  const matchedCat = productCategories.find((c) => c.slug === slug || c.id === slug);
  const matchedSec = !matchedCat
    ? storeMainSections.find((s) => s.slug === slug || s.id === slug)
    : undefined;

  const [selectedMainSecId, setSelectedMainSecId] = useState<string>(
    matchedCat?.mainSectionId || matchedSec?.id || 'all'
  );
  const [selectedCatId, setSelectedCatId] = useState<string>(matchedCat?.id || 'all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [query, setQuery] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Sync if URL changes
  React.useEffect(() => {
    const cat = productCategories.find((c) => c.slug === slug || c.id === slug);
    const sec = !cat ? storeMainSections.find((s) => s.slug === slug || s.id === slug) : undefined;
    if (cat) {
      setSelectedMainSecId(cat.mainSectionId);
      setSelectedCatId(cat.id);
    } else if (sec) {
      setSelectedMainSecId(sec.id);
      setSelectedCatId('all');
    } else {
      setSelectedMainSecId('all');
      setSelectedCatId('all');
    }
  }, [slug, productCategories, storeMainSections]);

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
  const activeSectionObj = storeMainSections.find((s) => s.id === selectedMainSecId);

  const visibleSubCategories = useMemo(() => {
    if (selectedMainSecId === 'all') return [];
    return productCategories.filter((c) => c.mainSectionId === selectedMainSecId);
  }, [productCategories, selectedMainSecId]);

  const pageTitle =
    activeCategoryObj?.nameAr || activeSectionObj?.nameAr || t('store.allProducts');
  const pageDescription = activeCategoryObj?.description || activeSectionObj?.description;

  const handleQuickAdd = (prdId: string, option?: string) => {
    const res = addToCart(prdId, 1, option);
    if (res.ok) {
      setJustAddedId(prdId);
      setTimeout(() => setJustAddedId(null), 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Breadcrumbs
            items={[
              { label: t('nav.store'), to: '/store' },
              ...(activeCategoryObj && activeSectionObj
                ? [{ label: activeSectionObj.nameAr, to: `/store/category/${activeSectionObj.slug}` }]
                : []),
              { label: pageTitle },
            ]}
          />
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">{pageTitle}</h1>
          {pageDescription && <p className="text-sm text-slate-600 mt-1">{pageDescription}</p>}
        </div>

        <Link
          to="/store/cart"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold tabular-nums whitespace-nowrap"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {t('nav.cart')} ({cartCount}) · {formatPrice(cartSubtotalYER)}
          </span>
        </Link>
      </div>

      {/* Prominent Store Main Groups Bar */}
      <StoreMainGroupsFilterBar
        selectedMainSectionId={selectedMainSecId}
        onSelectMainSection={(id) => {
          setSelectedMainSecId(id);
          setSelectedCatId('all');
        }}
        allLabel={lang === 'ar' ? 'كل المجموعات' : 'All Groups'}
      />

      {/* Sub-Category Branching Filter Strip when a Main Group is active */}
      {visibleSubCategories.length > 0 && (
        <ScrollableFilterBar
          surface="inset"
          ariaLabel={lang === 'ar' ? 'التصنيفات الفرعية' : 'Subcategories'}
        >
          <button
            type="button"
            onClick={() => setSelectedCatId('all')}
            className={getFilterTabClass(selectedCatId === 'all', true)}
          >
            {lang === 'ar' ? `كل ${activeSectionObj?.nameAr || 'الفروع'}` : 'All Subcategories'}
          </button>
          {visibleSubCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCatId(c.id)}
              className={getFilterTabClass(selectedCatId === c.id, true)}
            >
              {c.nameAr}
            </button>
          ))}
        </ScrollableFilterBar>
      )}

      {/* Filter & Sort Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="w-full lg:w-auto flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('store.searchPlaceholder')}
              className="ps-9 pe-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm w-full"
            />
          </div>

          <select
            aria-label={lang === 'ar' ? 'المجموعة الرئيسية' : 'Main Group'}
            value={selectedMainSecId}
            onChange={(e) => {
              setSelectedMainSecId(e.target.value);
              setSelectedCatId('all');
            }}
            className="w-full sm:w-auto max-w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
          >
            <option value="all">{lang === 'ar' ? 'كل المجموعات الرئيسية' : 'All Groups'}</option>
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
            className="w-full sm:w-auto max-w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
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

        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2">
          <label htmlFor="sort-select" className="text-xs text-slate-500 shrink-0">
            {t('store.filter.sortBy')}:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc')}
            className="flex-1 sm:flex-initial min-w-0 max-w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm bg-white"
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
            const hasDiscount =
              prd.originalPriceYER !== undefined && prd.originalPriceYER > prd.priceYER;
            const discountPct = hasDiscount
              ? Math.round(((prd.originalPriceYER! - prd.priceYER) / prd.originalPriceYER!) * 100)
              : 0;

            return (
              <div
                key={prd.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
              >
                <Link to={`/store/product/${prd.slug}`} className="group block">
                  <div className="relative">
                    <SafeImage src={prd.image} alt={prd.name} aspectClass="aspect-[4/3]" />
                    {discountPct > 0 && (
                      <span
                        dir="ltr"
                        className="absolute top-3 start-3 px-2 py-0.5 rounded bg-rose-600 text-white text-xs font-bold tabular-nums"
                      >
                        -{discountPct}%
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500 truncate">{cat?.nameAr}</span>
                      <StockStatusBadge product={prd} />
                    </div>
                    <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#0F4C5C]">
                      {prd.name}
                    </h2>
                    <p className="text-xs text-slate-600 line-clamp-2">{prd.shortDesc}</p>
                  </div>
                </Link>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-base text-[#0F4C5C] tabular-nums">
                        {formatPrice(prd.priceYER)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through tabular-nums">
                          {formatPrice(prd.originalPriceYER!)}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block">{prd.unit}</span>
                  </div>

                  {prd.inStock ? (
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(prd.id, prd.options?.[0])}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
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
                    <span className="text-xs font-semibold text-red-600 whitespace-nowrap shrink-0">
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
