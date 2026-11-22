import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { DoctorPortraitFrame } from '../components/ClinicLogoMark';

export const AboutPage: React.FC = () => {
  const { lang, isRTL, t, localizedConfig, departments, doctors, news } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-14">
      <div>
        <Breadcrumbs items={[{ label: t('nav.about') }]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-xl border border-slate-200 p-6 sm:p-10">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-semibold text-[#0284C7]">{localizedConfig.brand.nameEn}</span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900">
              {localizedConfig.brand.nameAr}
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              {localizedConfig.brand.shortAbout}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 rounded-lg border border-slate-200/80 p-4">
                <h2 className="font-display font-bold text-sm text-[#0F4C5C] mb-1.5">
                  {lang === 'ar' ? 'الرؤية' : 'Vision'}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{localizedConfig.brand.vision}</p>
              </div>
              <div className="bg-slate-50 rounded-lg border border-slate-200/80 p-4">
                <h2 className="font-display font-bold text-sm text-[#0F4C5C] mb-1.5">
                  {lang === 'ar' ? 'الرسالة' : 'Mission'}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{localizedConfig.brand.mission}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <SafeImage
              src={localizedConfig.brand.heroImage}
              alt={localizedConfig.brand.nameAr}
              aspectClass="aspect-[4/3]"
              className="rounded-xl border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* 4 Departments Overview */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-slate-900">
          {t('home.departmentsHeading')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              to={`/departments/${dept.slug}`}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 hover:border-[#0F4C5C]/40 transition-colors"
            >
              <span className="text-xs text-slate-400" dir="ltr">{dept.nameEn}</span>
              <h3 className="font-display font-bold text-base text-slate-900">{dept.nameAr}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{dept.shortDesc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Medical Team */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-2xl text-slate-900">{t('nav.doctors')}</h2>
          <Link to="/doctors" className="text-sm font-semibold text-[#0F4C5C] hover:underline inline-flex items-center gap-1">
            <span>{t('common.viewAll')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <Link
              key={doc.id}
              to={`/doctors/${doc.slug}`}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 hover:border-[#0F4C5C]/40"
            >
              <DoctorPortraitFrame
                imageUrl={doc.imageUrl}
                name={doc.nameAr}
                placeholderNote={doc.imagePlaceholderNote}
              />
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">{doc.nameAr}</h3>
                <p className="text-xs text-[#0F4C5C] mt-1">{doc.roleTitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Clinic Gallery */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'جولة في مرافق المركز' : 'Clinic Facilities Gallery'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {localizedConfig.brand.clinicGallery.map((item, idx) => (
            <figure key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <SafeImage src={item.url} alt={item.caption} aspectClass="aspect-[4/3]" />
              <figcaption className="p-3 text-xs text-slate-600 leading-relaxed">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Address & News */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-display font-bold text-xl text-slate-900">{t('home.locationHeading')}</h2>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#0F4C5C] mt-0.5 shrink-0" />
              <span>{localizedConfig.contact.address}</span>
            </p>
            <p className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#0F4C5C] mt-0.5 shrink-0" />
              <span>
                {localizedConfig.contact.workingDays} — {localizedConfig.contact.workingPeriods.map((p) => p.time).join(' / ')}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-[#0F4C5C] mt-0.5 shrink-0" />
              <span dir="ltr" className="tabular-nums">{localizedConfig.contact.phones[0].value}</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-slate-900">{t('home.newsHeading')}</h2>
            <Link to="/news" className="text-xs font-semibold text-[#0F4C5C] hover:underline">
              {t('common.viewAll')}
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {news.map((n) => (
              <Link
                key={n.id}
                to={`/news/${n.slug}`}
                className="block py-3 hover:text-[#0F4C5C] transition-colors"
              >
                <span className="text-xs text-slate-400 tabular-nums">{n.date} · {n.categoryLabel}</span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{n.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
