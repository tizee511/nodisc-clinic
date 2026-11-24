import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useClinic } from '../context/ClinicContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { BookActionButton } from '../components/BookActionLink';
import { getFilterTabClass, ScrollableFilterBar } from '../components/ScrollableFilterBar';

export const StoriesPage: React.FC = () => {
  const { lang, t, stories, departments } = useLanguage();
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const filteredStories =
    selectedDept === 'all'
      ? stories
      : stories.filter((s) => s.departmentId === selectedDept);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: t('nav.stories') }]} />
        <h1 className="font-display font-bold text-3xl text-slate-900">{t('nav.stories')}</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {lang === 'ar'
            ? 'نماذج تجريبية لقصص نجاح وتعافي المراجعين، جاهزة للاستبدال بالمحتوى المعتمد من المركز.'
            : 'General patient recovery case stories ready to be replaced with approved clinic publications.'}
        </p>
      </div>

      {/* Department Filter Bar */}
      <ScrollableFilterBar ariaLabel={lang === 'ar' ? 'تصفية قصص النجاح حسب القسم' : 'Filter stories by department'}>
        <button
          type="button"
          onClick={() => setSelectedDept('all')}
          className={getFilterTabClass(selectedDept === 'all')}
        >
          <span>{t('common.all')}</span>
          <span
            className={`text-[11px] tabular-nums ${
              selectedDept === 'all' ? 'text-sky-200' : 'text-slate-400'
            }`}
          >
            ({stories.length})
          </span>
        </button>
        {departments.map((dept) => {
          const count = stories.filter((s) => s.departmentId === dept.id).length;
          if (count === 0) return null;
          const isActive = selectedDept === dept.id;
          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => setSelectedDept(dept.id)}
              className={getFilterTabClass(isActive)}
            >
              <span>{dept.nameAr}</span>
              <span
                className={`text-[11px] tabular-nums ${
                  isActive ? 'text-sky-200' : 'text-slate-400'
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </ScrollableFilterBar>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredStories.map((story) => {
          const dept = departments.find((d) => d.id === story.departmentId);
          return (
            <Link
              key={story.id}
              to={`/stories/${story.slug}`}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#0F4C5C]/40 transition-colors"
            >
              <div>
                <SafeImage src={story.image} alt={story.title} aspectClass="aspect-[4/3]" />
                <div className="p-5 space-y-2.5">
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="font-medium text-[#0284C7]">{dept?.nameAr}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{story.date}</span>
                  </div>
                  <h2 className="font-display font-bold text-lg text-slate-900 group-hover:text-[#0F4C5C]">
                    {story.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{story.summary}</p>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>{story.patientLabel}</span>
                <span className="font-semibold text-[#0F4C5C]">{t('common.readMore')}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, stories, departments, doctors, services, localizedConfig } = useLanguage();
  const { pendingStoryComments, addStoryCommentForReview } = useClinic();

  const story = stories.find((s) => s.slug === slug || s.id === slug);

  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [submittedFlag, setSubmittedFlag] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!story) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'القصة غير موجودة' : 'Story not found'}
        </h1>
        <Link to="/stories" className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold">
          {t('nav.stories')}
        </Link>
      </div>
    );
  }

  const dept = departments.find((d) => d.id === story.departmentId);
  const doctor = doctors.find((d) => d.id === story.doctorId);
  const service = services.find((s) => s.id === story.serviceId);
  const localPending = pendingStoryComments[story.id] || [];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (authorName.trim().length < 2 || commentText.trim().length < 5) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى كتابة الاسم ونص التعليق بشكل واضح.'
          : 'Please enter your name and a brief comment.'
      );
      return;
    }

    addStoryCommentForReview(story.id, {
      id: `pending-${Date.now()}`,
      author: authorName.trim(),
      rating,
      text: commentText.trim(),
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
    });

    setAuthorName('');
    setCommentText('');
    setRating(5);
    setSubmittedFlag(true);
  };

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-10">
      <div>
        <Breadcrumbs
          items={[
            { label: t('nav.stories'), to: '/stories' },
            { label: story.title },
          ]}
        />

        <div className="space-y-3">
          <div className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2">
            {dept && (
              <Link to={`/departments/${dept.slug}`} className="font-semibold text-[#0284C7] hover:underline">
                {dept.nameAr}
              </Link>
            )}
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{story.date}</span>
            <span aria-hidden="true">·</span>
            <span>{story.patientLabel}</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-slate-900">
            {story.title}
          </h1>
        </div>
      </div>

      <SafeImage
        src={story.image}
        alt={story.title}
        aspectClass="aspect-[16/9]"
        className="rounded-xl border border-slate-200"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-2">
          <h2 className="font-display font-bold text-base text-[#0F4C5C]">
            {lang === 'ar' ? 'الحالة قبل المتابعة' : 'Initial Condition'}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">{story.beforeState}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-2">
          <h2 className="font-display font-bold text-base text-[#0F4C5C]">
            {lang === 'ar' ? 'المسار العلاجي' : 'Care Pathway'}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">{story.carePath}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-2">
          <h2 className="font-display font-bold text-base text-[#0F4C5C]">
            {lang === 'ar' ? 'النتيجة والتعافي' : 'Outcome'}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">{story.outcome}</p>
        </div>
      </div>

      {/* Linked Specialist & Service */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm space-y-1">
          {doctor && (
            <p>
              <span className="text-slate-500">{lang === 'ar' ? 'الطبيب:' : 'Physician:'} </span>
              <Link to={`/doctors/${doctor.slug}`} className="font-semibold text-[#0F4C5C] hover:underline">
                {doctor.nameAr}
              </Link>
            </p>
          )}
          {service && (
            <p>
              <span className="text-slate-500">{lang === 'ar' ? 'الخدمة المرتبطة:' : 'Related Service:'} </span>
              <Link to={`/services/${service.slug}`} className="font-semibold text-[#0F4C5C] hover:underline">
                {service.title}
              </Link>
            </p>
          )}
        </div>
        <BookActionButton
          departmentId={story.departmentId}
          serviceId={story.serviceId}
          doctorId={story.doctorId}
          sourceLabel={story.title}
          className="px-5 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold"
        >
          {t('common.bookNow')}
        </BookActionButton>
      </div>

      {/* Comments & Ratings Section */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="space-y-1.5">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {t('stories.commentsHeading')}
          </h2>
          <p className="text-xs text-slate-500">{localizedConfig.reviewsPolicy.moderationNotice}</p>
        </div>

        {/* Approved Comments */}
        <div className="space-y-4">
          {story.comments.filter((c) => c.status === 'approved').length === 0 &&
            story.comments.filter((c) => c.status === 'pending').length === 0 && (
              <p className="text-sm text-slate-500">
                {lang === 'ar'
                  ? 'لا توجد تعليقات منشورة بعد على هذه القصة.'
                  : 'No published comments on this story yet.'}
              </p>
            )}

          {story.comments
            .filter((c) => c.status === 'approved')
            .map((c) => (
              <div key={c.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-slate-900">{c.author}</span>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-0.5 text-amber-500" aria-label={`${c.rating} / 5`}>
                      {Array.from({ length: c.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </span>
                    <span className="tabular-nums">{c.date}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-700">{c.text}</p>
              </div>
            ))}

          {localPending
            .filter((p) => {
              const inStory = story.comments.find((c) => c.id === p.id);
              return !inStory || inStory.status === 'pending';
            })
            .map((c) => (
              <div key={c.id} className="p-4 rounded-lg bg-sky-50/70 border border-sky-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-slate-900">{c.author}</span>
                  <span className="text-xs font-semibold text-[#0284C7]">
                    {lang === 'ar' ? 'بانتظار المراجعة (محاكاة)' : 'Pending Review (Simulation)'}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{c.text}</p>
              </div>
            ))}
        </div>

        {/* Add Comment Form */}
        {localizedConfig.reviewsPolicy.allowPublicRating && (
          <form onSubmit={handleCommentSubmit} className="pt-6 border-t border-slate-200 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">
              {t('stories.addCommentTitle')}
            </h3>

            {submittedFlag && (
              <div
                role="status"
                className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>{t('stories.commentSubmittedNotice')}</span>
              </div>
            )}

            {errorMsg && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {errorMsg}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="comment-author" className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('stories.commentName')}
                </label>
                <input
                  id="comment-author"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label htmlFor="comment-rating" className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('stories.ratingLabel')}
                </label>
                <select
                  id="comment-rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} / 5
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="comment-text" className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('stories.commentText')}
              </label>
              <textarea
                id="comment-text"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
            >
              {t('stories.submitComment')}
            </button>
          </form>
        )}
      </section>
    </article>
  );
};
