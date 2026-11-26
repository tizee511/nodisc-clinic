import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const EmergencyRedFlagsSection: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { lang, isRTL } = useLanguage();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const redFlags =
    lang === 'ar'
      ? [
          {
            title: 'صداع مفاجئ شديد وعنيف (Thunderclap Headache)',
            desc: 'يوصف بأنه «أشد صداع في العمر»، خاصة إذا صاحبه قيء أو تصلب بالرقبة أو اضطراب في درجة الوعي، ويستدعي التوجه الفوري للطوارئ لاستبعاد نزيف تحت العنكبوتية.',
            actionNote: 'التصرف المطلوب: التوجه المباشر لأقرب قسم طوارئ لإجراء أشعة مقطعية عاجلة للدماغ.',
          },
          {
            title: 'ضعف مفاجئ في جانب واحد من الجسم أو الوجه',
            desc: 'صعوبة في التحدث أو اعوجاج زاوية الفم أو ثقل حاد باليد أو الساق يستدعي الفحص الطارئ لاستبعاد الجلطات الدماغية.',
            actionNote: 'التصرف المطلوب: عدم الانتظار — الساعات الذهبية الأولى حاسمة لإنقاذ الأنسجة العصبية.',
          },
          {
            title: 'متلازمة ذيل الفرس (احتباس البول وخدر الحوض)',
            desc: 'فقدان مفاجئ للتحكم بالبول أو الخروج، مصحوبًا بخدر بمنطقة الشرج أو ضعف متسارع بالقدمين؛ حالة طارئة تتطلب تدخلًا جراحيًا عاجلًا خلال ساعات.',
            actionNote: 'التصرف المطلوب: تواصل إسعافي فوري وإحضار أشعة الرنين المغناطيسي للفقرات القطنية.',
          },
          {
            title: 'نوبات صرع وتشنجات للمرة الأولى',
            desc: 'ظهور تشنج أو فقدان وعي لأول مرة لدى البالغين يستدعي تخطيط دماغ ورنين مغناطيسي لتحديد السبب المستبطن.',
            actionNote: 'التصرف المطلوب: التقييم العصبي الدقيق وتصوير الدماغ بالرنين المغناطيسي لدى الاستشاري.',
          },
        ]
      : [
          {
            title: 'Sudden Severe "Thunderclap" Headache',
            desc: 'Described as the worst headache of life—especially with vomiting, neck stiffness, or altered alertness—requiring immediate ER evaluation.',
            actionNote: 'Action required: Seek immediate ER care for urgent brain CT evaluation.',
          },
          {
            title: 'Sudden Weakness on One Side of the Face or Body',
            desc: 'Slurred speech, facial droop, or acute heaviness in an arm or leg requires emergency stroke evaluation.',
            actionNote: 'Action required: Act within the critical early hours for neurological preservation.',
          },
          {
            title: 'Cauda Equina Syndrome (Urinary Retention & Saddle Numbness)',
            desc: 'Sudden loss of bladder or bowel control with pelvic numbness or progressive foot weakness is a surgical emergency within hours.',
            actionNote: 'Action required: Urgent surgical assessment with lumbar spine MRI.',
          },
          {
            title: 'First-Time Seizure or Convulsion in Adults',
            desc: 'A new-onset seizure or unexplained loss of consciousness warrants prompt EEG and brain MRI evaluation.',
            actionNote: 'Action required: Schedule neurological consultation with EEG & Brain MRI.',
          },
        ];

  return (
    <div
      className={`rounded-2xl p-[1.5px] bg-gradient-to-br from-rose-300/80 via-amber-300/80 to-orange-200/80 shadow-[0_14px_34px_-16px_rgba(225,29,72,0.22)]`}
    >
      <div
        className={`rounded-[14.5px] bg-gradient-to-br from-amber-50/90 via-white to-rose-50/60 ${
          compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'
        } space-y-5`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/70 pb-4">
          <div className="flex items-start gap-3">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-sm inline-flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-bold text-rose-700 block">
                {lang === 'ar'
                  ? 'التوعية والإرشاد الصحي — د. محمد عبدالله الجرباني'
                  : 'Patient Safety Guide — Dr. Mohammed Al-Jurbani'}
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-0.5">
                {lang === 'ar'
                  ? 'علامات وأعراض إسعافية تستدعي التوجه الفوري للطوارئ'
                  : 'Emergency Red-Flag Symptoms Requiring Immediate ER Care'}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to="/book"
              className="btn-interactive btn-sheen inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] hover:from-[#093542] hover:to-[#0369A1] text-white text-xs font-bold shadow-[0_6px_16px_-6px_rgba(15,76,92,0.5)] whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'استشارة لمراجعة الأشعة' : 'Book MRI Review'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {redFlags.map((flag, i) => {
            const isSelected = selectedIdx === i;
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => setSelectedIdx(isSelected ? null : i)}
                aria-expanded={isSelected}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985 }}
                className={`group text-start rounded-2xl p-[1.5px] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
                  isSelected
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 shadow-md'
                    : 'bg-gradient-to-r from-amber-200/80 via-rose-200/60 to-amber-200/80 hover:from-rose-400 hover:to-amber-400'
                }`}
              >
                <div className="h-full rounded-[14.5px] bg-white p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-8 h-8 rounded-xl text-xs font-mono font-extrabold tabular-nums inline-flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                          isSelected
                            ? 'bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-xs'
                            : 'bg-rose-50 border border-rose-200 text-rose-700'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-amber-700 tabular-nums">
                            0{i + 1}.
                          </span>
                          <h4 className="font-display font-bold text-sm text-slate-900 group-hover:text-rose-700 transition-colors">
                            {flag.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{flag.desc}</p>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-rose-500 transition-transform duration-200 mt-1 ${
                        isSelected ? 'rotate-180' : 'opacity-65 group-hover:opacity-100'
                      }`}
                    />
                  </div>

                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2.5 mt-1 border-t border-rose-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-rose-800">{flag.actionNote}</span>
                          <Link
                            to="/contact"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>{lang === 'ar' ? 'أرقام التواصل' : 'Contact Desk'}</span>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500">
          {lang === 'ar'
            ? '* المواد التوعوية تهدف إلى الإرشاد الصحي العام ولا تغني بأي حال عن الفحص السريري المباشر أو التوجه لأقرب قسم طوارئ عند ظهور الأعراض الحرجة.'
            : '* Educational guidance does not replace direct clinical evaluation or emergency hospital care when acute red flags occur.'}
        </p>
      </div>
    </div>
  );
};
