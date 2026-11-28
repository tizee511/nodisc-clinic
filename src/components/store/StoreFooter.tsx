import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  ExternalLink,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { getShortWalletLabel, WalletBrandIcon } from '../PaymentMethodIcons';
import { StoreLogoBadge } from './StoreLogoMark';

export const StoreFooter: React.FC = () => {
  const { lang, isRTL, setLang, t, localizedConfig, storeMainSections } = useLanguage();
  const { currencyCode, setCurrencyCode } = useClinic();
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <footer className="bg-[#06222B] text-slate-300 border-t border-[#0F4C5C]/40 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Store Identity & Settings */}
          <div className="space-y-4">
            <Link
              to="/store"
              className="inline-flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl"
            >
              <StoreLogoBadge size="md" tone="light" />
              <span className="flex flex-col leading-tight min-w-0">
                <span className="font-display font-bold text-sm sm:text-base text-slate-900 whitespace-nowrap">
                  {lang === 'ar' ? 'متجر نوديسك' : 'NODISC Store'}
                </span>
                <span className="text-[10.5px] font-medium text-[#0F4C5C] whitespace-nowrap">
                  {lang === 'ar' ? 'صيدلية نوديسك' : 'NODISC Pharmacy'}
                </span>
              </span>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'متجر صيدلاني متخصص يوفر الدعامات الطبية، أجهزة العلاج الطبيعي، الفيتامينات والمكملات، ومستلزمات العناية بالبشرة والأم والطفل بإشراف صيدلاني موثوق.'
                : 'Dedicated pharmacy and medical store offering spine supports, physiotherapy devices, supplements, skincare, and mother & baby care.'}
            </p>

            <div className="flex items-start gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-sky-100/90 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
              <span>
                {lang === 'ar'
                  ? 'جميع المنتجات تخضع للمراجعة الصيدلانية ومعايير السلامة المعتمدة.'
                  : 'All store products undergo pharmacist verification and quality standards.'}
              </span>
            </div>

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
              {localizedConfig.contact.whatsappUrl && (
                <a
                  href={localizedConfig.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-1 rounded bg-emerald-900/50 hover:bg-emerald-800/70 border border-emerald-700/60 text-emerald-200 transition-colors"
                >
                  <span>{lang === 'ar' ? 'واتساب طلبات الصيدلية' : 'Pharmacy WhatsApp'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <label htmlFor="store-footer-currency" className="text-slate-400">
                  {t('common.currencyLabel')}:
                </label>
                <select
                  id="store-footer-currency"
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="bg-slate-900/80 border border-slate-700 rounded px-2 py-1 text-xs text-white"
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
                  className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs text-white transition-colors"
                >
                  {lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Store Main Groups */}
          <div>
            <h3 className="font-display font-bold text-white text-sm mb-4">
              {lang === 'ar' ? 'المجموعات الرئيسية للمتجر' : 'Store Categories'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {storeMainSections.map((sec) => (
                <li key={sec.id}>
                  <Link
                    to={`/store/category/${sec.slug}`}
                    className="hover:text-sky-300 transition-colors"
                  >
                    {sec.nameAr}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/store/category/all"
                  className="text-sky-300 hover:text-white font-semibold transition-colors"
                >
                  {t('store.allProducts')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Store Quick Shopping Links */}
          <div>
            <h3 className="font-display font-bold text-white text-sm mb-4">
              {lang === 'ar' ? 'روابط التسوق السريعة' : 'Shopping Links'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/store" className="hover:text-sky-300 transition-colors">
                  {lang === 'ar' ? 'الصفحة الرئيسية للمتجر' : 'Store Home'}
                </Link>
              </li>
              <li>
                <Link to="/store/offers" className="hover:text-sky-300 transition-colors">
                  {t('nav.offers')}
                </Link>
              </li>
              <li>
                <Link to="/store/wishlist" className="hover:text-sky-300 transition-colors">
                  {lang === 'ar' ? 'القائمة المفضلة' : 'Favorites Wishlist'}
                </Link>
              </li>
              <li>
                <Link to="/store/prescription" className="hover:text-sky-300 transition-colors">
                  {t('nav.prescriptionOrder')}
                </Link>
              </li>
              <li>
                <Link to="/store/cart" className="hover:text-sky-300 transition-colors">
                  {t('nav.cart')}
                </Link>
              </li>
              <li>
                <Link to="/store/checkout" className="hover:text-sky-300 transition-colors">
                  {lang === 'ar' ? 'إتمام الطلب والدفع' : 'Checkout & Payment'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Return to Clinic */}
          <div>
            <h3 className="font-display font-bold text-white text-sm mb-4">
              {lang === 'ar' ? 'خدمة العملاء والمركز' : 'Customer Care'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/contact" className="hover:text-sky-300 transition-colors">
                  {lang === 'ar' ? 'استشارة صيدلانية وتواصل' : 'Pharmacist Support & Contact'}
                </Link>
              </li>
              <li>
                <Link to="/complaints" className="hover:text-sky-300 transition-colors">
                  {t('nav.complaints')}
                </Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-sky-300 transition-colors">
                  {t('nav.bookAppointment')}
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-sky-300 hover:text-white font-semibold transition-colors"
                >
                  <BackIcon className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'العودة إلى موقع المركز الطبي' : 'Return to Clinic Website'}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Store Policies & Legal Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8] shrink-0" />
            <span>{lang === 'ar' ? 'سياسات المتجر والضمان:' : 'Store Policies & Legal:'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                to: '/store/policies/returns',
                label: lang === 'ar' ? 'سياسة الاستبدال والاسترجاع' : 'Return & Exchange Policy',
              },
              {
                to: '/store/policies/shipping',
                label: lang === 'ar' ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery',
              },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="btn-interactive inline-flex items-center px-3 py-1.5 rounded-lg bg-white/8 hover:bg-sky-500/20 border border-white/15 hover:border-[#38BDF8]/60 text-xs font-medium text-sky-100 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Electronic Payment Methods Strip */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium shrink-0">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              {lang === 'ar' ? 'وسائل الدفع المعتمدة في المتجر:' : 'Accepted Store Payment Methods:'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {localizedConfig.payment.ePaymentNetworks.map((net) => (
              <div
                key={net.id}
                title={`${net.name} — ${net.accountHint}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-white/10 text-xs text-slate-100"
              >
                <WalletBrandIcon id={net.id} size="sm" logoUrl={net.logoUrl} name={net.name} />
                <span className="font-medium whitespace-nowrap">
                  {getShortWalletLabel(net.id, lang, net.name)}
                </span>
              </div>
            ))}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/10 text-xs text-slate-300">
              <span
                className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 inline-flex items-center justify-center shrink-0"
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

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center lg:text-start">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2.5 gap-y-2">
            <p className="text-slate-300">
              {lang === 'ar'
                ? 'جميع الحقوق محفوظة © 2026 نوديسك كلينك (NODISC Clinic)'
                : `All Rights Reserved © 2026 ${localizedConfig.brand.nameEn}`}
            </p>
            <span className="hidden sm:inline text-slate-700" aria-hidden="true">·</span>
            <div className="inline-flex flex-wrap items-center justify-center gap-2 text-slate-400">
              <span>
                {lang === 'ar' ? (
                  <>
                    تصميم وتطوير:{' '}
                    <span className="text-sky-300 font-semibold">م. نشوان حاتم</span>
                  </>
                ) : (
                  <>
                    Designed &amp; Developed by{' '}
                    <span className="text-sky-300 font-semibold">Eng. Nashwan Hatem</span>
                  </>
                )}
              </span>
              <a
                href="tel:+967784392285"
                dir="ltr"
                aria-label={lang === 'ar' ? 'اتصال بالمطور: 784392285' : 'Call developer: 784392285'}
                className="btn-interactive inline-flex items-center gap-1.5 ps-1.5 pe-2.5 py-1 rounded-xl bg-gradient-to-r from-[#0F4C5C]/90 to-[#0284C7]/85 hover:from-[#0284C7] hover:to-[#0EA5E9] border border-sky-400/35 hover:border-sky-300/70 text-white text-[11px] font-mono font-semibold tabular-nums shadow-[0_4px_14px_-4px_rgba(2,132,199,0.45)]"
              >
                <span className="w-5 h-5 rounded-lg bg-white/15 inline-flex items-center justify-center shrink-0">
                  <Phone className="w-3 h-3 text-sky-200" />
                </span>
                <span>784392285</span>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/store/policies/privacy"
              className="text-slate-400 hover:text-sky-300 transition-colors"
            >
              {lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <Link
              to="/store/policies/terms"
              className="text-slate-400 hover:text-sky-300 transition-colors"
            >
              {lang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </Link>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1 text-[11px] text-slate-500/80 hover:text-slate-300 transition-colors shrink-0"
              aria-label={lang === 'ar' ? 'إدارة المتجر' : 'Store Admin'}
            >
              <Lock className="w-3 h-3" />
              <span>{lang === 'ar' ? 'الإدارة' : 'Admin'}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
