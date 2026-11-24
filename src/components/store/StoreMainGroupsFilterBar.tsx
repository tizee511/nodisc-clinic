import React from 'react';
import { Layers, LayoutGrid } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollableFilterBar } from '../ScrollableFilterBar';

interface StoreMainGroupsFilterBarProps {
  selectedMainSectionId: string;
  onSelectMainSection: (id: string) => void;
  allLabel?: string;
  headerAction?: React.ReactNode;
}

export const StoreMainGroupsFilterBar: React.FC<StoreMainGroupsFilterBarProps> = ({
  selectedMainSectionId,
  onSelectMainSection,
  allLabel,
  headerAction,
}) => {
  const { lang, storeMainSections, products } = useLanguage();

  const resolvedAllLabel =
    allLabel || (lang === 'ar' ? 'جميع المجموعات' : 'All Groups');

  return (
    <section
      aria-label={lang === 'ar' ? 'المجموعات الرئيسية للمتجر' : 'Store Main Groups Filter'}
      className="bg-white rounded-2xl border border-[#0F4C5C]/25 shadow-[0_12px_30px_-14px_rgba(15,76,92,0.24)] overflow-hidden"
    >
      {/* Prominent Header Band */}
      <div className="px-5 py-4 bg-gradient-to-l from-sky-50/75 via-white to-slate-50/70 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="w-11 h-11 rounded-xl bg-[#0F4C5C] text-white shadow-sm inline-flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 leading-tight">
              {lang === 'ar' ? 'المجموعات الرئيسية في المتجر' : 'Store Main Groups'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 tabular-nums">
              {lang === 'ar'
                ? `${storeMainSections.length} مجموعات رئيسية · ${products.length} منتج متاح للتصفية الفورية`
                : `${storeMainSections.length} main groups · ${products.length} products available`}
            </p>
          </div>
        </div>

        {headerAction && <div className="shrink-0 w-full lg:w-auto">{headerAction}</div>}
      </div>

      {/* Prominent Full-Width Scrollable Main Groups Strip */}
      <div className="p-3.5 sm:p-4 bg-slate-50/50">
        <ScrollableFilterBar
          surface="featured"
          fullWidth
          showFilterIcon={false}
          ariaLabel={lang === 'ar' ? 'تصفية حسب المجموعات الرئيسية' : 'Filter by store main groups'}
        >
          <button
            type="button"
            onClick={() => onSelectMainSection('all')}
            aria-pressed={selectedMainSectionId === 'all'}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-start transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C] ${
              selectedMainSectionId === 'all'
                ? 'bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-[0_6px_16px_-4px_rgba(15,76,92,0.48)]'
                : 'bg-white text-slate-800 border-slate-200 hover:border-[#0F4C5C]/45 hover:bg-sky-50/80 hover:text-[#0F4C5C] shadow-xs'
            }`}
          >
            <span
              className={`w-10 h-10 rounded-lg inline-flex items-center justify-center shrink-0 transition-colors ${
                selectedMainSectionId === 'all'
                  ? 'bg-white/15 text-white border border-white/25'
                  : 'bg-sky-50 text-[#0F4C5C] border border-sky-200/70'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <span className="block text-xs sm:text-sm font-bold leading-tight whitespace-nowrap">
                {resolvedAllLabel}
              </span>
              <span
                className={`block text-[11px] tabular-nums mt-0.5 whitespace-nowrap ${
                  selectedMainSectionId === 'all' ? 'text-sky-200' : 'text-slate-500'
                }`}
              >
                {products.length} {lang === 'ar' ? 'منتج' : 'items'}
              </span>
            </div>
          </button>

          {storeMainSections.map((sec) => {
            const count = products.filter((p) => p.mainSectionId === sec.id).length;
            const isActive = selectedMainSectionId === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSelectMainSection(sec.id)}
                aria-pressed={isActive}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-start transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C] ${
                  isActive
                    ? 'bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-[0_6px_16px_-4px_rgba(15,76,92,0.48)]'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-[#0F4C5C]/45 hover:bg-sky-50/80 hover:text-[#0F4C5C] shadow-xs'
                }`}
              >
                {sec.image ? (
                  <img
                    src={sec.image}
                    alt={sec.nameAr}
                    referrerPolicy="no-referrer"
                    className={`w-10 h-10 rounded-lg object-cover shrink-0 ${
                      isActive
                        ? 'border-2 border-white/40'
                        : 'border border-slate-200 bg-slate-100'
                    }`}
                  />
                ) : (
                  <span
                    className={`w-10 h-10 rounded-lg inline-flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-white/15 text-white border border-white/25'
                        : 'bg-sky-50 text-[#0F4C5C] border border-sky-200/70'
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                  </span>
                )}
                <div className="min-w-0">
                  <span className="block text-xs sm:text-sm font-bold leading-tight whitespace-nowrap">
                    {sec.nameAr}
                  </span>
                  <span
                    className={`block text-[11px] tabular-nums mt-0.5 whitespace-nowrap ${
                      isActive ? 'text-sky-200' : 'text-slate-500'
                    }`}
                  >
                    {count} {lang === 'ar' ? 'منتج' : 'items'}
                  </span>
                </div>
              </button>
            );
          })}
        </ScrollableFilterBar>
      </div>
    </section>
  );
};
