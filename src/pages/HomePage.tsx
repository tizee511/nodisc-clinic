import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  HelpCircle,
  MapPin,
  MessageSquare,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDataStore } from '../context/DataStoreContext';
import { SafeImage } from '../components/SafeImage';
import { DoctorPortraitFrame } from '../components/ClinicLogoMark';
import { BookActionButton } from '../components/BookActionLink';
import { SequentialCarousel } from '../components/SequentialCarousel';
import { EmergencyRedFlagsSection } from '../components/EmergencyRedFlagsSection';
import { ClinicalTrustStrip } from '../components/ClinicalTrustStrip';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const GeometricSectionDivider: React.FC<{ variant?: 'light' | 'subtle' }> = ({
  variant = 'light',
}) => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0.78 }}
    whileInView={{ opacity: 1, scaleX: 1 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
    aria-hidden="true"
    className={`w-full py-2 ${
      variant === 'subtle' ? 'bg-slate-50/70' : 'bg-transparent'
    }`}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#0F4C5C]/25 to-[#0F4C5C]/50" />
      <span className="w-1.5 h-1.5 rotate-45 border border-[#0284C7]/50 bg-white shrink-0" />
      <div className="relative w-7 h-7 rotate-45 rounded-[4px] border border-[#0F4C5C]/30 bg-white shadow-xs flex items-center justify-center shrink-0">
        <span className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-br from-[#0F4C5C] to-[#38BDF8]" />
      </div>
      <span className="w-1.5 h-1.5 rotate-45 border border-[#0284C7]/50 bg-white shrink-0" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#0F4C5C]/25 to-[#0F4C5C]/50" />
    </div>
  </motion.div>
);

const GeometricTitleRule: React.FC<{ light?: boolean }> = ({ light = false }) => (
  <div aria-hidden="true" className="flex items-center gap-1.5 mt-2">
    <span
      className={`h-[3px] w-10 rounded-full ${
        light
          ? 'bg-gradient-to-r from-[#38BDF8] to-white/80'
          : 'bg-gradient-to-r from-[#0F4C5C] to-[#38BDF8]'
      }`}
    />
    <span
      className={`w-1.5 h-1.5 rotate-45 rounded-[1px] ${
        light ? 'bg-[#38BDF8]' : 'bg-[#0284C7]'
      }`}
    />
    <span
      className={`h-[1.5px] w-4 rounded-full ${
        light ? 'bg-white/35' : 'bg-[#0F4C5C]/25'
      }`}
    />
  </div>
);

export const HomePage: React.FC = () => {
  const {
    lang,
    isRTL,
    t,
    localizedConfig,
    homepageSections,
    homeHero,
    departments,
    doctors,
    services,
    library,
    news,
    stories,
    campaigns,
  } = useLanguage();
  const { getCampaignBookedCount, getCampaignEffectiveStatus } = useDataStore();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [openFaqId, setOpenFaqId] = useState<string | null>(
    library.find((l) => l.type === 'faq')?.id || null
  );
  const [activePartnershipStep, setActivePartnershipStep] = useState<number>(0);

  // Campaigns sorted by priority: open -> scheduled -> full -> ended
  const orderedCampaigns = [...campaigns].sort((a, b) => {
    const rank: Record<string, number> = { open: 0, scheduled: 1, full: 2, ended: 3 };
    const sa = getCampaignEffectiveStatus(a);
    const sb = getCampaignEffectiveStatus(b);
    return (rank[sa] ?? 4) - (rank[sb] ?? 4);
  });

  const featuredDoctor = doctors.find((d) => d.isFeatured) || doctors[0];
  const sequentialServices = [
    ...services.filter((s) => s.featuredOnHome),
    ...services.filter((s) => !s.featuredOnHome),
  ];
  const sequentialStories = [
    ...stories.filter((s) => s.featuredOnHome),
    ...stories.filter((s) => !s.featuredOnHome),
  ];
  const libraryReadings = library.filter(
    (l) => l.type === 'article' || l.type === 'condition' || l.type === 'procedure'
  );
  const sequentialArticles = [
    ...libraryReadings.filter((l) => l.featuredOnHome),
    ...libraryReadings.filter((l) => !l.featuredOnHome),
  ];
  const featuredVideo =
    library.find((l) => l.type === 'video' && l.featuredOnHome) ||
    library.find((l) => l.type === 'video');
  const homeFaqs = library.filter((l) => l.type === 'faq' && l.featuredOnHome).slice(0, 4);

  const heroKicker = lang === 'ar' ? homeHero.kickerAr : t('home.heroKicker');
  const heroTitle = lang === 'ar' ? homeHero.titleAr : t('home.heroTitle');
  const heroSubtitle = lang === 'ar' ? homeHero.subtitleAr : t('home.heroSubtitle');
  const heroPrimaryCta = lang === 'ar' ? homeHero.primaryCtaAr : t('common.bookNow');
  const heroSecondaryCta = lang === 'ar' ? homeHero.secondaryCtaAr : t('common.exploreDepartments');

  const renderSection = (secId: string) => {
    switch (secId) {
      case 'hero':
        return (
          <section
            key="hero"
            className="relative bg-gradient-to-b from-white via-white to-sky-50/45 overflow-hidden"
          >
            {/* Subtle Architectural Grid & Ambient Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.045]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #0F4C5C 1px, transparent 1px), linear-gradient(to bottom, #0F4C5C 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -end-24 w-80 h-80 rounded-full bg-[#38BDF8]/12 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -start-24 w-72 h-72 rounded-full bg-[#0F4C5C]/10 blur-3xl"
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                  className="lg:col-span-6 flex flex-col justify-center space-y-6"
                >
                  <div className="inline-flex items-center gap-2">
                    <span
                      className="w-2 h-2 rotate-45 rounded-[1px] shrink-0"
                      style={{ backgroundColor: 'var(--color-sky)' }}
                      aria-hidden="true"
                    />
                    <p
                      className="text-xs sm:text-sm font-semibold"
                      style={{ color: 'var(--color-sky)' }}
                    >
                      {heroKicker}
                    </p>
                  </div>

                  <div>
                    <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.2] text-slate-900">
                      {heroTitle}
                    </h1>
                    <GeometricTitleRule />
                  </div>

                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                    {heroSubtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      to="/book"
                      className="btn-interactive btn-sheen btn-sheen-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0F4C5C] via-[#0F4C5C] to-[#0284C7] hover:from-[#093542] hover:to-[#0369A1] text-white border border-sky-300/40 ring-2 ring-[#0F4C5C]/15 text-sm sm:text-base font-bold shadow-[0_10px_24px_-8px_rgba(15,76,92,0.55)] hover:shadow-[0_14px_28px_-8px_rgba(2,132,199,0.55)] whitespace-nowrap"
                    >
                      <Calendar className="w-4 h-4 text-[#7DD3FC]" />
                      <span>{heroPrimaryCta}</span>
                    </Link>
                    {localizedConfig.contact.whatsappUrl && (
                      <a
                        href={`${localizedConfig.contact.whatsappUrl}?text=${encodeURIComponent(
                          lang === 'ar'
                            ? 'مرحبًا د. محمد الجرباني، أود حجز موعد استشارة طبية في نوديسك كلينك.'
                            : 'Hello Dr. Mohammed Al-Jurbani, I would like to book a consultation at NODISC Clinic.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-interactive btn-sheen inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border border-emerald-300/40 ring-2 ring-emerald-500/15 text-sm sm:text-base font-bold shadow-[0_10px_22px_-8px_rgba(16,185,129,0.55)] whitespace-nowrap"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-100" />
                        <span>{lang === 'ar' ? 'حجز سريع عبر واتساب' : 'Quick WhatsApp'}</span>
                      </a>
                    )}
                    <a
                      href="#departments-section"
                      className="btn-interactive inline-flex items-center justify-center px-5 py-3.5 rounded-xl border-2 border-[#0F4C5C]/25 bg-white/95 hover:border-[#0284C7] hover:bg-sky-50/70 text-[#0F4C5C] text-sm sm:text-base font-bold shadow-xs whitespace-nowrap"
                    >
                      {heroSecondaryCta}
                    </a>
                    <span
                      aria-hidden="true"
                      className="hidden sm:inline-block w-px h-6 bg-gradient-to-b from-transparent via-[#0F4C5C]/30 to-transparent mx-1"
                    />
                    <a
                      href="#clinic-location-section"
                      className="btn-interactive inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-sky-50/90 hover:bg-sky-100 border border-sky-200/90 text-[#0284C7] text-xs sm:text-sm font-bold whitespace-nowrap"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{t('common.clinicLocation')}</span>
                    </a>
                  </div>

                  {/* Interactive Color-Framed Clinical Trust Pillars */}
                  <ClinicalTrustStrip />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT_EXPO }}
                  className="lg:col-span-6 relative"
                >
                  <div className="relative h-full p-1.5 rounded-2xl bg-gradient-to-br from-[#0F4C5C]/15 via-sky-100/60 to-white border border-slate-200/80 shadow-sm">
                    <SafeImage
                      src={homeHero.heroImage || localizedConfig.brand.heroImage}
                      alt={localizedConfig.brand.nameAr}
                      aspectClass="aspect-[16/10] lg:h-full lg:aspect-auto min-h-[260px]"
                      className="rounded-xl"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        );

      case 'campaign':
        if (orderedCampaigns.length === 0) return null;
        return (
          <section
            key="campaign"
            style={{ backgroundColor: 'var(--color-petrol)' }}
            className="text-white border-y border-black/15"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-12"
            >
              <SequentialCarousel
                items={orderedCampaigns}
                keyExtractor={(camp) => camp.id}
                desktopCols={2}
                tabletCols={2}
                intervalMs={4200}
                theme="dark"
                ariaLabel={t('campaigns.title')}
                isRTL={isRTL}
                lang={lang}
                headerLeft={
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-sky-200">
                        {t('home.activeCampaignBadge')}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/15 text-white text-[11px] font-bold tabular-nums">
                        {orderedCampaigns.length}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                      {t('campaigns.title')}
                    </h2>
                    <p className="text-xs sm:text-sm text-sky-100/90 max-w-2xl">
                      {t('campaigns.subtitle')}
                    </p>
                  </div>
                }
                headerRightLink={
                  <Link
                    to="/campaigns"
                    className="btn-interactive btn-sheen inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#38BDF8] to-white text-[#093542] border border-sky-200 hover:shadow-[0_6px_16px_-4px_rgba(56,189,248,0.5)] text-xs font-extrabold whitespace-nowrap"
                  >
                    <span>{t('common.viewAll')}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                }
                renderItem={(camp) => {
                  const dept = departments.find((d) => d.id === camp.departmentId);
                  const booked = getCampaignBookedCount(camp.id);
                  const effectiveStatus = getCampaignEffectiveStatus(camp);
                  const remaining =
                    effectiveStatus === 'full'
                      ? 0
                      : Math.max(0, camp.totalCapacity - booked);

                  const statusBadgeStyle =
                    effectiveStatus === 'open'
                      ? 'bg-emerald-600 text-white'
                      : effectiveStatus === 'scheduled'
                      ? 'bg-[#0284C7] text-white'
                      : effectiveStatus === 'full'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-700 text-white';

                  return (
                    <Link
                      to={`/campaigns/${camp.slug}`}
                      className="group bg-white text-slate-900 rounded-xl border border-white/20 overflow-hidden flex flex-col justify-between w-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div>
                        {camp.image && (
                          <div className="relative overflow-hidden">
                            <SafeImage
                              src={camp.image}
                              alt={camp.title}
                              aspectClass="aspect-[16/9]"
                              className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                            />
                            <span
                              className={`absolute top-2.5 start-2.5 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs ${statusBadgeStyle}`}
                            >
                              {t(`campaigns.status.${effectiveStatus}`)}
                            </span>
                          </div>
                        )}
                        <div className="p-5 space-y-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            {dept && (
                              <span className="text-[#0284C7] font-semibold">{dept.nameAr}</span>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>{camp.dayLabel}</span>
                          </div>
                          <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#0F4C5C] line-clamp-2">
                            {camp.title}
                          </h3>
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {camp.serviceSummary}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                        <span className="text-slate-600 tabular-nums">
                          {t('home.remainingSeats')}:{' '}
                          <strong className="text-slate-900">{remaining}</strong> {t('home.seatsOf')}{' '}
                          {camp.totalCapacity}
                        </span>
                        <span className="text-[#0F4C5C] font-bold inline-flex items-center gap-1 whitespace-nowrap">
                          <span>
                            {effectiveStatus === 'open'
                              ? t('home.campaignDetails')
                              : t('common.readMore')}
                          </span>
                          <ArrowIcon className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                }}
              />
            </motion.div>
          </section>
        );

      case 'departments':
        return (
          <section
            key="departments"
            id="departments-section"
            className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-14"
          >
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
            <SequentialCarousel
              items={departments}
              keyExtractor={(dept) => dept.id}
              desktopCols={3}
              tabletCols={2}
              intervalMs={4200}
              ariaLabel={t('home.departmentsHeading')}
              isRTL={isRTL}
              lang={lang}
              headerLeft={
                <div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                    {t('home.departmentsHeading')}
                  </h2>
                  <GeometricTitleRule />
                  <p className="text-sm sm:text-base text-slate-600 mt-2.5 max-w-2xl">
                    {t('home.departmentsSub')}
                  </p>
                </div>
              }
              headerRightLink={
                <Link
                  to="/services"
                  className="btn-interactive inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] hover:bg-sky-50/70 text-sm font-bold text-[#0F4C5C] shadow-xs"
                >
                  <span>{t('nav.services')}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              }
              renderItem={(dept) => (
                <Link
                  to={`/departments/${dept.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col w-full transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0F4C5C]/45"
                >
                  <SafeImage
                    src={dept.image}
                    alt={dept.nameAr}
                    aspectClass="aspect-[4/3]"
                    className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  />
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs text-slate-500 block mb-1" dir="ltr">
                        {dept.nameEn}
                      </span>
                      <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-[#0F4C5C] transition-colors">
                        {dept.nameAr}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">{dept.shortDesc}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0F4C5C]">
                      <span>{t('common.readMore')}</span>
                      <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              )}
            />
            </motion.div>
          </section>
        );

      case 'doctor': {
        if (!featuredDoctor) return null;
        const featuredDept = departments.find((d) => d.id === featuredDoctor.departmentId);
        return (
          <section key="doctor" className="bg-slate-50/75 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
              >
                {/* Portrait Column */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: 0.08, ease: EASE_OUT_EXPO }}
                  className="lg:col-span-5 relative min-h-[360px] lg:min-h-[480px] bg-slate-100 overflow-hidden group border-b lg:border-b-0 lg:border-e border-slate-200 flex items-stretch"
                >
                  {featuredDoctor.imageUrl ? (
                    <>
                      <img
                        src={featuredDoctor.imageUrl}
                        alt={featuredDoctor.nameAr}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#093542]/92 via-[#093542]/45 to-transparent p-6 pt-16 text-white">
                        <p className="text-xs font-medium text-sky-200">
                          {featuredDept?.nameAr}
                        </p>
                        <p className="font-display font-bold text-lg sm:text-xl mt-0.5">
                          {featuredDoctor.nameAr}
                        </p>
                        <p className="text-xs text-slate-200/90 mt-0.5" dir="ltr">
                          {featuredDoctor.nameEn}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full p-6 flex items-center justify-center">
                      <DoctorPortraitFrame
                        imageUrl={featuredDoctor.imageUrl}
                        name={featuredDoctor.nameAr}
                        placeholderNote={featuredDoctor.imagePlaceholderNote}
                        size="lg"
                      />
                    </div>
                  )}
                </motion.div>

                {/* Editorial Details Column */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#0284C7]">
                      <span>{t('home.doctorSectionHeading')}</span>
                      {featuredDept && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500 font-medium">{featuredDept.nameAr}</span>
                        </>
                      )}
                    </div>

                    <div>
                      <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
                        {featuredDoctor.nameAr}
                      </h2>
                      <p
                        className="text-sm sm:text-base font-medium mt-1.5"
                        style={{ color: 'var(--color-petrol)' }}
                      >
                        {featuredDoctor.roleTitle}
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                      {featuredDoctor.bio}
                    </p>

                    {/* Staggered Interactive Clinical Focus Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {featuredDoctor.focusAreas.slice(0, 4).map((area, i) => {
                        const badgeColors = [
                          'from-[#0F4C5C] to-[#0284C7]',
                          'from-[#0284C7] to-indigo-600',
                          'from-emerald-600 to-teal-600',
                          'from-amber-600 to-[#0F4C5C]',
                        ];
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                              duration: 0.35,
                              delay: 0.12 + i * 0.06,
                              ease: EASE_OUT_EXPO,
                            }}
                          >
                            <BookActionButton
                              departmentId={featuredDoctor.departmentId}
                              doctorId={featuredDoctor.id}
                              sourceLabel={area}
                              className="btn-interactive group w-full text-start rounded-xl border border-slate-200/90 bg-gradient-to-br from-slate-50/90 to-white hover:from-sky-50/80 hover:to-white hover:border-[#0284C7]/55 hover:shadow-sm p-3.5 flex items-center justify-between gap-2.5"
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <span
                                  className={`w-6 h-6 rounded-lg bg-gradient-to-br ${
                                    badgeColors[i % badgeColors.length]
                                  } text-white font-mono text-[11px] font-bold tabular-nums inline-flex items-center justify-center shrink-0 mt-0.5 shadow-2xs`}
                                >
                                  0{i + 1}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-[#0F4C5C] leading-snug transition-colors">
                                  {area}
                                </span>
                              </div>
                              <ArrowIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0284C7] shrink-0 transition-transform group-hover:-translate-x-0.5" />
                            </BookActionButton>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Interactive 3-Step Patient Partnership Track */}
                    <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-[#0F4C5C]/30 via-[#0284C7]/45 to-emerald-400/40 shadow-xs">
                      <div className="rounded-[14.5px] bg-gradient-to-br from-sky-50/85 via-white to-emerald-50/40 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#0F4C5C]">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#0284C7] text-white inline-flex items-center justify-center shrink-0">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </span>
                            <span>
                              {lang === 'ar'
                                ? 'المريض شريك في القرار العلاجي — مراحل الاستشارة:'
                                : 'Patient-Partnered Care — 3-Step Consultation:'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          {(lang === 'ar'
                            ? [
                                {
                                  num: '01',
                                  title: 'تقييم الحالة والتاريخ المرضي',
                                  tip: 'يستمع الاستشاري لتفاصيل الألم، مدة الأعراض، والعلاجات السابقة لوضع صورة سريرية دقيقة.',
                                },
                                {
                                  num: '02',
                                  title: 'مراجعة الفحوصات وتفسير MRI',
                                  tip: 'تُعرض مقاطع الرنين المغناطيسي مع شرح واضح لموقع الضغط العصبي أو الغضروف للمريض.',
                                },
                                {
                                  num: '03',
                                  title: 'مناقشة الخطة العلاجية المناسبة',
                                  tip: 'نبدأ بالحلول التحفظية غير الجراحية أولاً، ولا نلجأ للجراحة إلا عند الضرورة القصوى.',
                                },
                              ]
                            : [
                                {
                                  num: '01',
                                  title: 'Symptom & History Assessment',
                                  tip: 'Thorough neurological evaluation of pain patterns, duration, and prior therapies.',
                                },
                                {
                                  num: '02',
                                  title: 'MRI & Diagnostic Review',
                                  tip: 'Side-by-side visual walkthrough of spine/brain MRI slices in plain language.',
                                },
                                {
                                  num: '03',
                                  title: 'Shared Treatment Plan',
                                  tip: 'Conservative non-surgical therapy first; minimally invasive surgery only when truly indicated.',
                                },
                              ]
                          ).map((step, idx) => {
                            const isSelected = activePartnershipStep === idx;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActivePartnershipStep(idx)}
                                aria-pressed={isSelected}
                                className={`btn-interactive text-start rounded-xl px-3 py-2.5 border transition-all flex items-center gap-2 ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border-[#0284C7] shadow-[0_6px_14px_-4px_rgba(2,132,199,0.45)]'
                                    : 'bg-white border-sky-200/80 text-slate-800 hover:border-[#0284C7] hover:bg-sky-50/70'
                                }`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-lg font-mono text-[11px] font-extrabold tabular-nums inline-flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-sky-100 text-[#0F4C5C]'
                                  }`}
                                >
                                  {step.num}
                                </span>
                                <span className="font-bold leading-snug">{step.title}</span>
                              </button>
                            );
                          })}
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activePartnershipStep}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                            className="rounded-xl bg-white/95 border border-sky-200/80 px-3.5 py-2.5 text-xs text-slate-700 leading-relaxed flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                            <span>
                              {
                                (lang === 'ar'
                                  ? [
                                      'يستمع الاستشاري لتفاصيل الألم، مدة الأعراض، والعلاجات السابقة لوضع صورة سريرية دقيقة.',
                                      'تُعرض مقاطع الرنين المغناطيسي مع شرح واضح لموقع الضغط العصبي أو الغضروف للمريض.',
                                      'نبدأ بالحلول التحفظية غير الجراحية أولاً، ولا نلجأ للجراحة إلا عند الضرورة القصوى.',
                                    ]
                                  : [
                                      'Thorough neurological evaluation of pain patterns, duration, and prior therapies.',
                                      'Side-by-side visual walkthrough of spine/brain MRI slices in plain language.',
                                      'Conservative non-surgical therapy first; minimally invasive surgery only when truly indicated.',
                                    ])[activePartnershipStep]
                              }
                            </span>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Qualifications Highlight */}
                    {featuredDoctor.qualifications.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                        <p className="font-semibold text-slate-900">
                          {lang === 'ar'
                            ? 'أبرز المؤهلات والمسار السريري:'
                            : 'Key Credentials & Clinical Focus:'}
                        </p>
                        <p className="leading-relaxed">
                          {featuredDoctor.qualifications.slice(0, 2).join(' · ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CTA Action Row */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="rounded-xl bg-gradient-to-r from-[#0F4C5C]/8 via-sky-50 to-emerald-50/60 border border-[#0F4C5C]/20 px-4 py-2.5">
                      <p className="text-xs font-bold text-[#0F4C5C]">
                        {lang === 'ar'
                          ? 'لا تؤجل صحتك وعافيتك — احصل على رأي طبي استشاري موثوق في آلام الظهر والرقبة والأعصاب.'
                          : 'Do not delay your recovery — get a trusted neurosurgical & spine consultation.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <BookActionButton
                        departmentId={featuredDoctor.departmentId}
                        doctorId={featuredDoctor.id}
                        sourceLabel={featuredDoctor.nameAr}
                        className="btn-interactive btn-sheen inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] hover:from-[#093542] hover:to-[#0369A1] text-white border border-sky-300/40 text-sm font-bold shadow-[0_8px_20px_-6px_rgba(15,76,92,0.5)] whitespace-nowrap"
                      >
                        <Calendar className="w-4 h-4 text-[#7DD3FC]" />
                        <span>{t('common.bookNow')}</span>
                      </BookActionButton>

                      {localizedConfig.contact.whatsappUrl && (
                        <a
                          href={`${localizedConfig.contact.whatsappUrl}?text=${encodeURIComponent(
                            lang === 'ar'
                              ? 'مرحبًا د. محمد الجرباني، أود حجز موعد استشارة طبية.'
                              : 'Hello Dr. Mohammed Al-Jurbani, I would like to book a consultation.'
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-interactive btn-sheen inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border border-emerald-300/40 text-sm font-bold shadow-[0_8px_18px_-6px_rgba(16,185,129,0.45)] whitespace-nowrap"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'حجز عبر واتساب' : 'Book via WhatsApp'}</span>
                        </a>
                      )}

                      <Link
                        to={`/doctors/${featuredDoctor.slug}`}
                        className="btn-interactive inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] hover:bg-sky-50/70 text-[#0F4C5C] text-sm font-bold whitespace-nowrap"
                      >
                        <span>{t('home.doctorProfileCta')}</span>
                        <ArrowIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        );
      }

      case 'services':
        return (
          <section key="services" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
            <SequentialCarousel
              items={sequentialServices}
              keyExtractor={(srv) => srv.id}
              desktopCols={2}
              tabletCols={2}
              intervalMs={3800}
              ariaLabel={t('home.servicesHeading')}
              isRTL={isRTL}
              lang={lang}
              headerLeft={
                <div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                    {t('home.servicesHeading')}
                  </h2>
                  <GeometricTitleRule />
                  <p className="text-sm sm:text-base text-slate-600 mt-2.5">{t('home.servicesSub')}</p>
                </div>
              }
              headerRightLink={
                <Link
                  to="/services"
                  className="btn-interactive inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] hover:bg-sky-50/70 text-sm font-bold text-[#0F4C5C] shadow-xs"
                >
                  <span>{t('common.viewAll')}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              }
              renderItem={(srv, idx) => {
                const dept = departments.find((d) => d.id === srv.departmentId);
                const doc = doctors.find((d) => d.id === srv.doctorId);
                return (
                  <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between w-full transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0284C7]/50 hover:shadow-md">
                    <div>
                      {srv.image && (
                        <Link to={`/services/${srv.slug}`} className="block overflow-hidden">
                          <SafeImage
                            src={srv.image}
                            alt={srv.title}
                            aspectClass="aspect-[16/9]"
                            className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                          />
                        </Link>
                      )}
                      <div className="p-6 pb-4 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono font-bold text-[#0284C7] tabular-nums">
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          <span>{dept?.nameAr}</span>
                          {doc && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{doc.nameAr}</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-lg text-slate-900">
                          <Link to={`/services/${srv.slug}`} className="hover:text-[#0F4C5C]">
                            {srv.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{srv.shortDesc}</p>
                      </div>
                    </div>

                    <div className="px-6 pb-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        to={`/services/${srv.slug}`}
                        className="text-sm font-bold text-[#0F4C5C] hover:text-[#0284C7] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>{t('common.readMore')}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                      <BookActionButton
                        departmentId={srv.departmentId}
                        serviceId={srv.id}
                        doctorId={srv.doctorId || undefined}
                        sourceLabel={srv.title}
                        className="btn-interactive btn-sheen text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border border-sky-300/30 shadow-xs"
                      >
                        {t('common.bookService')}
                      </BookActionButton>
                    </div>
                  </div>
                );
              }}
            />
            </motion.div>
          </section>
        );

      case 'stories':
        return (
          <section key="stories" className="bg-white border-y border-slate-200/80">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-14"
            >
              <SequentialCarousel
                items={sequentialStories}
                keyExtractor={(story) => story.id}
                desktopCols={2}
                tabletCols={2}
                intervalMs={4400}
                ariaLabel={t('home.storiesHeading')}
                isRTL={isRTL}
                lang={lang}
                headerLeft={
                  <div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                      {t('home.storiesHeading')}
                    </h2>
                    <GeometricTitleRule />
                    <p className="text-sm sm:text-base text-slate-600 mt-2.5">{t('home.storiesSub')}</p>
                  </div>
                }
                headerRightLink={
                  <Link
                    to="/stories"
                    className="btn-interactive inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] hover:bg-sky-50/70 text-sm font-bold text-[#0F4C5C] shadow-xs"
                  >
                    <span>{t('nav.stories')}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                }
                renderItem={(story) => {
                  const dept = departments.find((d) => d.id === story.departmentId);
                  return (
                    <Link
                      to={`/stories/${story.slug}`}
                      className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between w-full hover:border-[#0F4C5C]/40 transition-colors"
                    >
                      <div>
                        {story.image && (
                          <SafeImage
                            src={story.image}
                            alt={story.title}
                            aspectClass="aspect-[16/9]"
                            className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                          />
                        )}
                        <div className="p-6 pb-4 space-y-2.5">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="text-[#0284C7] font-medium">{dept?.nameAr}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{story.date}</span>
                          </div>
                          <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-[#0F4C5C]">
                            {story.title}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed">{story.summary}</p>
                        </div>
                      </div>
                      <div className="px-6 py-3.5 text-xs font-medium text-slate-500 border-t border-slate-200/70 flex items-center justify-between">
                        <span>{story.patientLabel}</span>
                        <span className="text-[#0F4C5C] font-semibold inline-flex items-center gap-1">
                          <span>{t('common.readMore')}</span>
                          <ArrowIcon className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                }}
              />
            </motion.div>
          </section>
        );

      case 'library':
        return (
          <section key="library" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-14">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                  {t('home.libraryHeading')}
                </h2>
                <GeometricTitleRule />
                <p className="text-sm sm:text-base text-slate-600 mt-2.5">{t('home.librarySub')}</p>
              </div>
              <Link
                to="/library"
                className="btn-interactive inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] hover:bg-sky-50/70 text-sm font-bold text-[#0F4C5C] shadow-xs self-start sm:self-auto"
              >
                <span>{t('nav.library')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between">
                <SequentialCarousel
                  items={sequentialArticles}
                  keyExtractor={(art) => art.id}
                  desktopCols={2}
                  tabletCols={2}
                  intervalMs={4600}
                  compactHeader
                  ariaLabel={t('home.libraryHeading')}
                  isRTL={isRTL}
                  lang={lang}
                  headerLeft={
                    <span className="text-xs font-semibold text-[#0284C7]">
                      {lang === 'ar'
                        ? 'مقالات وحالات طبية متسلسلة'
                        : 'Featured Medical Readings'}
                    </span>
                  }
                  renderItem={(art) => {
                    const dept = departments.find((d) => d.id === art.departmentId);
                    return (
                      <Link
                        to={`/library/${art.slug}`}
                        className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col w-full hover:border-[#0F4C5C]/40 transition-colors"
                      >
                        <SafeImage src={art.image} alt={art.title} aspectClass="aspect-[4/3]" />
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mb-1.5">
                              <span className="text-[#0284C7] font-medium">{art.typeLabel}</span>
                              <span aria-hidden="true">·</span>
                              <span>{dept?.nameAr}</span>
                            </div>
                            <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#0F4C5C]">
                              {art.title}
                            </h3>
                            <p className="text-sm text-slate-600 mt-2 line-clamp-3">{art.summary}</p>
                          </div>
                          <span className="text-xs font-semibold text-[#0F4C5C] inline-flex items-center gap-1">
                            <span>{t('common.readMore')}</span>
                            <ArrowIcon className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </Link>
                    );
                  }}
                />
              </div>

              {featuredVideo && (
                <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl overflow-hidden flex flex-col justify-between border border-slate-800">
                  <div className="relative">
                    <SafeImage
                      src={featuredVideo.image}
                      alt={featuredVideo.title}
                      aspectClass="aspect-[16/10]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex items-center justify-center">
                      <Link
                        to={`/library/${featuredVideo.slug}`}
                        aria-label={featuredVideo.title}
                        className="w-14 h-14 rounded-full bg-white/95 text-[#0F4C5C] flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      >
                        <Play className="w-6 h-6 fill-current" />
                      </Link>
                    </div>
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-sky-300 font-medium flex items-center gap-2 mb-1.5">
                        <span>{t('home.featuredVideoLabel')}</span>
                        {featuredVideo.videoDuration && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{featuredVideo.videoDuration}</span>
                          </>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-lg text-white">
                        {featuredVideo.title}
                      </h3>
                      <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                        {featuredVideo.summary}
                      </p>
                    </div>
                    <Link
                      to={`/library/${featuredVideo.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300 hover:text-white pt-2"
                    >
                      <span>{lang === 'ar' ? 'مشاهدة التفاصيل' : 'Watch Details'}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8">
              <EmergencyRedFlagsSection compact />
            </div>
            </motion.div>
          </section>
        );

      case 'news':
        return (
          <section key="news" className="bg-white border-y border-slate-200/80">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-14"
            >
              <SequentialCarousel
                items={news}
                keyExtractor={(item) => item.id}
                desktopCols={2}
                tabletCols={2}
                intervalMs={4000}
                ariaLabel={t('home.newsHeading')}
                isRTL={isRTL}
                lang={lang}
                headerLeft={
                  <div>
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                      {t('home.newsHeading')}
                    </h2>
                    <GeometricTitleRule />
                  </div>
                }
                headerRightLink={
                  <Link
                    to="/news"
                    className="btn-interactive inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] hover:bg-sky-50/70 text-sm font-bold text-[#0F4C5C] shadow-xs"
                  >
                    <span>{t('common.viewAll')}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                }
                renderItem={(item) => (
                  <Link
                    to={`/news/${item.slug}`}
                    className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between w-full hover:border-[#0F4C5C]/40 transition-colors"
                  >
                    <div>
                      <SafeImage src={item.image} alt={item.title} aspectClass="aspect-[16/9]" />
                      <div className="p-5 space-y-2">
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="text-[#0284C7] font-medium">{item.categoryLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{item.date}</span>
                        </div>
                        <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#0F4C5C]">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-3">{item.summary}</p>
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <span className="text-xs font-semibold text-[#0F4C5C] inline-flex items-center gap-1 pt-2 border-t border-slate-200/70 w-full">
                        <span>{t('common.readMore')}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                )}
              />
            </motion.div>
          </section>
        );

      case 'faq':
        return (
          <section key="faq" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
            >
              {/* Standout Dark Petrol FAQ Intro & Booking Guide Panel */}
              <div className="lg:col-span-5 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#062B35] via-[#093542] to-[#0F4C5C] text-white p-6 sm:p-8 shadow-lg border border-sky-400/20 space-y-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-12 -end-12 w-40 h-40 rounded-full bg-[#38BDF8]/15 blur-2xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-4 end-4 w-20 h-20 rotate-45 border border-white/10 rounded-xl"
                />

                <div className="relative space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-sky-200 text-xs font-semibold">
                    <HelpCircle className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>
                      {lang === 'ar' ? 'دليل الحجز والخدمات السريع' : 'Booking & Care Guide'}
                    </span>
                  </div>

                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-white leading-snug">
                    {t('home.faqHeading')}
                  </h2>
                  <GeometricTitleRule light />

                  <p className="text-sm text-slate-200 leading-relaxed pt-1">
                    {lang === 'ar'
                      ? 'إجابات واضحة ومرتبة حول آلية تأكيد المواعيد، تحضير فحوصات الرنين المغناطيسي، وتكامل خدمات علاج الألم والتأهيل والصيدلية.'
                      : 'Clear answers on appointment confirmation, MRI preparation, and coordinated pain, rehabilitation & pharmacy services.'}
                  </p>
                </div>

                <ul className="relative space-y-2.5 text-xs sm:text-sm text-slate-100 border-t border-white/15 pt-4">
                  {[
                    lang === 'ar' ? 'تأكيد المواعيد برقم مرجعي وإشعار فوري' : 'Instant reference ID & schedule confirmation',
                    lang === 'ar' ? 'تجهيز الأشعة والتقارير قبل الاستشارة الأولى' : 'First-visit MRI & medical records guidance',
                    lang === 'ar' ? 'تكامل خطة علاج الألم مع العلاج الطبيعي' : 'Integrated pain care & physiotherapy sessions',
                  ].map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative flex flex-wrap items-center gap-3 pt-2 border-t border-white/15">
                  <Link
                    to="/book"
                    className="btn-interactive btn-sheen inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#0284C7] hover:from-[#7DD3FC] hover:to-[#0EA5E9] text-[#05222B] border border-sky-200/70 text-xs sm:text-sm font-extrabold shadow-[0_6px_18px_-4px_rgba(56,189,248,0.5)] whitespace-nowrap"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{t('common.bookNow')}</span>
                  </Link>
                  <span
                    aria-hidden="true"
                    className="hidden sm:inline-block w-px h-5 bg-white/20"
                  />
                  <Link
                    to="/library?type=faq"
                    className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold whitespace-nowrap"
                  >
                    <span>{t('common.viewAll')}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Numbered Accordion List */}
              <div className="lg:col-span-7 space-y-3">
                {homeFaqs.map((faq, idx) => {
                  const isOpen = openFaqId === faq.id;
                  const dept = departments.find((d) => d.id === faq.departmentId);
                  return (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: idx * 0.06, ease: EASE_OUT_EXPO }}
                      className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                        isOpen
                          ? 'bg-sky-50/45 border-[#0F4C5C]/45 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-[#0F4C5C]/30'
                      }`}
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full px-4 sm:px-5 py-4 text-start flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3 min-w-0">
                          <span
                            className={`w-7 h-7 rounded-lg text-xs font-mono font-bold tabular-nums inline-flex items-center justify-center shrink-0 transition-colors ${
                              isOpen
                                ? 'bg-[#0F4C5C] text-white'
                                : 'bg-slate-100 text-[#0F4C5C]'
                            }`}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 space-y-0.5">
                            {dept && (
                              <span className="block text-[11px] font-semibold text-[#0284C7]">
                                {dept.nameAr}
                              </span>
                            )}
                            <span className="block font-display font-bold text-sm sm:text-base text-slate-900 leading-snug">
                              {faq.title}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`w-8 h-8 rounded-lg inline-flex items-center justify-center shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-[#0F4C5C]/10 text-[#0F4C5C]'
                              : 'bg-slate-100/80 text-slate-500'
                          }`}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 sm:px-5 pb-4 pt-3 text-sm text-slate-700 leading-relaxed border-t border-[#0F4C5C]/15 bg-white/80">
                              {faq.faqAnswer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </section>
        );

      case 'location':
        return (
          <section
            key="location"
            id="clinic-location-section"
            className="bg-gradient-to-b from-slate-50 via-sky-50/35 to-white border-t border-slate-200"
          >
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-8"
            >
              {/* Section Heading + Quick Action Links separated cleanly */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'ar'
                        ? 'خدمة المراجعين والوصول السريع'
                        : 'Patient Access & Direct Desk'}
                    </span>
                  </span>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                    {t('home.locationHeading')}
                  </h2>
                  <GeometricTitleRule />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    to="/book"
                    className="btn-interactive btn-sheen inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border border-sky-300/35 text-xs sm:text-sm font-bold shadow-[0_6px_18px_-5px_rgba(15,76,92,0.45)] whitespace-nowrap"
                  >
                    <Calendar className="w-4 h-4 text-[#7DD3FC]" />
                    <span>{t('common.bookNow')}</span>
                  </Link>
                  <span
                    aria-hidden="true"
                    className="hidden sm:inline-block w-px h-5 bg-slate-300"
                  />
                  <Link
                    to="/contact"
                    className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] hover:bg-sky-50/70 text-[#0F4C5C] text-xs sm:text-sm font-bold whitespace-nowrap"
                  >
                    <span>{t('nav.contact')}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Reordered & Elevated 3-Card Hub: Direct Contact (Highlighted) -> Working Hours -> Clinic Location */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* 1. Highlighted Direct Contact Anchor Card */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.04, ease: EASE_OUT_EXPO }}
                  className="lg:col-span-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#062B35] via-[#093542] to-[#0F4C5C] text-white p-6 shadow-md border border-sky-400/20 flex flex-col justify-between space-y-5"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-10 -end-10 w-32 h-32 rounded-full bg-[#38BDF8]/15 blur-2xl"
                  />
                  <div className="relative space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-[#38BDF8] inline-flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-white">
                          {t('home.phonesLabel')}
                        </h3>
                        <p className="text-xs text-sky-200/85">
                          {lang === 'ar'
                            ? 'للاستفسارات السريعة وتنسيق المواعيد'
                            : 'For quick inquiries & booking coordination'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {localizedConfig.contact.phones.map((ph, idx) => (
                        <a
                          key={idx}
                          href={`tel:${ph.value.replace(/\s+/g, '')}`}
                          className="btn-interactive flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#38BDF8]/60"
                        >
                          <span className="text-xs text-sky-100 font-medium">{ph.label}</span>
                          <span
                            className="font-mono text-sm font-bold text-white tabular-nums"
                            dir="ltr"
                          >
                            {ph.value}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="relative pt-3 border-t border-white/15 flex items-center justify-between gap-2">
                    <Link
                      to="/contact"
                      className="text-xs sm:text-sm font-semibold text-[#7DD3FC] hover:text-white inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>
                        {lang === 'ar' ? 'نموذج التواصل والشكاوى' : 'Contact & Inquiry Form'}
                      </span>
                      <ArrowIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>

                {/* 2. Elevated Working Days & Hours Card */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: EASE_OUT_EXPO }}
                  className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 border-t-4 border-t-[#0284C7] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-[#0284C7] inline-flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
                          {t('home.workingDaysLabel')}
                        </h3>
                        <p className="text-xs font-semibold text-[#0F4C5C]">
                          {localizedConfig.contact.workingDays}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {localizedConfig.contact.workingPeriods.map((period, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm"
                        >
                          <span className="font-semibold text-slate-800">{period.label}</span>
                          <span className="font-mono font-semibold text-[#0F4C5C] tabular-nums">
                            {period.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 pt-3 border-t border-slate-100">
                    {lang === 'ar'
                      ? 'يفضل الحجز المسبق لتفادي وقت الانتظار في الفترات المزدحمة.'
                      : 'Advance booking is recommended during peak consultation periods.'}
                  </p>
                </motion.div>

                {/* 3. Elevated Clinic Location & Directions Card */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.16, ease: EASE_OUT_EXPO }}
                  className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 border-t-4 border-t-[#0F4C5C] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[#0F4C5C]/10 border border-[#0F4C5C]/20 text-[#0F4C5C] inline-flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
                          {t('home.addressLabel')}
                        </h3>
                        <p className="text-xs font-semibold text-[#0284C7]">
                          {localizedConfig.contact.city}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                      {localizedConfig.contact.address}
                    </p>

                    <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">
                        {lang === 'ar' ? 'أقرب معلم: ' : 'Landmark: '}
                      </span>
                      {localizedConfig.contact.landmark}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    {localizedConfig.contact.directionsUrl ? (
                      <a
                        href={localizedConfig.contact.directionsUrl}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F4C5C] hover:text-[#0284C7] transition-colors"
                      >
                        <span>{t('common.getDirections')}</span>
                        <ArrowIcon className="w-4 h-4" />
                      </a>
                    ) : (
                      <p className="text-xs text-[#0284C7] font-semibold">
                        {localizedConfig.contact.directionsNote}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </section>
        );

      default:
        return null;
    }
  };

  const visibleSections = homepageSections.filter((s) => s.visible);

  return (
    <MotionConfig reducedMotion="user">
      <div>
        {visibleSections.map((sec, index) => {
          const content = renderSection(sec.id);
          if (!content) return null;
          const isLast = index === visibleSections.length - 1;
          const nextSec = !isLast ? visibleSections[index + 1] : null;
          // Skip extra standalone divider right before/after dark Petrol campaign band
          const showDivider =
            !isLast && sec.id !== 'campaign' && nextSec?.id !== 'campaign';
          return (
            <React.Fragment key={sec.id}>
              {content}
              {showDivider && <GeometricSectionDivider />}
            </React.Fragment>
          );
        })}
      </div>
    </MotionConfig>
  );
};
