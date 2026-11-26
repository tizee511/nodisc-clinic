import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Calendar,
  ChevronDown,
  Globe,
  Home,
  LayoutGrid,
  Megaphone,
  Menu,
  Phone,
  Search,
  Stethoscope,
  X,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ClinicLogoMark } from './ClinicLogoMark';
import { StoreGlyph } from './store/StoreLogoMark';
import { SearchModal } from './SearchModal';
import { SafeImage } from './SafeImage';
import { AnnouncementTicker, TickerItem } from './AnnouncementTicker';

export const Header: React.FC = () => {
  const {
    lang,
    isRTL,
    setLang,
    t,
    localizedConfig,
    departments,
    campaigns,
  } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [mobileDeptOpen, setMobileDeptOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

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

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const isDepartmentActive = location.pathname.startsWith('/departments');

  const clinicTickerItems = useMemo<TickerItem[]>(() => {
    const activeCampaign = campaigns[0];
    return [
      {
        id: 'non-surgical',
        badge: lang === 'ar' ? 'تخصصنا' : 'Care',
        text:
          lang === 'ar'
            ? 'علاج الانزلاق الغضروفي وآلام العمود الفقري والمفاصل بدون جراحة'
            : 'Non-surgical spine, disc herniation & joint rehabilitation care',
        to: '/services',
      },
      ...(activeCampaign
        ? [
            {
              id: `camp-${activeCampaign.id}`,
              badge: lang === 'ar' ? 'حملة' : 'Campaign',
              text: activeCampaign.title,
              to: `/campaigns/${activeCampaign.slug}`,
            },
          ]
        : []),
      {
        id: 'doctor',
        text:
          lang === 'ar'
            ? 'إشراف طبي مباشر: د. محمد عبدالله الجرباني — استشاري جراحة المخ والأعصاب والعمود الفقري'
            : 'Led by Dr. Mohammed Al-Jurbani — Consultant Neurosurgeon & Spine Surgeon',
        to: '/doctors',
      },
      {
        id: 'conservative-85',
        badge: lang === 'ar' ? '+85% تحفظياً' : '>85% Non-Surgical',
        text:
          lang === 'ar'
            ? 'أكثر من 85% من حالات الانزلاق الغضروفي وآلام العمود الفقري تُعالج بنجاح بدون جراحة'
            : 'Over 85% of spine disc & back pain cases recover through conservative & rehab care',
        to: '/services',
      },
      {
        id: 'instant-book',
        badge: lang === 'ar' ? 'احجز الآن' : 'Book',
        text:
          lang === 'ar'
            ? 'احجز موعدك إلكترونياً خلال ثوانٍ في عيادات نوديسك بصنعاء'
            : 'Book your consultation online in seconds at NODISC Clinic Sana’a',
        to: '/book',
      },
      {
        id: 'store-link',
        text:
          lang === 'ar'
            ? 'اكتشف متجر صيدلية نوديسك للدعامات الطبية وأجهزة التأهيل المنزلي'
            : 'Explore NODISC Pharmacy Store for orthopedic braces & rehab devices',
        to: '/store',
      },
    ];
  }, [lang, campaigns]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors inline-flex items-center gap-1.5 ${
      isActive
        ? 'text-[#7DD3FC] border-[#38BDF8] font-bold'
        : 'text-slate-100/90 border-transparent hover:text-white hover:border-sky-300/50'
    }`;

  return (
    <>
      {/* Slim Sticky Main Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#093542]/80 via-[#0F4C5C]/80 to-[#093542]/80 backdrop-blur-md backdrop-saturate-150 text-white border-b border-sky-300/20 shadow-md">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          {/* Brand Logo */}
          <Link
            to="/"
            className="inline-flex items-center min-w-0 focus-visible:rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ClinicLogoMark tone="dark" />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label={lang === 'ar' ? 'القائمة الرئيسية' : 'Main Navigation'}
          >
            <NavLink to="/about" className={navLinkClass}>
              <Building2 className="w-3.5 h-3.5 hidden xl:inline-block shrink-0 text-sky-300/90" />
              <span>{t('nav.about')}</span>
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
                className={`inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors ${
                  isDepartmentActive
                    ? 'text-[#7DD3FC] border-[#38BDF8] font-bold'
                    : 'text-slate-100/90 border-transparent hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 hidden xl:inline-block shrink-0 text-sky-300/90" />
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
              <Stethoscope className="w-3.5 h-3.5 hidden xl:inline-block shrink-0 text-sky-300/90" />
              <span>{t('nav.doctors')}</span>
            </NavLink>
            <NavLink to="/library" className={navLinkClass}>
              <BookOpen className="w-3.5 h-3.5 hidden xl:inline-block shrink-0 text-sky-300/90" />
              <span>{t('nav.library')}</span>
            </NavLink>

            <NavLink to="/store" className={navLinkClass}>
              <StoreGlyph className="w-3.5 h-3.5 hidden xl:inline-block shrink-0 text-sky-300/90" />
              <span>{t('nav.store')}</span>
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              <Phone className="w-3.5 h-3.5 hidden xl:inline-block shrink-0 text-sky-300/90" />
              <span>{t('nav.contact')}</span>
            </NavLink>
          </nav>

          {/* Zone 3: Search, Language, Wishlist, Cart, Primary CTA */}
          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={t('nav.search')}
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
              <span className="md:hidden absolute -bottom-0.5 -end-0.5 px-1 rounded bg-[#05222B] border border-sky-300/35 text-[8px] font-extrabold text-[#7DD3FC] leading-tight uppercase">
                {lang === 'ar' ? 'EN' : 'AR'}
              </span>
            </button>

            <Link
              to="/book"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#38BDF8] to-[#0284C7] hover:from-[#7DD3FC] hover:to-[#0EA5E9] text-[#05222B] text-sm font-bold whitespace-nowrap shrink-0 transition-all shadow-sm"
            >
              {t('nav.bookAppointment')}
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

      {/* Eye-Catching Moving Highlights Strip Under Clinic Header */}
      <AnnouncementTicker
        variant="clinic"
        ariaLabel={lang === 'ar' ? 'أبرز خدمات وعروض نوديسك كلينك' : 'NODISC Clinic Highlights'}
        items={clinicTickerItems}
      />

      {/* Full-Height Half-Width Mobile Navigation Drawer with Solid Petrol Background */}
      <div
        className={`fixed inset-0 z-50 lg:hidden flex transition-opacity duration-350 ease-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!mobileMenuOpen}
        aria-label={lang === 'ar' ? 'قائمة الجوال' : 'Mobile Navigation'}
      >
        <aside
          className={`relative z-10 w-1/2 min-w-0 h-full bg-[#093542] bg-gradient-to-b from-[#062B35] via-[#093542] to-[#0F4C5C] border-e border-sky-400/25 shadow-2xl flex flex-col overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.22,1.18,0.36,1)] ${
            mobileMenuOpen
              ? 'translate-x-0 scale-100 opacity-100'
              : `${isRTL ? 'translate-x-full' : '-translate-x-full'} scale-[0.96] opacity-90`
          }`}
        >
            {/* Drawer Header */}
            <div className="px-2.5 sm:px-3 py-3 border-b border-white/10 bg-[#05222B] text-white flex items-center justify-between gap-1.5 shrink-0">
              <span className="font-display font-bold text-xs sm:text-sm truncate text-white">
                {lang === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
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
              <nav className="space-y-1.5" aria-label={lang === 'ar' ? 'قائمة الجوال' : 'Mobile Navigation'}>
                {[
                  { to: '/', label: t('nav.home'), icon: Home },
                  { to: '/about', label: t('nav.about'), icon: Building2 },
                  { to: '/doctors', label: t('nav.doctors'), icon: Stethoscope },
                  { to: '/services', label: t('nav.services'), icon: Activity },
                  { to: '/library', label: t('nav.library'), icon: BookOpen },
                  { to: '/campaigns', label: t('nav.campaigns'), icon: Megaphone },
                  { to: '/store', label: t('nav.store'), icon: StoreGlyph },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
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
                                ? 'bg-[#38BDF8] text-[#05222B]'
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

                {/* Collapsible Mobile Accordion: Medical Departments */}
                <div className="rounded-xl border border-white/15 overflow-hidden bg-[#05222B]/80">
                  <button
                    type="button"
                    aria-expanded={mobileDeptOpen}
                    onClick={() => setMobileDeptOpen((curr) => !curr)}
                    className="w-full min-h-[42px] px-2.5 py-2 flex items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-white/10 text-sky-300 inline-flex items-center justify-center shrink-0">
                        <LayoutGrid className="w-4 h-4" />
                      </span>
                      <span className="truncate">
                        {t('nav.departments')} ({departments.length})
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-sky-300 shrink-0 transition-transform duration-200 ${
                        mobileDeptOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {mobileDeptOpen && (
                    <div className="px-2 pb-2 space-y-1 border-t border-white/10 pt-2 animate-accordion-reveal">
                      {departments.map((dept) => (
                        <NavLink
                          key={dept.id}
                          to={`/departments/${dept.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                              isActive
                                ? 'bg-[#38BDF8]/20 border border-sky-400/45 text-white font-semibold'
                                : 'text-slate-200 hover:bg-white/10 hover:text-white'
                            }`
                          }
                        >
                          <img
                            src={dept.image}
                            alt={dept.nameAr}
                            className="w-6 h-6 rounded object-cover border border-white/20 shrink-0"
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
                            ? 'bg-[#38BDF8] text-[#05222B]'
                            : 'bg-white/10 text-sky-300 group-hover:bg-white/15 group-hover:text-white'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                      </span>
                      <span className="truncate">{t('nav.contact')}</span>
                    </>
                  )}
                </NavLink>
              </nav>
            </div>

            {/* Pinned Bottom Actions */}
            <div className="p-3 border-t border-white/15 bg-[#05222B] flex flex-col gap-2 shrink-0">
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#38BDF8] to-[#0284C7] hover:from-[#7DD3FC] hover:to-[#0EA5E9] text-[#05222B] text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t('nav.bookAppointment')}</span>
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

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
