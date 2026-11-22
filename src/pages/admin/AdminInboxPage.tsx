import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Check,
  ClipboardCheck,
  MessageSquare,
  MessageSquareHeart,
  ShieldAlert,
  Star,
  X,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';

type InboxTab = 'messages' | 'comments' | 'careers' | 'surveys';

export const AdminInboxPage: React.FC = () => {
  const {
    hasPermission,
    supportMessages,
    updateSupportMessage,
    stories,
    moderateStoryComment,
    careerApps,
    updateCareerAppStatus,
    surveys,
  } = useDataStore();
  const { lang } = useLanguage();

  const [tab, setTab] = useState<InboxTab>('messages');
  const [msgFilter, setMsgFilter] = useState<'all' | 'new' | 'in_progress' | 'closed'>('all');
  const [commentFilter, setCommentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    'pending'
  );
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const allComments = useMemo(
    () =>
      stories.flatMap((story) =>
        story.comments.map((comment) => ({
          storyId: story.id,
          storySlug: story.slug,
          storyTitle: story.title,
          comment,
        }))
      ),
    [stories]
  );

  const filteredMessages = useMemo(
    () => supportMessages.filter((m) => msgFilter === 'all' || m.status === msgFilter),
    [supportMessages, msgFilter]
  );

  const filteredComments = useMemo(
    () =>
      allComments.filter((item) => commentFilter === 'all' || item.comment.status === commentFilter),
    [allComments, commentFilter]
  );

  const pendingCommentsCount = allComments.filter((c) => c.comment.status === 'pending').length;
  const newMessagesCount = supportMessages.filter((m) => m.status === 'new').length;
  const newCareersCount = careerApps.filter((c) => c.status === 'new').length;

  const avgClarity =
    surveys.length > 0
      ? (surveys.reduce((acc, s) => acc + s.clarityRating, 0) / surveys.length).toFixed(1)
      : '—';
  const avgEase =
    surveys.length > 0
      ? (surveys.reduce((acc, s) => acc + s.easeRating, 0) / surveys.length).toFixed(1)
      : '—';

  if (!hasPermission('manage_inbox')) {
    return (
      <AdminLayout titleAr="البريد والتعليقات والتقييم" titleEn="Inbox & Moderation">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
          <ShieldAlert className="w-8 h-8 text-amber-600 mx-auto" />
          <p className="font-bold text-slate-900">
            {lang === 'ar'
              ? 'هذا القسم غير متاح لصلاحيات دورك الحالي'
              : 'Access restricted for your current role'}
          </p>
          <Link
            to="/admin"
            className="inline-block px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold"
          >
            {lang === 'ar' ? 'العودة إلى لوحة المؤشرات' : 'Back to Overview'}
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout titleAr="البريد والتعليقات والتقييم" titleEn="Inbox, Comments & Surveys">
      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-3 text-xs font-medium flex items-center justify-between">
          <span>{feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-emerald-700 hover:text-emerald-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab('messages')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border inline-flex items-center gap-2 transition-colors ${
            tab === 'messages'
              ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{lang === 'ar' ? 'الرسائل والشكاوى' : 'Messages & Complaints'}</span>
          {newMessagesCount > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-[11px] tabular-nums">
              {newMessagesCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTab('comments')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border inline-flex items-center gap-2 transition-colors ${
            tab === 'comments'
              ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span>{lang === 'ar' ? 'تعليقات قصص النجاح' : 'Story Comments'}</span>
          {pendingCommentsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[11px] tabular-nums">
              {pendingCommentsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTab('careers')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border inline-flex items-center gap-2 transition-colors ${
            tab === 'careers'
              ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{lang === 'ar' ? 'طلبات التوظيف' : 'Career Interest'}</span>
          {newCareersCount > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-[11px] tabular-nums">
              {newCareersCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setTab('surveys')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border inline-flex items-center gap-2 transition-colors ${
            tab === 'surveys'
              ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>{lang === 'ar' ? 'استبيان تجربة الموقع' : 'Site Surveys'}</span>
          <span className="text-[11px] opacity-80 tabular-nums">({surveys.length})</span>
        </button>
      </div>

      {/* Tab 1: Support Messages & Complaints */}
      {tab === 'messages' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(['all', 'new', 'in_progress', 'closed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setMsgFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    msgFilter === st
                      ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st === 'all'
                    ? lang === 'ar'
                      ? 'الكل'
                      : 'All'
                    : st === 'new'
                    ? lang === 'ar'
                      ? 'جديد'
                      : 'New'
                    : st === 'in_progress'
                    ? lang === 'ar'
                      ? 'قيد المتابعة'
                      : 'In Progress'
                    : lang === 'ar'
                    ? 'مغلق'
                    : 'Closed'}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-500 tabular-nums">
              {lang === 'ar' ? `عدد السجلات: ${filteredMessages.length}` : `Count: ${filteredMessages.length}`}
            </span>
          </div>

          <div className="space-y-3">
            {filteredMessages.map((msg) => {
              const draft = noteDrafts[msg.id] ?? msg.internalNote ?? '';
              return (
                <div
                  key={msg.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0F4C5C]" dir="ltr">
                          {msg.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border text-[11px] font-medium ${
                            msg.type === 'complaint'
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : msg.type === 'suggestion'
                              ? 'bg-sky-50 text-sky-800 border-sky-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {msg.typeLabel}
                        </span>
                        <span className="text-xs text-slate-500 tabular-nums">{msg.createdAt}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {msg.senderName}{' '}
                        <span className="text-xs font-normal text-slate-500" dir="ltr">
                          ({msg.contactInfo})
                        </span>
                      </h3>
                    </div>

                    <select
                      value={msg.status}
                      onChange={(e) => {
                        const next = e.target.value as 'new' | 'in_progress' | 'closed';
                        updateSupportMessage(msg.id, { status: next });
                        setFeedback(
                          lang === 'ar'
                            ? `تم تحديث حالة الرسالة ${msg.id}.`
                            : `Updated message ${msg.id} status.`
                        );
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value="new">{lang === 'ar' ? 'جديد' : 'New'}</option>
                      <option value="in_progress">{lang === 'ar' ? 'قيد المتابعة' : 'In Progress'}</option>
                      <option value="closed">{lang === 'ar' ? 'تمت المعالجة / مغلق' : 'Closed'}</option>
                    </select>
                  </div>

                  <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-100">
                    {msg.message}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [msg.id]: e.target.value }))}
                      placeholder={
                        lang === 'ar'
                          ? 'ملاحظة متابعة داخلية...'
                          : 'Internal follow-up note...'
                      }
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateSupportMessage(msg.id, { internalNote: draft });
                        setFeedback(
                          lang === 'ar'
                            ? `تم حفظ الملاحظة الداخلية للرسالة ${msg.id}.`
                            : `Saved internal note for ${msg.id}.`
                        );
                      }}
                      className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold hover:bg-[#093542]"
                    >
                      {lang === 'ar' ? 'حفظ الملاحظة' : 'Save Note'}
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredMessages.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
                {lang === 'ar' ? 'لا توجد رسائل مطابقة للتصفية.' : 'No matching messages.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Story Comments Moderation */}
      {tab === 'comments' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setCommentFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    commentFilter === st
                      ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st === 'pending'
                    ? lang === 'ar'
                      ? 'بانتظار المراجعة'
                      : 'Pending'
                    : st === 'approved'
                    ? lang === 'ar'
                      ? 'معتمد ومنشور'
                      : 'Approved'
                    : st === 'rejected'
                    ? lang === 'ar'
                      ? 'مرفوض / مخفي'
                      : 'Rejected'
                    : lang === 'ar'
                    ? 'الكل'
                    : 'All'}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              {lang === 'ar'
                ? 'اعتماد التعليق يُظهره فورًا في صفحة القصة على الموقع العام.'
                : 'Approving a comment immediately publishes it on the public story page.'}
            </p>
          </div>

          <div className="space-y-3">
            {filteredComments.map(({ storyId, storySlug, storyTitle, comment }) => (
              <div
                key={comment.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-slate-900">{comment.author}</span>
                    <span className="inline-flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < comment.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </span>
                    <span className="text-slate-400 tabular-nums">{comment.date}</span>
                    <span
                      className={`px-2 py-0.5 rounded border text-[11px] font-medium ${
                        comment.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : comment.status === 'rejected'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {comment.status === 'approved'
                        ? lang === 'ar'
                          ? 'معتمد'
                          : 'Approved'
                        : comment.status === 'rejected'
                        ? lang === 'ar'
                          ? 'مرفوض'
                          : 'Rejected'
                        : lang === 'ar'
                        ? 'قيد المراجعة'
                        : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{comment.text}</p>
                  <p className="text-xs text-slate-500">
                    {lang === 'ar' ? 'القصة المرتبطة:' : 'Story:'}{' '}
                    <Link
                      to={`/stories/${storySlug}`}
                      className="text-[#0F4C5C] font-medium hover:underline"
                    >
                      {storyTitle}
                    </Link>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      moderateStoryComment(storyId, comment.id, 'approved');
                      setFeedback(
                        lang === 'ar'
                          ? 'تم اعتماد التعليق ونشره على صفحة القصة.'
                          : 'Comment approved and published.'
                      );
                    }}
                    disabled={comment.status === 'approved'}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'اعتماد ونشر' : 'Approve'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      moderateStoryComment(storyId, comment.id, 'rejected');
                      setFeedback(
                        lang === 'ar'
                          ? 'تم إخفاء التعليق من الظهور العام.'
                          : 'Comment hidden from public view.'
                      );
                    }}
                    disabled={comment.status === 'rejected'}
                    className="px-3.5 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 disabled:opacity-40 text-red-800 text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'رفض / إخفاء' : 'Reject'}</span>
                  </button>
                </div>
              </div>
            ))}
            {filteredComments.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
                {lang === 'ar' ? 'لا توجد تعليقات ضمن هذا التصنيف.' : 'No comments in this filter.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Career Applications */}
      {tab === 'careers' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'المرجع' : 'ID'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'الاسم' : 'Applicant'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'التخصص / المجال' : 'Specialty'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'الجوال' : 'Phone'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {careerApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-semibold text-[#0F4C5C]" dir="ltr">
                      {app.id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{app.name}</td>
                    <td className="px-4 py-3 text-slate-700">{app.specialty}</td>
                    <td className="px-4 py-3 font-mono text-slate-700" dir="ltr">
                      {app.phone}
                    </td>
                    <td className="px-4 py-3 text-slate-500 tabular-nums">{app.createdAt}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded border text-[11px] font-medium ${
                          app.status === 'reviewed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}
                      >
                        {app.status === 'reviewed'
                          ? lang === 'ar'
                            ? 'تمت المراجعة'
                            : 'Reviewed'
                          : lang === 'ar'
                          ? 'طلب جديد'
                          : 'New'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateCareerAppStatus(
                            app.id,
                            app.status === 'new' ? 'reviewed' : 'new'
                          )
                        }
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        {app.status === 'new'
                          ? lang === 'ar'
                            ? 'تعيين كمراجع'
                            : 'Mark Reviewed'
                          : lang === 'ar'
                          ? 'إعادة لجديد'
                          : 'Reopen'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Surveys */}
      {tab === 'surveys' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <span className="text-xs text-slate-500 block">
                {lang === 'ar' ? 'عدد الاستبيانات المستلمة' : 'Total Surveys'}
              </span>
              <span className="font-display font-bold text-2xl text-slate-900 tabular-nums">
                {surveys.length}
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <span className="text-xs text-slate-500 block">
                {lang === 'ar' ? 'متوسط وضوح المعلومات' : 'Avg Clarity Score'}
              </span>
              <span className="font-display font-bold text-2xl text-[#0F4C5C] tabular-nums">
                {avgClarity} / 5
              </span>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <span className="text-xs text-slate-500 block">
                {lang === 'ar' ? 'متوسط سهولة الحجز والطلب' : 'Avg Ease Score'}
              </span>
              <span className="font-display font-bold text-2xl text-[#0284C7] tabular-nums">
                {avgEase} / 5
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {surveys.map((sv) => (
              <div key={sv.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono font-bold text-[#0F4C5C]" dir="ltr">
                    {sv.id}
                  </span>
                  <span className="tabular-nums">{sv.createdAt}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 font-semibold">
                    {lang === 'ar' ? 'وضوح المعلومات:' : 'Clarity:'} {sv.clarityRating}/5
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 font-semibold">
                    {lang === 'ar' ? 'سهولة الاستخدام:' : 'Ease:'} {sv.easeRating}/5
                  </span>
                </div>
                {sv.note && <p className="text-sm text-slate-700 pt-1">{sv.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
