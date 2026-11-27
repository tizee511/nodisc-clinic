import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { DoctorPortraitFrame } from '../components/ClinicLogoMark';
import { BookActionButton } from '../components/BookActionLink';
import { ClinicalTrustStrip } from '../components/ClinicalTrustStrip';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const DoctorProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, isRTL, t, localizedConfig, doctors, departments, services, library } =
    useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const [activePartnershipStep, setActivePartnershipStep] = useState<number>(0);

  const doctor = doctors.find((d) => d.slug === slug || d.id === slug);

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'الملف غير موجود' : 'Doctor profile not found'}
        </h1>
        <Link
          to="/doctors"
          className="btn-interactive inline-flex px-5 py-2.5 rounded-xl bg-[#0F4C5C] text-white text-sm font-semibold"
        >
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

  const partnershipSteps =
    lang === 'ar'
      ? [
          {
            num: '01',
            title: 'تقييم الحالة والتاريخ المرضي',
            tip: 'يستمع الاستشاري لتفاصيل الألم، مدة الأعراض، والعلاجات السابقة لوضع صورة سريرية دقيقة.',
          },
          {
            num: '02',
            title: 'مراجعة الفحوصات وتفسير MRI',
            tip: 'تُعرض مقاطع الرنين المغناطيسي مع شرح واضح لموقع الضغط العصبي أو الغضروف للمريض.',
          },
          {
            num: '03',
            title: 'مناقشة الخطة العلاجية المناسبة',
            tip: 'نبدأ بالحلول التحفظية غير الجراحية أولاً، ولا نلجأ للجراحة إلا عند الضرورة القصوى.',
          },
        ]
      : [
          {
            num: '01',
            title: 'Symptom & History Assessment',
            tip: 'Thorough neurological evaluation of pain patterns, duration, and prior therapies.',
          },
          {
            num: '02',
            title: 'MRI & Diagnostic Review',
            tip: 'Side-by-side visual walkthrough of spine/brain MRI slices in plain language.',
          },
          {
            num: '03',
            title: 'Shared Treatment Plan',
            tip: 'Conservative non-surgical therapy first; minimally invasive surgery only when truly indicated.',
          },
        ];

  const focusBadgeColors = [
    'from-[#0F4C5C] to-[#0284C7]',
    'from-[#0284C7] to-indigo-600',
    'from-emerald-600 to-teal-600',
    'from-amber-600 to-[#0F4C5C]',
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-10">
        <div>
          <Breadcrumbs
            items={[
              { label: t('nav.doctors'), to: '/doctors' },
              { label: doctor.nameAr },
            ]}
          />

          {/* Framed Hero Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="rounded-3xl p-[1.5px] bg-gradient-to-br from-[#0F4C5C]/30 via-[#0284C7]/35 to-emerald-400/30 shadow-sm"
          >
            <div className="relative overflow-hidden rounded-[22.5px] bg-white p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Subtle Architectural Grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #0F4C5C 1px, transparent 1px), linear-gradient(to bottom, #0F4C5C 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                }}
              />

              {/* Portrait Column */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.48, delay: 0.06, ease: EASE_OUT_EXPO }}
                className="relative lg:col-span-4 flex flex-col items-center gap-3"
              >
                <div className="group w-full max-w-sm rounded-2xl p-[2px] bg-gradient-to-br from-[#0F4C5C]/35 via-[#0284C7]/40 to-emerald-400/35 shadow-sm">
                  <div className="rounded-[14px] overflow-hidden bg-white">
                    <DoctorPortraitFrame
                      imageUrl={doctor.imageUrl}
                      name={doctor.nameAr}
                      placeholderNote={doctor.imagePlaceholderNote}
                      size="lg"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 text-center">
                  {lang === 'ar'
                    ? 'إشراف سريري مباشر · مركز نوديسك كلينك'
                    : 'Direct Clinical Supervision · NODISC Clinic'}
                </p>
              </motion.div>

              {/* Editorial Details Column */}
              <div className="relative lg:col-span-8 space-y-6">
                <div className="space-y-2">
                  {dept && (
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <Link
                        to={`/departments/${dept.slug}`}
                        className="text-[#0284C7] hover:underline"
                      >
                        {dept.nameAr}
                      </Link>
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                      <span className="text-slate-500 font-medium" dir="ltr">
                        {dept.nameEn}
                      </span>
                    </div>
                  )}

                  <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 leading-tight">
                    {doctor.nameAr}
                  </h1>
                  <p className="text-sm text-slate-500" dir="ltr">
                    {doctor.nameEn}
                  </p>
                  <p className="text-base font-bold text-[#0F4C5C] pt-1">{doctor.roleTitle}</p>
                </div>

                <p className="text-base text-slate-700 leading-relaxed">{doctor.bio}</p>

                {/* Clinical Approach Reassurance Callout */}
                <div className="rounded-xl bg-gradient-to-r from-[#0F4C5C]/8 via-sky-50 to-emerald-50/60 border border-[#0F4C5C]/20 px-4 py-3 flex items-start gap-2.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#0284C7] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-semibold text-[#0F4C5C] leading-relaxed">
                    {lang === 'ar'
                      ? 'نهجنا الطبي: نبدأ باستنفاد جميع حلول العلاج التحفظي والتأهيل غير الجراحي، ونقصر التدخل الجراحي الميكروسكوبي على الحالات التي تستدعي ذلك فقط.'
                      : 'Our Approach: We exhaust non-surgical conservative and rehab options first, reserving microsurgical intervention strictly for clearly indicated cases.'}
                  </p>
                </div>

                {/* Primary CTA Row */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <BookActionButton
                    departmentId={doctor.departmentId}
                    doctorId={doctor.id}
                    sourceLabel={doctor.nameAr}
                    className="btn-interactive btn-sheen inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] hover:from-[#093542] hover:to-[#0369A1] text-white border border-sky-300/40 text-sm font-bold shadow-[0_8px_20px_-6px_rgba(15,76,92,0.5)] whitespace-nowrap"
                  >
                    <Calendar className="w-4 h-4 text-[#7DD3FC]" />
                    <span>{t('common.bookNow')}</span>
                  </BookActionButton>

                  {localizedConfig.contact.whatsappUrl && (
                    <a
                      href={`${localizedConfig.contact.whatsappUrl}?text=${encodeURIComponent(
                        lang === 'ar'
                          ? `مرحبًا، أود حجز استشارة طبية مع ${doctor.nameAr}.`
                          : `Hello, I would like to book a consultation with ${doctor.nameEn}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-emerald-500/45 bg-emerald-50/75 hover:bg-emerald-100/80 hover:border-emerald-600 text-emerald-900 text-sm font-bold whitespace-nowrap shadow-2xs"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-700" />
                      <span>{t('common.whatsapp')}</span>
                    </a>
                  )}

                  {dept && (
                    <Link
                      to={`/departments/${dept.slug}`}
                      className="btn-interactive inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] hover:bg-sky-50/70 text-[#0F4C5C] text-sm font-bold whitespace-nowrap"
                    >
                      <span>{dept.nameAr}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                {/* Interactive Clinical Trust Strip */}
                <ClinicalTrustStrip compact />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive 3-Step Patient Partnership Track */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="rounded-2xl p-[1.5px] bg-gradient-to-r from-[#0F4C5C]/30 via-[#0284C7]/45 to-emerald-400/40 shadow-xs"
        >
          <div className="rounded-[14.5px] bg-gradient-to-br from-sky-50/85 via-white to-emerald-50/40 p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-[#0284C7] text-white inline-flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="font-display font-bold text-base sm:text-lg text-slate-900">
                    {lang === 'ar'
                      ? 'المريض شريك في القرار العلاجي — مراحل الاستشارة مع الدكتور'
                      : 'Patient-Partnered Care — Your Consultation Track'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === 'ar'
                      ? 'اضغط على أي خطوة لمعرفة تفاصيل الفحص واتخاذ القرار الطبي المشترك'
                      : 'Select any step to see how your clinical assessment and treatment plan unfold'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              {partnershipSteps.map((step, idx) => {
                const isSelected = activePartnershipStep === idx;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => setActivePartnershipStep(idx)}
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
                      {step.num}
                    </span>
                    <span className="font-bold leading-snug">{step.title}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activePartnershipStep}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                className="rounded-xl bg-white/95 border border-sky-200/80 px-4 py-3 text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4.5 h-4.5 text-[#0284C7] shrink-0 mt-0.5" />
                <span>{partnershipSteps[activePartnershipStep]?.tip}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Qualifications, Experience, Interactive Focus Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Qualifications Card */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0, ease: EASE_OUT_EXPO }}
            className="rounded-2xl p-[1.5px] bg-gradient-to-br from-emerald-300/70 via-teal-200/60 to-slate-200/80 shadow-xs"
          >
            <div className="relative h-full rounded-[14.5px] bg-gradient-to-br from-emerald-50/45 via-white to-white p-6 space-y-4">
              <span
                aria-hidden="true"
                className="absolute top-0 inset-x-6 h-[3px] rounded-b-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500"
              />
              <div className="flex items-center gap-3 pt-1">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white inline-flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </span>
                <h2 className="font-display font-bold text-lg text-slate-900">
                  {t('doctorPage.qualifications')}
                </h2>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                {doctor.qualifications.map((q, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white/90 border border-emerald-100 hover:border-emerald-300 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Experiences Card */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0.06, ease: EASE_OUT_EXPO }}
            className="rounded-2xl p-[1.5px] bg-gradient-to-br from-sky-300/75 via-cyan-200/60 to-indigo-200/75 shadow-xs"
          >
            <div className="relative h-full rounded-[14.5px] bg-gradient-to-br from-sky-50/50 via-white to-white p-6 space-y-4">
              <span
                aria-hidden="true"
                className="absolute top-0 inset-x-6 h-[3px] rounded-b-full bg-gradient-to-r from-[#0284C7] via-sky-400 to-indigo-500"
              />
              <div className="flex items-center gap-3 pt-1">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0284C7] to-indigo-600 text-white inline-flex items-center justify-center shrink-0 shadow-xs">
                  <Stethoscope className="w-5 h-5" />
                </span>
                <h2 className="font-display font-bold text-lg text-slate-900">
                  {t('doctorPage.experiences')}
                </h2>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed">
                {doctor.experiences.map((ex, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white/90 border border-sky-100 hover:border-[#0284C7]/45 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-md bg-sky-100 text-[#0284C7] font-mono text-[11px] font-bold tabular-nums inline-flex items-center justify-center shrink-0 mt-0.5">
                      0{i + 1}
                    </span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Interactive Focus Areas Card */}
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, delay: 0.12, ease: EASE_OUT_EXPO }}
            className="rounded-2xl p-[1.5px] bg-gradient-to-br from-[#0F4C5C]/35 via-sky-200/75 to-amber-200/75 shadow-xs"
          >
            <div className="relative h-full rounded-[14.5px] bg-gradient-to-br from-[#F0F9FF]/60 via-white to-amber-50/35 p-6 space-y-4">
              <span
                aria-hidden="true"
                className="absolute top-0 inset-x-6 h-[3px] rounded-b-full bg-gradient-to-r from-[#0F4C5C] via-cyan-500 to-amber-500"
              />
              <div className="flex items-center gap-3 pt-1">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C5C] to-amber-600 text-white inline-flex items-center justify-center shrink-0 shadow-xs">
                  <Activity className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    {t('doctorPage.focusAreas')}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'ar' ? 'اضغط على المجال لبدء الحجز' : 'Tap any area to book'}
                  </p>
                </div>
              </div>
              <div className="space-y-2.5">
                {doctor.focusAreas.map((area, i) => (
                  <BookActionButton
                    key={i}
                    departmentId={doctor.departmentId}
                    doctorId={doctor.id}
                    sourceLabel={area}
                    className="btn-interactive group w-full text-start p-3 rounded-xl bg-white border border-slate-200/90 hover:border-[#0284C7] hover:bg-sky-50/60 flex items-center justify-between gap-2.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-lg bg-gradient-to-br ${
                          focusBadgeColors[i % focusBadgeColors.length]
                        } text-white font-mono text-[11px] font-bold tabular-nums inline-flex items-center justify-center shrink-0`}
                      >
                        0{i + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 group-hover:text-[#0F4C5C] leading-snug">
                        {area}
                      </span>
                    </div>
                    <ArrowIcon className="w-4 h-4 text-slate-400 group-hover:text-[#0284C7] shrink-0 transition-transform group-hover:-translate-x-0.5" />
                  </BookActionButton>
                ))}
              </div>
            </div>
          </motion.section>
        </div>

        {/* Linked Services */}
        {linkedServices.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-2xl text-slate-900">
                  {t('doctorPage.linkedServices')}
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
                <span>{t('common.viewAll')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {linkedServices.map((srv, idx) => (
                <motion.div
                  key={srv.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: EASE_OUT_EXPO }}
                  className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 hover:border-[#0284C7]/50 hover:shadow-md p-5 flex flex-col justify-between space-y-4 transition-all"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 inset-x-5 h-[3px] rounded-b-full bg-gradient-to-r from-[#0F4C5C] via-[#0284C7] to-[#38BDF8] opacity-75 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="pt-1">
                    <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#0F4C5C] transition-colors">
                      <Link to={`/services/${srv.slug}`}>{srv.title}</Link>
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {srv.shortDesc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <Link
                      to={`/services/${srv.slug}`}
                      className="text-xs font-bold text-[#0F4C5C] hover:text-[#0284C7] inline-flex items-center gap-1"
                    >
                      <span>{t('common.readMore')}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                    <BookActionButton
                      departmentId={srv.departmentId}
                      serviceId={srv.id}
                      doctorId={doctor.id}
                      sourceLabel={srv.title}
                      className="btn-interactive btn-sheen text-xs font-bold px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white shadow-2xs"
                    >
                      {t('common.bookService')}
                    </BookActionButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Linked Library Materials */}
        {linkedLibrary.length > 0 && (
          <section className="space-y-5">
            <div>
              <h2 className="font-display font-bold text-2xl text-slate-900">
                {t('doctorPage.linkedLibrary')}
              </h2>
              <div aria-hidden="true" className="flex items-center gap-1.5 mt-2">
                <span className="h-[3px] w-10 rounded-full bg-gradient-to-r from-[#0284C7] to-emerald-400" />
                <span className="w-1.5 h-1.5 rotate-45 rounded-[1px] bg-[#0F4C5C]" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {linkedLibrary.map((item) => (
                <Link
                  key={item.id}
                  to={`/library/${item.slug}`}
                  className="btn-interactive group bg-white rounded-2xl border border-slate-200 hover:border-[#0284C7]/55 hover:shadow-md p-5 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7]">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{item.typeLabel}</span>
                    </span>
                    <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#0F4C5C] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F4C5C]">
                    <span>{t('common.readMore')}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </MotionConfig>
  );
};
