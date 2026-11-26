import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface TrustItem {
  id: string;
  metric: string;
  title: string;
  subtitle: string;
  detail: string;
  ctaLabel: string;
  ctaTo: string;
  icon: React.ComponentType<{ className?: string }>;
  accentBar: string;
  frameGradient: string;
  surfaceTint: string;
  activeBorder: string;
  badgeBg: string;
  metricColor: string;
  ctaBg: string;
}

export const ClinicalTrustStrip: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { lang, isRTL } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(null);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const items: TrustItem[] = [
    {
      id: 'conservative',
      metric: '+85%',
      title: lang === 'ar' ? 'شفاء تحفظي بدون جراحة' : 'Non-Surgical Recovery',
      subtitle: lang === 'ar' ? 'العلاج التحفظي والتأهيل' : 'Conservative & Rehab Care',
      detail:
        lang === 'ar'
          ? 'أكثر من 85% من حالات آلام الظهر والانزلاق الغضروفي تستجيب بنجاح للعلاج الدوائي الموجه، الحقن التداخلية، وبرامج التأهيل الطبيعي دون الحاجة لتدخل جراحي.'
          : 'Over 85% of spine disc herniation and back pain cases recover successfully through targeted medical care, interventional pain therapy, and structured rehabilitation without surgery.',
      ctaLabel: lang === 'ar' ? 'تقييم حالتك أولاً' : 'Evaluate Your Case',
      ctaTo: '/book',
      icon: Activity,
      accentBar: 'from-emerald-500 via-teal-400 to-cyan-500',
      frameGradient: 'from-emerald-200/80 via-teal-100/70 to-emerald-100/80',
      surfaceTint: 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/70',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/25 shadow-[0_12px_28px_-10px_rgba(16,185,129,0.38)]',
      badgeBg: 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-sm',
      metricColor: 'text-emerald-700',
      ctaBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
      id: 'success',
      metric: '+4,500',
      title: lang === 'ar' ? 'حالة وعملية بنجاح +98%' : 'Cases (>98% Safety)',
      subtitle: lang === 'ar' ? 'توثيق سريري ومجهر دقيق' : 'Microsurgical Precision',
      detail:
        lang === 'ar'
          ? 'خبرة ممتدة في التعامل مع أدق حالات المخ والأعصاب والعمود الفقري باستخدام الجراحة الميكروسكوبية ومراقبة الأعصاب الحية لتحقيق أعلى معدلات الأمان.'
          : 'Extensive hands-on experience across complex brain and spine procedures utilizing microsurgical magnification and intraoperative neuromonitoring for >98% safety.',
      ctaLabel: lang === 'ar' ? 'استعراض خدمات العيادة' : 'Explore Services',
      ctaTo: '/services',
      icon: Award,
      accentBar: 'from-[#0284C7] via-sky-400 to-indigo-500',
      frameGradient: 'from-sky-200/90 via-cyan-100/70 to-indigo-100/80',
      surfaceTint: 'bg-gradient-to-br from-sky-50/95 via-white to-indigo-50/60',
      activeBorder: 'border-[#0284C7] ring-2 ring-[#0284C7]/25 shadow-[0_12px_28px_-10px_rgba(2,132,199,0.38)]',
      badgeBg: 'bg-gradient-to-br from-[#0284C7] to-indigo-600 text-white shadow-sm',
      metricColor: 'text-[#0284C7]',
      ctaBg: 'bg-[#0284C7] hover:bg-sky-700 text-white',
    },
    {
      id: 'standards',
      metric: lang === 'ar' ? '+15 عامًا' : '+15 Yrs',
      title: lang === 'ar' ? 'معايير Mayo Clinic السريرية' : 'Mayo Clinic Standards',
      subtitle: lang === 'ar' ? 'بإشراف د. محمد الجرباني' : 'Led by Dr. Al-Jurbani',
      detail:
        lang === 'ar'
          ? 'تطبيق أحدث البروتوكولات التشخيصية العالمية وقراءة أشعة الرنين المغناطيسي بدقة عالية لاتخاذ قرار علاجي مشترك وواضح مع المريض.'
          : 'Applying international diagnostic protocols and meticulous MRI interpretation to deliver transparent, evidence-based shared treatment decisions.',
      ctaLabel: lang === 'ar' ? 'السيرة المهنية للاستشاري' : 'Consultant Profile',
      ctaTo: '/doctors',
      icon: Stethoscope,
      accentBar: 'from-[#0F4C5C] via-cyan-500 to-amber-500',
      frameGradient: 'from-[#0F4C5C]/25 via-sky-100/80 to-amber-200/75',
      surfaceTint: 'bg-gradient-to-br from-[#F0F9FF] via-white to-amber-50/65',
      activeBorder: 'border-[#0F4C5C] ring-2 ring-[#0F4C5C]/25 shadow-[0_12px_28px_-10px_rgba(15,76,92,0.38)]',
      badgeBg: 'bg-gradient-to-br from-[#0F4C5C] to-amber-600 text-white shadow-sm',
      metricColor: 'text-[#0F4C5C]',
      ctaBg: 'bg-[#0F4C5C] hover:bg-[#093542] text-white',
    },
  ];

  const activeItem = items.find((i) => i.id === activeId) || null;

  return (
    <div className={compact ? 'space-y-2.5' : 'space-y-3 pt-3 border-t border-slate-200/80'}>
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1.5 text-[#0F4C5C]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>
            {lang === 'ar'
              ? 'مؤشرات الثقة والاعتماد الطبي (اضغط لعرض التفاصيل)'
              : 'Clinical Trust Pillars (Tap to inspect details)'}
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActiveId(isActive ? null : item.id)}
              aria-expanded={isActive}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.38, delay: idx * 0.07, ease: EASE_OUT_EXPO }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className={`group relative overflow-hidden rounded-2xl p-[1.5px] text-start transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4C5C] ${
                isActive
                  ? 'bg-gradient-to-br ' + item.accentBar
                  : 'bg-gradient-to-br ' + item.frameGradient + ' hover:shadow-md'
              }`}
            >
              <div
                className={`relative h-full rounded-[14.5px] ${item.surfaceTint} p-3.5 flex flex-col justify-between gap-2.5 transition-all duration-200 btn-sheen ${
                  isActive ? item.activeBorder : 'border border-white/70'
                }`}
              >
                {/* Top Accent Bar */}
                <span
                  aria-hidden="true"
                  className={`absolute top-0 inset-x-4 h-[3px] rounded-b-full bg-gradient-to-r ${item.accentBar} opacity-85 group-hover:opacity-100 transition-opacity`}
                />

                <div className="flex items-start justify-between gap-2 pt-1">
                  <div className="space-y-0.5 min-w-0">
                    <span
                      className={`font-mono text-base sm:text-lg font-extrabold block tabular-nums tracking-tight ${item.metricColor}`}
                    >
                      {item.metric}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 block truncate">
                      {item.subtitle}
                    </span>
                  </div>

                  <span
                    className={`w-9 h-9 rounded-xl ${item.badgeBg} inline-flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/70">
                  <span className="text-xs font-bold text-slate-900 leading-snug">
                    {item.title}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                      item.metricColor
                    } ${isActive ? 'rotate-180' : 'opacity-70 group-hover:opacity-100'}`}
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Interactive Expanded Detail Box on Click */}
      <AnimatePresence mode="wait">
        {activeItem && (
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
            className={`rounded-2xl p-[1.5px] bg-gradient-to-r ${activeItem.accentBar} shadow-md`}
          >
            <div className="rounded-[14.5px] bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <span
                  className={`w-10 h-10 rounded-xl ${activeItem.badgeBg} inline-flex items-center justify-center shrink-0 mt-0.5`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-mono text-sm font-extrabold ${activeItem.metricColor}`}>
                      {activeItem.metric}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{activeItem.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeItem.detail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={activeItem.ctaTo}
                  className={`btn-interactive btn-sheen inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs whitespace-nowrap ${activeItem.ctaBg}`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activeItem.ctaLabel}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
