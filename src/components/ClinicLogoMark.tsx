import React from 'react';
import { Stethoscope } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ClinicLogoMark: React.FC<{ compact?: boolean; tone?: 'light' | 'dark' }> = ({
  compact = false,
  tone = 'light',
}) => {
  const { localizedConfig } = useLanguage();
  const isDark = tone === 'dark';

  if (localizedConfig.brand.logoUrl) {
    return (
      <span className="inline-flex items-center gap-2 sm:gap-2.5 min-w-0">
        <img
          src={localizedConfig.brand.logoUrl}
          alt={localizedConfig.brand.nameAr}
          referrerPolicy="no-referrer"
          className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg object-contain bg-white p-0.5 shrink-0 ${
            isDark ? 'border border-white/25 shadow-xs' : 'border border-slate-200/80'
          }`}
        />
        <span className="flex flex-col leading-tight min-w-0">
          <span
            className={`font-display font-bold text-sm sm:text-lg truncate ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {localizedConfig.brand.nameAr}
          </span>
          {!compact && (
            <span
              className={`hidden min-[360px]:block text-[10px] sm:text-[11px] font-medium truncate ${
                isDark ? 'text-sky-300' : ''
              }`}
              style={isDark ? undefined : { color: 'var(--color-petrol)' }}
              dir="ltr"
            >
              {localizedConfig.brand.nameEn}
            </span>
          )}
        </span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5 min-w-0">
      <span
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${
          isDark
            ? 'bg-white/15 border border-sky-300/35 text-[#7DD3FC] shadow-xs'
            : 'text-white'
        }`}
        style={isDark ? undefined : { backgroundColor: 'var(--color-petrol)' }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18M7 7.5c2.5-1.5 7.5-1.5 10 0M7 12c2.5-1.5 7.5-1.5 10 0M7 16.5c2.5-1.5 7.5-1.5 10 0" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight min-w-0">
        <span
          className={`font-display font-bold text-sm sm:text-lg truncate ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {localizedConfig.brand.nameAr}
        </span>
        {!compact && (
          <span
            className={`hidden min-[360px]:block text-[10px] sm:text-[11px] font-medium truncate ${
              isDark ? 'text-sky-300' : ''
            }`}
            style={isDark ? undefined : { color: 'var(--color-petrol)' }}
            dir="ltr"
          >
            {localizedConfig.brand.nameEn}
          </span>
        )}
      </span>
    </span>
  );
};

interface DoctorPortraitFrameProps {
  imageUrl: string | null;
  name: string;
  placeholderNote: string;
  size?: 'md' | 'lg';
}

export const DoctorPortraitFrame: React.FC<DoctorPortraitFrameProps> = ({
  imageUrl,
  name,
  placeholderNote,
  size = 'md',
}) => {
  const { lang } = useLanguage();
  const [imgError, setImgError] = React.useState(false);
  const dimensions = size === 'lg' ? 'w-full aspect-[3/4] max-w-sm' : 'w-full aspect-[4/4]';

  if (imageUrl && !imgError) {
    return (
      <div className={`${dimensions} rounded-2xl overflow-hidden border border-slate-200 bg-slate-100`}>
        <img
          src={imageUrl}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className={`${dimensions} rounded-2xl border border-slate-200 bg-gradient-to-b from-sky-50/80 to-slate-100 flex flex-col items-center justify-center p-6 text-center`}
    >
      <div className="w-20 h-20 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#0F4C5C] mb-3 shadow-xs">
        <Stethoscope className="w-9 h-9" strokeWidth={1.5} />
      </div>
      <p className="font-display font-bold text-slate-900 text-base">{name}</p>
      <p className="text-xs text-slate-500 mt-1.5 max-w-[26ch] leading-relaxed">
        {placeholderNote}
      </p>
      <span className="mt-3 text-[11px] text-[#0F4C5C] font-medium">
        {lang === 'ar' ? 'حقل صورة قابل للاستبدال' : 'Replaceable portrait slot'}
      </span>
    </div>
  );
};
