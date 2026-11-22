import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';
import { useLanguage } from '../context/LanguageContext';
import { useClinic } from '../context/ClinicContext';
import { ClinicLogoMark } from './ClinicLogoMark';

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

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t('footer.legalNote')}</p>
          <p dir="ltr">© 2026 {localizedConfig.brand.nameEn}</p>
        </div>
      </div>
    </footer>
  );
};
