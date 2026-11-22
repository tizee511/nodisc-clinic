import React, { useState } from 'react';
import { Archive, CheckCircle2, Edit3, Eye, FileUp, Image as ImageIcon, Plus } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  DepartmentId,
  LibraryCategory,
  LibraryItem,
  MediaAsset,
  NewsItem,
  PublishStatus,
  SuccessStory,
} from '../../types/clinic';

export const AdminContentPage: React.FC = () => {
  const {
    library,
    setLibrary,
    news,
    setNews,
    stories,
    setStories,
    departments,
    mediaAssets,
    setMediaAssets,
    hasPermission,
    recordAudit,
  } = useDataStore();
  const { lang } = useLanguage();

  const [activeTab, setActiveTab] = useState<'library' | 'news' | 'stories' | 'media'>('library');
  const [typeFilter, setTypeFilter] = useState<'all' | LibraryCategory>('all');

  const [editingLib, setEditingLib] = useState<LibraryItem | null>(null);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [previewItem, setPreviewItem] = useState<{ title: string; summary: string; image?: string } | null>(null);

  const canEdit = hasPermission('manage_content');
  const canPublish = hasPermission('publish_content');
  const canArchive = hasPermission('archive_records');

  const setLibStatus = (id: string, status: PublishStatus) => {
    setLibrary((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    recordAudit('المحتوى', `تغيير حالة نشر مادة مكتبية إلى ${status}`, id);
  };

  const setNewsStatus = (id: string, status: PublishStatus) => {
    setNews((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));
    recordAudit('الأخبار', `تغيير حالة خبر إلى ${status}`, id);
  };

  const setStoryStatus = (id: string, status: PublishStatus) => {
    setStories((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    recordAudit('قصص النجاح', `تغيير حالة قصة إلى ${status}`, id);
  };

  const handleSaveLib = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLib) return;
    const typeLabels: Record<LibraryCategory, string> = {
      condition: 'حالة مرضية',
      article: 'مقال طبي',
      procedure: 'إجراء / فحص',
      video: 'فيديو توعوي',
      faq: 'سؤال شائع',
    };
    const finalItem: LibraryItem = {
      ...editingLib,
      typeLabel: typeLabels[editingLib.type],
    };
    const exists = library.some((l) => l.id === finalItem.id);
    if (exists) {
      setLibrary((prev) => prev.map((l) => (l.id === finalItem.id ? finalItem : l)));
      recordAudit('المحتوى', 'تعديل مادة مكتبية', finalItem.title);
    } else {
      setLibrary((prev) => [finalItem, ...prev]);
      recordAudit('المحتوى', 'إضافة مادة مكتبية جديدة', finalItem.title);
    }
    setEditingLib(null);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;
    const exists = news.some((n) => n.id === editingNews.id);
    if (exists) {
      setNews((prev) => prev.map((n) => (n.id === editingNews.id ? editingNews : n)));
    } else {
      setNews((prev) => [editingNews, ...prev]);
    }
    recordAudit('الأخبار', 'حفظ خبر للمركز', editingNews.title);
    setEditingNews(null);
  };

  const handleSaveStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    const exists = stories.some((s) => s.id === editingStory.id);
    if (exists) {
      setStories((prev) => prev.map((s) => (s.id === editingStory.id ? editingStory : s)));
    } else {
      setStories((prev) => [editingStory, ...prev]);
    }
    recordAudit('قصص النجاح', 'حفظ قصة نجاح', editingStory.title);
    setEditingStory(null);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const asset: MediaAsset = {
      id: `med-${Date.now()}`,
      title: file.name,
      url,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      description: `ملف مرفوع خلال الجلسة (${Math.round(file.size / 1024)} KB)`,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };
    setMediaAssets((prev) => [asset, ...prev]);
    recordAudit('مكتبة الوسائط', 'رفع ملف جديد للجلسة', file.name);
  };

  const filteredLib = library.filter((l) => (typeFilter === 'all' ? true : l.type === typeFilter));

  return (
    <AdminLayout titleAr="المحتوى ومكتبة الوسائط" titleEn="Content & Media Library">
      {/* Tabs + Add */}
      <div className="bg-white rounded-xl border border-slate-200 p-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'library', ar: `المكتبة والأسئلة (${library.length})`, en: `Library & FAQs (${library.length})` },
              { id: 'news', ar: `الأخبار (${news.length})`, en: `News (${news.length})` },
              { id: 'stories', ar: `قصص النجاح (${stories.length})`, en: `Stories (${stories.length})` },
              { id: 'media', ar: `مكتبة الوسائط (${mediaAssets.length})`, en: `Media Library (${mediaAssets.length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === t.id ? 'bg-[#0F4C5C] text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {lang === 'ar' ? t.ar : t.en}
            </button>
          ))}
        </div>

        {canEdit && activeTab === 'library' && (
          <button
            type="button"
            onClick={() =>
              setEditingLib({
                id: `lib-${Date.now()}`,
                slug: `item-${Date.now().toString().slice(-4)}`,
                type: 'article',
                typeLabel: 'مقال طبي',
                title: '',
                departmentId: 'neurosurgery',
                publishedAt: new Date().toISOString().slice(0, 10),
                summary: '',
                image: mediaAssets[0]?.url || '/src/assets/images/hero_nodisc_clinic_1795286630066.jpg',
                status: canPublish ? 'published' : 'draft',
              })
            }
            className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إضافة مادة / سؤال' : 'Add Library Item'}</span>
          </button>
        )}

        {canEdit && activeTab === 'news' && (
          <button
            type="button"
            onClick={() =>
              setEditingNews({
                id: `nws-${Date.now()}`,
                slug: `news-${Date.now().toString().slice(-4)}`,
                title: '',
                date: new Date().toISOString().slice(0, 10),
                categoryLabel: 'أخبار المركز',
                summary: '',
                body: ['تفاصيل الخبر قابلة للتعديل من لوحة الإدارة.'],
                image: mediaAssets[0]?.url || '/src/assets/images/hero_nodisc_clinic_1795286630066.jpg',
                status: canPublish ? 'published' : 'draft',
              })
            }
            className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إضافة خبر جديد' : 'Add News'}</span>
          </button>
        )}

        {canEdit && activeTab === 'stories' && (
          <button
            type="button"
            onClick={() =>
              setEditingStory({
                id: `st-${Date.now()}`,
                slug: `story-${Date.now().toString().slice(-4)}`,
                title: '',
                departmentId: 'rehabilitation',
                patientLabel: 'نموذج حالة تعافي',
                date: new Date().toISOString().slice(0, 10),
                summary: '',
                beforeState: 'وصف الحالة قبل البرنامج العلاجي.',
                carePath: 'خطة العلاج والتأهيل المتكاملة.',
                outcome: 'تحسن الوظيفة الحركية والالتزام بالتعليمات.',
                image: mediaAssets[2]?.url || '/src/assets/images/dept_rehab_gym_1795286629619.jpg',
                status: canPublish ? 'published' : 'draft',
                comments: [],
              })
            }
            className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إضافة قصة نجاح' : 'Add Story'}</span>
          </button>
        )}
      </div>

      {/* Tab 1: Library */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'all', label: 'الكل' },
                { id: 'condition', label: 'الحالات' },
                { id: 'article', label: 'المقالات' },
                { id: 'procedure', label: 'الإجراءات' },
                { id: 'video', label: 'الفيديوهات' },
                { id: 'faq', label: 'الأسئلة الشائعة' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTypeFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  typeFilter === f.id
                    ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-start font-semibold">العنوان</th>
                    <th className="px-4 py-3 text-start font-semibold">النوع</th>
                    <th className="px-4 py-3 text-start font-semibold">القسم</th>
                    <th className="px-4 py-3 text-start font-semibold">الحالة</th>
                    <th className="px-4 py-3 text-end font-semibold">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLib.map((item) => {
                    const dept = departments.find((d) => d.id === item.departmentId);
                    const st = item.status || 'published';
                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
                          {item.title}
                        </td>
                        <td className="px-4 py-3 text-[#0284C7] font-medium">{item.typeLabel}</td>
                        <td className="px-4 py-3 text-slate-600">{dept?.nameAr}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded border text-[11px] font-medium ${
                              st === 'published'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : st === 'draft'
                                ? 'bg-slate-100 text-slate-700 border-slate-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {st === 'published' ? 'منشور' : st === 'draft' ? 'مسودة' : 'مؤرشف'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end space-x-1.5 space-x-reverse whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewItem({
                                title: item.title,
                                summary: item.faqAnswer || item.summary,
                                image: item.image,
                              })
                            }
                            className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
                            title="معاينة"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => setEditingLib({ ...item })}
                              className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
                              title="تعديل"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canPublish && st !== 'published' && (
                            <button
                              type="button"
                              onClick={() => setLibStatus(item.id, 'published')}
                              className="px-2 py-1 rounded border border-emerald-300 text-emerald-700 font-semibold inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              نشر
                            </button>
                          )}
                          {canArchive && st !== 'archived' && (
                            <button
                              type="button"
                              onClick={() => setLibStatus(item.id, 'archived')}
                              className="p-1.5 rounded border border-amber-300 text-amber-800"
                              title="أرشفة"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: News */}
      {activeTab === 'news' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((n) => {
            const st = n.status || 'published';
            return (
              <div key={n.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#0284C7] font-medium">{n.categoryLabel}</span>
                    <span className="tabular-nums text-slate-500">{n.date}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-900">{n.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3">{n.summary}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">
                    {st === 'published' ? 'منشور' : st === 'draft' ? 'مسودة' : 'مؤرشف'}
                  </span>
                  <div className="flex gap-1.5">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => setEditingNews({ ...n })}
                        className="px-2.5 py-1 rounded border border-slate-300 font-medium"
                      >
                        تعديل
                      </button>
                    )}
                    {canPublish && st !== 'published' && (
                      <button
                        type="button"
                        onClick={() => setNewsStatus(n.id, 'published')}
                        className="px-2.5 py-1 rounded border border-emerald-300 text-emerald-700 font-semibold"
                      >
                        نشر
                      </button>
                    )}
                    {canArchive && st !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => setNewsStatus(n.id, 'archived')}
                        className="px-2.5 py-1 rounded border border-amber-300 text-amber-800 font-medium"
                      >
                        أرشفة
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Stories */}
      {activeTab === 'stories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((st) => {
            const pub = st.status || 'published';
            return (
              <div key={st.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#0284C7] font-medium">{st.patientLabel}</span>
                    <span className="tabular-nums text-slate-500">{st.date}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-900">{st.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3">{st.summary}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">
                    {pub === 'published' ? 'منشورة' : pub === 'draft' ? 'مسودة' : 'مؤرشفة'}
                  </span>
                  <div className="flex gap-1.5">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => setEditingStory({ ...st })}
                        className="px-2.5 py-1 rounded border border-slate-300 font-medium"
                      >
                        تعديل
                      </button>
                    )}
                    {canPublish && pub !== 'published' && (
                      <button
                        type="button"
                        onClick={() => setStoryStatus(st.id, 'published')}
                        className="px-2.5 py-1 rounded border border-emerald-300 text-emerald-700 font-semibold"
                      >
                        نشر
                      </button>
                    )}
                    {canArchive && pub !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => setStoryStatus(st.id, 'archived')}
                        className="px-2.5 py-1 rounded border border-amber-300 text-amber-800 font-medium"
                      >
                        أرشفة
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 4: Media Library */}
      {activeTab === 'media' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-display font-bold text-base text-slate-900">
                {lang === 'ar' ? 'إدارة الصور والملفات في الجلسة' : 'Media Library Assets'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar'
                  ? 'يمكنك رفع صور جديدة خلال جلسة المعاينة لاستخدامها في الواجهة أو المنتجات والمقالات.'
                  : 'Upload local images during the session for hero banners, products, or articles.'}
              </p>
            </div>
            {canEdit && (
              <label className="px-4 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-2">
                <FileUp className="w-4 h-4" />
                <span>{lang === 'ar' ? 'رفع صورة / ملف جديد' : 'Upload Asset'}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleMediaUpload}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mediaAssets.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden flex items-center justify-center">
                  {m.type === 'image' ? (
                    <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="p-3.5 space-y-1.5 flex-1">
                  <p className="font-semibold text-xs text-slate-900 truncate">{m.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{m.description}</p>
                  <p className="text-[10px] font-mono text-slate-400 tabular-nums">{m.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Library Edit Modal */}
      {editingLib && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveLib}
            className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-display font-bold text-lg text-slate-900">تحرير مادة المكتبة</h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">النوع</label>
                  <select
                    value={editingLib.type}
                    onChange={(e) =>
                      setEditingLib({ ...editingLib, type: e.target.value as LibraryCategory })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="article">مقال طبي</option>
                    <option value="condition">حالة مرضية</option>
                    <option value="procedure">إجراء / فحص</option>
                    <option value="video">فيديو توعوي</option>
                    <option value="faq">سؤال شائع</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">القسم</label>
                  <select
                    value={editingLib.departmentId}
                    onChange={(e) =>
                      setEditingLib({ ...editingLib, departmentId: e.target.value as DepartmentId })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">العنوان *</label>
                <input
                  type="text"
                  required
                  value={editingLib.title}
                  onChange={(e) => setEditingLib({ ...editingLib, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الملخص / الإجابة *</label>
                <textarea
                  rows={3}
                  required
                  value={editingLib.type === 'faq' ? editingLib.faqAnswer || editingLib.summary : editingLib.summary}
                  onChange={(e) =>
                    setEditingLib({
                      ...editingLib,
                      summary: e.target.value,
                      faqAnswer: editingLib.type === 'faq' ? e.target.value : editingLib.faqAnswer,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">حالة النشر</label>
                <select
                  value={editingLib.status || 'published'}
                  onChange={(e) =>
                    setEditingLib({ ...editingLib, status: e.target.value as PublishStatus })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="draft">مسودة</option>
                  <option value="published">منشور على الموقع العام</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingLib(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-xs">
                إلغاء
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold">
                حفظ المادة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* News Edit Modal */}
      {editingNews && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveNews} className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">تحرير الخبر</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">عنوان الخبر *</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الملخص *</label>
                <textarea
                  rows={3}
                  required
                  value={editingNews.summary}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingNews(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-xs">
                إلغاء
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold">
                حفظ الخبر
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Story Edit Modal */}
      {editingStory && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveStory} className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">تحرير قصة نجاح</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">العنوان *</label>
                <input
                  type="text"
                  required
                  value={editingStory.title}
                  onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الملخص *</label>
                <textarea
                  rows={3}
                  required
                  value={editingStory.summary}
                  onChange={(e) => setEditingStory({ ...editingStory, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingStory(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-xs">
                إلغاء
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold">
                حفظ القصة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">{previewItem.title}</h3>
            {previewItem.image && (
              <img src={previewItem.image} alt={previewItem.title} className="w-full h-44 object-cover rounded-lg" />
            )}
            <p className="text-sm text-slate-700 leading-relaxed">{previewItem.summary}</p>
            <div className="flex justify-end">
              <button type="button" onClick={() => setPreviewItem(null)} className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold">
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
