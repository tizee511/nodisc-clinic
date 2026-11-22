import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, Pause, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { BookActionButton } from '../components/BookActionLink';

export const LibraryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, library, departments, doctors, services } = useLanguage();
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [faqOpen, setFaqOpen] = useState(true);

  const item = library.find((l) => l.slug === slug || l.id === slug);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'المادة الطبية غير متوفرة' : 'Library item not found'}
        </h1>
        <Link to="/library" className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold">
          {t('nav.library')}
        </Link>
      </div>
    );
  }

  const dept = departments.find((d) => d.id === item.departmentId);
  const doctor = doctors.find((d) => d.id === item.doctorId);
  const relatedServices = services.filter((s) => item.relatedServiceIds?.includes(s.id));
  const relatedItems = library.filter(
    (l) => l.id !== item.id && l.departmentId === item.departmentId
  ).slice(0, 3);

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-10">
      <div>
        <Breadcrumbs
          items={[
            { label: t('nav.library'), to: '/library' },
            { label: item.typeLabel, to: `/library?type=${item.type}` },
            { label: item.title },
          ]}
        />

        <div className="space-y-4">
          <div className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#0284C7]">{item.typeLabel}</span>
            {dept && (
              <>
                <span aria-hidden="true">·</span>
                <Link to={`/departments/${dept.slug}`} className="hover:text-[#0F4C5C]">
                  {dept.nameAr}
                </Link>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{item.publishedAt}</span>
            {item.readTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{item.readTime}</span>
              </>
            )}
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-slate-900 leading-tight">
            {item.title}
          </h1>

          {item.authorName && (
            <p className="text-sm text-slate-600">
              {doctor ? (
                <Link to={`/doctors/${doctor.slug}`} className="font-medium text-[#0F4C5C] hover:underline">
                  {item.authorName}
                </Link>
              ) : (
                item.authorName
              )}
            </p>
          )}
        </div>
      </div>

      {/* Video Player Layout */}
      {item.type === 'video' ? (
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-white">
          <div className="relative">
            <SafeImage src={item.image} alt={item.title} aspectClass="aspect-[16/9]" />
            <div className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <button
                type="button"
                onClick={() => setIsPlayingDemo((p) => !p)}
                className="w-16 h-16 rounded-full bg-white text-[#0F4C5C] flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                aria-label={isPlayingDemo ? 'Pause' : 'Play'}
              >
                {isPlayingDemo ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current" />}
              </button>
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {isPlayingDemo
                    ? lang === 'ar'
                      ? 'جارٍ تشغيل معاينة الفيديو التوعوي (محاكاة تجريبية)...'
                      : 'Playing educational video preview (demo simulation)...'
                    : lang === 'ar'
                    ? `اضغط للتشغيل — المدة: ${item.videoDuration || '04:00'}`
                    : `Press to play — Duration: ${item.videoDuration || '04:00'}`}
                </p>
                <p className="text-xs text-slate-300 max-w-md">{t('library.videoSimNote')}</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-2">
            <p className="text-sm text-slate-200 leading-relaxed">{item.summary}</p>
            {item.videoPreviewNote && (
              <p className="text-xs text-sky-300">{item.videoPreviewNote}</p>
            )}
          </div>
        </div>
      ) : item.type === 'faq' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button
            type="button"
            aria-expanded={faqOpen}
            onClick={() => setFaqOpen((p) => !p)}
            className="w-full px-6 py-5 text-start flex items-center justify-between gap-4 bg-slate-50"
          >
            <span className="font-display font-bold text-lg text-slate-900">{item.title}</span>
            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${faqOpen ? 'rotate-180' : ''}`} />
          </button>
          {faqOpen && (
            <div className="p-6 text-base text-slate-700 leading-relaxed border-t border-slate-200">
              {item.faqAnswer}
            </div>
          )}
        </div>
      ) : (
        /* Article / Condition / Procedure Layout */
        <div className="space-y-8">
          <SafeImage
            src={item.image}
            alt={item.title}
            aspectClass="aspect-[16/9]"
            className="rounded-xl border border-slate-200"
          />

          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 space-y-6">
            <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed border-b border-slate-100 pb-6">
              {item.summary}
            </p>

            {item.sections?.map((sec, idx) => (
              <section key={idx} className="space-y-2">
                <h2 className="font-display font-bold text-xl text-slate-900">{sec.heading}</h2>
                <p className="text-base text-slate-700 leading-relaxed">{sec.body}</p>
              </section>
            ))}

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
              {lang === 'ar'
                ? 'ملاحظة طبية وتنظيمية: هذا المحتوى التعريفي عام وتجريبي لأغراض العرض، ويُستبدل بالمادة الطبية المعتمدة من أطباء المركز.'
                : 'Editorial Note: This educational text is a general replaceable placeholder to be finalized with physician-approved medical copy.'}
            </div>
          </div>
        </div>
      )}

      {/* Linked Services & Booking CTA */}
      {(relatedServices.length > 0 || doctor) && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-900">
            {lang === 'ar' ? 'الخدمات والطبيب المرتبط' : 'Related Services & Specialist'}
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedServices.map((srv) => (
              <Link
                key={srv.id}
                to={`/services/${srv.slug}`}
                className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#0F4C5C] text-sm font-medium text-slate-800"
              >
                {srv.title}
              </Link>
            ))}
            <BookActionButton
              departmentId={item.departmentId}
              doctorId={item.doctorId}
              sourceLabel={item.title}
              className="px-5 py-2 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold"
            >
              {t('common.bookNow')}
            </BookActionButton>
          </div>
        </section>
      )}

      {/* Related Materials */}
      {relatedItems.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display font-bold text-xl text-slate-900">
            {lang === 'ar' ? 'مواد مرتبطة من المكتبة' : 'Related Library Materials'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedItems.map((rel) => (
              <Link
                key={rel.id}
                to={`/library/${rel.slug}`}
                className="bg-white rounded-xl border border-slate-200 p-5 space-y-2 hover:border-[#0F4C5C]/40"
              >
                <span className="text-xs font-medium text-[#0284C7]">{rel.typeLabel}</span>
                <h3 className="font-display font-bold text-base text-slate-900">{rel.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
