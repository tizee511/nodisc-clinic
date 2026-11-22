import React, { useState } from 'react';
import { CheckCircle2, Clock, MessageSquare, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { DepartmentId } from '../../types/clinic';

export const AdminScheduleSmsPage: React.FC = () => {
  const {
    scheduleSettings,
    setScheduleSettings,
    departments,
    smsLogs,
    retrySms,
    recordAudit,
  } = useDataStore();
  const { lang } = useLanguage();

  const [newClosedDate, setNewClosedDate] = useState('');
  const [savedFlag, setSavedFlag] = useState(false);

  const addClosedDate = () => {
    if (!newClosedDate || scheduleSettings.closedDates.includes(newClosedDate)) return;
    setScheduleSettings((prev) => ({
      ...prev,
      closedDates: [...prev.closedDates, newClosedDate].sort(),
    }));
    recordAudit('الدوام', 'إضافة يوم مغلق / إجازة', newClosedDate);
    setNewClosedDate('');
  };

  const removeClosedDate = (dt: string) => {
    setScheduleSettings((prev) => ({
      ...prev,
      closedDates: prev.closedDates.filter((d) => d !== dt),
    }));
    recordAudit('الدوام', 'إزالة يوم مغلق', dt);
  };

  const sampleSmsPreview = scheduleSettings.smsTemplateConfirmedAr
    .replace('{name}', 'فيصل الحيمي')
    .replace('{service}', 'استشارة جراحة العمود الفقري')
    .replace('{date}', '2026-11-28')
    .replace('{time}', '10:30 صباحًا')
    .replace('{ref}', 'ND-501299');

  return (
    <AdminLayout titleAr="إعدادات الدوام وسجل SMS" titleEn="Schedule & SMS Settings">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Capacities & Closed Dates */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F4C5C]" />
              <span>{lang === 'ar' ? 'سعة الفترات لكل قسم' : 'Department Slot Capacities'}</span>
            </h2>
            {savedFlag && (
              <span className="text-xs text-emerald-700 font-semibold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تم التحديث
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {departments.map((d) => (
              <div key={d.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <label className="block font-semibold text-slate-800">{d.nameAr}</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={scheduleSettings.departmentCapacities[d.id] || 6}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value) || 1);
                    setScheduleSettings((prev) => ({
                      ...prev,
                      departmentCapacities: {
                        ...prev.departmentCapacities,
                        [d.id as DepartmentId]: val,
                      },
                    }));
                    setSavedFlag(true);
                    setTimeout(() => setSavedFlag(false), 1500);
                  }}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 bg-white text-sm tabular-nums"
                />
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-900">
              {lang === 'ar' ? 'الأيام المغلقة / الإجازات التجريبية' : 'Closed Dates / Holidays'}
            </h3>
            <div className="flex gap-2">
              <input
                type="date"
                value={newClosedDate}
                onChange={(e) => setNewClosedDate(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs tabular-nums"
              />
              <button
                type="button"
                onClick={addClosedDate}
                className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة يوم</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {scheduleSettings.closedDates.map((dt) => (
                <span
                  key={dt}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-mono text-amber-900 tabular-nums"
                >
                  <span>{dt}</span>
                  <button
                    type="button"
                    onClick={() => removeClosedDate(dt)}
                    className="text-red-600 hover:text-red-800"
                    title="إزالة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SMS Template Editor */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquare className="w-4 h-4 text-[#0284C7]" />
            <span>{lang === 'ar' ? 'قالب رسالة SMS عند التأكيد' : 'Confirmation SMS Template'}</span>
          </h2>

          <p className="text-[11px] text-slate-500">
            المتغيرات المتاحة: <code className="font-mono">{'{name} {service} {date} {time} {ref}'}</code>
          </p>

          <textarea
            rows={3}
            value={scheduleSettings.smsTemplateConfirmedAr}
            onChange={(e) =>
              setScheduleSettings((prev) => ({
                ...prev,
                smsTemplateConfirmedAr: e.target.value,
              }))
            }
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
          />

          <div className="p-3.5 rounded-lg bg-sky-50 border border-sky-200 space-y-1">
            <span className="text-[11px] font-semibold text-[#0F4C5C] block">معاينة حية للرسالة:</span>
            <p className="text-xs text-slate-800 leading-relaxed">{sampleSmsPreview}</p>
          </div>
        </div>
      </div>

      {/* SMS Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-slate-900">
            {lang === 'ar' ? 'سجل إشعارات SMS المحاكاة' : 'Simulated SMS Delivery Log'}
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">{smsLogs.length} سجل</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">المرجع</th>
                <th className="px-4 py-3 text-start font-semibold">الهاتف</th>
                <th className="px-4 py-3 text-start font-semibold">نص الرسالة</th>
                <th className="px-4 py-3 text-start font-semibold">الحالة والمحاولات</th>
                <th className="px-4 py-3 text-end font-semibold">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {smsLogs.map((sms) => (
                <tr key={sms.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-semibold text-[#0F4C5C]" dir="ltr">
                    {sms.referenceId}
                  </td>
                  <td className="px-4 py-3 font-mono tabular-nums" dir="ltr">
                    {sms.phone}
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-md">{sms.message}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${
                        sms.status === 'sent'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : sms.status === 'failed'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {sms.status === 'sent'
                        ? 'تم الإرسال'
                        : sms.status === 'failed'
                        ? 'تعذر الإرسال'
                        : 'قيد الانتظار'}{' '}
                      ({sms.attempts})
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    {sms.status === 'failed' && (
                      <button
                        type="button"
                        onClick={() => retrySms(sms.id, false)}
                        className="px-3 py-1.5 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>إعادة الإرسال</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
