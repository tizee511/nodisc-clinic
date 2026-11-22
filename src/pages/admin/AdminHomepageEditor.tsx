import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, Check, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminHomepageEditor: React.FC = () => {
  const {
    siteConfigState,
    setSiteConfigState,
    homepageSections,
    setHomepageSections,
    homeHero,
    setHomeHero,
    doctors,
    setDoctors,
    services,
    setServices,
    stories,
    setStories,
    mediaAssets,
    recordAudit,
  } = useDataStore();
  const { lang } = useLanguage();
  const [savedNotice, setSavedNotice] = useState(false);

  const notifySaved = (desc: string) => {
    recordAudit('الرئيسية والهوية', desc, 'إعدادات الواجهة');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    const sorted = [...homepageSections].sort((a, b) => a.order - b.order);
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;
    const temp = sorted[index];
    sorted[index] = sorted[targetIdx];
    sorted[targetIdx] = temp;
    setHomepageSections(sorted.map((s, i) => ({ ...s, order: i + 1 })));
    notifySaved('إعادة ترتيب أقسام الصفحة الرئيسية');
  };

  const toggleSectionVisibility = (id: string) => {
    setHomepageSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
    notifySaved(`تبديل ظهور قسم (${id})`);
  };

  const sortedSections = [...homepageSections].sort((a, b) => a.order - b.order);

  return (
    <AdminLayout titleAr="إدارة الرئيسية والهوية" titleEn="Homepage & Brand Editor">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs sm:text-sm text-slate-600">
          {lang === 'ar'
            ? 'أي تعديل على الهوية أو ألوان الثيم أو ترتيب الأقسام يظهر مباشرة في الصفحة الرئيسية العامة.'
            : 'Any changes to brand identity, colors, hero copy, or section order reflect live on the public homepage.'}
        </p>
        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'تم الحفظ في الجلسة' : 'Saved'}
            </span>
          )}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'معاينة الرئيسية' : 'View Homepage'}</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Brand Identity & Theme Colors */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            {lang === 'ar' ? 'الهوية والألوان المبدئية' : 'Brand Identity & Colors'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'ar' ? 'اسم المركز (عربي)' : 'Brand Name (AR)'}
              </label>
              <input
                type="text"
                value={siteConfigState.brand.nameAr}
                onChange={(e) =>
                  setSiteConfigState((prev) => ({
                    ...prev,
                    brand: { ...prev.brand, nameAr: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'ar' ? 'اسم المركز (إنجليزي)' : 'Brand Name (EN)'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={siteConfigState.brand.nameEn}
                onChange={(e) =>
                  setSiteConfigState((prev) => ({
                    ...prev,
                    brand: { ...prev.brand, nameEn: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'ar' ? 'الوصف المختصر' : 'Short Tagline'}
            </label>
            <input
              type="text"
              value={siteConfigState.brand.tagline}
              onChange={(e) =>
                setSiteConfigState((prev) => ({
                  ...prev,
                  brand: { ...prev.brand, tagline: e.target.value },
                }))
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {lang === 'ar' ? 'اللون الأساسي' : 'Primary Petrol'}
              </label>
              <input
                type="color"
                value={siteConfigState.theme.petrolPrimary}
                onChange={(e) =>
                  setSiteConfigState((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, petrolPrimary: e.target.value },
                  }))
                }
                className="w-full h-9 rounded border border-slate-300 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {lang === 'ar' ? 'الأزرق الداكن' : 'Petrol Dark'}
              </label>
              <input
                type="color"
                value={siteConfigState.theme.petrolDark}
                onChange={(e) =>
                  setSiteConfigState((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, petrolDark: e.target.value },
                  }))
                }
                className="w-full h-9 rounded border border-slate-300 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {lang === 'ar' ? 'اللون الثانوي' : 'Sky Accent'}
              </label>
              <input
                type="color"
                value={siteConfigState.theme.skyAccent}
                onChange={(e) =>
                  setSiteConfigState((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, skyAccent: e.target.value },
                  }))
                }
                className="w-full h-9 rounded border border-slate-300 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {lang === 'ar' ? 'لون الخلفية' : 'Canvas Bg'}
              </label>
              <input
                type="color"
                value={siteConfigState.theme.canvasBg}
                onChange={(e) =>
                  setSiteConfigState((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, canvasBg: e.target.value },
                  }))
                }
                className="w-full h-9 rounded border border-slate-300 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => notifySaved('تحديث الهوية وألوان الثيم')}
            className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold"
          >
            {lang === 'ar' ? 'تطبيق وتوثيق في السجل' : 'Apply & Log Change'}
          </button>
        </div>

        {/* Hero Text & Image */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            {lang === 'ar' ? 'الواجهة الأولى (Hero Section)' : 'Hero Banner Content'}
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'ar' ? 'السطر التمهيدي' : 'Kicker Text'}
            </label>
            <input
              type="text"
              value={homeHero.kickerAr}
              onChange={(e) => setHomeHero((prev) => ({ ...prev, kickerAr: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'ar' ? 'العنوان الرئيسي' : 'Main Headline'}
            </label>
            <input
              type="text"
              value={homeHero.titleAr}
              onChange={(e) => setHomeHero((prev) => ({ ...prev, titleAr: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {lang === 'ar' ? 'النص الوصفي' : 'Subtitle'}
            </label>
            <textarea
              rows={2}
              value={homeHero.subtitleAr}
              onChange={(e) => setHomeHero((prev) => ({ ...prev, subtitleAr: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'ar' ? 'زر الحجز الأساسي' : 'Primary CTA'}
              </label>
              <input
                type="text"
                value={homeHero.primaryCtaAr}
                onChange={(e) =>
                  setHomeHero((prev) => ({ ...prev, primaryCtaAr: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'ar' ? 'صورة الواجهة (من الوسائط)' : 'Hero Image Asset'}
              </label>
              <select
                value={homeHero.heroImage}
                onChange={(e) => setHomeHero((prev) => ({ ...prev, heroImage: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
              >
                {mediaAssets
                  .filter((m) => m.type === 'image')
                  .map((m) => (
                    <option key={m.id} value={m.url}>
                      {m.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => notifySaved('تحديث نص وصورة الواجهة الأولى')}
            className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold"
          >
            {lang === 'ar' ? 'حفظ تغييرات الواجهة' : 'Save Hero Changes'}
          </button>
        </div>

        {/* Section Ordering & Visibility */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            {lang === 'ar' ? 'ترتيب وإظهار أقسام الصفحة الرئيسية' : 'Homepage Sections Order & Visibility'}
          </h2>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
            {sortedSections.map((sec, idx) => (
              <div key={sec.id} className="px-3.5 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-mono text-slate-400 tabular-nums w-5">
                    {idx + 1}.
                  </span>
                  <span
                    className={`text-sm font-medium truncate ${
                      sec.visible ? 'text-slate-900' : 'text-slate-400 line-through'
                    }`}
                  >
                    {lang === 'ar' ? sec.labelAr : sec.labelEn}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, -1)}
                    className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === sortedSections.length - 1}
                    onClick={() => moveSection(idx, 1)}
                    className="p-1.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(sec.id)}
                    className={`px-2.5 py-1.5 rounded border text-xs font-medium inline-flex items-center gap-1 ${
                      sec.visible
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{sec.visible ? (lang === 'ar' ? 'ظاهر' : 'Visible') : lang === 'ar' ? 'مخفي' : 'Hidden'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Items Control */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            {lang === 'ar' ? 'تحديد العناصر البارزة في الرئيسية' : 'Featured Items on Homepage'}
          </h2>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0F4C5C]">
              {lang === 'ar' ? 'الخدمات المختارة' : 'Featured Services'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {services.slice(0, 6).map((srv) => (
                <label
                  key={srv.id}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 text-xs cursor-pointer hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={!!srv.featuredOnHome}
                    onChange={() =>
                      setServices((prev) =>
                        prev.map((x) =>
                          x.id === srv.id ? { ...x, featuredOnHome: !x.featuredOnHome } : x
                        )
                      )
                    }
                  />
                  <span className="truncate">{srv.title}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0F4C5C]">
              {lang === 'ar' ? 'الطبيب المميز والقصص البارزة' : 'Featured Physician & Stories'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {doctors.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 text-xs cursor-pointer hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={doc.isFeatured}
                    onChange={() =>
                      setDoctors((prev) =>
                        prev.map((d) => ({ ...d, isFeatured: d.id === doc.id }))
                      )
                    }
                  />
                  <span className="truncate">{doc.nameAr}</span>
                </label>
              ))}
              {stories.map((st) => (
                <label
                  key={st.id}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 text-xs cursor-pointer hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={!!st.featuredOnHome}
                    onChange={() =>
                      setStories((prev) =>
                        prev.map((s) =>
                          s.id === st.id ? { ...s, featuredOnHome: !s.featuredOnHome } : s
                        )
                      )
                    }
                  />
                  <span className="truncate">{st.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
