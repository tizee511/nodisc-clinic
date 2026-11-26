import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  MapPin,
  Maximize2,
  MessageSquare,
  Newspaper,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { DoctorPortraitFrame } from '../components/ClinicLogoMark';
import { BookActionButton } from '../components/BookActionLink';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const AboutPage: React.FC = () => {
  const { lang, isRTL, t, localizedConfig, departments, doctors, news } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [activeCareModelIdx, setActiveCareModelIdx] = useState<number>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const carePillars =
    lang === 'ar'
      ? [
          {
            num: '01',
            title: 'التشخيص العصبي الدقيق',
            summary:
              'فحص سريري متكامل ومراجعة تفصيلية لأشعة الرنين المغناطيسي والأشعة المقطعية لتحديد سبب الألم الفعلي بدقة.',
            linkTo: '/departments/neurosurgery',
            linkLabel: 'قسم جراحة المخ والأعصاب',
          },
          {
            num: '02',
            title: 'الأولوية للعلاج التحفظي',
            summary:
              'أكثر من 85% من حالات الديسك وآلام العمود الفقري تتحسن دون جراحة عبر العلاج الدوائي الموجه وتعديل نمط الحركة.',
            linkTo: '/services',
            linkLabel: 'استعراض برامج العلاج',
          },
          {
            num: '03',
            title: 'علاج الألم والتأهيل الحركي',
            summary:
              'تخفيف الانضغاط العصبي، الحقن التداخلية الموجهة، والشد الرقمي الآمن مع جلسات التأهيل والتمارين العلاجية.',
            linkTo: '/departments/rehabilitation',
            linkLabel: 'قسم التأهيل الحركي',
          },
          {
            num: '04',
            title: 'الصيدلية والدعامات الطبية',
            summary:
              'صرف الوصفات المعتمدة وتوفير المشدات الطبية والوسائد التقويمية وأجهزة التأهيل المنزلي بإشراف صيدلاني.',
            linkTo: '/store',
            linkLabel: 'زيارة متجر نوديسك',
          },
        ]
      : [
          {
            num: '01',
            title: 'Precision Neurological Diagnosis',
            summary:
              'Thorough clinical exam paired with detailed MRI & CT walkthroughs to pinpoint the true pain source.',
            linkTo: '/departments/neurosurgery',
            linkLabel: 'Neurosurgery Department',
          },
          {
            num: '02',
            title: 'Non-Surgical Care First',
            summary:
              'Over 85% of spine disc and back pain cases recover without surgery via targeted medical & conservative therapy.',
            linkTo: '/services',
            linkLabel: 'Explore Treatment Services',
          },
          {
            num: '03',
            title: 'Pain Relief & Active Rehab',
            summary:
              'Guided interventional pain relief, digital spinal decompression, and individualized physical rehabilitation.',
            linkTo: '/departments/rehabilitation',
            linkLabel: 'Rehabilitation Center',
          },
          {
            num: '04',
            title: 'Clinical Pharmacy & Braces',
            summary:
              'Dispensing approved prescriptions alongside orthopedic braces, ergonomic pillows, and home rehab gear.',
            linkTo: '/store',
            linkLabel: 'Visit NODISC Store',
          },
        ];

  const deptAccents = [
    'from-[#0F4C5C] via-[#0284C7] to-[#38BDF8]',
    'from-[#0284C7] via-sky-400 to-indigo-500',
    'from-emerald-500 via-teal-400 to-cyan-500',
    'from-[#0F4C5C] via-cyan-500 to-amber-500',
  ];

  const gallery = localizedConfig.brand.clinicGallery;
  const activeGalleryItem =
    lightboxIndex !== null && gallery[lightboxIndex] ? gallery[lightboxIndex] : null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-14">
        {/* Framed Clinic Identity Hero */}
        <div>
          <Breadcrumbs items={[{ label: t('nav.about') }]} />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="rounded-3xl p-[1.5px] bg-gradient-to-br from-[#0F4C5C]/30 via-[#0284C7]/35 to-emerald-400/30 shadow-sm"
          >
            <div className="relative overflow-hidden rounded-[22.5px] bg-white p-6 sm:p-10 space-y-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #0F4C5C 1px, transparent 1px), linear-gradient(to bottom, #0F4C5C 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                }}
              />

              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="text-[#0284C7]" dir="ltr">
                      {localizedConfig.brand.nameEn}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span className="text-slate-500">{localizedConfig.contact.city}</span>
                  </div>

                  <div>
                    <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 leading-tight">
                      {localizedConfig.brand.nameAr}
                    </h1>
                    <p className="text-sm sm:text-base font-semibold text-[#0F4C5C] mt-1.5">
                      {localizedConfig.brand.tagline}
                    </p>
                  </div>

                  <p className="text-base text-slate-600 leading-relaxed">
                    {localizedConfig.brand.shortAbout}
                  </p>

                  {/* Color-Framed Vision & Mission Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/65 via-white to-white p-4 space-y-2">
                      <span
                        aria-hidden="true"
                        className="absolute top-0 inset-x-4 h-[3px] rounded-b-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      />
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white inline-flex items-center justify-center shrink-0">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                        <h2 className="font-display font-bold text-sm text-[#0F4C5C]">
                          {lang === 'ar' ? 'الرؤية الطبية' : 'Clinical Vision'}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {localizedConfig.brand.vision}
                      </p>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-sky-200/90 bg-gradient-to-br from-sky-50/70 via-white to-white p-4 space-y-2">
                      <span
                        aria-hidden="true"
                        className="absolute top-0 inset-x-4 h-[3px] rounded-b-full bg-gradient-to-r from-[#0284C7] to-indigo-500"
                      />
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="w-7 h-7 rounded-lg bg-[#0284C7] text-white inline-flex items-center justify-center shrink-0">
                          <Compass className="w-3.5 h-3.5" />
                        </span>
                        <h2 className="font-display font-bold text-sm text-[#0F4C5C]">
                          {lang === 'ar' ? 'رسالتنا ورعايتنا' : 'Our Mission'}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {localizedConfig.brand.mission}
                      </p>
                    </div>
                  </div>

                  {/* Hero Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <BookActionButton
                      sourceLabel={localizedConfig.brand.nameAr}
                      className="btn-interactive btn-sheen inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] hover:from-[#093542] hover:to-[#0369A1] text-white border border-sky-300/40 text-sm font-bold shadow-[0_8px_20px_-6px_rgba(15,76,92,0.5)] whitespace-nowrap"
                    >
                      <Calendar className="w-4 h-4 text-[#7DD3FC]" />
                      <span>{t('common.bookNow')}</span>
                    </BookActionButton>

                    {localizedConfig.contact.whatsappUrl && (
                      <a
                        href={`${localizedConfig.contact.whatsappUrl}?text=${encodeURIComponent(
                          lang === 'ar'
                            ? 'مرحبًا نوديسك كلينك، أود الاستفسار عن المواعيد والخدمات الطبية.'
                            : 'Hello NODISC Clinic, I would like to inquire about appointments and services.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-emerald-500/45 bg-emerald-50/75 hover:bg-emerald-100/80 hover:border-emerald-600 text-emerald-900 text-sm font-bold whitespace-nowrap shadow-2xs"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-700" />
                        <span>{t('common.whatsapp')}</span>
                      </a>
                    )}

                    <Link
                      to="/services"
                      className="btn-interactive inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] hover:bg-sky-50/70 text-[#0F4C5C] text-sm font-bold whitespace-nowrap"
                    >
                      <span>{t('nav.services')}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Framed Clinic Visual */}
                <div className="lg:col-span-5">
                  <div className="rounded-2xl p-[2px] bg-gradient-to-br from-[#0F4C5C]/30 via-[#0284C7]/40 to-emerald-400/35 shadow-sm">
                    <div className="rounded-[14px] overflow-hidden bg-white">
                      <SafeImage
                        src={localizedConfig.brand.heroImage}
                        alt={localizedConfig.brand.nameAr}
                        aspectClass="aspect-[4/3]"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2.5 text-center">
                    {localizedConfig.contact.landmark}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Integrated Care Methodology Strip */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="rounded-2xl p-[1.5px] bg-gradient-to-r from-[#0F4C5C]/30 via-[#0284C7]/45 to-emerald-400/40 shadow-xs"
        >
          <div className="rounded-[14.5px] bg-gradient-to-br from-sky-50/85 via-white to-emerald-50/40 p-5 sm:p-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#0284C7] text-white inline-flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </span>
                <div>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                    {lang === 'ar'
                      ? 'منظومة نوديسك المتكاملة — 4 ركائز تحت سقف واحد'
                      : 'Integrated NODISC Care — 4 Pillars Under One Roof'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === 'ar'
                      ? 'اضغط على أي ركيزة لاستعراض دورها في رحلة تعافي المريض'
                      : 'Select any pillar to explore how it supports your recovery journey'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {carePillars.map((pillar, idx) => {
                const isSelected = activeCareModelIdx === idx;
                return (
                  <button
                    key={pillar.num}
                    type="button"
                    onClick={() => setActiveCareModelIdx(idx)}
                    aria-pressed={isSelected}
                    className={`btn-interactive text-start rounded-xl px-4 py-3 border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border-[#0284C7] shadow-[0_8px_18px_-6px_rgba(2,132,199,0.45)]'
                        : 'bg-white border-sky-200/80 text-slate-800 hover:border-[#0284C7] hover:bg-sky-50/70'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg font-mono text-xs font-extrabold tabular-nums inline-flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-sky-100 text-[#0F4C5C]'
                      }`}
                    >
                      {pillar.num}
                    </span>
                    <span className="text-xs sm:text-sm font-bold leading-snug">
                      {pillar.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCareModelIdx}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                className="rounded-xl bg-white/95 border border-sky-200/80 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <CheckCircle2 className="w-4.5 h-4.5 text-[#0284C7] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {carePillars[activeCareModelIdx]?.summary}
                  </p>
                </div>
                <Link
                  to={carePillars[activeCareModelIdx]?.linkTo || '/services'}
                  className="btn-interactive inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs font-bold whitespace-nowrap shrink-0 self-start sm:self-center"
                >
                  <span>{carePillars[activeCareModelIdx]?.linkLabel}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>

        {/* 4 Departments Overview */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-2xl text-slate-900">
                {t('home.departmentsHeading')}
              </h2>
              <div aria-hidden="true" className="flex items-center gap-1.5 mt-2">
                <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-[#0F4C5C] to-[#38BDF8]" />
                <span className="w-1.5 h-1.5 rotate-45 rounded-[1px] bg-[#0284C7]" />
              </div>
            </div>
            <Link
              to="/services"
              className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:border-[#0284C7] text-xs sm:text-sm font-bold text-[#0F4C5C] whitespace-nowrap"
            >
              <span>{t('nav.services')}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {departments.map((dept, idx) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.38, delay: idx * 0.05, ease: EASE_OUT_EXPO }}
              >
                <Link
                  to={`/departments/${dept.slug}`}
                  className="btn-interactive group relative overflow-hidden h-full bg-white rounded-2xl border border-slate-200 hover:border-[#0284C7]/55 hover:shadow-md p-5 flex flex-col justify-between space-y-4 transition-all"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute top-0 inset-x-4 h-[3px] rounded-b-full bg-gradient-to-r ${
                      deptAccents[idx % deptAccents.length]
                    } opacity-80 group-hover:opacity-100 transition-opacity`}
                  />
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-slate-400 truncate" dir="ltr">
                        {dept.nameEn}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[#0284C7] tabular-nums shrink-0">
                        0{idx + 1}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#0F4C5C] transition-colors">
                      {dept.nameAr}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{dept.shortDesc}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F4C5C]">
                    <span>{t('common.readMore')}</span>
                    <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Medical Team */}
        <section className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-2xl text-slate-900">{t('nav.doctors')}</h2>
              <div aria-hidden="true" className="flex items-center gap-1.5 mt-2">
                <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-[#0284C7] to-emerald-400" />
                <span className="w-1.5 h-1.5 rotate-45 rounded-[1px] bg-[#0F4C5C]" />
              </div>
            </div>
            <Link
              to="/doctors"
              className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:border-[#0284C7] text-xs sm:text-sm font-bold text-[#0F4C5C] whitespace-nowrap"
            >
              <span>{t('common.viewAll')}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="group relative overflow-hidden rounded-2xl p-[1.5px] bg-gradient-to-br from-[#0F4C5C]/25 via-[#0284C7]/35 to-emerald-400/25 shadow-xs hover:shadow-md transition-all"
              >
                <div className="relative h-full rounded-[14.5px] bg-white p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <Link to={`/doctors/${doc.slug}`} className="block">
                      <DoctorPortraitFrame
                        imageUrl={doc.imageUrl}
                        name={doc.nameAr}
                        placeholderNote={doc.imagePlaceholderNote}
                      />
                    </Link>
                    <div>
                      <Link
                        to={`/doctors/${doc.slug}`}
                        className="font-display font-bold text-lg text-slate-900 hover:text-[#0F4C5C] transition-colors block"
                      >
                        {doc.nameAr}
                      </Link>
                      <p className="text-xs font-semibold text-[#0284C7] mt-1">{doc.roleTitle}</p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {doc.bio}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/doctors/${doc.slug}`}
                      className="btn-interactive text-xs font-bold text-[#0F4C5C] hover:text-[#0284C7] inline-flex items-center gap-1"
                    >
                      <span>{t('home.doctorProfileCta')}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
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
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Clinic Facilities Gallery */}
        <section className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-900">
              {lang === 'ar' ? 'جولة في مرافق المركز' : 'Clinic Facilities Gallery'}
            </h2>
            <div aria-hidden="true" className="flex items-center gap-1.5 mt-2">
              <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-[#0F4C5C] to-[#38BDF8]" />
              <span className="w-1.5 h-1.5 rotate-45 rounded-[1px] bg-[#0284C7]" />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              {lang === 'ar'
                ? 'اضغط على أي صورة لمعاينة مرافق العيادة والتأهيل والصيدلية بحجم أكبر'
                : 'Select any facility photo to inspect clinic, rehab, and pharmacy spaces in detail'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {gallery.map((item, idx) => (
              <motion.figure
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.38, delay: idx * 0.05, ease: EASE_OUT_EXPO }}
                className="group relative bg-white rounded-2xl border border-slate-200 hover:border-[#0284C7]/55 hover:shadow-md overflow-hidden transition-all flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  aria-label={item.caption}
                  className="relative w-full text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284C7]"
                >
                  <SafeImage
                    src={item.url}
                    alt={item.caption}
                    aspectClass="aspect-[4/3]"
                    className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-2.5 end-2.5 w-8 h-8 rounded-lg bg-[#093542]/80 text-white inline-flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:bg-[#0284C7] transition-all shadow-sm">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </button>
                <figcaption className="p-3.5 flex-1 flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <span className="font-mono text-[11px] font-bold text-[#0284C7] tabular-nums shrink-0 mt-0.5">
                    0{idx + 1}
                  </span>
                  <span>{item.caption}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        {/* Address & Latest News */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Framed Location & Contact Card */}
          <div className="lg:col-span-5 rounded-2xl p-[1.5px] bg-gradient-to-br from-[#0F4C5C]/30 via-[#0284C7]/35 to-emerald-400/30 shadow-xs">
            <div className="relative h-full rounded-[14.5px] bg-gradient-to-br from-sky-50/45 via-white to-white p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#0284C7] text-white inline-flex items-center justify-center shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </span>
                  <h2 className="font-display font-bold text-xl text-slate-900">
                    {t('home.locationHeading')}
                  </h2>
                </div>

                <div className="space-y-3 text-sm text-slate-700">
                  <p className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80">
                    <MapPin className="w-4 h-4 text-[#0284C7] mt-0.5 shrink-0" />
                    <span>{localizedConfig.contact.address}</span>
                  </p>
                  <p className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80">
                    <Clock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>
                      {localizedConfig.contact.workingDays} —{' '}
                      {localizedConfig.contact.workingPeriods.map((p) => p.time).join(' / ')}
                    </span>
                  </p>
                  <a
                    href={`tel:${localizedConfig.contact.phones[0].value.replace(/\s+/g, '')}`}
                    className="btn-interactive flex items-center justify-between gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 hover:border-[#0284C7]"
                  >
                    <span className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#0F4C5C] shrink-0" />
                      <span dir="ltr" className="font-semibold tabular-nums">
                        {localizedConfig.contact.phones[0].value}
                      </span>
                    </span>
                    <ArrowIcon className="w-3.5 h-3.5 text-[#0284C7]" />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <BookActionButton
                  sourceLabel={t('home.locationHeading')}
                  className="btn-interactive btn-sheen inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white text-xs font-bold shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#7DD3FC]" />
                  <span>{t('common.bookNow')}</span>
                </BookActionButton>
                <Link
                  to="/contact"
                  className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:border-[#0284C7] text-xs font-bold text-[#0F4C5C]"
                >
                  <Activity className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>{t('nav.contact')}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Framed Latest News Card */}
          <div className="lg:col-span-7 rounded-2xl p-[1.5px] bg-gradient-to-br from-sky-200/80 via-slate-200/80 to-emerald-200/70 shadow-xs">
            <div className="h-full rounded-[14.5px] bg-white p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-[#0284C7] inline-flex items-center justify-center shrink-0">
                    <Newspaper className="w-4.5 h-4.5" />
                  </span>
                  <h2 className="font-display font-bold text-xl text-slate-900">
                    {t('home.newsHeading')}
                  </h2>
                </div>
                <Link
                  to="/news"
                  className="btn-interactive inline-flex items-center gap-1 text-xs font-bold text-[#0F4C5C] hover:text-[#0284C7]"
                >
                  <span>{t('common.viewAll')}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {news.map((n) => (
                  <Link
                    key={n.id}
                    to={`/news/${n.slug}`}
                    className="group flex items-center justify-between gap-3 py-3.5 hover:text-[#0F4C5C] transition-colors"
                  >
                    <div className="min-w-0">
                      <span className="text-xs text-slate-500 tabular-nums">
                        {n.date} · {n.categoryLabel}
                      </span>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-[#0F4C5C] mt-0.5 transition-colors">
                        {n.title}
                      </p>
                    </div>
                    <ArrowIcon className="w-4 h-4 text-slate-400 group-hover:text-[#0284C7] shrink-0 transition-transform group-hover:-translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Facility Lightbox Preview Modal */}
        <AnimatePresence>
          {activeGalleryItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-label={activeGalleryItem.caption}
              onClick={() => setLightboxIndex(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-white shadow-2xl border border-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative bg-slate-900">
                  <SafeImage
                    src={activeGalleryItem.url}
                    alt={activeGalleryItem.caption}
                    aspectClass="aspect-[16/10]"
                  />
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(null)}
                    aria-label={lang === 'ar' ? 'إغلاق المعاينة' : 'Close preview'}
                    className="absolute top-3 end-3 w-9 h-9 rounded-xl bg-slate-950/70 hover:bg-slate-950 text-white inline-flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-white">
                  <p className="text-sm font-semibold text-slate-800">{activeGalleryItem.caption}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((prev) =>
                          prev === null ? 0 : (prev - 1 + gallery.length) % gallery.length
                        )
                      }
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0284C7] text-xs font-bold text-[#0F4C5C]"
                    >
                      {lang === 'ar' ? 'السابق' : 'Previous'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((prev) =>
                          prev === null ? 0 : (prev + 1) % gallery.length
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs font-bold"
                    >
                      {lang === 'ar' ? 'التالي' : 'Next'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};
