import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { DoctorPortraitFrame } from '../components/ClinicLogoMark';
import { BookActionButton } from '../components/BookActionLink';
import { ClinicalTrustStrip } from '../components/ClinicalTrustStrip';

export const DoctorsPage: React.FC = () => {
  const { lang, isRTL, t, doctors, departments } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: t('nav.doctors') }]} />
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-display font-bold text-3xl text-slate-900">{t('nav.doctors')}</h1>
          <span className="text-xs sm:text-sm font-semibold text-[#0284C7] tabular-nums">
            · {doctors.length}{' '}
            {lang === 'ar'
              ? doctors.length === 1
                ? 'طبيب استشاري'
                : 'أطباء استشاريون'
              : doctors.length === 1
              ? 'Consultant Physician'
              : 'Consultant Physicians'}
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
            <div className="rounded-3xl p-[1.5px] bg-gradient-to-br from-[#0F4C5C]/30 via-[#0284C7]/35 to-emerald-400/30 shadow-sm">
              <div className="bg-white rounded-[22.5px] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl p-[2px] bg-gradient-to-br from-[#0F4C5C]/30 via-[#0284C7]/35 to-emerald-400/30 shadow-xs">
                  <div className="rounded-[14px] overflow-hidden bg-white">
                    <DoctorPortraitFrame
                      imageUrl={doc.imageUrl}
                      name={doc.nameAr}
                      placeholderNote={doc.imagePlaceholderNote}
                      size="lg"
                    />
                  </div>
                </div>
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
                      <BookActionButton
                        key={idx}
                        departmentId={doc.departmentId}
                        doctorId={doc.id}
                        sourceLabel={area}
                        className="btn-interactive px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-50 to-white border border-sky-200/90 hover:border-[#0284C7] text-xs font-bold text-[#0F4C5C] shadow-2xs"
                      >
                        {area}
                      </BookActionButton>
                    ))}
                  </div>
                )}

                <ClinicalTrustStrip compact />

                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/doctors/${doc.slug}`}
                    className="btn-interactive inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] hover:bg-sky-50/70 text-sm font-bold text-[#0F4C5C]"
                  >
                    <span>{t('home.doctorProfileCta')}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                  <BookActionButton
                    departmentId={doc.departmentId}
                    doctorId={doc.id}
                    sourceLabel={doc.nameAr}
                    className="btn-interactive btn-sheen inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border border-sky-300/35 text-sm font-bold shadow-[0_8px_18px_-6px_rgba(15,76,92,0.45)]"
                  >
                    <Calendar className="w-4 h-4 text-[#7DD3FC]" />
                    <span>{t('common.bookNow')}</span>
                  </BookActionButton>
                </div>
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
                className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 hover:border-[#0284C7]/55 hover:shadow-md p-6 flex flex-col justify-between space-y-5 transition-all"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 inset-x-5 h-[3px] rounded-b-full bg-gradient-to-r from-[#0F4C5C] via-[#0284C7] to-emerald-400 opacity-75 group-hover:opacity-100 transition-opacity"
                />
                <div className="space-y-4 pt-1">
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
                    className="btn-interactive text-sm font-bold text-[#0F4C5C] hover:text-[#0284C7] inline-flex items-center gap-1"
                  >
                    <span>{t('home.doctorProfileCta')}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                  <BookActionButton
                    departmentId={doc.departmentId}
                    doctorId={doc.id}
                    sourceLabel={doc.nameAr}
                    className="btn-interactive btn-sheen inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white text-xs font-bold shadow-2xs"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#7DD3FC]" />
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
