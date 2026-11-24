import React from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AdminImageFieldProps {
  label: string;
  value: string | null | undefined;
  onChange: (nextUrl: string) => void;
  onClear?: () => void;
  presets?: { label: string; url: string }[];
  allowUrlInput?: boolean;
  helperText?: string;
}

export const AdminImageField: React.FC<AdminImageFieldProps> = ({
  label,
  value,
  onChange,
  onClear,
  presets,
  allowUrlInput = true,
  helperText,
}) => {
  const { lang } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-slate-700 text-xs">{label}</span>
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-medium text-red-600 hover:underline inline-flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>{lang === 'ar' ? 'إزالة الصورة' : 'Remove'}</span>
          </button>
        )}
      </div>

      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-300" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#0F4C5C]/50 bg-white hover:bg-sky-50 text-xs font-semibold text-[#0F4C5C] cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'ar' ? 'رفع صورة من الجهاز' : 'Upload from device'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          {presets && presets.length > 0 && (
            <select
              value={presets.some((p) => p.url === value) ? value || '' : '__custom__'}
              onChange={(e) => {
                if (e.target.value !== '__custom__') {
                  onChange(e.target.value);
                }
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
            >
              {presets.map((p) => (
                <option key={p.url} value={p.url}>
                  {p.label}
                </option>
              ))}
              {value && !presets.some((p) => p.url === value) && (
                <option value="__custom__">
                  {lang === 'ar' ? 'صورة مخصصة / مرفوعة' : 'Custom / Uploaded Image'}
                </option>
              )}
            </select>
          )}

          {allowUrlInput && (
            <input
              type="text"
              dir="ltr"
              value={value && !value.startsWith('data:') ? value : ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={
                value?.startsWith('data:')
                  ? lang === 'ar'
                    ? 'تم إرفاق صورة من الجهاز ✓ (أو الصق رابطاً بديلاً)'
                    : 'Local image attached ✓ (or paste URL)'
                  : 'https://... or /src/assets/images/...'
              }
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] bg-white font-mono"
            />
          )}

          {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
        </div>
      </div>
    </div>
  );
};
