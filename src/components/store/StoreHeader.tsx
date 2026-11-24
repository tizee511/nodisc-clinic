import React, { useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Globe,
  Heart,
  Menu,
  Percent,
  Phone,
  Search,
  ShoppingBag,
  Store,
  X,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { SearchModal } from '../SearchModal';

export const StoreHeader: React.FC = () => {
  const { lang, isRTL, setLang, t, localizedConfig, storeMainSections, products } = useLanguage();
  const { cartCount, cartSubtotalYER, wishlistCount, formatPrice, currencyCode, setCurrencyCode } =
    useClinic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const offersCount = useMemo(
    () =>
      products.filter(
        (p) => p.isOnSale || (p.originalPriceYER !== undefined && p.originalPriceYER > p.priceYER)
      ).length,
    [products]
  );

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors inline-flex items-center gap-1.5 ${
      isActive
        ? 'text-[#0F4C5C] border-[#0F4C5C] font-semibold'
        : 'text-slate-700 border-transparent hover:text-[#0F4C5C] hover:border-slate-300'
    }`;

  return (
    <>
      {/* Store Top Utility Strip */}
      <div className="bg-[#062B35] text-slate-100 text-xs border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-slate-200">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white font-semibold transition-colors whitespace-nowrap"
            >
              <BackIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'ar' ? 'العودة إلى المركز الطبي' : 'Back to Clinic'}</span>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span dir="ltr" className="tabular-nums">
                {localizedConfig.contact.phones[0].value}
              </span>
            </span>

            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>
                {lang === 'ar' ? 'توصيل واستلام صيدلاني موثوق' : 'Verified Pharmacy Fulfillment'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3 ms-auto">
            {/* Currency Switcher inside Store Header */}
            <div className="hidden sm:inline-flex items-center gap-1.5">
              <label htmlFor="store-header-currency" className="sr-only">
                {t('common.currencyLabel')}
              </label>
              <select
                id="store-header-currency"
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="bg-white/10 hover:bg-white/15 border border-white/15 rounded px-2 py-0.5 text-[11px] font-medium text-white focus:outline-none"
              >
                {Object.entries(siteConfig.currency.exchangeRatesFromYER).map(([code, info]) => (
                  <option key={code} value={code} className="text-slate-900">
                    {info.label}
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/admin/products"
              className="px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors whitespace-nowrap"
            >
              {lang === 'ar' ? 'إدارة المتجر' : 'Store Admin'}
            </Link>

            {/* Language Switcher */}
            <div
              className="inline-flex items-center bg-white/10 rounded-md p-0.5"
              role="group"
              aria-label={t('nav.languageLabel')}
            >
              <button
                type="button"
                onClick={() => setLang('ar')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                  lang === 'ar' ? 'bg-white text-[#062B35]' : 'text-slate-200 hover:text-white'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                  lang === 'en' ? 'bg-white text-[#062B35]' : 'text-slate-200 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slim Sticky Store Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Store Brand Mark */}
          <Link
            to="/store"
            className="inline-flex items-center gap-2.5 shrink-0 focus-visible:rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            {localizedConfig.brand.logoUrl ? (
              <img
                src={localizedConfig.brand.logoUrl}
                alt={lang === 'ar' ? 'متجر نوديسك' : 'NODISC Store'}
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
              />
            ) : (
              <span
                className="w-9 h-9 rounded-lg bg-[#0F4C5C] text-white flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <Store className="w-5 h-5" />
              </span>
            )}
            <span className="flex flex-col leading-tight">
              <span className="font-display font-bold text-base sm:text-lg text-slate-900 whitespace-nowrap">
                {lang === 'ar' ? 'متجر نوديسك' : 'NODISC Store'}
              </span>
              <span className="text-[11px] font-medium text-[#0F4C5C] whitespace-nowrap">
                {lang === 'ar' ? 'الصيدلية والمستلزمات الطبية' : 'Pharmacy & Medical Store'}
              </span>
            </span>
          </Link>

          {/* Zone 2: Dedicated Store Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label={lang === 'ar' ? 'قائمة المتجر' : 'Store Navigation'}
          >
            <NavLink to="/store" end className={navLinkClass}>
              {lang === 'ar' ? 'رئيسية المتجر' : 'Store Home'}
            </NavLink>

            <NavLink to="/store/category/all" className={navLinkClass}>
              {t('store.allProducts')}
            </NavLink>

            <NavLink to="/store/offers" className={navLinkClass}>
              <Percent className="w-3.5 h-3.5 text-rose-600" />
              <span>{t('nav.offers')}</span>
              {offersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold tabular-nums leading-none">
                  {offersCount}
                </span>
              )}
            </NavLink>

            <NavLink to="/store/prescription" className={navLinkClass}>
              {t('nav.prescriptionOrder')}
            </NavLink>

            <NavLink to="/store/wishlist" className={navLinkClass}>
              {lang === 'ar' ? 'المفضلة' : 'Favorites'}
            </NavLink>
          </nav>

          {/* Zone 3: Store Search, Wishlist, Cart Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t('store.searchPlaceholder')}
              title={t('store.searchPlaceholder')}
              className="p-2 rounded-lg text-slate-600 hover:text-[#0F4C5C] hover:bg-slate-100 transition-colors"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <Link
              to="/store/wishlist"
              aria-label={lang === 'ar' ? 'القائمة المفضلة' : 'Favorites'}
              title={lang === 'ar' ? 'القائمة المفضلة' : 'Favorites'}
              className="relative p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors inline-flex items-center gap-1"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  wishlistCount > 0 ? 'text-rose-600 fill-rose-500/20' : ''
                }`}
              />
              {wishlistCount > 0 && (
                <span className="min-w-[1.25rem] h-5 px-1 rounded-full bg-rose-600 text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/store/cart"
              aria-label={t('nav.cart')}
              className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors tabular-nums"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>
                {t('nav.cart')} ({cartCount})
              </span>
              {cartCount > 0 && (
                <span className="hidden sm:inline text-sky-200 font-medium">
                  · {formatPrice(cartSubtotalYER)}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.menu')}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Store Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 max-h-[82vh] overflow-y-auto px-4 py-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
                  <button
                    type="button"
                    onClick={() => setLang('ar')}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      lang === 'ar' ? 'bg-white text-[#0F4C5C] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      lang === 'en' ? 'bg-white text-[#0F4C5C] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <select
                aria-label={t('common.currencyLabel')}
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800"
              >
                {Object.entries(siteConfig.currency.exchangeRatesFromYER).map(([code, info]) => (
                  <option key={code} value={code}>
                    {info.label}
                  </option>
                ))}
              </select>
            </div>

            <nav
              className="space-y-1.5"
              aria-label={lang === 'ar' ? 'قائمة المتجر للجوال' : 'Mobile Store Navigation'}
            >
              {[
                { to: '/store', label: lang === 'ar' ? 'رئيسية المتجر' : 'Store Home', end: true },
                { to: '/store/category/all', label: t('store.allProducts') },
                { to: '/store/offers', label: `${t('nav.offers')} (${offersCount})` },
                { to: '/store/prescription', label: t('nav.prescriptionOrder') },
                { to: '/store/wishlist', label: `${lang === 'ar' ? 'المفضلة' : 'Favorites'} (${wishlistCount})` },
                { to: '/store/cart', label: `${t('nav.cart')} (${cartCount})` },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive ? 'bg-sky-50 text-[#0F4C5C] font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Quick Links to Store Main Groups */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-xs font-bold text-slate-500 px-1">
                {lang === 'ar' ? 'أقسام المتجر الرئيسية' : 'Store Main Groups'}
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {storeMainSections.map((sec) => (
                  <Link
                    key={sec.id}
                    to={`/store/category/${sec.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-sky-50 text-xs font-semibold text-slate-800 hover:text-[#0F4C5C]"
                  >
                    {sec.image && (
                      <img
                        src={sec.image}
                        alt={sec.nameAr}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded object-cover border border-slate-200 shrink-0"
                      />
                    )}
                    <span className="truncate">{sec.nameAr}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/store/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold text-center tabular-nums"
              >
                {t('nav.cart')} ({cartCount}) · {formatPrice(cartSubtotalYER)}
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium text-center"
              >
                {lang === 'ar' ? 'العودة إلى موقع المركز الطبي' : 'Return to Clinic Website'}
              </Link>
            </div>
          </div>
        )}
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} storeOnly />
    </>
  );
};
