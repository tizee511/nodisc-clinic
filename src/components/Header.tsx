import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Clock,
  Globe,
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

export const Header: React.FC = () => {
  const { lang, setLang, t, localizedConfig, departments } = useLanguage();
  const { cartCount } = useClinic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const isDepartmentActive = location.pathname.startsWith('/departments');

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors ${
      isActive
        ? 'text-[#0F4C5C] border-[#0F4C5C] font-semibold'
        : 'text-slate-700 border-transparent hover:text-[#0F4C5C] hover:border-slate-300'
    }`;

  return (
    <>
      {/* Non-sticky Top Utility Strip: Contact info, hours, concise prototype notice, and Language Switcher */}
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

      {/* Slim Sticky Main Header (3 Zones) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Brand Logo / Wordmark */}
          <Link to="/" className="shrink-0 focus-visible:rounded-lg" onClick={() => setMobileMenuOpen(false)}>
            <ClinicLogoMark />
          </Link>

          {/* Zone 2: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label={lang === 'ar' ? 'القائمة الرئيسية' : 'Main Navigation'}>
            <NavLink to="/about" className={navLinkClass}>
              {t('nav.about')}
            </NavLink>

            {/* Departments Dropdown */}
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
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {deptDropdownOpen && (
                <div className="absolute top-full start-0 pt-2 w-72 z-50">
                  <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-2">
                    {departments.map((dept) => (
                      <Link
                        key={dept.id}
                        to={`/departments/${dept.slug}`}
                        onClick={() => setDeptDropdownOpen(false)}
                        className={`block px-3 py-2.5 rounded-lg transition-colors ${
                          location.pathname === `/departments/${dept.slug}`
                            ? 'bg-sky-50 text-[#0F4C5C]'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span className="block text-sm font-semibold">{dept.nameAr}</span>
                        <span className="block text-[11px] text-slate-500 mt-0.5" dir="ltr">
                          {dept.nameEn}
                        </span>
                      </Link>
                    ))}
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

          {/* Zone 3: Search, Cart, Language (mobile quick), Primary CTA */}
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

        {/* Mobile Prototype Notice Bar (slim 1-line) */}
        <div className="xl:hidden bg-sky-50/90 border-t border-sky-100 px-4 py-1 text-[11px] text-[#093542] text-center truncate">
          {localizedConfig.brand.prototypeNotice}
        </div>

        {/* Mobile Navigation Drawer */}
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

            <nav className="space-y-1" aria-label={lang === 'ar' ? 'قائمة الجوال' : 'Mobile Navigation'}>
              {[
                { to: '/', label: t('nav.home') },
                { to: '/about', label: t('nav.about') },
                { to: '/doctors', label: t('nav.doctors') },
                { to: '/services', label: t('nav.services') },
                { to: '/library', label: t('nav.library') },
                { to: '/campaigns', label: t('nav.campaigns') },
                { to: '/store', label: t('nav.store') },
                { to: '/store/offers', label: t('nav.offers') },
                { to: '/contact', label: t('nav.contact') },
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

              <div className="pt-2 pb-1">
                <p className="px-3 text-xs font-semibold text-slate-400 mb-1.5">{t('nav.departments')}</p>
                <div className="space-y-1 ps-2">
                  {departments.map((dept) => (
                    <NavLink
                      key={dept.id}
                      to={`/departments/${dept.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm ${
                          isActive ? 'bg-sky-50 text-[#0F4C5C] font-semibold' : 'text-slate-600 hover:bg-slate-50'
                        }`
                      }
                    >
                      {dept.nameAr}
                    </NavLink>
                  ))}
                </div>
              </div>
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
