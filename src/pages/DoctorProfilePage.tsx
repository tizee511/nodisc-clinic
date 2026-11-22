import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { DoctorPortraitFrame } from '../components/ClinicLogoMark';
import { BookActionButton } from '../components/BookActionLink';

export const DoctorProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, isRTL, t, doctors, departments, services, library } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const doctor = doctors.find((d) => d.slug === slug || d.id === slug);

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'الملف غير موجود' : 'Doctor profile not found'}
        </h1>
        <Link to="/doctors" className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold">
          {t('nav.doctors')}
        </Link>
      </div>
    );
  }

  const dept = departments.find((d) => d.id === doctor.departmentId);
  const linkedServices = services.filter(
    (s) => doctor.serviceIds.includes(s.id) || s.doctorId === doctor.id
  );
  const linkedLibrary = library.filter((l) => l.doctorId === doctor.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-10">
      <div>
        <Breadcrumbs
          items={[
            { label: t('nav.doctors'), to: '/doctors' },
            { label: doctor.nameAr },
          ]}
        />

        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 flex justify-center">
            <DoctorPortraitFrame
              imageUrl={doctor.imageUrl}
              name={doctor.nameAr}
              placeholderNote={doctor.imagePlaceholderNote}
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
                  {dept.nameAr} · <span dir="ltr">{dept.nameEn}</span>
                </Link>
              )}
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 mt-1">
                {doctor.nameAr}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5" dir="ltr">
                {doctor.nameEn}
              </p>
              <p className="text-base font-medium text-[#0F4C5C] mt-2">{doctor.roleTitle}</p>
            </div>

            <p className="text-base text-slate-700 leading-relaxed">{doctor.bio}</p>

            <div className="p-3.5 rounded-lg bg-sky-50 border border-sky-100 text-xs text-slate-700">
              {doctor.isProfileEditableNote}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <BookActionButton
                departmentId={doctor.departmentId}
                doctorId={doctor.id}
                sourceLabel={doctor.nameAr}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('common.bookNow')}</span>
              </BookActionButton>
              {dept && (
                <Link
                  to={`/departments/${dept.slug}`}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg border border-slate-300 hover:border-[#0F4C5C] text-slate-800 text-sm font-medium"
                >
                  <span>{dept.nameAr}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Qualifications, Experience, Focus Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <h2 className="font-display font-bold text-lg text-slate-900">
            {t('doctorPage.qualifications')}
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-600 list-disc list-inside leading-relaxed">
            {doctor.qualifications.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <h2 className="font-display font-bold text-lg text-slate-900">
            {t('doctorPage.experiences')}
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-600 list-disc list-inside leading-relaxed">
            {doctor.experiences.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <h2 className="font-display font-bold text-lg text-slate-900">
            {t('doctorPage.focusAreas')}
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {doctor.focusAreas.map((area, i) => (
              <li key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                {area}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Linked Services */}
      {linkedServices.length > 0 && (
        <section className="space-y-5">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {t('doctorPage.linkedServices')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {linkedServices.map((srv) => (
              <div key={srv.id} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    <Link to={`/services/${srv.slug}`} className="hover:text-[#0F4C5C]">
                      {srv.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5">{srv.shortDesc}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
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
                    doctorId={doctor.id}
                    sourceLabel={srv.title}
                    className="text-xs font-semibold px-3 py-1.5 rounded bg-slate-100 hover:bg-[#0F4C5C] text-slate-800 hover:text-white transition-colors"
                  >
                    {t('common.bookService')}
                  </BookActionButton>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Linked Library Materials */}
      {linkedLibrary.length > 0 && (
        <section className="space-y-5">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {t('doctorPage.linkedLibrary')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {linkedLibrary.map((item) => (
              <Link
                key={item.id}
                to={`/library/${item.slug}`}
                className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 hover:border-[#0F4C5C]/40"
              >
                <span className="text-xs font-medium text-[#0284C7]">{item.typeLabel}</span>
                <h3 className="font-display font-bold text-base text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
