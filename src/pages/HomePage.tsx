import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  Clock,
  MapPin,
  Phone,
  Play,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDataStore } from '../context/DataStoreContext';
import { SafeImage } from '../components/SafeImage';
import { DoctorPortraitFrame } from '../components/ClinicLogoMark';
import { BookActionButton } from '../components/BookActionLink';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

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

  // Active open campaign (section ب)
  const activeCampaign = campaigns.find((c) => getCampaignEffectiveStatus(c) === 'open');
  const activeCampaignBooked = activeCampaign ? getCampaignBookedCount(activeCampaign.id) : 0;

  const featuredDoctor = doctors.find((d) => d.isFeatured) || doctors[0];
  const featuredServices = services.filter((s) => s.featuredOnHome).slice(0, 4);
  const featuredStories = stories.filter((s) => s.featuredOnHome).slice(0, 2);
  const featuredArticles = library
    .filter((l) => (l.type === 'article' || l.type === 'condition') && l.featuredOnHome)
    .slice(0, 2);
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
          <section key="hero" className="bg-white border-b border-slate-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                  className="lg:col-span-6 flex flex-col justify-center space-y-6"
                >
                  <p
                    className="text-xs sm:text-sm font-semibold"
                    style={{ color: 'var(--color-sky)' }}
                  >
                    {heroKicker}
                  </p>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.2] text-slate-900">
                    {heroTitle}
                  </h1>
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                    {heroSubtitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      to="/book"
                      style={{ backgroundColor: 'var(--color-petrol)' }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg hover:opacity-95 text-white text-sm sm:text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{heroPrimaryCta}</span>
                    </Link>
                    <a
                      href="#departments-section"
                      className="inline-flex items-center justify-center px-5 py-3.5 rounded-lg border border-slate-300 hover:border-[#0F4C5C] hover:text-[#0F4C5C] text-slate-700 text-sm sm:text-base font-medium transition-colors whitespace-nowrap"
                    >
                      {heroSecondaryCta}
                    </a>
                    <a
                      href="#clinic-location-section"
                      style={{ color: 'var(--color-sky)' }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-medium hover:underline whitespace-nowrap"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{t('common.clinicLocation')}</span>
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT_EXPO }}
                  className="lg:col-span-6"
                >
                  <SafeImage
                    src={homeHero.heroImage || localizedConfig.brand.heroImage}
                    alt={localizedConfig.brand.nameAr}
                    aspectClass="aspect-[16/10] lg:h-full lg:aspect-auto min-h-[260px]"
                    className="rounded-xl border border-slate-200"
                  />
                </motion.div>
              </div>
            </div>
          </section>
        );

      case 'campaign':
        if (!activeCampaign) return null;
        return (
          <section
            key="campaign"
            style={{ backgroundColor: 'var(--color-petrol)' }}
            className="text-white border-b border-black/15"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-sky-200 font-medium">
                    <span>{t('home.activeCampaignBadge')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeCampaign.dayLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {t('home.remainingSeats')}:{' '}
                      {Math.max(0, activeCampaign.totalCapacity - activeCampaignBooked)}{' '}
                      {t('home.seatsOf')} {activeCampaign.totalCapacity}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                    {activeCampaign.title}
                  </h2>
                  <p className="text-sm text-sky-100/90">{activeCampaign.serviceSummary}</p>
                </div>
                <div className="shrink-0">
                  <Link
                    to={`/campaigns/${activeCampaign.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-[#093542] hover:bg-sky-50 text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    <span>{t('home.campaignDetails')}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );

      case 'departments':
        return (
          <section key="departments" id="departments-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                  {t('home.departmentsHeading')}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1.5 max-w-2xl">
                  {t('home.departmentsSub')}
                </p>
              </div>
              <Link
                to="/services"
                className="text-sm font-semibold text-[#0F4C5C] hover:text-[#0284C7] inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>{t('nav.services')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept, idx) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.4, delay: idx * 0.06, ease: EASE_OUT_EXPO }}
                  whileHover={{ y: -4 }}
                  className="flex"
                >
                  <Link
                    to={`/departments/${dept.slug}`}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col w-full transition-colors duration-200 hover:border-[#0F4C5C]/45"
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
                </motion.div>
              ))}
            </div>
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

                    {/* Staggered Clinical Focus Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {featuredDoctor.focusAreas.slice(0, 4).map((area, i) => (
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
                          className="rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-[#0F4C5C]/40 transition-colors p-3.5 flex items-start gap-2.5"
                        >
                          <span className="font-mono text-xs font-bold text-[#0284C7] tabular-nums pt-0.5 shrink-0">
                            0{i + 1}.
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                            {area}
                          </span>
                        </motion.div>
                      ))}
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
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                    <BookActionButton
                      departmentId={featuredDoctor.departmentId}
                      doctorId={featuredDoctor.id}
                      sourceLabel={featuredDoctor.nameAr}
                      style={{ backgroundColor: 'var(--color-petrol)' }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg hover:opacity-95 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{t('common.bookNow')}</span>
                    </BookActionButton>

                    <Link
                      to={`/doctors/${featuredDoctor.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-lg border border-slate-300 hover:border-[#0F4C5C] text-slate-800 hover:text-[#0F4C5C] text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      <span>{t('home.doctorProfileCta')}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </Link>

                    <Link
                      to="/doctors"
                      className="text-sm font-medium text-slate-600 hover:text-[#0F4C5C] px-2 py-2 whitespace-nowrap"
                    >
                      {t('nav.doctors')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        );
      }

      case 'services':
        return (
          <section key="services" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                  {t('home.servicesHeading')}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1.5">{t('home.servicesSub')}</p>
              </div>
              <Link
                to="/services"
                className="text-sm font-semibold text-[#0F4C5C] hover:text-[#0284C7] inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>{t('common.viewAll')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredServices.map((srv, idx) => {
                const dept = departments.find((d) => d.id === srv.departmentId);
                const doc = doctors.find((d) => d.id === srv.doctorId);
                return (
                  <motion.div
                    key={srv.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.38, delay: idx * 0.06, ease: EASE_OUT_EXPO }}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 transition-colors hover:border-[#0F4C5C]/40"
                  >
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-[#0284C7]">0{idx + 1}.</span>
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

                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        to={`/services/${srv.slug}`}
                        className="text-sm font-semibold text-[#0F4C5C] hover:underline inline-flex items-center gap-1"
                      >
                        <span>{t('common.readMore')}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                      <BookActionButton
                        departmentId={srv.departmentId}
                        serviceId={srv.id}
                        doctorId={srv.doctorId || undefined}
                        sourceLabel={srv.title}
                        className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-[#0F4C5C] text-slate-800 hover:text-white transition-colors"
                      >
                        {t('common.bookService')}
                      </BookActionButton>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        );

      case 'stories':
        return (
          <section key="stories" className="bg-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-16">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                    {t('home.storiesHeading')}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 mt-1.5">{t('home.storiesSub')}</p>
                </div>
                <Link
                  to="/stories"
                  className="text-sm font-semibold text-[#0F4C5C] hover:text-[#0284C7] inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <span>{t('nav.stories')}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredStories.map((story) => {
                  const dept = departments.find((d) => d.id === story.departmentId);
                  return (
                    <Link
                      key={story.id}
                      to={`/stories/${story.slug}`}
                      className="group bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:border-[#0F4C5C]/40 transition-colors"
                    >
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>{dept?.nameAr}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{story.date}</span>
                        </div>
                        <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-[#0F4C5C]">
                          {story.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{story.summary}</p>
                      </div>
                      <div className="text-xs font-medium text-slate-500 pt-2 border-t border-slate-200/70 flex items-center justify-between">
                        <span>{story.patientLabel}</span>
                        <span className="text-[#0F4C5C] font-semibold inline-flex items-center gap-1">
                          <span>{t('common.readMore')}</span>
                          <ArrowIcon className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case 'library':
        return (
          <section key="library" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                  {t('home.libraryHeading')}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mt-1.5">{t('home.librarySub')}</p>
              </div>
              <Link
                to="/library"
                className="text-sm font-semibold text-[#0F4C5C] hover:text-[#0284C7] inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>{t('nav.library')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {featuredArticles.map((art) => {
                  const dept = departments.find((d) => d.id === art.departmentId);
                  return (
                    <Link
                      key={art.id}
                      to={`/library/${art.slug}`}
                      className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col"
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
                })}
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
          </section>
        );

      case 'news':
        return (
          <section key="news" className="bg-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-16">
              <div className="flex items-center justify-between gap-4 mb-8">
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                  {t('home.newsHeading')}
                </h2>
                <Link
                  to="/news"
                  className="text-sm font-semibold text-[#0F4C5C] hover:text-[#0284C7] inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <span>{t('common.viewAll')}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {news.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.slug}`}
                    className="group bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-3 hover:border-[#0F4C5C]/40 transition-colors"
                  >
                    <div className="space-y-2">
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
                    <span className="text-xs font-semibold text-[#0F4C5C] inline-flex items-center gap-1 pt-2">
                      <span>{t('common.readMore')}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );

      case 'faq':
        return (
          <section key="faq" className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-3">
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                  {t('home.faqHeading')}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {lang === 'ar'
                    ? 'إجابات سريعة حول آلية تأكيد المواعيد، وتحضير الأشعة، وتكامل أقسام المركز.'
                    : 'Quick answers about appointment confirmation, MRI preparation, and coordinated clinic care.'}
                </p>
                <Link
                  to="/library?type=faq"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F4C5C] hover:underline"
                >
                  <span>{t('common.viewAll')}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>

              <div className="lg:col-span-8 space-y-3">
                {homeFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full px-5 py-4 text-start flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-display font-semibold text-sm sm:text-base text-slate-900">
                          {faq.title}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                              {faq.faqAnswer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case 'location':
        return (
          <section
            key="location"
            id="clinic-location-section"
            className="bg-white border-t border-slate-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mb-8">
                {t('home.locationHeading')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-2">
                  <div className="flex items-center gap-2 text-[#0F4C5C] font-semibold text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{t('home.addressLabel')}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900">{localizedConfig.contact.city}</p>
                  <p className="text-sm text-slate-600">{localizedConfig.contact.address}</p>
                  <p className="text-xs text-slate-500">{localizedConfig.contact.landmark}</p>
                  <div className="pt-2">
                    {localizedConfig.contact.directionsUrl ? (
                      <a
                        href={localizedConfig.contact.directionsUrl}
                        className="text-sm font-semibold text-[#0284C7] hover:underline"
                      >
                        {t('common.getDirections')}
                      </a>
                    ) : (
                      <p className="text-xs text-[#0284C7] font-medium">
                        {localizedConfig.contact.directionsNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[#0F4C5C] font-semibold text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{t('home.workingDaysLabel')}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {localizedConfig.contact.workingDays}
                  </p>
                  <div className="space-y-1.5 text-sm text-slate-600">
                    {localizedConfig.contact.workingPeriods.map((period, idx) => (
                      <div key={idx} className="flex justify-between gap-2">
                        <span className="font-medium text-slate-800">{period.label}:</span>
                        <span className="tabular-nums">{period.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[#0F4C5C] font-semibold text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{t('home.phonesLabel')}</span>
                  </div>
                  <div className="space-y-2">
                    {localizedConfig.contact.phones.map((ph, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="text-slate-500 block text-xs">{ph.label}</span>
                        <span className="font-mono font-semibold text-slate-900 tabular-nums" dir="ltr">
                          {ph.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/contact"
                      className="text-sm font-semibold text-[#0F4C5C] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{t('nav.contact')}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div>{homepageSections.filter((s) => s.visible).map((s) => renderSection(s.id))}</div>
    </MotionConfig>
  );
};
