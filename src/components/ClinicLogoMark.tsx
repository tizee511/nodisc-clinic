import React from 'react';
import { Stethoscope } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ClinicLogoMark: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { localizedConfig, lang } = useLanguage();

  if (localizedConfig.brand.logoUrl) {
    return (
      <span className="inline-flex items-center gap-2.5 shrink-0">
        <img
          src={localizedConfig.brand.logoUrl}
          alt={localizedConfig.brand.nameAr}
          referrerPolicy="no-referrer"
          className="h-9 w-9 rounded-lg object-contain bg-white border border-slate-200/80 p-0.5 shrink-0"
        />
        <span className="flex flex-col leading-tight">
          <span className="font-display font-bold text-base sm:text-lg text-slate-900 whitespace-nowrap">
            {localizedConfig.brand.nameAr}
          </span>
          {!compact && (
            <span
              className="text-[11px] font-medium whitespace-nowrap"
              style={{ color: 'var(--color-petrol)' }}
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
    <span className="inline-flex items-center gap-2.5 shrink-0">
      <span
        className="w-9 h-9 rounded-lg text-white flex items-center justify-center shrink-0"
        style={{ backgroundColor: 'var(--color-petrol)' }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v18M7 7.5c2.5-1.5 7.5-1.5 10 0M7 12c2.5-1.5 7.5-1.5 10 0M7 16.5c2.5-1.5 7.5-1.5 10 0" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display font-bold text-base sm:text-lg text-slate-900 whitespace-nowrap">
          {localizedConfig.brand.nameAr}
        </span>
        {!compact && (
          <span
            className="text-[11px] font-medium whitespace-nowrap"
            style={{ color: 'var(--color-petrol)' }}
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
