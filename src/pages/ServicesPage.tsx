import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { BookActionButton } from '../components/BookActionLink';
import { getFilterTabClass, ScrollableFilterBar } from '../components/ScrollableFilterBar';

export const ServicesPage: React.FC = () => {
  const { lang, isRTL, t, departments, services, doctors } = useLanguage();
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const filtered =
    selectedDept === 'all'
      ? services
      : services.filter((s) => s.departmentId === selectedDept);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: t('nav.services') }]} />
        <h1 className="font-display font-bold text-3xl text-slate-900">{t('nav.services')}</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {lang === 'ar'
            ? 'تصفح الخدمات الاستشارية والعلاجية والتأهيلية حسب القسم الطبي.'
            : 'Browse diagnostic, therapeutic, rehabilitation, and pharmacy services by department.'}
        </p>
      </div>

      {/* Department Filter Tabs */}
      <ScrollableFilterBar ariaLabel={lang === 'ar' ? 'تصفية الخدمات حسب القسم' : 'Filter services by department'}>
        <button
          type="button"
          onClick={() => setSelectedDept('all')}
          className={getFilterTabClass(selectedDept === 'all')}
        >
          <span>{t('common.all')}</span>
          <span
            className={`text-[11px] tabular-nums ${
              selectedDept === 'all' ? 'text-sky-200' : 'text-slate-400'
            }`}
          >
            ({services.length})
          </span>
        </button>
        {departments.map((dept) => {
          const count = services.filter((s) => s.departmentId === dept.id).length;
          const isActive = selectedDept === dept.id;
          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => setSelectedDept(dept.id)}
              className={getFilterTabClass(isActive)}
            >
              <span>{dept.nameAr}</span>
              <span
                className={`text-[11px] tabular-nums ${
                  isActive ? 'text-sky-200' : 'text-slate-400'
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </ScrollableFilterBar>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((srv) => {
          const dept = departments.find((d) => d.id === srv.departmentId);
          const doc = doctors.find((d) => d.id === srv.doctorId);
          return (
            <div
              key={srv.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between"
            >
              <div>
                <SafeImage src={srv.image} alt={srv.title} aspectClass="aspect-[16/10]" />
                <div className="p-5 space-y-2.5">
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                    <span className="text-[#0284C7] font-medium">{dept?.nameAr}</span>
                    {doc && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{doc.nameAr}</span>
                      </>
                    )}
                  </div>
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    <Link to={`/services/${srv.slug}`} className="hover:text-[#0F4C5C]">
                      {srv.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{srv.shortDesc}</p>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-[#0F4C5C]/25 bg-gradient-to-r from-[#0F4C5C]/20 via-sky-100/95 to-[#0284C7]/18 flex items-center justify-between gap-2">
                <Link
                  to={`/services/${srv.slug}`}
                  className="btn-interactive inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/95 hover:bg-gradient-to-r hover:from-[#0F4C5C] hover:to-[#0284C7] text-[#0F4C5C] hover:text-white border border-[#0F4C5C]/20 hover:border-transparent text-xs font-bold shadow-2xs transition-all duration-200 whitespace-nowrap"
                >
                  <span>{t('common.readMore')}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
                <BookActionButton
                  departmentId={srv.departmentId}
                  serviceId={srv.id}
                  doctorId={srv.doctorId || undefined}
                  sourceLabel={srv.title}
                  className="btn-interactive btn-sheen inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border border-sky-300/35 text-xs font-bold shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#7DD3FC]" />
                  <span>{t('common.bookService')}</span>
                </BookActionButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
