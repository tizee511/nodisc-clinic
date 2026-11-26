import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Megaphone, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ClinicAnnouncementBar: React.FC = () => {
  const { lang } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-[#05222B] via-[#093542] to-[#0F4C5C] text-white border-b border-sky-400/25 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-sky-400/25 to-cyan-300/15 border border-sky-300/35 text-[#7DD3FC] font-bold shrink-0 shadow-xs">
            <Megaphone className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تنويه العيادة' : 'Clinic Notice'}</span>
          </span>
          <p className="text-slate-100 truncate sm:whitespace-normal leading-snug">
            {lang === 'ar'
              ? 'يتواجد د. محمد عبدالله الجرباني في مركز ابن سيناء الطبي بصنعاء خلال الفترتين الصباحية والمسائية — يُفضل حجز الموعد مسبقًا لتقليل وقت الانتظار.'
              : 'Dr. Mohammed Al-Jurbani sees patients at Ibn Sina Medical Center, Sana’a (morning & evening). Advance booking is recommended to reduce wait times.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/book"
            className="btn-interactive btn-sheen btn-sheen-auto inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#38BDF8] to-[#0284C7] hover:from-[#7DD3FC] hover:to-[#0EA5E9] text-[#05222B] border border-sky-200/70 font-extrabold shadow-[0_4px_14px_-4px_rgba(56,189,248,0.65)] whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'حجز موعد' : 'Book Now'}</span>
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label={lang === 'ar' ? 'إغلاق التنويه' : 'Dismiss notice'}
            className="btn-interactive p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-sky-200 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
