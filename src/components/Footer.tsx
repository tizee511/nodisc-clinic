import React from 'react';
import { Link } from 'react-router-dom';
import { Banknote, ExternalLink, Mail, Phone, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { useLanguage } from '../context/LanguageContext';
import { useClinic } from '../context/ClinicContext';
import { ClinicLogoMark } from './ClinicLogoMark';
import { getShortWalletLabel, WalletBrandIcon } from './PaymentMethodIcons';

export const Footer: React.FC = () => {
  const { lang, setLang, t, localizedConfig, departments } = useLanguage();
  const { currencyCode, setCurrencyCode } = useClinic();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Summary & Settings */}
          <div className="space-y-4">
            <div className="inline-block bg-white px-3 py-2 rounded-lg">
              <ClinicLogoMark compact />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {localizedConfig.brand.shortAbout}
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              {localizedConfig.contact.phones[0] && (
                <a
                  href={`tel:${localizedConfig.contact.phones[0].value.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 hover:text-sky-300 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="font-mono tabular-nums" dir="ltr">
                    {localizedConfig.contact.phones[0].value}
                  </span>
                </a>
              )}
              <a
                href={`mailto:${localizedConfig.contact.email}`}
                className="flex items-center gap-2 hover:text-sky-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="font-mono" dir="ltr">
                  {localizedConfig.contact.email}
                </span>
              </a>
            </div>
            {(localizedConfig.contact.whatsappUrl || localizedConfig.contact.socialLinks) && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {localizedConfig.contact.whatsappUrl && (
                  <a
                    href={localizedConfig.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-900/50 hover:bg-emerald-800/70 border border-emerald-700/60 text-emerald-200 transition-colors"
                  >
                    <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {localizedConfig.contact.socialLinks?.facebook && (
                  <a
                    href={localizedConfig.contact.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
                  >
                    <span>Facebook</span>
                  </a>
                )}
                {localizedConfig.contact.socialLinks?.instagram && (
                  <a
                    href={localizedConfig.contact.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
                  >
                    <span>Instagram</span>
                  </a>
                )}
                {localizedConfig.contact.socialLinks?.youtube && (
                  <a
                    href={localizedConfig.contact.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
                  >
                    <span>YouTube</span>
                  </a>
                )}
              </div>
            )}
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <label htmlFor="footer-currency" className="text-slate-400">
                  {t('common.currencyLabel')}:
                </label>
                <select
                  id="footer-currency"
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                >
                  {Object.entries(siteConfig.currency.exchangeRatesFromYER).map(([code, info]) => (
                    <option key={code} value={code}>
                      {info.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">{t('nav.languageLabel')}:</span>
                <button
                  type="button"
                  onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded px-2.5 py-1 text-xs text-white transition-colors"
                >
                  {lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
                </button>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div>
            <h3 className="font-display font-bold text-white text-sm mb-4">
              {t('footer.departmentsTitle')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {departments.map((dept) => (
                <li key={dept.id}>
                  <Link
                    to={`/departments/${dept.slug}`}
                    className="hover:text-sky-300 transition-colors"
                  >
                    {dept.nameAr}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="hover:text-sky-300 transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-white text-sm mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-sky-300 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-sky-300 transition-colors">
                  {t('nav.doctors')}
                </Link>
              </li>
              <li>
                <Link to="/library" className="hover:text-sky-300 transition-colors">
                  {t('nav.library')}
                </Link>
              </li>
              <li>
                <Link to="/stories" className="hover:text-sky-300 transition-colors">
                  {t('nav.stories')}
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-sky-300 transition-colors">
                  {t('nav.news')}
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-sky-300 transition-colors">
                  {t('nav.campaigns')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Store */}
          <div>
            <h3 className="font-display font-bold text-white text-sm mb-4">
              {t('footer.supportTitle')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/book" className="hover:text-sky-300 transition-colors">
                  {t('nav.bookAppointment')}
                </Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-sky-300 transition-colors">
                  {t('nav.store')}
                </Link>
              </li>
              <li>
                <Link to="/store/offers" className="hover:text-sky-300 transition-colors">
                  {t('nav.offers')}
                </Link>
              </li>
              <li>
                <Link to="/store/prescription" className="hover:text-sky-300 transition-colors">
                  {t('nav.prescriptionOrder')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sky-300 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/complaints" className="hover:text-sky-300 transition-colors">
                  {t('nav.complaints')}
                </Link>
              </li>
                {localizedConfig.features.showCareersPage && (
                <li>
                  <Link to="/careers" className="hover:text-sky-300 transition-colors">
                    {t('nav.careers')}
                  </Link>
                </li>
              )}
              {localizedConfig.features.showSurveyPage && (
                <li>
                  <Link to="/survey" className="hover:text-sky-300 transition-colors">
                    {t('nav.survey')}
                  </Link>
                </li>
              )}
              <li>
                <Link to="/admin" className="text-sky-300 hover:text-white font-semibold transition-colors">
                  {lang === 'ar' ? 'لوحة الإدارة التجريبية' : 'Admin Control Panel'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Electronic Payment Methods Strip */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium shrink-0">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              {lang === 'ar' ? 'وسائل الدفع الإلكتروني المعتمدة:' : 'Accepted Electronic Payments:'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {localizedConfig.payment.ePaymentNetworks.map((net) => (
              <div
                key={net.id}
                title={`${net.name} — ${net.accountHint}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/75 border border-slate-700/80 text-xs text-slate-100"
              >
                <WalletBrandIcon id={net.id} size="sm" logoUrl={net.logoUrl} name={net.name} />
                <span className="font-medium whitespace-nowrap">
                  {getShortWalletLabel(net.id, lang, net.name)}
                </span>
              </div>
            ))}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300">
              <span
                className="w-7 h-7 rounded-lg bg-slate-700/70 border border-slate-600/80 text-slate-200 inline-flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <Banknote className="w-3.5 h-3.5" />
              </span>
              <span className="font-medium whitespace-nowrap">
                {lang === 'ar' ? 'نقدًا عند الاستلام' : 'Cash on Delivery'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t('footer.legalNote')}</p>
          <p dir="ltr">© 2026 {localizedConfig.brand.nameEn}</p>
        </div>
      </div>
    </footer>
  );
};
