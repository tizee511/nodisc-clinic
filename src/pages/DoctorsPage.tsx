import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { DoctorPortraitFrame } from '../components/ClinicLogoMark';
import { BookActionButton } from '../components/BookActionLink';

export const DoctorsPage: React.FC = () => {
  const { lang, isRTL, t, doctors, departments } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: t('nav.doctors') }]} />
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display font-bold text-3xl text-slate-900">{t('nav.doctors')}</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[#0F4C5C] text-xs font-semibold tabular-nums">
            {doctors.length}{' '}
            {lang === 'ar'
              ? doctors.length === 1
                ? 'طبيب'
                : 'أطباء'
              : doctors.length === 1
              ? 'Physician'
              : 'Physicians'}
          </span>
        </div>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {lang === 'ar'
            ? 'الملف المهني المعتمد لأطباء واستشاريي نوديسك كلينك، ويمكن استعراض السيرة العلمية وحجز الاستشارات مباشرة.'
            : 'Official professional profiles of NODISC Clinic physicians and consultants for direct review and appointment booking.'}
        </p>
      </div>

      {doctors.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-600">
          {lang === 'ar'
            ? 'لا توجد ملفات أطباء منشورة حالياً.'
            : 'No published physician profiles yet.'}
        </div>
      ) : doctors.length === 1 ? (
        (() => {
          const doc = doctors[0];
          const dept = departments.find((d) => d.id === doc.departmentId);
          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex justify-center">
                <DoctorPortraitFrame
                  imageUrl={doc.imageUrl}
                  name={doc.nameAr}
                  placeholderNote={doc.imagePlaceholderNote}
                  size="lg"
                />
              </div>
              <div className="lg:col-span-8 space-y-5">
                <div>
                  {dept && (
                    <Link
                      to={`/departments/${dept.slug}`}
                      className="text-xs font-semibold text-[#0284C7] hover:underline"
                    >
                      {dept.nameAr}
                    </Link>
                  )}
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-1">
                    {doc.nameAr}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5" dir="ltr">
                    {doc.nameEn}
                  </p>
                  <p className="text-sm sm:text-base text-[#0F4C5C] font-semibold mt-2">
                    {doc.roleTitle}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {doc.bio}
                </p>

                {doc.focusAreas.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {doc.focusAreas.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/doctors/${doc.slug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-slate-300 hover:border-[#0F4C5C] text-sm font-semibold text-[#0F4C5C] transition-colors"
                  >
                    <span>{t('home.doctorProfileCta')}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                  <BookActionButton
                    departmentId={doc.departmentId}
                    doctorId={doc.id}
                    sourceLabel={doc.nameAr}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{t('common.bookNow')}</span>
                  </BookActionButton>
                </div>
              </div>
            </div>
          );
        })()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => {
            const dept = departments.find((d) => d.id === doc.departmentId);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <DoctorPortraitFrame
                    imageUrl={doc.imageUrl}
                    name={doc.nameAr}
                    placeholderNote={doc.imagePlaceholderNote}
                  />
                  <div>
                    <span className="text-xs font-medium text-[#0284C7]">{dept?.nameAr}</span>
                    <h2 className="font-display font-bold text-xl text-slate-900 mt-1">
                      {doc.nameAr}
                    </h2>
                    <p className="text-xs text-[#0F4C5C] font-medium mt-1">{doc.roleTitle}</p>
                    <p className="text-sm text-slate-600 mt-3 leading-relaxed line-clamp-3">
                      {doc.bio}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <Link
                    to={`/doctors/${doc.slug}`}
                    className="text-sm font-semibold text-[#0F4C5C] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{t('home.doctorProfileCta')}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                  <BookActionButton
                    departmentId={doc.departmentId}
                    doctorId={doc.id}
                    sourceLabel={doc.nameAr}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs font-semibold transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t('common.bookNow')}</span>
                  </BookActionButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
