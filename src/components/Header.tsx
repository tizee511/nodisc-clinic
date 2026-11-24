import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock,
  Globe,
  Heart,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useClinic } from '../context/ClinicContext';
import { ClinicLogoMark } from './ClinicLogoMark';
import { SearchModal } from './SearchModal';
import { SafeImage } from './SafeImage';

export const Header: React.FC = () => {
  const {
    lang,
    isRTL,
    setLang,
    t,
    localizedConfig,
    departments,
  } = useLanguage();
  const { cartCount, wishlistCount } = useClinic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [mobileDeptOpen, setMobileDeptOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const isDepartmentActive = location.pathname.startsWith('/departments');

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors ${
      isActive
        ? 'text-[#0F4C5C] border-[#0F4C5C] font-semibold'
        : 'text-slate-700 border-transparent hover:text-[#0F4C5C] hover:border-slate-300'
    }`;

  return (
    <>
      {/* Non-sticky Top Utility Strip */}
      <div className="bg-[#093542] text-slate-100 text-xs border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-slate-200">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span dir="ltr" className="tabular-nums">
                {localizedConfig.contact.phones[0].value}
              </span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>{localizedConfig.contact.city}</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-300 shrink-0" />
              <span>
                {localizedConfig.contact.workingDays} · {localizedConfig.contact.workingPeriods[0].time}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 ms-auto">
            <span className="hidden xl:inline text-sky-200/90">
              {localizedConfig.brand.prototypeNotice}
            </span>

            <Link
              to="/admin"
              className="px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors whitespace-nowrap"
            >
              {lang === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
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
                  lang === 'ar' ? 'bg-white text-[#093542]' : 'text-slate-200 hover:text-white'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                  lang === 'en' ? 'bg-white text-[#093542]' : 'text-slate-200 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slim Sticky Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 lg:gap-8">
          {/* Brand Logo */}
          <Link
            to="/"
            className="shrink-0 focus-visible:rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ClinicLogoMark />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label={lang === 'ar' ? 'القائمة الرئيسية' : 'Main Navigation'}
          >
            <NavLink to="/about" className={navLinkClass}>
              {t('nav.about')}
            </NavLink>

            {/* Departments Visual Dropdown Panel */}
            <div
              className="relative"
              onMouseEnter={() => setDeptDropdownOpen(true)}
              onMouseLeave={() => setDeptDropdownOpen(false)}
            >
              <button
                type="button"
                aria-expanded={deptDropdownOpen}
                onClick={() => setDeptDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors ${
                  isDepartmentActive
                    ? 'text-[#0F4C5C] border-[#0F4C5C] font-semibold'
                    : 'text-slate-700 border-transparent hover:text-[#0F4C5C]'
                }`}
              >
                <span>{t('nav.departments')}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    deptDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {deptDropdownOpen && (
                <div className="absolute top-full start-0 pt-2.5 w-[34rem] z-50">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      {departments.map((dept) => (
                        <Link
                          key={dept.id}
                          to={`/departments/${dept.slug}`}
                          onClick={() => setDeptDropdownOpen(false)}
                          className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                            location.pathname === `/departments/${dept.slug}`
                              ? 'bg-sky-50/80 border-[#0F4C5C]/40 text-[#0F4C5C]'
                              : 'border-slate-100 hover:border-[#0F4C5C]/30 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="w-14 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                            <SafeImage
                              src={dept.image}
                              alt={dept.nameAr}
                              aspectClass="aspect-[4/3]"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block text-xs font-bold leading-snug group-hover:text-[#0F4C5C] line-clamp-2">
                              {dept.nameAr}
                            </span>
                            <span
                              className="block text-[10px] text-slate-400 truncate mt-0.5"
                              dir="ltr"
                            >
                              {dept.nameEn}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <Link
                        to="/services"
                        onClick={() => setDeptDropdownOpen(false)}
                        className="font-semibold text-[#0F4C5C] hover:underline inline-flex items-center gap-1"
                      >
                        <span>
                          {lang === 'ar' ? 'عرض جميع الخدمات الطبية' : 'View All Medical Services'}
                        </span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to="/doctors"
                        onClick={() => setDeptDropdownOpen(false)}
                        className="font-medium text-slate-600 hover:text-[#0F4C5C]"
                      >
                        {t('nav.doctors')}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/doctors" className={navLinkClass}>
              {t('nav.doctors')}
            </NavLink>
            <NavLink to="/library" className={navLinkClass}>
              {t('nav.library')}
            </NavLink>

            <NavLink to="/store" className={navLinkClass}>
              {t('nav.store')}
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              {t('nav.contact')}
            </NavLink>
          </nav>

          {/* Zone 3: Search, Cart, Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t('nav.search')}
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
              className="relative p-2 rounded-lg text-slate-600 hover:text-[#0F4C5C] hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="min-w-[1.25rem] h-5 px-1 rounded-full bg-[#0284C7] text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/book"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              {t('nav.bookAppointment')}
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

        {/* Mobile Prototype Notice Bar */}
        <div className="xl:hidden bg-sky-50/90 border-t border-sky-100 px-4 py-1 text-[11px] text-[#093542] text-center truncate">
          {localizedConfig.brand.prototypeNotice}
        </div>

        {/* Mobile Navigation Drawer with Collapsible Hierarchical Accordions */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 max-h-[80vh] overflow-y-auto px-4 py-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500 inline-flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                {t('nav.languageLabel')}
              </span>
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

            <nav className="space-y-1.5" aria-label={lang === 'ar' ? 'قائمة الجوال' : 'Mobile Navigation'}>
              {[
                { to: '/', label: t('nav.home') },
                { to: '/about', label: t('nav.about') },
                { to: '/doctors', label: t('nav.doctors') },
                { to: '/services', label: t('nav.services') },
                { to: '/library', label: t('nav.library') },
                { to: '/campaigns', label: t('nav.campaigns') },
                { to: '/store', label: t('nav.store') },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
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

              {/* Collapsible Mobile Accordion: Medical Departments */}
              <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  aria-expanded={mobileDeptOpen}
                  onClick={() => setMobileDeptOpen((curr) => !curr)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-sm font-semibold text-slate-800 hover:bg-slate-100/70"
                >
                  <span>
                    {t('nav.departments')} ({departments.length})
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                      mobileDeptOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileDeptOpen && (
                  <div className="px-2.5 pb-2.5 space-y-1 border-t border-slate-200/60 pt-2">
                    {departments.map((dept) => (
                      <NavLink
                        key={dept.id}
                        to={`/departments/${dept.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium ${
                            isActive
                              ? 'bg-white border border-[#0F4C5C]/30 text-[#0F4C5C] font-semibold'
                              : 'text-slate-700 hover:bg-white'
                          }`
                        }
                      >
                        <img
                          src={dept.image}
                          alt={dept.nameAr}
                          className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0"
                        />
                        <span className="truncate">{dept.nameAr}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>

              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-sky-50 text-[#0F4C5C] font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {t('nav.contact')}
              </NavLink>
            </nav>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold text-center"
              >
                {t('nav.bookAppointment')}
              </Link>
              <Link
                to="/store/prescription"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium text-center"
              >
                {t('nav.prescriptionOrder')}
              </Link>
            </div>
          </div>
        )}
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
