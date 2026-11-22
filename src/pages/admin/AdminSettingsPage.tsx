import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, RotateCcw, Save, ShieldAlert } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminSettingsPage: React.FC = () => {
  const {
    hasPermission,
    siteConfigState,
    setSiteConfigState,
    auditLog,
    recordAudit,
    resetAllDemoData,
  } = useDataStore();
  const { lang } = useLanguage();

  const [auditFilter, setAuditFilter] = useState('');
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const [form, setForm] = useState({
    tagline: siteConfigState.brand.tagline,
    prototypeNotice: siteConfigState.brand.prototypeNotice,
    city: siteConfigState.contact.city,
    address: siteConfigState.contact.address,
    landmark: siteConfigState.contact.landmark,
    email: siteConfigState.contact.email,
    workingDays: siteConfigState.contact.workingDays,
    whatsappDisplay: siteConfigState.contact.whatsappDisplay,
    phone1: siteConfigState.contact.phones[0]?.value || '',
    phone2: siteConfigState.contact.phones[1]?.value || '',
    deliveryFeeYER: siteConfigState.payment.deliveryFeeYER,
    freeDeliveryThresholdYER: siteConfigState.payment.freeDeliveryThresholdYER,
    codFeeYER: siteConfigState.payment.codFeeYER,
    ePaymentFeeYER: siteConfigState.payment.ePaymentFeeYER,
    showCareersPage: siteConfigState.features.showCareersPage,
    showSurveyPage: siteConfigState.features.showSurveyPage,
    showDualPaymentPreview: siteConfigState.features.showDualPaymentPreview,
    showFloatingContactButton: siteConfigState.features.showFloatingContactButton,
    allowPublicRating: siteConfigState.reviewsPolicy.allowPublicRating,
  });

  const filteredAudit = useMemo(() => {
    const q = auditFilter.trim().toLowerCase();
    if (!q) return auditLog;
    return auditLog.filter(
      (entry) =>
        entry.action.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.actorName.toLowerCase().includes(q) ||
        entry.target.toLowerCase().includes(q)
    );
  }, [auditLog, auditFilter]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteConfigState((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        tagline: form.tagline,
        prototypeNotice: form.prototypeNotice,
      },
      contact: {
        ...prev.contact,
        city: form.city,
        address: form.address,
        landmark: form.landmark,
        email: form.email,
        workingDays: form.workingDays,
        whatsappDisplay: form.whatsappDisplay,
        phones: prev.contact.phones.map((ph, idx) =>
          idx === 0
            ? { ...ph, value: form.phone1 }
            : idx === 1
            ? { ...ph, value: form.phone2 }
            : ph
        ),
      },
      payment: {
        ...prev.payment,
        deliveryFeeYER: Number(form.deliveryFeeYER) || 0,
        freeDeliveryThresholdYER: Number(form.freeDeliveryThresholdYER) || 0,
        codFeeYER: Number(form.codFeeYER) || 0,
        ePaymentFeeYER: Number(form.ePaymentFeeYER) || 0,
      },
      reviewsPolicy: {
        ...prev.reviewsPolicy,
        allowPublicRating: form.allowPublicRating,
      },
      features: {
        ...prev.features,
        showCareersPage: form.showCareersPage,
        showSurveyPage: form.showSurveyPage,
        showDualPaymentPreview: form.showDualPaymentPreview,
        showFloatingContactButton: form.showFloatingContactButton,
      },
    }));
    recordAudit('الإعدادات', 'تحديث إعدادات المركز والمتجر والميزات', 'siteConfig');
    setSavedNotice(
      lang === 'ar'
        ? 'تم حفظ الإعدادات وتطبيقها مباشرة على الموقع العام والمتجر.'
        : 'Settings saved and applied to public site & store.'
    );
  };

  if (!hasPermission('manage_settings')) {
    return (
      <AdminLayout titleAr="إعدادات النظام وسجل الأنشطة" titleEn="Settings & Audit Log">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
          <ShieldAlert className="w-8 h-8 text-amber-600 mx-auto" />
          <p className="font-bold text-slate-900">
            {lang === 'ar'
              ? 'إعدادات النظام وسجل الأنشطة متاحة لمدير النظام فقط'
              : 'System settings are restricted to System Admin'}
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
    <AdminLayout titleAr="إعدادات النظام وسجل الأنشطة" titleEn="Settings & Audit Log">
      {savedNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-3 text-xs font-medium">
          {savedNotice}
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* General & Contact Settings */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <h2 className="font-display font-bold text-base text-slate-900">
            {lang === 'ar' ? 'بيانات المركز والتواصل' : 'Clinic Info & Contact'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                {lang === 'ar' ? 'الوصف المختصر في الشريط والتذييل' : 'Clinic Tagline'}
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                {lang === 'ar' ? 'نص إشعار النموذج التصوري' : 'Prototype Notice Text'}
              </label>
              <input
                type="text"
                value={form.prototypeNotice}
                onChange={(e) => setForm((f) => ({ ...f, prototypeNotice: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {lang === 'ar' ? 'المدينة' : 'City'}
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {lang === 'ar' ? 'أيام الدوام' : 'Working Days'}
              </label>
              <input
                type="text"
                value={form.workingDays}
                onChange={(e) => setForm((f) => ({ ...f, workingDays: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">
                {lang === 'ar' ? 'العنوان التفصيلي' : 'Address'}
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {lang === 'ar' ? 'هاتف الاستقبال' : 'Reception Phone'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={form.phone1}
                onChange={(e) => setForm((f) => ({ ...f, phone1: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {lang === 'ar' ? 'هاتف الصيدلية' : 'Pharmacy Phone'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={form.phone2}
                onChange={(e) => setForm((f) => ({ ...f, phone2: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {lang === 'ar' ? 'عرض واتساب' : 'WhatsApp Display'}
              </label>
              <input
                type="text"
                dir="ltr"
                value={form.whatsappDisplay}
                onChange={(e) => setForm((f) => ({ ...f, whatsappDisplay: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Payment, Fees & Feature Flags */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h2 className="font-display font-bold text-base text-slate-900">
              {lang === 'ar' ? 'رسوم المتجر والتوصيل (ر.ي)' : 'Store Delivery & Fees (YER)'}
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {lang === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.deliveryFeeYER}
                  onChange={(e) => setForm((f) => ({ ...f, deliveryFeeYER: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 tabular-nums"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {lang === 'ar' ? 'حد التوصيل المجاني' : 'Free Delivery Threshold'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.freeDeliveryThresholdYER}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, freeDeliveryThresholdYER: Number(e.target.value) }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 tabular-nums"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {lang === 'ar' ? 'رسوم الدفع عند التسليم' : 'COD Fee'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.codFeeYER}
                  onChange={(e) => setForm((f) => ({ ...f, codFeeYER: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 tabular-nums"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {lang === 'ar' ? 'رسوم الدفع الإلكتروني' : 'E-Payment Fee'}
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.ePaymentFeeYER}
                  onChange={(e) => setForm((f) => ({ ...f, ePaymentFeeYER: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h2 className="font-display font-bold text-base text-slate-900">
              {lang === 'ar' ? 'إظهار الميزات والصفحات المساعدة' : 'Feature Flags'}
            </h2>
            <div className="space-y-2 text-xs">
              {[
                {
                  key: 'showCareersPage' as const,
                  ar: 'إظهار صفحة الانضمام والتوظيف العام في التذييل',
                  en: 'Show Careers page link in Footer',
                },
                {
                  key: 'showSurveyPage' as const,
                  ar: 'إظهار رابط استبيان تجربة الموقع',
                  en: 'Show Site Survey link in Footer',
                },
                {
                  key: 'showDualPaymentPreview' as const,
                  ar: 'إتاحة خيار الدفع المقسم (نقد + إلكتروني) في المتجر',
                  en: 'Enable Split Payment in Checkout',
                },
                {
                  key: 'showFloatingContactButton' as const,
                  ar: 'إظهار زر التواصل السريع العائم',
                  en: 'Show Floating Contact Button',
                },
                {
                  key: 'allowPublicRating' as const,
                  ar: 'السماح بإرسال تعليقات وتقييمات جديدة على القصص',
                  en: 'Allow public story comments & ratings',
                },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2.5 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={form[item.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [item.key]: e.target.checked }))}
                    className="w-4 h-4 accent-[#0F4C5C]"
                  />
                  <span className="text-slate-700 font-medium">
                    {lang === 'ar' ? item.ar : item.en}
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{lang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmResetOpen(true)}
                className="py-2.5 px-4 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إعادة ضبط الديمو' : 'Reset Demo Data'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Audit Log */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-[#0284C7]" />
            <span>{lang === 'ar' ? 'سجل الأنشطة والإجراءات' : 'System Audit Log'}</span>
          </h2>
          <input
            type="search"
            value={auditFilter}
            onChange={(e) => setAuditFilter(e.target.value)}
            placeholder={lang === 'ar' ? 'تصفية السجل...' : 'Filter audit log...'}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs w-60"
          />
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'الوقت' : 'Time'}</th>
                <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'المنفذ' : 'Actor'}</th>
                <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'القسم' : 'Category'}</th>
                <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'الإجراء' : 'Action'}</th>
                <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'العنصر' : 'Target'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAudit.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-mono text-slate-500 tabular-nums whitespace-nowrap" dir="ltr">
                    {entry.timestamp}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-slate-900">
                    {entry.actorName}{' '}
                    <span className="text-[11px] text-slate-400">({entry.actorRole})</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-700">{entry.action}</td>
                  <td className="px-4 py-2.5 font-mono text-[#0F4C5C]">{entry.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Demo Reset */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">
              {lang === 'ar' ? 'تأكيد إعادة ضبط بيانات المعاينة' : 'Confirm Demo Data Reset'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'سيتم استرجاع جميع بيانات الموقع العام والمتجر والحجوزات والطلبات والمخزون والصلاحيات إلى الوضع التجريبي الافتراضي.'
                : 'This will restore all public site content, store inventory, orders, bookings, and permissions back to initial demo defaults.'}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllDemoData();
                  setConfirmResetOpen(false);
                  setSavedNotice(
                    lang === 'ar'
                      ? 'تمت إعادة ضبط كافة بيانات المعاينة بنجاح.'
                      : 'All demo data has been reset to defaults.'
                  );
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                {lang === 'ar' ? 'تأكيد الإعادة' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
