import React, { useMemo, useState } from 'react';
import { CheckCircle2, MessageSquarePlus, ShieldCheck, Star } from 'lucide-react';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { getFilterTabClass, ScrollableFilterBar } from '../ScrollableFilterBar';

export const StarRatingDisplay: React.FC<{
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, size = 'sm' }) => {
  const iconClass =
    size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <span
      dir="ltr"
      className="inline-flex items-center gap-0.5 text-amber-400"
      aria-label={`${rating.toFixed(1)} / 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star - 0.25;
        const half = !filled && rating >= star - 0.75;
        return (
          <span key={star} className="relative inline-flex">
            <Star className={`${iconClass} text-slate-200 fill-slate-200`} />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : '50%' }}
              >
                <Star className={`${iconClass} text-amber-400 fill-amber-400`} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productName,
}) => {
  const { lang } = useLanguage();
  const { getProductReviews, addProductReview } = useDataStore();

  const reviews = getProductReviews(productId);

  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const stats = useMemo(() => {
    const count = reviews.length;
    if (count === 0) {
      return {
        count: 0,
        avg: 0,
        breakdown: [5, 4, 3, 2, 1].map((s) => ({ stars: s, count: 0, pct: 0 })),
      };
    }
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = total / count;
    const breakdown = [5, 4, 3, 2, 1].map((s) => {
      const c = reviews.filter((r) => r.rating === s).length;
      return { stars: s, count: c, pct: Math.round((c / count) * 100) };
    });
    return { count, avg, breakdown };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (starFilter === 'all') return reviews;
    return reviews.filter((r) => r.rating === starFilter);
  }, [reviews, starFilter]);

  const ratingLabel = (val: number) => {
    if (lang === 'ar') {
      if (val === 5) return 'ممتاز';
      if (val === 4) return 'جيد جداً';
      if (val === 3) return 'جيد';
      if (val === 2) return 'مقبول';
      return 'ضعيف';
    }
    if (val === 5) return 'Excellent';
    if (val === 4) return 'Very Good';
    if (val === 3) return 'Good';
    if (val === 2) return 'Fair';
    return 'Poor';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (authorName.trim().length < 2 || comment.trim().length < 5) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى إدخال اسمك وكتابة مراجعة لا تقل عن 5 أحرف.'
          : 'Please enter your name and a review of at least 5 characters.'
      );
      return;
    }

    addProductReview({
      productId,
      authorName: authorName.trim(),
      rating,
      comment: comment.trim(),
      verifiedPurchase: false,
    });

    setAuthorName('');
    setComment('');
    setRating(5);
    setHoverRating(0);
    setStarFilter('all');
    setSubmittedNotice(true);
    setShowForm(false);
  };

  const formOpen = showForm || reviews.length === 0;
  const activeStarValue = hoverRating || rating;

  return (
    <section
      id="product-reviews"
      className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 scroll-mt-24"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
            {lang === 'ar' ? 'تقييمات ومراجعات العملاء' : 'Customer Ratings & Reviews'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'ar'
              ? `آراء وتجارب العملاء حول: ${productName}`
              : `Verified buyer feedback for: ${productName}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev);
            setSubmittedNotice(false);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>
            {formOpen && reviews.length > 0
              ? lang === 'ar'
                ? 'إغلاق نموذج التقييم'
                : 'Close Review Form'
              : lang === 'ar'
              ? 'أضف تقييمك للمنتج'
              : 'Write a Review'}
          </span>
        </button>
      </div>

      {submittedNotice && (
        <div
          role="status"
          className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            {lang === 'ar'
              ? 'شكراً لمشاركتك! تم إضافة تقييمك بنجاح وعرضه في قائمة المراجعات.'
              : 'Thank you! Your rating and review have been published.'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Summary & Breakdown Column */}
        <div className="lg:col-span-4 bg-slate-50 rounded-xl border border-slate-200/80 p-5 space-y-5">
          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-3 rounded-lg bg-white border border-slate-200 shrink-0">
              <div className="font-display font-bold text-3xl text-slate-900 tabular-nums">
                {stats.count > 0 ? stats.avg.toFixed(1) : '0.0'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                {lang === 'ar' ? 'من 5' : 'out of 5'}
              </div>
            </div>

            <div className="space-y-1.5">
              <StarRatingDisplay rating={stats.avg} size="md" />
              <p className="text-xs font-medium text-slate-700 tabular-nums">
                {stats.count === 0
                  ? lang === 'ar'
                    ? 'لا توجد تقييمات بعد'
                    : 'No reviews yet'
                  : lang === 'ar'
                  ? `بناءً على ${stats.count} ${stats.count === 1 ? 'تقييم' : 'تقييمات'}`
                  : `Based on ${stats.count} review${stats.count === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>

          {/* 5-Star Distribution Bars */}
          <div className="space-y-2 pt-2 border-t border-slate-200/70">
            {stats.breakdown.map((row) => {
              const isSelected = starFilter === row.stars;
              return (
                <button
                  key={row.stars}
                  type="button"
                  onClick={() =>
                    setStarFilter((curr) => (curr === row.stars ? 'all' : row.stars))
                  }
                  className={`w-full flex items-center gap-2.5 text-xs py-1 px-1.5 rounded-md transition-colors ${
                    isSelected ? 'bg-sky-100/80 font-bold text-[#0F4C5C]' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="w-11 text-start inline-flex items-center gap-1 tabular-nums shrink-0">
                    <span>{row.stars}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-end text-slate-500 tabular-nums shrink-0">
                    {row.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200/70 flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#0F4C5C] shrink-0 mt-0.5" />
            <span>
              {lang === 'ar'
                ? 'تعرض هذه الصفحة تقييمات حقيقية وتجارب موثقة لمنتجات متجر صيدلية نوديسك.'
                : 'Showing genuine customer ratings and verified buyer experiences from NODISC Store.'}
            </span>
          </div>
        </div>

        {/* Form + Review Cards Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Interactive Review Submission Form */}
          {formOpen && (
            <form
              onSubmit={handleSubmit}
              className="bg-sky-50/50 rounded-xl border border-sky-200/80 p-5 sm:p-6 space-y-4"
            >
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900">
                {lang === 'ar' ? 'شارك تجربتك مع هذا المنتج' : 'Rate & Review This Product'}
              </h3>

              {errorMsg && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                  {errorMsg}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="rev-author" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {lang === 'ar' ? 'الاسم *' : 'Your Name *'}
                  </label>
                  <input
                    id="rev-author"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: محمد العولقي' : 'e.g. Sarah Ahmed'}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:border-[#0F4C5C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {lang === 'ar' ? 'التقييم *' : 'Rating *'}
                  </label>
                  <div className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white flex items-center justify-between gap-2 min-h-[42px]">
                    <div
                      dir="ltr"
                      className="inline-flex items-center gap-1"
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= activeStarValue;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onClick={() => setRating(star)}
                            aria-label={`${star} / 5`}
                            className="p-0.5 transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                active
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 fill-slate-100'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-[#0F4C5C] tabular-nums whitespace-nowrap">
                      {ratingLabel(activeStarValue)} ({activeStarValue}/5)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="rev-comment" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {lang === 'ar' ? 'تفاصيل مراجعتك *' : 'Your Review *'}
                </label>
                <textarea
                  id="rev-comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'اكتب انطباعك عن فعالية المنتج وجودة التغليف والتوصيل...'
                      : 'Share how this product worked for you...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:border-[#0F4C5C]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
                >
                  {lang === 'ar' ? 'نشر التقييم' : 'Submit Review'}
                </button>
                {reviews.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium hover:bg-slate-50"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Movable Star Rating Filter Strip when reviews exist */}
          {reviews.length > 0 && (
            <ScrollableFilterBar
              surface="inset"
              ariaLabel={lang === 'ar' ? 'تصفية التقييمات حسب النجوم' : 'Filter reviews by stars'}
            >
              <button
                type="button"
                onClick={() => setStarFilter('all')}
                className={getFilterTabClass(starFilter === 'all', true)}
              >
                <span>{lang === 'ar' ? 'الكل' : 'All'}</span>
                <span
                  className={`text-[11px] tabular-nums ${
                    starFilter === 'all' ? 'text-sky-200' : 'text-slate-400'
                  }`}
                >
                  ({reviews.length})
                </span>
              </button>
              {[5, 4, 3, 2, 1].map((s) => {
                const countForStar = reviews.filter((r) => r.rating === s).length;
                if (countForStar === 0) return null;
                const isActive = starFilter === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStarFilter(s)}
                    className={getFilterTabClass(isActive, true)}
                  >
                    <span className="tabular-nums">{s}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span
                      className={`text-[11px] tabular-nums ${
                        isActive ? 'text-sky-200' : 'text-slate-400'
                      }`}
                    >
                      ({countForStar})
                    </span>
                  </button>
                );
              })}
            </ScrollableFilterBar>
          )}

          {/* Review Cards List */}
          {filteredReviews.length === 0 ? (
            <div className="p-8 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 text-center text-sm text-slate-600">
              {reviews.length === 0
                ? lang === 'ar'
                  ? 'كن أول من يقيّم هذا المنتج ويساعد الآخرين بتجربته.'
                  : 'Be the first to review this product and share your experience.'
                : lang === 'ar'
                ? 'لا توجد مراجعات مطابقة لعدد النجوم المحدد.'
                : 'No reviews match the selected star filter.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((rev) => (
                <article
                  key={rev.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-lg bg-[#0F4C5C]/10 text-[#0F4C5C] font-display font-bold text-sm inline-flex items-center justify-center shrink-0">
                        {rev.authorName.trim().charAt(0)}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display font-bold text-sm text-slate-900">
                            {rev.authorName}
                          </span>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{lang === 'ar' ? 'مشتري موثق' : 'Verified Buyer'}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRatingDisplay rating={rev.rating} size="sm" />
                          <span className="text-[11px] font-semibold text-slate-600 tabular-nums">
                            {rev.rating}.0
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 tabular-nums" dir="ltr">
                      {rev.createdAt}
                    </span>
                  </div>

                  {rev.title && (
                    <h4 className="font-display font-bold text-sm text-slate-900">
                      {rev.title}
                    </h4>
                  )}

                  <p className="text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
