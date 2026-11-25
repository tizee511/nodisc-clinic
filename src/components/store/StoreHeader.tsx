import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  FileUp,
  Globe,
  Heart,
  LayoutGrid,
  Menu,
  Percent,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { SearchModal } from '../SearchModal';
import { AnnouncementTicker, TickerItem } from '../AnnouncementTicker';
import { StoreGlyph, StoreLogoMark } from './StoreLogoMark';

export const StoreHeader: React.FC = () => {
  const { lang, isRTL, setLang, t, localizedConfig, storeMainSections, products } = useLanguage();
  const { cartCount, cartSubtotalYER, wishlistCount, formatPrice, currencyCode, setCurrencyCode } =
    useClinic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const offersCount = useMemo(
    () =>
      products.filter(
        (p) => p.isOnSale || (p.originalPriceYER !== undefined && p.originalPriceYER > p.priceYER)
      ).length,
    [products]
  );

  const storeTickerItems = useMemo<TickerItem[]>(
    () => [
      {
        id: 'store-offers',
        badge: offersCount > 0 ? (lang === 'ar' ? `${offersCount} عرض` : `${offersCount} Deals`) : undefined,
        text:
          lang === 'ar'
            ? 'عروض وتخفيضات حصرية متجددة على مستلزمات التأهيل والفيتامينات والعناية'
            : 'Exclusive seasonal savings across rehab gear, vitamins & daily care',
        to: '/store/offers',
      },
      {
        id: 'store-rx',
        badge: lang === 'ar' ? 'وصفة' : 'Rx',
        text:
          lang === 'ar'
            ? 'ارفع صورة وصفتك الطبية بضغطة زر ليجهزها لك الصيدلي المختص فوراً'
            : 'Upload your prescription photo in one tap for instant pharmacist prep',
        to: '/store/prescription',
      },
      {
        id: 'store-verified',
        text:
          lang === 'ar'
            ? 'جميع الدعامات الطبية والمكملات أصلية ومختارة بإشراف صيدلاني موثوق'
            : '100% authentic medical braces & supplements curated by licensed pharmacists',
        to: '/store/category/all',
      },
      {
        id: 'store-payments',
        text:
          lang === 'ar'
            ? 'دفع إلكتروني مرن عبر المحافظ المعتمدة أو نقداً عند الاستلام'
            : 'Flexible e-wallets & Cash on Delivery across all orders',
        to: '/store/cart',
      },
    ],
    [lang, offersCount]
  );

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors inline-flex items-center gap-1.5 ${
      isActive
        ? 'text-[#7DD3FC] border-[#38BDF8] font-bold'
        : 'text-slate-100/90 border-transparent hover:text-white hover:border-sky-300/50'
    }`;

  return (
    <>
      {/* Slim Sticky Store Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#06222B]/80 via-[#062B35]/80 to-[#0B414F]/80 backdrop-blur-md backdrop-saturate-150 text-white border-b border-sky-400/25 shadow-md">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          {/* Zone 1: Dedicated Store Brand Mark */}
          <Link
            to="/store"
            className="inline-flex items-center min-w-0 focus-visible:rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <StoreLogoMark tone="dark" />
          </Link>

          {/* Zone 2: Dedicated Store Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-4 xl:gap-6"
            aria-label={lang === 'ar' ? 'قائمة المتجر' : 'Store Navigation'}
          >
            <NavLink to="/store" end className={navLinkClass}>
              <StoreGlyph className="w-3.5 h-3.5 hidden xl:inline-block shrink-0 text-sky-300/90" />
              <span>{lang === 'ar' ? 'رئيسية المتجر' : 'Store Home'}</span>
            </NavLink>

            <NavLink to="/store/category/all" className={navLinkClass}>
              <LayoutGrid className="w-3.5 h-3.5 hidden xl:inline-block shrink-0 text-sky-300/90" />
              <span>{t('store.allProducts')}</span>
            </NavLink>

            <NavLink to="/store/offers" className={navLinkClass}>
              <Percent className="w-3.5 h-3.5 text-rose-400" />
              <span>{t('nav.offers')}</span>
              {offersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold tabular-nums leading-none">
                  {offersCount}
                </span>
              )}
            </NavLink>

            <NavLink to="/store/prescription" className={navLinkClass}>
              <FileUp className="w-3.5 h-3.5 hidden xl:inline-block shrink-0 text-sky-300/90" />
              <span>{t('nav.prescriptionOrder')}</span>
            </NavLink>

            <NavLink to="/store/wishlist" className={navLinkClass}>
              <Heart className="w-3.5 h-3.5 hidden xl:inline-block shrink-0 text-sky-300/90" />
              <span>{lang === 'ar' ? 'المفضلة' : 'Favorites'}</span>
            </NavLink>

            <Link
              to="/"
              className="text-sm font-medium whitespace-nowrap shrink-0 py-1.5 text-sky-200 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <BackIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'ar' ? 'المركز الطبي' : 'Clinic'}</span>
            </Link>
          </nav>

          {/* Zone 3: Store Search, Language, Currency, Wishlist, Cart Primary CTA */}
          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <div className="hidden md:block">
              <label htmlFor="store-header-currency" className="sr-only">
                {t('common.currencyLabel')}
              </label>
              <select
                id="store-header-currency"
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg px-2 py-1 text-xs font-medium text-white focus:outline-none"
              >
                {Object.entries(siteConfig.currency.exchangeRatesFromYER).map(([code, info]) => (
                  <option key={code} value={code} className="text-slate-900">
                    {info.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t('store.searchPlaceholder')}
              title={t('store.searchPlaceholder')}
              className="p-1.5 sm:p-2 rounded-lg text-slate-100 hover:text-[#7DD3FC] hover:bg-white/10 transition-colors"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              className="relative p-1.5 sm:p-2 rounded-lg text-slate-100 hover:text-[#7DD3FC] hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-1"
            >
              <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline text-[11px] font-bold uppercase tracking-wide">
                {lang === 'ar' ? 'EN' : 'AR'}
              </span>
              <span className="md:hidden absolute -bottom-0.5 -end-0.5 px-1 rounded bg-[#04181F] border border-sky-300/35 text-[8px] font-extrabold text-[#7DD3FC] leading-tight uppercase">
                {lang === 'ar' ? 'EN' : 'AR'}
              </span>
            </button>

            <Link
              to="/store/wishlist"
              aria-label={lang === 'ar' ? 'القائمة المفضلة' : 'Favorites'}
              title={lang === 'ar' ? 'القائمة المفضلة' : 'Favorites'}
              className="relative p-1.5 sm:p-2 rounded-lg text-slate-100 hover:text-rose-300 hover:bg-white/10 transition-colors inline-flex items-center justify-center"
            >
              <Heart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  wishlistCount > 0 ? 'text-rose-400 fill-rose-400/25' : ''
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -end-0.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums leading-none ring-2 ring-[#062B35]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/store/cart"
              aria-label={t('nav.cart')}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-[#38BDF8] to-[#0284C7] hover:from-[#7DD3FC] hover:to-[#0EA5E9] text-[#04181F] text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all tabular-nums shadow-sm"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="sm:hidden">{cartCount}</span>
              <span className="hidden sm:inline">
                {t('nav.cart')} ({cartCount})
              </span>
              {cartCount > 0 && (
                <span className="hidden md:inline text-[#06222B]/80 font-semibold">
                  · {formatPrice(cartSubtotalYER)}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.menu')}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </header>

      {/* Eye-Catching Moving Highlights Strip Under Store Header */}
      <AnnouncementTicker
        variant="store"
        ariaLabel={lang === 'ar' ? 'عروض ومزايا متجر صيدلية نوديسك' : 'NODISC Store Highlights'}
        items={storeTickerItems}
      />

      {/* Full-Height Half-Width Mobile Store Navigation Drawer with Solid Deep Pharmacy Background */}
      <div
        className={`fixed inset-0 z-50 lg:hidden flex transition-opacity duration-350 ease-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileMenuOpen}
        aria-label={lang === 'ar' ? 'قائمة المتجر للجوال' : 'Mobile Store Navigation'}
      >
        <aside
          className={`relative z-10 w-1/2 min-w-0 h-full bg-[#06222B] bg-gradient-to-b from-[#041B22] via-[#062B35] to-[#0C4452] border-e border-sky-400/25 shadow-2xl flex flex-col overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.22,1.18,0.36,1)] ${
            mobileMenuOpen
              ? 'translate-x-0 scale-100 opacity-100'
              : `${isRTL ? 'translate-x-full' : '-translate-x-full'} scale-[0.96] opacity-90`
          }`}
        >
            {/* Drawer Header */}
            <div className="px-2.5 sm:px-3 py-3 border-b border-white/10 bg-[#04181F] text-white flex items-center justify-between gap-1.5 shrink-0">
              <span className="font-display font-bold text-xs sm:text-sm truncate text-white">
                {lang === 'ar' ? 'قائمة المتجر' : 'Store Menu'}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label={t('nav.closeMenu')}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white inline-flex items-center justify-center shrink-0 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 sm:px-3 py-3 space-y-4">
              {/* Currency Selector */}
              <div className="pb-3 border-b border-white/10">
                <select
                  aria-label={t('common.currencyLabel')}
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-white/20 bg-[#04181F] text-[11px] font-medium text-white focus:outline-none focus:border-sky-400"
                >
                  {Object.entries(siteConfig.currency.exchangeRatesFromYER).map(([code, info]) => (
                    <option key={code} value={code} className="text-slate-900 bg-white">
                      {info.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Primary Store Links */}
              <nav
                className="space-y-1.5"
                aria-label={lang === 'ar' ? 'قائمة المتجر للجوال' : 'Mobile Store Navigation'}
              >
                {[
                  {
                    to: '/store',
                    label: lang === 'ar' ? 'رئيسية المتجر' : 'Store Home',
                    end: true,
                    icon: StoreGlyph,
                  },
                  {
                    to: '/store/category/all',
                    label: t('store.allProducts'),
                    icon: LayoutGrid,
                  },
                  {
                    to: '/store/offers',
                    label: `${t('nav.offers')} (${offersCount})`,
                    icon: Percent,
                  },
                  {
                    to: '/store/prescription',
                    label: t('nav.prescriptionOrder'),
                    icon: FileUp,
                  },
                  {
                    to: '/store/wishlist',
                    label: `${lang === 'ar' ? 'المفضلة' : 'Favorites'} (${wishlistCount})`,
                    icon: Heart,
                  },
                  {
                    to: '/store/cart',
                    label: `${t('nav.cart')} (${cartCount})`,
                    icon: ShoppingBag,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `group min-h-[42px] flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[#38BDF8]/20 text-white font-bold border border-sky-400/45 shadow-xs'
                            : 'text-slate-100/90 hover:bg-white/10 hover:text-white border border-transparent'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? 'bg-[#38BDF8] text-[#04181F]'
                                : 'bg-white/10 text-sky-300 group-hover:bg-white/15 group-hover:text-white'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="truncate">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Quick Links to Store Main Groups */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <p className="text-[11px] font-bold text-sky-300 px-1">
                  {lang === 'ar' ? 'أقسام المتجر الرئيسية' : 'Store Main Groups'}
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {storeMainSections.map((sec) => (
                    <Link
                      key={sec.id}
                      to={`/store/category/${sec.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#04181F]/85 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-100 hover:text-white transition-colors"
                    >
                      {sec.image && (
                        <img
                          src={sec.image}
                          alt={sec.nameAr}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded object-cover border border-white/20 shrink-0"
                        />
                      )}
                      <span className="truncate">{sec.nameAr}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Pinned Bottom Actions */}
            <div className="p-3 border-t border-white/15 bg-[#04181F] flex flex-col gap-2 shrink-0">
              <Link
                to="/store/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#38BDF8] to-[#0284C7] hover:from-[#7DD3FC] hover:to-[#0EA5E9] text-[#04181F] text-xs font-bold inline-flex items-center justify-center gap-1.5 tabular-nums shadow-sm transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {t('nav.cart')} ({cartCount}) · {formatPrice(cartSubtotalYER)}
                </span>
              </Link>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 px-3 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/15 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <BackIcon className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span className="truncate">
                  {lang === 'ar' ? 'العودة إلى المركز الطبي' : 'Return to Clinic'}
                </span>
              </Link>
            </div>
          </aside>

          {/* Remaining Half Backdrop */}
          <div
            className={`flex-1 bg-slate-950/65 backdrop-blur-xs transition-opacity duration-350 ${
              mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} storeOnly />
    </>
  );
};
