import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useClinic } from '../context/ClinicContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeOnly?: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  storeOnly = false,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const {
    t,
    isRTL,
    lang,
    departments,
    doctors,
    services,
    library,
    products,
    productCategories,
    storeMainSections,
  } = useLanguage();
  const { formatPrice } = useClinic();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: { id: string; typeLabel: string; title: string; subtitle: string; to: string }[] = [];

    if (!storeOnly) {
      departments.forEach((d) => {
        if (
          d.nameAr.toLowerCase().includes(q) ||
          d.nameEn.toLowerCase().includes(q) ||
          d.shortDesc.toLowerCase().includes(q)
        ) {
          items.push({
            id: `dept-${d.id}`,
            typeLabel: lang === 'ar' ? 'قسم طبي' : 'Department',
            title: d.nameAr,
            subtitle: d.shortDesc,
            to: `/departments/${d.slug}`,
          });
        }
      });

      doctors.forEach((doc) => {
        if (
          doc.nameAr.toLowerCase().includes(q) ||
          doc.nameEn.toLowerCase().includes(q) ||
          doc.roleTitle.toLowerCase().includes(q)
        ) {
          items.push({
            id: `doc-${doc.id}`,
            typeLabel: lang === 'ar' ? 'طبيب' : 'Physician',
            title: doc.nameAr,
            subtitle: doc.roleTitle,
            to: `/doctors/${doc.slug}`,
          });
        }
      });

      services.forEach((srv) => {
        if (srv.title.toLowerCase().includes(q) || srv.shortDesc.toLowerCase().includes(q)) {
          items.push({
            id: `srv-${srv.id}`,
            typeLabel: lang === 'ar' ? 'خدمة طبية' : 'Medical Service',
            title: srv.title,
            subtitle: srv.shortDesc,
            to: `/services/${srv.slug}`,
          });
        }
      });

      library.forEach((lib) => {
        if (lib.title.toLowerCase().includes(q) || lib.summary.toLowerCase().includes(q)) {
          items.push({
            id: `lib-${lib.id}`,
            typeLabel: lib.typeLabel,
            title: lib.title,
            subtitle: lib.summary,
            to: `/library/${lib.slug}`,
          });
        }
      });
    } else {
      storeMainSections.forEach((sec) => {
        if (
          sec.nameAr.toLowerCase().includes(q) ||
          (sec.nameEn || '').toLowerCase().includes(q) ||
          (sec.description || '').toLowerCase().includes(q)
        ) {
          items.push({
            id: `sec-${sec.id}`,
            typeLabel: lang === 'ar' ? 'مجموعة رئيسية' : 'Store Group',
            title: sec.nameAr,
            subtitle: sec.description,
            to: `/store/category/${sec.slug}`,
          });
        }
      });

      productCategories.forEach((cat) => {
        if (
          cat.nameAr.toLowerCase().includes(q) ||
          (cat.nameEn || '').toLowerCase().includes(q) ||
          (cat.description || '').toLowerCase().includes(q)
        ) {
          items.push({
            id: `cat-${cat.id}`,
            typeLabel: lang === 'ar' ? 'تصنيف فرعي' : 'Subcategory',
            title: cat.nameAr,
            subtitle: cat.description,
            to: `/store/category/${cat.slug}`,
          });
        }
      });
    }

    products.forEach((prd) => {
      if (prd.name.toLowerCase().includes(q) || prd.shortDesc.toLowerCase().includes(q)) {
        items.push({
          id: `prd-${prd.id}`,
          typeLabel: lang === 'ar' ? 'منتج صيدلاني' : 'Pharmacy Product',
          title: prd.name,
          subtitle: `${formatPrice(prd.priceYER)} · ${prd.shortDesc}`,
          to: `/store/product/${prd.slug}`,
        });
      }
    });

    return items.slice(0, 8);
  }, [
    query,
    storeOnly,
    departments,
    doctors,
    services,
    library,
    products,
    productCategories,
    storeMainSections,
    lang,
    formatPrice,
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    if (storeOnly) {
      navigate('/store/category/all');
    } else {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const quickTerms = storeOnly
    ? lang === 'ar'
      ? ['حزام الظهر', 'فيتامينات', 'سيروم الشعر', 'جهاز TENS']
      : ['Lumbar Brace', 'Vitamins', 'Hair Serum', 'TENS Device']
    : lang === 'ar'
    ? ['الانزلاق الغضروفي', 'الجرباني', 'العلاج الطبيعي', 'حزام الظهر']
    : ['Disc Herniation', 'Al-Jurbani', 'Physiotherapy', 'Lumbar Brace'];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label={storeOnly ? t('store.searchPlaceholder') : t('nav.search')}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={storeOnly ? t('store.searchPlaceholder') : t('common.searchPlaceholder')}
            className="w-full text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.cancel')}
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        <div className="max-h-[60dvh] sm:max-h-96 overflow-y-auto overscroll-contain p-4">
          {!query.trim() ? (
            <div className="text-center py-6 space-y-3">
              <p className="text-sm text-slate-500">
                {storeOnly ? t('store.searchPlaceholder') : t('common.searchPlaceholder')}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {quickTerms.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-sky-50 hover:text-[#0F4C5C] text-slate-700 rounded-md transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-sm font-medium text-slate-800">{t('common.noResults')}</p>
              <p className="text-xs text-slate-500">{t('common.tryAgain')}</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {results.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center justify-between gap-4 py-3 px-2 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <span className="text-xs text-[#0284C7] font-medium block">{item.typeLabel}</span>
                      <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-[#0F4C5C]">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                    <ArrowIcon className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-[#0F4C5C]" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            {storeOnly
              ? lang === 'ar'
                ? 'بحث سريع في منتجات وأقسام المتجر'
                : 'Quick search across store products & categories'
              : lang === 'ar'
              ? 'اضغط Enter لعرض جميع نتائج البحث في صفحة مخصصة'
              : 'Press Enter to view all results on the search page'}
          </span>
          <Link
            to={
              storeOnly
                ? '/store/category/all'
                : `/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`
            }
            onClick={onClose}
            className="font-semibold text-[#0F4C5C] hover:underline whitespace-nowrap"
          >
            {storeOnly
              ? t('store.allProducts')
              : lang === 'ar'
              ? 'فتح صفحة البحث'
              : 'Open Search Page'}
          </Link>
        </div>
      </div>
    </div>
  );
};
