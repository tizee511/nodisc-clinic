import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';

export const NewsPage: React.FC = () => {
  const { lang, t, news } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: t('nav.news') }]} />
        <h1 className="font-display font-bold text-3xl text-slate-900">{t('nav.news')}</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          {lang === 'ar'
            ? 'أرشيف الأخبار والتحديثات التجريبية الخاصة بأقسام نوديسك كلينك.'
            : 'Archive of clinic updates and prototype news announcements.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item) => (
          <Link
            key={item.id}
            to={`/news/${item.slug}`}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#0F4C5C]/40 transition-colors"
          >
            <div>
              <SafeImage src={item.image} alt={item.title} aspectClass="aspect-[4/3]" />
              <div className="p-5 space-y-2.5">
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-semibold text-[#0284C7]">{item.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{item.date}</span>
                </div>
                <h2 className="font-display font-bold text-lg text-slate-900 group-hover:text-[#0F4C5C]">
                  {item.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{item.summary}</p>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 text-xs font-semibold text-[#0F4C5C]">
              {t('common.readMore')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, news, departments } = useLanguage();
  const item = news.find((n) => n.slug === slug || n.id === slug);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'الخبر غير موجود' : 'News item not found'}
        </h1>
        <Link to="/news" className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold">
          {t('nav.news')}
        </Link>
      </div>
    );
  }

  const dept = departments.find((d) => d.id === item.departmentId);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: t('nav.news'), to: '/news' },
            { label: item.title },
          ]}
        />
        <div className="space-y-3">
          <div className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#0284C7]">{item.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{item.date}</span>
            {dept && (
              <>
                <span aria-hidden="true">·</span>
                <Link to={`/departments/${dept.slug}`} className="hover:text-[#0F4C5C]">
                  {dept.nameAr}
                </Link>
              </>
            )}
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-slate-900">
            {item.title}
          </h1>
        </div>
      </div>

      <SafeImage
        src={item.image}
        alt={item.title}
        aspectClass="aspect-[16/9]"
        className="rounded-xl border border-slate-200"
      />

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 space-y-4">
        {item.body.map((paragraph, idx) => (
          <p key={idx} className="text-base text-slate-700 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
};
