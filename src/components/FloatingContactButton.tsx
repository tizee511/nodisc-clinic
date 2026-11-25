import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, FileUp, MessageSquare, Phone, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FloatingContactButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { lang, localizedConfig, t } = useLanguage();
  const isStoreRoute = pathname.startsWith('/store');

  if (!localizedConfig.features.showFloatingContactButton) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-4 end-3 sm:end-4 z-30">
      {open && (
        <div
          className="mb-3 w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-4 space-y-3"
          role="dialog"
          aria-label={lang === 'ar' ? 'خيارات التواصل السريع' : 'Quick Contact Options'}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-display font-bold text-sm text-slate-900">
              {isStoreRoute
                ? lang === 'ar'
                  ? 'خدمة عملاء المتجر والصيدلية'
                  : 'Store & Pharmacy Support'
                : lang === 'ar'
                ? 'التواصل السريع — نوديسك كلينك'
                : 'Quick Contact — NODISC Clinic'}
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('common.cancel')}
              className="p-1 rounded text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <a
              href={`tel:${localizedConfig.contact.phones[0].value.replace(/\s+/g, '')}`}
              className="block p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors"
            >
              <span className="text-slate-500 block">{localizedConfig.contact.phones[0].label}</span>
              <span className="font-mono font-semibold text-slate-900 block mt-0.5 tabular-nums" dir="ltr">
                {localizedConfig.contact.phones[0].value}
              </span>
            </a>

            {localizedConfig.contact.whatsappUrl ? (
              <a
                href={localizedConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 rounded-lg bg-emerald-50/75 hover:bg-emerald-50 border border-emerald-200/80 transition-colors"
              >
                <span className="text-emerald-900 font-semibold block">
                  {lang === 'ar' ? 'محادثة واتساب المباشرة' : 'Direct Clinic WhatsApp'}
                </span>
                <span className="font-mono font-semibold text-emerald-800 block mt-0.5 tabular-nums" dir="ltr">
                  {localizedConfig.contact.whatsappDisplay}
                </span>
              </a>
            ) : (
              <div className="p-2.5 rounded-lg bg-sky-50/70 border border-sky-100">
                <span className="text-[#0F4C5C] font-medium block">
                  {lang === 'ar' ? 'واتساب المركز (حالة توضيحية)' : 'Clinic WhatsApp (Demo State)'}
                </span>
                <span className="font-mono text-slate-700 block mt-0.5" dir="ltr">
                  {localizedConfig.contact.whatsappDisplay}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  {lang === 'ar'
                    ? 'سيتم تفعيل الرابط المباشر عند تزويدنا برقم واتساب المركز الرسمي.'
                    : 'Direct link activates once the official WhatsApp number is provided.'}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {isStoreRoute ? (
              <Link
                to="/store/prescription"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold hover:bg-[#093542]"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>{t('nav.prescriptionOrder')}</span>
              </Link>
            ) : (
              <Link
                to="/book"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold hover:bg-[#093542]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('nav.bookAppointment')}</span>
              </Link>
            )}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('nav.contact')}</span>
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={lang === 'ar' ? 'التواصل السريع' : 'Quick Contact'}
        className="h-12 px-4 rounded-full bg-[#0F4C5C] hover:bg-[#093542] text-white shadow-lg inline-flex items-center gap-2 text-sm font-semibold transition-transform hover:-translate-y-0.5"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">{t('nav.contact')}</span>
      </button>
    </div>
  );
};
