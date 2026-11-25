import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  Table2,
  X,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { APPOINTMENT_STATUS_LABELS } from '../../utils/adminLabels';
import { AppointmentStatus, AppointmentSubmission } from '../../types/clinic';

export const AdminBookingsPage: React.FC = () => {
  const {
    appointments,
    updateAppointment,
    departments,
    doctors,
    services,
    scheduleSettings,
    hasPermission,
  } = useDataStore();
  const { lang } = useLanguage();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'schedule'>('table');

  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [drawerDay, setDrawerDay] = useState('');
  const [drawerPeriod, setDrawerPeriod] = useState('');
  const [drawerTime, setDrawerTime] = useState('');
  const [drawerNote, setDrawerNote] = useState('');
  const [simulateSmsFail, setSimulateSmsFail] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const canConfirm = hasPermission('confirm_bookings');
  const canManage = hasPermission('manage_bookings');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (deptFilter !== 'all' && a.departmentId !== deptFilter) return false;
      if (dateFilter && a.preferredDay !== dateFilter) return false;
      if (
        q &&
        !a.patientName.toLowerCase().includes(q) &&
        !a.phone.toLowerCase().includes(q) &&
        !a.referenceId.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [appointments, query, statusFilter, deptFilter, dateFilter]);

  const selectedBooking = appointments.find((a) => a.referenceId === selectedRef) || null;

  const openDrawer = (app: AppointmentSubmission) => {
    setSelectedRef(app.referenceId);
    setDrawerDay(app.preferredDay);
    setDrawerPeriod(app.preferredPeriod);
    setDrawerTime(app.confirmedDateTime || `${app.preferredDay} · 10:30 صباحًا`);
    setDrawerNote(app.internalNote || '');
    setSimulateSmsFail(false);
    setFeedback(null);
  };

  const runAction = (
    nextStatus: AppointmentStatus,
    actionLabel: string,
    sendSms = false
  ) => {
    if (!selectedBooking) return;
    setFeedback(null);
    const res = updateAppointment(
      selectedBooking.referenceId,
      {
        status: nextStatus,
        preferredDay: drawerDay || selectedBooking.preferredDay,
        preferredPeriod: drawerPeriod || selectedBooking.preferredPeriod,
        confirmedDateTime: drawerTime || undefined,
        internalNote: drawerNote || undefined,
      },
      { sendSms, simulateSmsFail, actionLabel }
    );
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'تعذر تنفيذ الإجراء.' });
    } else {
      setFeedback({
        type: 'ok',
        text:
          sendSms && simulateSmsFail
            ? 'تم تأكيد الموعد بنجاح، ولكن تعذر إرسال SMS وتم وضع علامة متابعة اتصال.'
            : `${actionLabel} بنجاح.`,
      });
    }
  };

  // Group by day for schedule view
  const groupedByDay = useMemo(() => {
    const map: Record<string, AppointmentSubmission[]> = {};
    filtered.forEach((a) => {
      map[a.preferredDay] = map[a.preferredDay] || [];
      map[a.preferredDay].push(a);
    });
    return Object.entries(map).sort(([d1], [d2]) => d1.localeCompare(d2));
  }, [filtered]);

  return (
    <AdminLayout titleAr="إدارة الحجوزات" titleEn="Bookings Management">
      {/* Filters & View Mode Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full lg:w-auto flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث بالاسم، الهاتف، أو المرجع...' : 'Search name, phone, ref...'}
              className="ps-9 pe-3 py-2 rounded-lg border border-slate-300 text-xs w-full"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full sm:w-auto max-w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">{lang === 'ar' ? 'كل الأقسام' : 'All Departments'}</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nameAr}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto max-w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">{lang === 'ar' ? 'كل الحالات' : 'All Statuses'}</option>
            {Object.entries(APPOINTMENT_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {lang === 'ar' ? v.ar : v.en}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-slate-300 text-xs tabular-nums"
          />

          {(query || statusFilter !== 'all' || deptFilter !== 'all' || dateFilter) && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setStatusFilter('all');
                setDeptFilter('all');
                setDateFilter('');
              }}
              className="text-xs font-semibold text-[#0284C7] hover:underline px-2"
            >
              {lang === 'ar' ? 'إعادة ضبط' : 'Reset'}
            </button>
          )}
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 ${
              viewMode === 'table' ? 'bg-white text-[#0F4C5C] shadow-xs' : 'text-slate-600'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'جدول' : 'Table'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('schedule')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 ${
              viewMode === 'schedule' ? 'bg-white text-[#0F4C5C] shadow-xs' : 'text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'الجدول اليومي' : 'Schedule'}</span>
          </button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">المرجع</th>
                  <th className="px-4 py-3 text-start font-semibold">المراجع</th>
                  <th className="px-4 py-3 text-start font-semibold">القسم والخدمة</th>
                  <th className="px-4 py-3 text-start font-semibold">الطبيب</th>
                  <th className="px-4 py-3 text-start font-semibold">التاريخ والفترة</th>
                  <th className="px-4 py-3 text-start font-semibold">الحالة</th>
                  <th className="px-4 py-3 text-end font-semibold">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((app) => {
                  const dept = departments.find((d) => d.id === app.departmentId);
                  const srv = services.find((s) => s.id === app.serviceId);
                  const doc = doctors.find((d) => d.id === app.doctorId);
                  const st = APPOINTMENT_STATUS_LABELS[app.status];
                  return (
                    <tr key={app.referenceId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-semibold text-[#0F4C5C] tabular-nums" dir="ltr">
                        {app.referenceId}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 block">{app.patientName}</span>
                        <span className="font-mono text-[11px] text-slate-500 tabular-nums" dir="ltr">
                          {app.phone}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800 block">{dept?.nameAr}</span>
                        <span className="text-[11px] text-slate-500">{srv?.title}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{doc?.nameAr || 'حسب القسم'}</td>
                      <td className="px-4 py-3 tabular-nums">
                        <span className="font-medium text-slate-800 block">{app.preferredDay}</span>
                        <span className="text-[11px] text-slate-500">{app.preferredPeriod}</span>
                      </td>
                      <td className="px-4 py-3 space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${st.badgeClass}`}>
                          {lang === 'ar' ? st.ar : st.en}
                        </span>
                        {app.smsFollowUpRequired && (
                          <span className="block text-[10px] text-red-700 font-semibold">
                            يتطلب متابعة (تعذر SMS)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button
                          type="button"
                          onClick={() => openDrawer(app)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0F4C5C] hover:text-white text-slate-800 font-semibold transition-colors"
                        >
                          {lang === 'ar' ? 'التفاصيل' : 'Manage'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      {lang === 'ar' ? 'لا توجد حجوزات مطابقة للمرشحات الحالية.' : 'No matching bookings.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Schedule Day View */
        <div className="space-y-4">
          {groupedByDay.map(([day, list]) => {
            const isClosed = scheduleSettings.closedDates.includes(day);
            return (
              <div key={day} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0F4C5C]" />
                    <h2 className="font-display font-bold text-base text-slate-900 tabular-nums">
                      {day}
                    </h2>
                    {isClosed && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                        يوم مغلق في الإعدادات
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 tabular-nums">{list.length} مواعيد</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((app) => {
                    const st = APPOINTMENT_STATUS_LABELS[app.status];
                    const dept = departments.find((d) => d.id === app.departmentId);
                    return (
                      <div
                        key={app.referenceId}
                        onClick={() => openDrawer(app)}
                        className="cursor-pointer p-3.5 rounded-lg border border-slate-200 hover:border-[#0F4C5C] bg-slate-50/50 space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-[#0F4C5C]" dir="ltr">
                            {app.referenceId}
                          </span>
                          <span className={`px-2 py-0.5 rounded border font-medium ${st.badgeClass}`}>
                            {lang === 'ar' ? st.ar : st.en}
                          </span>
                        </div>
                        <p className="font-semibold text-sm text-slate-900">{app.patientName}</p>
                        <p className="text-xs text-slate-600">{dept?.nameAr} · {app.preferredPeriod}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Detail Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto border-s border-slate-200 p-6 space-y-6">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#0284C7]" dir="ltr">
                  {selectedBooking.referenceId}
                </span>
                <h2 className="font-display font-bold text-xl text-slate-900 mt-0.5">
                  {selectedBooking.patientName}
                </h2>
                <p className="font-mono text-xs text-slate-500 tabular-nums" dir="ltr">
                  {selectedBooking.phone}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRef(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`p-3.5 rounded-lg border text-xs flex items-start gap-2 ${
                  feedback.type === 'ok'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {feedback.type === 'ok' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Info Summary */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">القسم:</span>
                <span className="font-semibold text-slate-900">
                  {departments.find((d) => d.id === selectedBooking.departmentId)?.nameAr}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الخدمة:</span>
                <span className="font-semibold text-slate-900">
                  {services.find((s) => s.id === selectedBooking.serviceId)?.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">نوع الزيارة:</span>
                <span className="text-slate-800">{selectedBooking.visitType}</span>
              </div>
              {selectedBooking.notes && (
                <div className="pt-2 border-t border-slate-200 text-slate-700">
                  <span className="font-semibold block mb-0.5">ملاحظة المراجع:</span>
                  {selectedBooking.notes}
                </div>
              )}
            </div>

            {/* Schedule Controls */}
            {canManage && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-sm text-slate-900">
                  تحديد اليوم والفترة والموعد النهائي
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">اليوم</label>
                    <input
                      type="date"
                      value={drawerDay}
                      onChange={(e) => setDrawerDay(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">الساعة المعتمدة</label>
                    <input
                      type="text"
                      value={drawerTime}
                      onChange={(e) => setDrawerTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>
                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 mb-1">الفترة</label>
                  <select
                    value={drawerPeriod}
                    onChange={(e) => setDrawerPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="الفترة الصباحية (09:00 – 01:30)">الفترة الصباحية (09:00 – 01:30)</option>
                    <option value="الفترة المسائية (04:00 – 08:30)">الفترة المسائية (04:00 – 08:30)</option>
                  </select>
                </div>
                <div className="text-xs">
                  <label className="block font-semibold text-slate-700 mb-1">ملاحظة داخلية للاستقبال</label>
                  <textarea
                    rows={2}
                    value={drawerNote}
                    onChange={(e) => setDrawerNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>

                {canConfirm && (
                  <label className="flex items-center gap-2 p-3 rounded-lg bg-red-50/70 border border-red-200 text-xs text-red-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={simulateSmsFail}
                      onChange={(e) => setSimulateSmsFail(e.target.checked)}
                    />
                    <span>محاكاة تعذر إرسال SMS عند التأكيد (لا يمنع التأكيد ويسجل تنبيه متابعة)</span>
                  </label>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {canConfirm && (
                    <button
                      type="button"
                      onClick={() => runAction('confirmed', 'تأكيد الموعد وإصدار إشعار SMS', true)}
                      className="col-span-2 py-2.5 px-4 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs font-semibold"
                    >
                      تأكيد الموعد وإرسال SMS
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => runAction('needs_revision', 'اقتراح موعد بديل للمراجع')}
                    className="py-2 px-3 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-xs font-semibold"
                  >
                    اقتراح وقت بديل
                  </button>
                  <button
                    type="button"
                    onClick={() => runAction('attended', 'تسجيل حضور المراجع')}
                    className="py-2 px-3 rounded-lg border border-teal-300 bg-teal-50 text-teal-900 text-xs font-semibold"
                  >
                    حضر المراجع
                  </button>
                  <button
                    type="button"
                    onClick={() => runAction('no_show', 'تسجيل عدم الحضور')}
                    className="py-2 px-3 rounded-lg border border-orange-300 bg-orange-50 text-orange-900 text-xs font-semibold"
                  >
                    لم يحضر
                  </button>
                  <button
                    type="button"
                    onClick={() => runAction('cancelled', 'إلغاء الموعد')}
                    className="py-2 px-3 rounded-lg border border-red-300 bg-red-50 text-red-800 text-xs font-semibold"
                  >
                    إلغاء الموعد
                  </button>
                </div>
              </div>
            )}

            {/* Simulated SMS Preview */}
            {selectedBooking.simulatedSmsText && (
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-[#0F4C5C]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>آخر رسالة SMS محاكاة</span>
                </div>
                <p className="text-slate-700 leading-relaxed">{selectedBooking.simulatedSmsText}</p>
              </div>
            )}

            {/* Action Log */}
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <h3 className="font-display font-bold text-xs text-slate-700">سجل الإجراءات على الطلب</h3>
              <ul className="space-y-2 text-xs">
                {(selectedBooking.actionLog || []).map((log, i) => (
                  <li key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-800">{log.actor}</span>
                      <span className="tabular-nums">{log.time}</span>
                    </div>
                    <p className="text-slate-700 mt-0.5">{log.action}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
