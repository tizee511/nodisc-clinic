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
        <h1 className="font-display font-bold text-3xl text-slate-900">{t('nav.doctors')}</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {lang === 'ar'
            ? 'الملف المهني للدكتور محمد الجرباني وهيكلة الفرق التخصصية القابلة لاستقبال بيانات بقية الكوادر الطبية.'
            : 'Professional profile for Dr. Mohammed Al-Jurbani and extensible team modules ready for onboarding additional specialists.'}
        </p>
      </div>

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
    </div>
  );
};
