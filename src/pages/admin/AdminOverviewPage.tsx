import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  FileUp,
  MessageSquare,
  PackageOpen,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { APPOINTMENT_STATUS_LABELS, ORDER_STATUS_LABELS } from '../../utils/adminLabels';

export const AdminOverviewPage: React.FC = () => {
  const {
    appointments,
    orders,
    orderPayments,
    prescriptions,
    products,
    supportMessages,
    stories,
    campaigns,
    departments,
    hasPermission,
  } = useDataStore();
  const { lang } = useLanguage();
  const { formatPrice } = useClinic();
  const [periodFilter, setPeriodFilter] = useState<'today' | '7d' | '30d'>('7d');

  // KPIs
  const pendingBookings = appointments.filter(
    (a) => a.status === 'pending_review' || a.status === 'needs_revision'
  ).length;
  const confirmedBookings = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'attended'
  ).length;
  const newOrders = orders.filter((o) => o.fulfillmentStatus === 'pending_review').length;
  const verifiedCollectionYER = orderPayments
    .filter((p) => p.reviewStatus === 'verified')
    .reduce((acc, p) => acc + p.amountYER, 0);
  const lowStockCount = products.filter(
    (p) => p.stockQty - (p.reservedQty || 0) <= (p.lowStockThreshold || 3)
  ).length;
  const pendingRxCount = prescriptions.filter(
    (r) => r.status === 'new' || r.status === 'under_review'
  ).length;
  const pendingCommentsCount = stories.reduce(
    (acc, s) => acc + s.comments.filter((c) => c.status === 'pending').length,
    0
  );
  const pendingInboxCount =
    supportMessages.filter((m) => m.status === 'new').length + pendingCommentsCount;

  // Bookings by Department chart data
  const bookingsByDept = departments.map((d) => ({
    id: d.id,
    label: lang === 'ar' ? d.nameAr : d.nameEn,
    count: appointments.filter((a) => a.departmentId === d.id).length,
  }));
  const maxDeptBookings = Math.max(1, ...bookingsByDept.map((b) => b.count));

  // Orders vs Verified Collection summary
  const totalOrdersValue = orders
    .filter((o) => o.fulfillmentStatus !== 'cancelled')
    .reduce((acc, o) => acc + o.total, 0);
  const deliveredOrdersValue = orders
    .filter((o) => o.fulfillmentStatus === 'delivered')
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <AdminLayout titleAr="نظرة عامة" titleEn="Dashboard Overview">
      {/* Period Bar + Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">
            {lang === 'ar' ? 'نطاق العرض:' : 'Period:'}
          </span>
          {(
            [
              { id: 'today', ar: 'اليوم', en: 'Today' },
              { id: '7d', ar: 'آخر 7 أيام', en: 'Last 7 Days' },
              { id: '30d', ar: 'آخر 30 يومًا', en: 'Last 30 Days' },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriodFilter(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                periodFilter === p.id
                  ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {lang === 'ar' ? p.ar : p.en}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {hasPermission('manage_bookings') && (
            <Link
              to="/admin/bookings?status=pending_review"
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0F4C5C] hover:text-white text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <CalendarCheck2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مراجعة المواعيد' : 'Review Bookings'}</span>
            </Link>
          )}
          {hasPermission('manage_store') && (
            <Link
              to="/admin/products?new=1"
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0F4C5C] hover:text-white text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إضافة منتج' : 'Add Product'}</span>
            </Link>
          )}
          {hasPermission('manage_content') && (
            <Link
              to="/admin/content"
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0F4C5C] hover:text-white text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مادة طبية جديدة' : 'New Article'}</span>
            </Link>
          )}
          {hasPermission('manage_prescriptions') && (
            <Link
              to="/admin/prescriptions"
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0F4C5C] hover:text-white text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'طابور الوصفات' : 'Rx Queue'}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Clickable KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Link
          to={hasPermission('manage_bookings') ? '/admin/bookings?status=pending_review' : '#'}
          className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#0F4C5C]/50 transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{lang === 'ar' ? 'مواعيد بانتظار التأكيد' : 'Pending Bookings'}</span>
            <CalendarCheck2 className="w-4 h-4 text-[#0284C7]" />
          </div>
          <p className="font-display font-bold text-2xl text-slate-900 tabular-nums">
            {pendingBookings}
          </p>
          <p className="text-[11px] text-slate-500 tabular-nums">
            {lang === 'ar' ? `${confirmedBookings} موعد مؤكد/مكتمل` : `${confirmedBookings} confirmed`}
          </p>
        </Link>

        <Link
          to={hasPermission('manage_orders') ? '/admin/orders?status=pending_review' : '#'}
          className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#0F4C5C]/50 transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{lang === 'ar' ? 'طلبات المتجر الجديدة' : 'New Store Orders'}</span>
            <ShoppingCart className="w-4 h-4 text-[#0F4C5C]" />
          </div>
          <p className="font-display font-bold text-2xl text-slate-900 tabular-nums">
            {newOrders}
          </p>
          <p className="text-[11px] text-slate-500 tabular-nums">
            {lang === 'ar' ? `إجمالي الطلبات: ${orders.length}` : `Total: ${orders.length}`}
          </p>
        </Link>

        <Link
          to={hasPermission('manage_orders') ? '/admin/orders' : '#'}
          className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#0F4C5C]/50 transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{lang === 'ar' ? 'التحصيل المثبت' : 'Verified Collection'}</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-display font-bold text-xl text-[#0F4C5C] tabular-nums">
            {formatPrice(verifiedCollectionYER)}
          </p>
          <p className="text-[11px] text-slate-500 tabular-nums">
            {lang === 'ar' ? 'من واقع المدفوعات المؤكدة' : 'Verified payment records'}
          </p>
        </Link>

        <Link
          to={hasPermission('manage_prescriptions') ? '/admin/prescriptions' : '#'}
          className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#0F4C5C]/50 transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{lang === 'ar' ? 'وصفات للمراجعة' : 'Rx Queue'}</span>
            <FileUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-display font-bold text-2xl text-slate-900 tabular-nums">
            {pendingRxCount}
          </p>
          <p className="text-[11px] text-slate-500 tabular-nums">
            {lang === 'ar' ? `من أصل ${prescriptions.length} وصفة` : `of ${prescriptions.length} total`}
          </p>
        </Link>

        <Link
          to={hasPermission('manage_store') ? '/admin/products?stock=low' : '#'}
          className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#0F4C5C]/50 transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{lang === 'ar' ? 'منتجات منخفضة المخزون' : 'Low Stock Alerts'}</span>
            <PackageOpen className="w-4 h-4 text-red-600" />
          </div>
          <p className="font-display font-bold text-2xl text-slate-900 tabular-nums">
            {lowStockCount}
          </p>
          <p className="text-[11px] text-slate-500">
            {lang === 'ar' ? 'تحتاج إعادة تزويد' : 'Needs restock'}
          </p>
        </Link>

        <Link
          to={hasPermission('manage_inbox') ? '/admin/inbox' : '#'}
          className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#0F4C5C]/50 transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{lang === 'ar' ? 'رسائل وتعليقات معلقة' : 'Inbox & Moderation'}</span>
            <MessageSquare className="w-4 h-4 text-[#0284C7]" />
          </div>
          <p className="font-display font-bold text-2xl text-slate-900 tabular-nums">
            {pendingInboxCount}
          </p>
          <p className="text-[11px] text-slate-500">
            {lang === 'ar'
              ? `${pendingCommentsCount} تعليق بانتظار الاعتماد`
              : `${pendingCommentsCount} pending comments`}
          </p>
        </Link>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bookings by Department */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-slate-900">
              {lang === 'ar' ? 'توزيع الحجوزات حسب الأقسام' : 'Bookings by Department'}
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">
              {lang === 'ar' ? `الإجمالي: ${appointments.length}` : `Total: ${appointments.length}`}
            </span>
          </div>
          <div className="space-y-3">
            {bookingsByDept.map((row) => (
              <div key={row.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800">{row.label}</span>
                  <span className="font-mono font-semibold text-[#0F4C5C] tabular-nums">
                    {row.count}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0F4C5C] rounded-full transition-all"
                    style={{ width: `${Math.round((row.count / maxDeptBookings) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Value vs Delivered vs Verified Collection */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-slate-900">
              {lang === 'ar' ? 'مؤشرات قيمة الطلبات والتسليم والتحصيل' : 'Orders Value vs Collection'}
            </h2>
            <span className="text-xs text-slate-500">
              {lang === 'ar' ? 'فصل مالي واضح' : 'Separated metrics'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 block">
                {lang === 'ar' ? 'قيمة الطلبات غير الملغاة' : 'Active Orders Value'}
              </span>
              <span className="font-bold text-sm text-slate-900 tabular-nums block">
                {formatPrice(totalOrdersValue)}
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 block">
                {lang === 'ar' ? 'قيمة الطلبات المسلمة' : 'Delivered Value'}
              </span>
              <span className="font-bold text-sm text-[#0F4C5C] tabular-nums block">
                {formatPrice(deliveredOrdersValue)}
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1">
              <span className="text-[11px] text-emerald-800 block">
                {lang === 'ar' ? 'التحصيل المثبت فعليًا' : 'Verified Collection'}
              </span>
              <span className="font-bold text-sm text-emerald-900 tabular-nums block">
                {formatPrice(verifiedCollectionYER)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span>
              {lang === 'ar'
                ? `الحملات الطبية المسجلة: ${campaigns.length}`
                : `Configured Campaigns: ${campaigns.length}`}
            </span>
            {hasPermission('view_reports') && (
              <Link to="/admin/reports" className="font-semibold text-[#0F4C5C] hover:underline">
                {lang === 'ar' ? 'فتح التقارير التفصيلية ←' : 'Open Detailed Reports →'}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bookings & Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-slate-900">
              {lang === 'ar' ? 'أحدث طلبات المواعيد' : 'Recent Appointments'}
            </h2>
            {hasPermission('manage_bookings') && (
              <Link to="/admin/bookings" className="text-xs font-semibold text-[#0F4C5C] hover:underline">
                {lang === 'ar' ? 'عرض الكل' : 'View all'}
              </Link>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'المرجع' : 'Ref'}</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'المراجع' : 'Patient'}</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'اليوم' : 'Date'}</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.slice(0, 5).map((app) => {
                  const st = APPOINTMENT_STATUS_LABELS[app.status];
                  return (
                    <tr key={app.referenceId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-semibold text-[#0F4C5C] tabular-nums" dir="ltr">
                        {app.referenceId}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {app.patientName}
                        {app.smsFollowUpRequired && (
                          <span title={lang === 'ar' ? 'تعذر إرسال SMS' : 'SMS delivery failed'}>
                            <AlertCircle className="w-3.5 h-3.5 text-red-600 inline ms-1" />
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 tabular-nums">{app.preferredDay}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${st.badgeClass}`}>
                          {lang === 'ar' ? st.ar : st.en}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Store Orders */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-slate-900">
              {lang === 'ar' ? 'أحدث طلبات المتجر' : 'Recent Store Orders'}
            </h2>
            {hasPermission('manage_orders') && (
              <Link to="/admin/orders" className="text-xs font-semibold text-[#0F4C5C] hover:underline">
                {lang === 'ar' ? 'عرض الكل' : 'View all'}
              </Link>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'رقم الطلب' : 'Order'}</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'الإجمالي' : 'Total'}</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'التنفيذ' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((ord) => {
                  const st = ORDER_STATUS_LABELS[ord.fulfillmentStatus];
                  return (
                    <tr key={ord.orderNumber} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-semibold text-[#0F4C5C] tabular-nums" dir="ltr">
                        {ord.orderNumber}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {ord.customerName}
                        {ord.refundFollowUpRequired && (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600 inline ms-1" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold tabular-nums text-slate-900">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${st.badgeClass}`}>
                          {lang === 'ar' ? st.ar : st.en}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-sky-50/60 border border-sky-200 rounded-xl px-4 py-3 text-xs text-[#093542] flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
        <span>
          {lang === 'ar'
            ? 'جميع الأرقام والحجوزات والطلبات والمدفوعات مرتبطة لحظيًا بالموقع العام والمتجر خلال جلسة المعاينة.'
            : 'All metrics, bookings, orders, and payments are synchronized live with the public site & store during this session.'}
        </span>
      </div>
    </AdminLayout>
  );
};
