import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Download,
  Filter,
  Printer,
  ShieldAlert,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';

export const AdminReportsPage: React.FC = () => {
  const {
    hasPermission,
    appointments,
    orders,
    orderPayments,
    products,
    productCategories,
    storeMainSections,
    campaigns,
    departments,
    getCampaignBookedCount,
  } = useDataStore();
  const { lang } = useLanguage();
  const { formatPrice } = useClinic();

  const [deptFilter, setDeptFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');

  const suppliers = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.supplier) set.add(p.supplier);
    });
    return Array.from(set);
  }, [products]);

  const filteredAppointments = useMemo(
    () =>
      appointments.filter(
        (a) => deptFilter === 'all' || a.departmentId === deptFilter
      ),
    [appointments, deptFilter]
  );

  // Orders separated financially
  const activeOrders = useMemo(
    () => orders.filter((o) => o.fulfillmentStatus !== 'cancelled'),
    [orders]
  );
  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.fulfillmentStatus === 'delivered'),
    [orders]
  );

  const activeOrdersValue = activeOrders.reduce((acc, o) => acc + o.total, 0);
  const deliveredOrdersValue = deliveredOrders.reduce((acc, o) => acc + o.total, 0);

  const verifiedCollection = orderPayments
    .filter((p) => p.reviewStatus === 'verified')
    .reduce((acc, p) => acc + p.amountYER, 0);
  const pendingCollection = orderPayments
    .filter((p) => p.reviewStatus === 'pending')
    .reduce((acc, p) => acc + p.amountYER, 0);
  const refundPending = orderPayments
    .filter((p) => p.reviewStatus === 'refund_pending')
    .reduce((acc, p) => acc + p.amountYER, 0);

  // Itemized sales filtered by section / category / supplier
  const itemizedLines = useMemo(() => {
    return activeOrders.flatMap((ord) =>
      ord.items
        .map((item) => {
          const prod = products.find((p) => p.id === item.productId);
          const secId = item.mainSectionId || prod?.mainSectionId || '';
          const catId = item.categoryId || prod?.categoryId || '';
          const sup = item.supplier || prod?.supplier || 'غير محدد';
          return {
            orderNumber: ord.orderNumber,
            isDelivered: ord.fulfillmentStatus === 'delivered',
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            revenue: item.unitPrice * item.quantity,
            mainSectionId: secId,
            categoryId: catId,
            supplier: sup,
          };
        })
        .filter((line) => {
          if (sectionFilter !== 'all' && line.mainSectionId !== sectionFilter) return false;
          if (categoryFilter !== 'all' && line.categoryId !== categoryFilter) return false;
          if (supplierFilter !== 'all' && line.supplier !== supplierFilter) return false;
          return true;
        })
    );
  }, [activeOrders, products, sectionFilter, categoryFilter, supplierFilter]);

  const salesByProduct = useMemo(() => {
    const map = new Map<
      string,
      { name: string; qty: number; activeRev: number; deliveredRev: number }
    >();
    itemizedLines.forEach((l) => {
      const prev = map.get(l.productId) || {
        name: l.productName,
        qty: 0,
        activeRev: 0,
        deliveredRev: 0,
      };
      prev.qty += l.quantity;
      prev.activeRev += l.revenue;
      if (l.isDelivered) prev.deliveredRev += l.revenue;
      map.set(l.productId, prev);
    });
    return Array.from(map.values()).sort((a, b) => b.activeRev - a.activeRev);
  }, [itemizedLines]);

  const salesByCategory = useMemo(() => {
    const map = new Map<string, { label: string; qty: number; rev: number }>();
    itemizedLines.forEach((l) => {
      const cat = productCategories.find((c) => c.id === l.categoryId);
      const label = cat ? (lang === 'ar' ? cat.nameAr : cat.nameEn || cat.nameAr) : 'أخرى';
      const prev = map.get(l.categoryId) || { label, qty: 0, rev: 0 };
      prev.qty += l.quantity;
      prev.rev += l.revenue;
      map.set(l.categoryId, prev);
    });
    return Array.from(map.values()).sort((a, b) => b.rev - a.rev);
  }, [itemizedLines, productCategories, lang]);

  const salesByMainSection = useMemo(() => {
    const map = new Map<string, { label: string; qty: number; rev: number }>();
    itemizedLines.forEach((l) => {
      const sec = storeMainSections.find((s) => s.id === l.mainSectionId);
      const label = sec ? (lang === 'ar' ? sec.nameAr : sec.nameEn) : 'غير محدد';
      const prev = map.get(l.mainSectionId) || { label, qty: 0, rev: 0 };
      prev.qty += l.quantity;
      prev.rev += l.revenue;
      map.set(l.mainSectionId, prev);
    });
    return Array.from(map.values()).sort((a, b) => b.rev - a.rev);
  }, [itemizedLines, storeMainSections, lang]);

  const salesBySupplier = useMemo(() => {
    const map = new Map<string, { supplier: string; qty: number; rev: number }>();
    itemizedLines.forEach((l) => {
      const prev = map.get(l.supplier) || { supplier: l.supplier, qty: 0, rev: 0 };
      prev.qty += l.quantity;
      prev.rev += l.revenue;
      map.set(l.supplier, prev);
    });
    return Array.from(map.values()).sort((a, b) => b.rev - a.rev);
  }, [itemizedLines]);

  const collectionByMethod = useMemo(() => {
    const map = new Map<
      string,
      { method: string; verified: number; pending: number; refundPending: number }
    >();
    orderPayments.forEach((p) => {
      const prev = map.get(p.methodLabel) || {
        method: p.methodLabel,
        verified: 0,
        pending: 0,
        refundPending: 0,
      };
      if (p.reviewStatus === 'verified') prev.verified += p.amountYER;
      else if (p.reviewStatus === 'pending') prev.pending += p.amountYER;
      else prev.refundPending += p.amountYER;
      map.set(p.methodLabel, prev);
    });
    return Array.from(map.values());
  }, [orderPayments]);

  const lowStockProducts = useMemo(
    () =>
      products.filter((p) => {
        const available = p.stockQty - (p.reservedQty || 0);
        return available <= (p.lowStockThreshold || 5);
      }),
    [products]
  );

  const exportCsv = () => {
    const rows: string[][] = [
      ['نوع التقرير', 'البيان / المعرف', 'الكمية / العدد', 'القيمة (ر.ي)', 'ملاحظة'],
      ['مؤشر مالي', 'إجمالي الطلبات النشطة', String(activeOrders.length), String(activeOrdersValue), 'تشمل قيد المراجعة والتجهيز والتسليم'],
      ['مؤشر مالي', 'قيمة الطلبات المسلمة فعليًا', String(deliveredOrders.length), String(deliveredOrdersValue), 'مخصوم منها المخزون'],
      ['مؤشر مالي', 'التحصيل المثبت', String(orderPayments.filter((p) => p.reviewStatus === 'verified').length), String(verifiedCollection), 'مدفوعات تم التحقق منها'],
      ...salesByProduct.map((p) => ['مبيعات منتج', p.name, String(p.qty), String(p.activeRev), `مسلم: ${p.deliveredRev}`]),
      ...departments.map((d) => [
        'حجوزات قسم',
        lang === 'ar' ? d.nameAr : d.nameEn,
        String(appointments.filter((a) => a.departmentId === d.id).length),
        '0',
        `مؤكد/حضر: ${appointments.filter((a) => a.departmentId === d.id && (a.status === 'confirmed' || a.status === 'attended')).length}`,
      ]),
    ];

    const csvContent =
      '\uFEFF' +
      rows
        .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nodisc-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!hasPermission('view_reports')) {
    return (
      <AdminLayout titleAr="التقارير والتحليلات" titleEn="Reports & Analytics">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
          <ShieldAlert className="w-8 h-8 text-amber-600 mx-auto" />
          <p className="font-bold text-slate-900">
            {lang === 'ar'
              ? 'صلاحية الاطلاع على التقارير غير متاحة لدورك الحالي'
              : 'Reports access restricted for your role'}
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
    <AdminLayout titleAr="التقارير والتحليلات" titleEn="Reports & Analytics">
      {/* Toolbar & Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">{lang === 'ar' ? 'كل الأقسام الطبية' : 'All Clinic Depts'}</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {lang === 'ar' ? d.nameAr : d.nameEn}
              </option>
            ))}
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">{lang === 'ar' ? 'كلا القسمين الرئيسيين للمتجر' : 'Both Store Sections'}</option>
            {storeMainSections.map((s) => (
              <option key={s.id} value={s.id}>
                {lang === 'ar' ? s.nameAr : s.nameEn}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">{lang === 'ar' ? 'كل التصنيفات الفرعية' : 'All Subcategories'}</option>
            {productCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {lang === 'ar' ? c.nameAr : c.nameEn || c.nameAr}
              </option>
            ))}
          </select>

          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">{lang === 'ar' ? 'كل الموردين' : 'All Suppliers'}</option>
            {suppliers.map((sup) => (
              <option key={sup} value={sup}>
                {sup}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تصدير CSV' : 'Export CSV'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] text-white hover:bg-[#093542] text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'طباعة التقرير' : 'Print Report'}</span>
          </button>
        </div>
      </div>

      {/* Financial Separation Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
          <span className="text-xs text-slate-500 block">
            {lang === 'ar' ? 'قيمة الطلبات النشطة (غير الملغاة)' : 'Active Orders Value'}
          </span>
          <span className="font-display font-bold text-lg text-slate-900 tabular-nums block">
            {formatPrice(activeOrdersValue)}
          </span>
          <span className="text-[11px] text-slate-500 tabular-nums">
            {activeOrders.length} {lang === 'ar' ? 'طلبات' : 'orders'}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
          <span className="text-xs text-slate-500 block">
            {lang === 'ar' ? 'قيمة الطلبات المسلمة فعليًا' : 'Delivered Value'}
          </span>
          <span className="font-display font-bold text-lg text-[#0F4C5C] tabular-nums block">
            {formatPrice(deliveredOrdersValue)}
          </span>
          <span className="text-[11px] text-slate-500 tabular-nums">
            {deliveredOrders.length} {lang === 'ar' ? 'طلب مسلم' : 'delivered'}
          </span>
        </div>

        <div className="bg-emerald-50/70 rounded-xl border border-emerald-200 p-4 space-y-1">
          <span className="text-xs text-emerald-800 block">
            {lang === 'ar' ? 'التحصيل المثبت المعتمد' : 'Verified Collection'}
          </span>
          <span className="font-display font-bold text-lg text-emerald-900 tabular-nums block">
            {formatPrice(verifiedCollection)}
          </span>
          <span className="text-[11px] text-emerald-700 tabular-nums">
            {lang === 'ar'
              ? `قيد المراجعة: ${formatPrice(pendingCollection)}`
              : `Pending: ${formatPrice(pendingCollection)}`}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1">
          <span className="text-xs text-slate-500 block">
            {lang === 'ar' ? 'مبالغ بانتظار الاسترداد / متابعة' : 'Refund Follow-up'}
          </span>
          <span className="font-display font-bold text-lg text-amber-700 tabular-nums block">
            {formatPrice(refundPending)}
          </span>
          <span className="text-[11px] text-slate-500">
            {lang === 'ar' ? 'من طلبات ملغاة مدفوعة مسبقًا' : 'Cancelled pre-paid orders'}
          </span>
        </div>
      </div>

      {/* Store Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Main Section & Subcategory */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
          <div>
            <h2 className="font-display font-bold text-base text-slate-900">
              {lang === 'ar' ? 'المبيعات حسب القسم الرئيسي للمتجر' : 'Sales by Store Main Section'}
            </h2>
            <div className="mt-3 space-y-2.5">
              {salesByMainSection.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <span className="font-semibold text-slate-800">{row.label}</span>
                  <div className="flex items-center gap-4 tabular-nums">
                    <span className="text-slate-500">
                      {row.qty} {lang === 'ar' ? 'قطعة' : 'units'}
                    </span>
                    <span className="font-bold text-[#0F4C5C]">{formatPrice(row.rev)}</span>
                  </div>
                </div>
              ))}
              {salesByMainSection.length === 0 && (
                <p className="text-xs text-slate-500">{lang === 'ar' ? 'لا توجد بيانات مطابقة' : 'No matching data'}</p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 mb-3">
              {lang === 'ar' ? 'المبيعات حسب التصنيف الفرعي' : 'Sales by Subcategory'}
            </h3>
            <div className="space-y-2">
              {salesByCategory.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700">{row.label}</span>
                  <div className="flex items-center gap-4 tabular-nums">
                    <span className="text-slate-500">{row.qty}</span>
                    <span className="font-semibold text-slate-900">{formatPrice(row.rev)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Collection by Payment Method & Sales by Supplier */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-5">
          <div>
            <h2 className="font-display font-bold text-base text-slate-900">
              {lang === 'ar' ? 'التحصيل حسب وسيلة الدفع' : 'Collection by Payment Method'}
            </h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-start font-semibold">{lang === 'ar' ? 'الوسيلة' : 'Method'}</th>
                    <th className="px-3 py-2 text-start font-semibold">{lang === 'ar' ? 'مثبت' : 'Verified'}</th>
                    <th className="px-3 py-2 text-start font-semibold">{lang === 'ar' ? 'معلق' : 'Pending'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {collectionByMethod.map((row) => (
                    <tr key={row.method}>
                      <td className="px-3 py-2 font-medium text-slate-800">{row.method}</td>
                      <td className="px-3 py-2 font-bold text-emerald-700 tabular-nums">
                        {formatPrice(row.verified)}
                      </td>
                      <td className="px-3 py-2 text-amber-700 tabular-nums">
                        {formatPrice(row.pending)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 mb-3">
              {lang === 'ar' ? 'المبيعات حسب المورد' : 'Sales by Supplier'}
            </h3>
            <div className="space-y-2">
              {salesBySupplier.map((row) => (
                <div key={row.supplier} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700">{row.supplier}</span>
                  <div className="flex items-center gap-4 tabular-nums">
                    <span className="text-slate-500">{row.qty}</span>
                    <span className="font-semibold text-slate-900">{formatPrice(row.rev)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Sales & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-display font-bold text-base text-slate-900">
              {lang === 'ar' ? 'المبيعات حسب الصنف' : 'Sales by Product'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'الصنف' : 'Item'}</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'الكمية' : 'Qty'}</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'القيمة النشطة' : 'Active Value'}</th>
                  <th className="px-4 py-2.5 text-start font-semibold">{lang === 'ar' ? 'المسلم' : 'Delivered'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salesByProduct.map((row) => (
                  <tr key={row.name}>
                    <td className="px-4 py-2.5 font-medium text-slate-900">{row.name}</td>
                    <td className="px-4 py-2.5 tabular-nums">{row.qty}</td>
                    <td className="px-4 py-2.5 font-semibold tabular-nums">{formatPrice(row.activeRev)}</td>
                    <td className="px-4 py-2.5 text-[#0F4C5C] font-semibold tabular-nums">
                      {formatPrice(row.deliveredRev)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{lang === 'ar' ? 'تنبيهات انخفاض المخزون' : 'Low Stock Alerts'}</span>
            </h2>
            <span className="text-xs font-bold text-amber-700 tabular-nums">
              {lowStockProducts.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {lowStockProducts.map((p) => {
              const available = p.stockQty - (p.reservedQty || 0);
              return (
                <div key={p.id} className="px-5 py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {lang === 'ar'
                        ? `الحد الأدنى: ${p.lowStockThreshold || 5}`
                        : `Threshold: ${p.lowStockThreshold || 5}`}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded border font-bold tabular-nums ${
                      available <= 0
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {available} {lang === 'ar' ? 'متاح' : 'avail'}
                  </span>
                </div>
              );
            })}
            {lowStockProducts.length === 0 && (
              <p className="p-6 text-center text-xs text-slate-500">
                {lang === 'ar' ? 'جميع الأصناف فوق حد التنبيه.' : 'All items above low-stock threshold.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Appointments & Campaigns Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h2 className="font-display font-bold text-base text-slate-900">
            {lang === 'ar' ? 'تقرير الحجوزات حسب القسم والحالة' : 'Bookings by Department & Status'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
              <span className="font-bold text-base tabular-nums">{filteredAppointments.length}</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-800 block">{lang === 'ar' ? 'مؤكد / حضر' : 'Confirmed/Attended'}</span>
              <span className="font-bold text-base text-emerald-900 tabular-nums">
                {
                  filteredAppointments.filter(
                    (a) => a.status === 'confirmed' || a.status === 'attended'
                  ).length
                }
              </span>
            </div>
            <div className="p-3 rounded-lg bg-sky-50 border border-sky-200">
              <span className="text-sky-800 block">{lang === 'ar' ? 'بانتظار التأكيد' : 'Pending'}</span>
              <span className="font-bold text-base text-sky-900 tabular-nums">
                {
                  filteredAppointments.filter(
                    (a) => a.status === 'pending_review' || a.status === 'needs_revision'
                  ).length
                }
              </span>
            </div>
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <span className="text-red-800 block">{lang === 'ar' ? 'ملغى / لم يحضر' : 'Cancelled/No-show'}</span>
              <span className="font-bold text-base text-red-900 tabular-nums">
                {
                  filteredAppointments.filter(
                    (a) => a.status === 'cancelled' || a.status === 'no_show'
                  ).length
                }
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h2 className="font-display font-bold text-base text-slate-900">
            {lang === 'ar' ? 'نسب إشغال الحملات الطبية' : 'Campaign Capacity Utilization'}
          </h2>
          <div className="space-y-3">
            {campaigns.map((camp) => {
              const booked = getCampaignBookedCount(camp.id);
              const pct = camp.totalCapacity > 0 ? Math.round((booked / camp.totalCapacity) * 100) : 0;
              return (
                <div key={camp.id} className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800 truncate">{camp.title}</span>
                    <span className="tabular-nums font-bold text-[#0F4C5C]">
                      {booked}/{camp.totalCapacity} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#0284C7] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
