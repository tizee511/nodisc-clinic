import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { BookActionButton } from '../components/BookActionLink';

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
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl w-fit" role="tablist">
        <button
          type="button"
          onClick={() => setSelectedDept('all')}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            selectedDept === 'all'
              ? 'bg-white text-[#0F4C5C] shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('common.all')} ({services.length})
        </button>
        {departments.map((dept) => {
          const count = services.filter((s) => s.departmentId === dept.id).length;
          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => setSelectedDept(dept.id)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                selectedDept === dept.id
                  ? 'bg-white text-[#0F4C5C] shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {dept.nameAr} ({count})
            </button>
          );
        })}
      </div>

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

              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/services/${srv.slug}`}
                  className="text-xs font-semibold text-[#0F4C5C] hover:underline inline-flex items-center gap-1"
                >
                  <span>{t('common.readMore')}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
                <BookActionButton
                  departmentId={srv.departmentId}
                  serviceId={srv.id}
                  doctorId={srv.doctorId || undefined}
                  sourceLabel={srv.title}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs font-semibold transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
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
