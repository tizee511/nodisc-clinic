import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { getFilterTabClass, ScrollableFilterBar } from '../components/ScrollableFilterBar';
import { EmergencyRedFlagsSection } from '../components/EmergencyRedFlagsSection';
import { LibraryCategory } from '../types/clinic';

export const LibraryPage: React.FC = () => {
  const { lang, t, library, departments } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as LibraryCategory | 'all') || 'all';
  const [activeType, setActiveType] = useState<LibraryCategory | 'all'>(initialType);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    const typeParam = searchParams.get('type') as LibraryCategory | null;
    if (typeParam) setActiveType(typeParam);
  }, [searchParams]);

  const handleSelectType = (type: LibraryCategory | 'all') => {
    setActiveType(type);
    if (type === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ type });
    }
  };

  const tabs: { key: LibraryCategory | 'all'; label: string }[] = [
    { key: 'all', label: t('common.all') },
    { key: 'condition', label: t('library.types.condition') },
    { key: 'article', label: t('library.types.article') },
    { key: 'procedure', label: t('library.types.procedure') },
    { key: 'video', label: t('library.types.video') },
    { key: 'faq', label: t('library.types.faq') },
  ];

  const items =
    activeType === 'all' ? library : library.filter((item) => item.type === activeType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: t('nav.library') }]} />
        <h1 className="font-display font-bold text-3xl text-slate-900">{t('library.title')}</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {t('library.subtitle')}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <ScrollableFilterBar ariaLabel={lang === 'ar' ? 'تصفية المكتبة الطبية' : 'Filter medical library'}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleSelectType(tab.key)}
            className={getFilterTabClass(activeType === tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </ScrollableFilterBar>

      {activeType === 'faq' ? (
        <div className="space-y-3 max-w-4xl">
          {items.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="bg-white rounded-xl border border-slate-200">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full px-5 py-4 text-start flex items-center justify-between gap-4"
                >
                  <span className="font-display font-semibold text-base text-slate-900">
                    {faq.title}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-sm text-slate-600 border-t border-slate-100 leading-relaxed space-y-2">
                    <p>{faq.faqAnswer}</p>
                    <Link
                      to={`/library/${faq.slug}`}
                      className="inline-block text-xs font-semibold text-[#0F4C5C] hover:underline"
                    >
                      {lang === 'ar' ? 'فتح صفحة السؤال المستقلة' : 'Open dedicated FAQ page'}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const dept = departments.find((d) => d.id === item.departmentId);
            return (
              <Link
                key={item.id}
                to={`/library/${item.slug}`}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#0F4C5C]/40 transition-colors"
              >
                <div>
                  <div className="relative">
                    <SafeImage src={item.image} alt={item.title} aspectClass="aspect-[4/3]" />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                        <span className="w-12 h-12 rounded-full bg-white/95 text-[#0F4C5C] flex items-center justify-center shadow">
                          <Play className="w-5 h-5 fill-current" />
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 space-y-2.5">
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-[#0284C7]">{item.typeLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{dept?.nameAr}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{item.publishedAt}</span>
                    </div>
                    <h2 className="font-display font-bold text-lg text-slate-900 group-hover:text-[#0F4C5C]">
                      {item.title}
                    </h2>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {item.authorName && (
                  <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
                    {item.authorName}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <EmergencyRedFlagsSection />
    </div>
  );
};
