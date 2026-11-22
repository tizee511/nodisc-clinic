import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  Clock,
  FileUp,
  Phone,
  ShoppingBag,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { DoctorPortraitFrame } from '../components/ClinicLogoMark';
import { BookActionButton } from '../components/BookActionLink';

export const DepartmentPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const {
    lang,
    isRTL,
    t,
    localizedConfig,
    departments,
    services,
    doctors,
    library,
    stories,
    productCategories,
  } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const dept = departments.find((d) => d.slug === slug || d.id === slug);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  if (!dept) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'القسم غير متاح في البيانات الحالية' : 'Department not found'}
        </h1>
        <Link
          to="/"
          className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold"
        >
          {t('nav.home')}
        </Link>
      </div>
    );
  }

  const deptServices = services.filter((s) => s.departmentId === dept.id);
  const deptDoctors = doctors.filter((d) => d.departmentId === dept.id);
  const deptTopics = library.filter((l) => l.departmentId === dept.id && l.type !== 'faq' && l.type !== 'video');
  const deptVideos = library.filter((l) => l.departmentId === dept.id && l.type === 'video');
  const deptStories = stories.filter((s) => s.departmentId === dept.id);
  const deptFaqs = library.filter((l) => l.departmentId === dept.id && l.type === 'faq');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-12">
      <div>
        <Breadcrumbs
          items={[
            { label: t('nav.departments'), to: '/#departments-section' },
            { label: dept.nameAr },
          ]}
        />

        {/* 1. Department Intro */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-5">
              <div>
                <span className="text-xs font-medium text-[#0284C7] block mb-1" dir="ltr">
                  {dept.nameEn}
                </span>
                <h1 className="font-display font-bold text-2xl sm:text-4xl text-slate-900">
                  {dept.nameAr}
                </h1>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">{dept.shortDesc}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {dept.isPharmacy ? (
                  <>
                    <Link
                      to="/store"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t('departmentPage.openStoreCta')}</span>
                    </Link>
                    <Link
                      to="/store/prescription"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 hover:border-[#0F4C5C] text-slate-800 hover:text-[#0F4C5C] text-sm font-semibold transition-colors"
                    >
                      <FileUp className="w-4 h-4" />
                      <span>{t('departmentPage.uploadPrescriptionCta')}</span>
                    </Link>
                  </>
                ) : (
                  <BookActionButton
                    departmentId={dept.id}
                    sourceLabel={dept.nameAr}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{dept.ctaLabel}</span>
                  </BookActionButton>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <SafeImage
                src={dept.image}
                alt={dept.nameAr}
                aspectClass="aspect-[4/3] lg:h-full lg:aspect-auto min-h-[240px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Overview & Scope */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <h2 className="font-display font-bold text-2xl text-slate-900 mb-3">
            {t('departmentPage.scopeHeading')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {dept.fullOverview}
          </p>
        </div>
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dept.scopeItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 text-sm text-slate-700 leading-relaxed"
            >
              <span className="text-xs font-semibold text-[#0284C7] block mb-1.5">
                0{idx + 1}.
              </span>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Pharmacy-specific: Categories & Store Entry */}
      {dept.isPharmacy && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display font-bold text-2xl text-slate-900">
              {t('departmentPage.pharmacyCategoriesHeading')}
            </h2>
            <Link
              to="/store"
              className="text-sm font-semibold text-[#0F4C5C] hover:underline inline-flex items-center gap-1"
            >
              <span>{t('departmentPage.openStoreCta')}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {productCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/store/category/${cat.slug}`}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#0F4C5C]/40 transition-colors"
              >
                <SafeImage src={cat.image} alt={cat.nameAr} aspectClass="aspect-[4/3]" />
                <div className="p-4 space-y-1.5">
                  <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#0F4C5C]">
                    {cat.nameAr}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Rehabilitation-specific: Facility Gallery & Equipment */}
      {dept.equipmentList && dept.equipmentList.length > 0 && (
        <section className="space-y-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl text-slate-900">
              {t('departmentPage.equipmentHeading')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {dept.equipmentList.map((eq, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                <h3 className="font-display font-semibold text-base text-slate-900">{eq.name}</h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{eq.purpose}</p>
              </div>
            ))}
          </div>

          {dept.gallery && dept.gallery.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="font-display font-bold text-lg text-slate-900">
                {t('departmentPage.galleryHeading')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dept.gallery.map((g, idx) => (
                  <figure key={idx} className="space-y-2">
                    <SafeImage
                      src={g.url}
                      alt={g.caption}
                      aspectClass="aspect-[16/10]"
                      className="rounded-lg border border-slate-200"
                    />
                    <figcaption className="text-xs text-slate-500">{g.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 3. Services List */}
      {deptServices.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {t('departmentPage.servicesHeading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deptServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="text-xs text-slate-500">{srv.durationNote}</span>
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
                    departmentId={dept.id}
                    serviceId={srv.id}
                    doctorId={srv.doctorId || undefined}
                    sourceLabel={srv.title}
                    className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs font-semibold transition-colors"
                  >
                    {t('common.bookService')}
                  </BookActionButton>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Linked Doctor / Team */}
      {deptDoctors.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {t('departmentPage.teamHeading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deptDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center"
              >
                <div className="sm:col-span-5">
                  <DoctorPortraitFrame
                    imageUrl={doc.imageUrl}
                    name={doc.nameAr}
                    placeholderNote={doc.imagePlaceholderNote}
                  />
                </div>
                <div className="sm:col-span-7 space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">{doc.nameAr}</h3>
                    <p className="text-xs font-medium text-[#0F4C5C] mt-0.5">{doc.roleTitle}</p>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3">{doc.bio}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      to={`/doctors/${doc.slug}`}
                      className="text-xs font-semibold text-[#0F4C5C] hover:underline px-2 py-1.5"
                    >
                      {t('home.doctorProfileCta')}
                    </Link>
                    <BookActionButton
                      departmentId={dept.id}
                      doctorId={doc.id}
                      sourceLabel={doc.nameAr}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0F4C5C] text-slate-800 hover:text-white text-xs font-semibold transition-colors"
                    >
                      {t('common.bookNow')}
                    </BookActionButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Linked Topics & Procedures */}
      {deptTopics.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {t('departmentPage.libraryHeading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deptTopics.map((item) => (
              <Link
                key={item.id}
                to={`/library/${item.slug}`}
                className="group bg-white rounded-xl border border-slate-200 p-5 space-y-2.5 hover:border-[#0F4C5C]/40 transition-colors"
              >
                <span className="text-xs font-medium text-[#0284C7]">{item.typeLabel}</span>
                <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-[#0F4C5C]">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. Related Stories & Videos */}
      {(deptStories.length > 0 || deptVideos.length > 0) && (
        <section className="space-y-6">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {t('departmentPage.storiesVideosHeading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deptStories.map((st) => (
              <Link
                key={st.id}
                to={`/stories/${st.slug}`}
                className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 hover:border-[#0F4C5C]/40"
              >
                <span className="text-xs text-slate-500">{t('nav.stories')}</span>
                <h3 className="font-display font-bold text-base text-slate-900">{st.title}</h3>
                <p className="text-sm text-slate-600">{st.summary}</p>
              </Link>
            ))}
            {deptVideos.map((vid) => (
              <Link
                key={vid.id}
                to={`/library/${vid.slug}`}
                className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 hover:border-[#0F4C5C]/40"
              >
                <span className="text-xs text-[#0284C7] font-medium">
                  {vid.typeLabel} · {vid.videoDuration}
                </span>
                <h3 className="font-display font-bold text-base text-slate-900">{vid.title}</h3>
                <p className="text-sm text-slate-600">{vid.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7. Department FAQs */}
      {deptFaqs.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {t('departmentPage.faqHeading')}
          </h2>
          <div className="space-y-3">
            {deptFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="bg-white rounded-xl border border-slate-200">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-5 py-4 text-start flex items-center justify-between gap-4"
                  >
                    <span className="font-semibold text-sm sm:text-base text-slate-900">
                      {faq.title}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-slate-600 border-t border-slate-100 pt-3">
                      {faq.faqAnswer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 8. Location, Hours & Final CTA */}
      <section className="bg-[#0F4C5C] text-white rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <h2 className="font-display font-bold text-xl sm:text-2xl">
            {t('departmentPage.ctaBannerTitle')}
          </h2>
          <p className="text-sm text-sky-100">{t('departmentPage.ctaBannerDesc')}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-sky-200 pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {dept.workingHoursNote}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              {dept.contactNote}
            </span>
            <span>{localizedConfig.contact.city}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          {dept.isPharmacy ? (
            <Link
              to="/store"
              className="px-5 py-3 rounded-lg bg-white text-[#093542] hover:bg-sky-50 text-sm font-semibold"
            >
              {t('departmentPage.openStoreCta')}
            </Link>
          ) : (
            <BookActionButton
              departmentId={dept.id}
              sourceLabel={dept.nameAr}
              className="px-5 py-3 rounded-lg bg-white text-[#093542] hover:bg-sky-50 text-sm font-semibold"
            >
              {t('common.bookNow')}
            </BookActionButton>
          )}
          <Link
            to="/contact"
            className="px-5 py-3 rounded-lg border border-white/30 hover:bg-white/10 text-white text-sm font-medium"
          >
            {t('nav.contact')}
          </Link>
        </div>
      </section>
    </div>
  );
};
