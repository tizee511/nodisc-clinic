import React, { useState } from 'react';
import { Check, Edit3, Plus, Users } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Campaign, CampaignStatus, DepartmentId } from '../../types/clinic';

export const AdminCampaignsPage: React.FC = () => {
  const {
    campaigns,
    setCampaigns,
    campaignBookings,
    campaignCapacityPolicy,
    setCampaignCapacityPolicy,
    getCampaignBookedCount,
    getCampaignEffectiveStatus,
    updateCampaignBookingStatus,
    departments,
    hasPermission,
    recordAudit,
  } = useDataStore();
  const { lang } = useLanguage();

  const [editingCamp, setEditingCamp] = useState<Campaign | null>(null);
  const [actionMsg, setActionMsg] = useState<string>('');
  const canManage = hasPermission('manage_campaigns');

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCamp) return;
    const exists = campaigns.some((c) => c.id === editingCamp.id);
    if (exists) {
      setCampaigns((prev) => prev.map((c) => (c.id === editingCamp.id ? editingCamp : c)));
      recordAudit('الحملات', 'تحديث إعدادات حملة', editingCamp.title);
    } else {
      setCampaigns((prev) => [editingCamp, ...prev]);
      recordAudit('الحملات', 'إضافة حملة طبية جديدة', editingCamp.title);
    }
    setEditingCamp(null);
  };

  const handleBookingStatus = (refId: string, nextStatus: 'pending' | 'confirmed' | 'cancelled') => {
    const res = updateCampaignBookingStatus(refId, nextStatus);
    if (!res.ok) {
      setActionMsg(res.error || 'تعذر التحديث');
    } else {
      setActionMsg(`تم تحديث حالة طلب الحملة (${refId}) وإعادة احتساب السعة المتبقية تلقائيًا.`);
    }
  };

  return (
    <AdminLayout titleAr="إدارة الحملات الطبية" titleEn="Campaigns Management">
      {/* Policy Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-display font-bold text-sm text-slate-900">
            {lang === 'ar' ? 'قاعدة احتساب سعة الحملات:' : 'Campaign Capacity Policy:'}
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'ينعكس التغيير مباشرة على حساب المقاعد المتبقية في الموقع العام.'
              : 'Immediately updates remaining seat counts on the public site.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={campaignCapacityPolicy}
            onChange={(e) =>
              setCampaignCapacityPolicy(e.target.value as 'confirmed_only' | 'all_active')
            }
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-medium"
          >
            <option value="confirmed_only">احتساب الطلبات المؤكدة فقط (Confirmed Only)</option>
            <option value="all_active">احتساب كل الطلبات النشطة (Confirmed + Pending)</option>
          </select>

          {canManage && (
            <button
              type="button"
              onClick={() =>
                setEditingCamp({
                  id: `camp-${Date.now()}`,
                  slug: `campaign-${Date.now().toString().slice(-4)}`,
                  title: '',
                  departmentId: 'neurosurgery',
                  serviceSummary: '',
                  dayLabel: 'الخميس — ديسمبر 2026',
                  periodLabel: 'الفترة الصباحية: 09:00 – 01:00',
                  locationLabel: 'نوديسك كلينك — العيادات التخصصية',
                  registrationWindow: 'متاح عبر الموقع',
                  freeScopeExplanation: 'يشمل الكشف المبدئي المجاني خلال فترة الحملة.',
                  totalCapacity: 20,
                  bookedCount: 0,
                  status: 'open',
                  image: '/src/assets/images/dept_neurosurgery_suite_1795286629702.jpg',
                  notes: ['يرجى إحضار التقارير والأشعة السابقة.'],
                })
              }
              className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>حملة جديدة</span>
            </button>
          )}
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs text-[#093542] font-medium">
          {actionMsg}
        </div>
      )}

      {/* Campaigns Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {campaigns.map((camp) => {
          const dept = departments.find((d) => d.id === camp.departmentId);
          const booked = getCampaignBookedCount(camp.id);
          const effective = getCampaignEffectiveStatus(camp);
          const remaining = Math.max(0, camp.totalCapacity - booked);
          return (
            <div key={camp.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#0284C7]">{dept?.nameAr}</span>
                  <h3 className="font-display font-bold text-base text-slate-900">{camp.title}</h3>
                  <p className="text-xs text-slate-500">{camp.dayLabel} · {camp.periodLabel}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded border text-[11px] font-semibold shrink-0 ${
                    effective === 'open'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : effective === 'full'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {effective === 'open'
                    ? 'مفتوحة'
                    : effective === 'full'
                    ? 'مكتملة'
                    : effective === 'scheduled'
                    ? 'مجدولة'
                    : 'منتهية'}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs tabular-nums">
                  <span className="text-slate-600 inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#0F4C5C]" />
                    المحجوز: <strong>{booked}</strong> / {camp.totalCapacity}
                  </span>
                  <span className="font-semibold text-[#0F4C5C]">المتبقي: {remaining}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0F4C5C]"
                    style={{ width: `${Math.min(100, Math.round((booked / Math.max(1, camp.totalCapacity)) * 100))}%` }}
                  />
                </div>
              </div>

              {canManage && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingCamp({ ...camp })}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل السعة / الحالة</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Campaign Registrations Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-slate-900">
            {lang === 'ar' ? 'الطلبات المرتبطة بالحملات' : 'Campaign Registrations'}
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">{campaignBookings.length} طلب</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">المرجع</th>
                <th className="px-4 py-3 text-start font-semibold">المراجع</th>
                <th className="px-4 py-3 text-start font-semibold">الحملة</th>
                <th className="px-4 py-3 text-start font-semibold">الحالة</th>
                <th className="px-4 py-3 text-end font-semibold">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaignBookings.map((b) => {
                const camp = campaigns.find((c) => c.id === b.campaignId);
                return (
                  <tr key={b.referenceId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-semibold text-[#0F4C5C]" dir="ltr">
                      {b.referenceId}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{b.patientName}</span>
                      <span className="font-mono text-[11px] text-slate-500" dir="ltr">{b.phone}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{camp?.title || b.campaignId}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded border text-[11px] font-medium ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : b.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {b.status === 'confirmed'
                          ? 'مؤكد'
                          : b.status === 'pending'
                          ? 'قيد المراجعة'
                          : 'ملغى'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end space-x-1.5 space-x-reverse whitespace-nowrap">
                      {canManage && b.status !== 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => handleBookingStatus(b.referenceId, 'confirmed')}
                          className="px-2.5 py-1 rounded border border-emerald-300 text-emerald-700 font-semibold"
                        >
                          تأكيد
                        </button>
                      )}
                      {canManage && b.status !== 'cancelled' && (
                        <button
                          type="button"
                          onClick={() => handleBookingStatus(b.referenceId, 'cancelled')}
                          className="px-2.5 py-1 rounded border border-red-300 text-red-700 font-semibold"
                        >
                          إلغاء
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

      {/* Edit Campaign Modal */}
      {editingCamp && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveCampaign} className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">إعدادات الحملة الطبية</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">عنوان الحملة *</label>
                <input
                  type="text"
                  required
                  value={editingCamp.title}
                  onChange={(e) => setEditingCamp({ ...editingCamp, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">القسم</label>
                  <select
                    value={editingCamp.departmentId}
                    onChange={(e) =>
                      setEditingCamp({ ...editingCamp, departmentId: e.target.value as DepartmentId })
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
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">إجمالي السعة (مقاعد)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingCamp.totalCapacity}
                    onChange={(e) =>
                      setEditingCamp({ ...editingCamp, totalCapacity: Math.max(1, Number(e.target.value) || 1) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الحالة التشغيلية</label>
                <select
                  value={editingCamp.status}
                  onChange={(e) =>
                    setEditingCamp({ ...editingCamp, status: e.target.value as CampaignStatus })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="open">مفتوحة للتسجيل</option>
                  <option value="full">مكتملة</option>
                  <option value="scheduled">مجدولة</option>
                  <option value="ended">منتهية</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">وصف الخدمة المجانية *</label>
                <textarea
                  rows={2}
                  required
                  value={editingCamp.serviceSummary}
                  onChange={(e) => setEditingCamp({ ...editingCamp, serviceSummary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingCamp(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-xs">
                إلغاء
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                حفظ الحملة
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};
