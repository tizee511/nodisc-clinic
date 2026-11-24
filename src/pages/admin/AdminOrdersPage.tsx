import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Plus,
  Printer,
  Search,
  X,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { ORDER_STATUS_LABELS } from '../../utils/adminLabels';
import { OrderFulfillmentStatus, OrderRecord } from '../../types/clinic';

export const AdminOrdersPage: React.FC = () => {
  const {
    orders,
    updateOrderFulfillment,
    orderPayments,
    addOrderPayment,
    verifyOrderPayment,
    hasPermission,
  } = useDataStore();
  const { lang } = useLanguage();
  const { formatPrice } = useClinic();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [selectedOrderNum, setSelectedOrderNum] = useState<string | null>(null);
  const [printableOrder, setPrintableOrder] = useState<OrderRecord | null>(null);

  const [newPayMethod, setNewPayMethod] = useState<'cod' | 'epayment'>('cod');
  const [newPayLabel, setNewPayLabel] = useState('نقدًا عند التسليم');
  const [newPayAmount, setNewPayAmount] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const canManage = hasPermission('manage_orders');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.fulfillmentStatus !== statusFilter) return false;
      if (
        q &&
        !o.orderNumber.toLowerCase().includes(q) &&
        !o.customerName.toLowerCase().includes(q) &&
        !o.phone.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [orders, query, statusFilter]);

  const selectedOrder = orders.find((o) => o.orderNumber === selectedOrderNum) || null;
  const selectedPayments = selectedOrder
    ? orderPayments.filter((p) => p.orderNumber === selectedOrder.orderNumber)
    : [];
  const verifiedPaid = selectedPayments
    .filter((p) => p.reviewStatus === 'verified')
    .reduce((acc, p) => acc + p.amountYER, 0);

  const handleFulfillmentChange = (nextStatus: OrderFulfillmentStatus) => {
    if (!selectedOrder) return;
    setFeedback(null);
    const res = updateOrderFulfillment(selectedOrder.orderNumber, nextStatus);
    if (!res.ok) {
      setFeedback({ type: 'err', text: res.error || 'تعذر تغيير حالة الطلب.' });
    } else {
      setFeedback({
        type: 'ok',
        text: `تم تحديث حالة التنفيذ إلى (${ORDER_STATUS_LABELS[nextStatus].ar}) مع تحديث حالة المخزون المرتبطة.`,
      });
    }
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const amt = Number(newPayAmount) || 0;
    if (amt <= 0) return;
    addOrderPayment({
      orderNumber: selectedOrder.orderNumber,
      methodType: newPayMethod,
      methodLabel: newPayLabel,
      amountYER: amt,
      reference: `PAY-${Math.floor(10000 + Math.random() * 89999)}`,
      reviewStatus: 'verified',
      reviewerName: 'مسؤول المتجر',
    });
    setNewPayAmount('');
  };

  return (
    <AdminLayout titleAr="طلبات المتجر والتحصيل" titleEn="Store Orders & Payments">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="رقم الطلب، اسم العميل، الهاتف..."
              className="ps-9 pe-3 py-2 rounded-lg border border-slate-300 text-xs w-56"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">كل حالات التنفيذ</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {lang === 'ar' ? v.ar : v.en}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500 tabular-nums">عدد الطلبات: {filtered.length}</span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">رقم الطلب</th>
                <th className="px-4 py-3 text-start font-semibold">العميل</th>
                <th className="px-4 py-3 text-start font-semibold">الاستلام والدفع</th>
                <th className="px-4 py-3 text-start font-semibold">الإجمالي / المثبت</th>
                <th className="px-4 py-3 text-start font-semibold">حالة التنفيذ</th>
                <th className="px-4 py-3 text-end font-semibold">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ord) => {
                const st = ORDER_STATUS_LABELS[ord.fulfillmentStatus];
                const paid = orderPayments
                  .filter((p) => p.orderNumber === ord.orderNumber && p.reviewStatus === 'verified')
                  .reduce((acc, p) => acc + p.amountYER, 0);
                return (
                  <tr key={ord.orderNumber} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-[#0F4C5C] block" dir="ltr">
                        {ord.orderNumber}
                      </span>
                      {ord.linkedPrescriptionRef && (
                        <span className="text-[10px] text-[#0284C7] font-medium">
                          مرتبط بوصفة {ord.linkedPrescriptionRef}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{ord.customerName}</span>
                      <span className="font-mono text-[11px] text-slate-500" dir="ltr">{ord.phone}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block text-slate-800">
                        {ord.deliveryMethod === 'delivery' ? 'توصيل' : 'استلام من الصيدلية'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {ord.paymentMode === 'cod'
                          ? 'نقدًا عند التسليم'
                          : ord.paymentMode === 'epayment'
                          ? 'دفع إلكتروني'
                          : 'دفع مقسم'}
                      </span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      <span className="font-bold text-slate-900 block">{formatPrice(ord.total)}</span>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        مثبت: {formatPrice(paid)}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-medium ${st.badgeClass}`}>
                        {lang === 'ar' ? st.ar : st.en}
                      </span>
                      {ord.refundFollowUpRequired && (
                        <span className="block text-[10px] text-amber-800 font-semibold">
                          يتطلب متابعة استرداد
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end space-x-1.5 space-x-reverse whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrderNum(ord.orderNumber);
                          setFeedback(null);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0F4C5C] hover:text-white text-slate-800 font-semibold"
                      >
                        التفاصيل والتحصيل
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex justify-end">
          <div className="bg-white w-full max-w-xl h-full overflow-y-auto border-s border-slate-200 p-6 space-y-6">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#0284C7]" dir="ltr">
                  {selectedOrder.orderNumber}
                </span>
                <h2 className="font-display font-bold text-xl text-slate-900">
                  {selectedOrder.customerName}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedOrder.phone} · {selectedOrder.address || 'استلام من الصيدلية'}
                </p>
                {(selectedOrder.paymentReference || selectedOrder.paymentReceiptName) && (
                  <p className="text-[11px] text-[#0F4C5C] mt-1 font-medium">
                    {selectedOrder.paymentReference && `مرجع التحويل: ${selectedOrder.paymentReference}`}
                    {selectedOrder.paymentSenderName && ` · المحوّل: ${selectedOrder.paymentSenderName}`}
                    {selectedOrder.paymentReceiptName && ` · مرفق: ${selectedOrder.paymentReceiptName}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPrintableOrder(selectedOrder)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>فاتورة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderNum(null)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
                  feedback.type === 'ok'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {feedback.type === 'ok' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Fulfillment Workflow */}
            {canManage && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-slate-900">
                    مسار تنفيذ الطلب والمخزون
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${
                      ORDER_STATUS_LABELS[selectedOrder.fulfillmentStatus].badgeClass
                    }`}
                  >
                    {ORDER_STATUS_LABELS[selectedOrder.fulfillmentStatus].ar}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'confirmed',
                      'preparing',
                      'ready_for_delivery',
                      'delivered',
                      'cancelled',
                    ] as OrderFulfillmentStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleFulfillmentChange(st)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                        selectedOrder.fulfillmentStatus === st
                          ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-[#0F4C5C]'
                      }`}
                    >
                      {ORDER_STATUS_LABELS[st].ar}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  التأكيد يحجز الكمية، والتسليم يخصم من الفعلي ويحرر المحجوز، والإلغاء يعيد الكمية المحجوزة.
                </p>
              </div>
            )}

            {/* Order Items (Historical immutable prices) */}
            <div className="space-y-2">
              <h3 className="font-display font-bold text-sm text-slate-900">الأصناف المطلوبة</h3>
              <ul className="divide-y divide-slate-100 border border-slate-200 rounded-xl px-4 text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <li key={idx} className="py-2.5 flex justify-between gap-3">
                    <span>
                      {item.name} {item.option ? `(${item.option})` : ''} ×{' '}
                      <strong className="tabular-nums">{item.quantity}</strong>
                    </span>
                    <span className="font-semibold tabular-nums">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                ))}
                <li className="py-2.5 flex justify-between font-bold text-sm text-[#0F4C5C]">
                  <span>الإجمالي الكلي</span>
                  <span className="tabular-nums">{formatPrice(selectedOrder.total)}</span>
                </li>
              </ul>
            </div>

            {/* Independent Payment Collection Records */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#0284C7]" />
                  <span>سجل الدفع والتحصيل المستقل</span>
                </h3>
                <div className="text-xs tabular-nums">
                  <span className="text-emerald-700 font-bold">المثبت: {formatPrice(verifiedPaid)}</span>
                  <span className="mx-1.5 text-slate-300">|</span>
                  <span className="text-slate-600">
                    المتبقي: {formatPrice(Math.max(0, selectedOrder.total - verifiedPaid))}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {selectedPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block">{pay.methodLabel}</span>
                      <span className="font-mono text-[11px] text-slate-500" dir="ltr">
                        {pay.reference} · {pay.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold tabular-nums text-slate-900">
                        {formatPrice(pay.amountYER)}
                      </span>
                      {canManage && pay.reviewStatus === 'pending' ? (
                        <button
                          type="button"
                          onClick={() => verifyOrderPayment(pay.id, 'verified')}
                          className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-semibold"
                        >
                          تثبيت التحصيل
                        </button>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${
                            pay.reviewStatus === 'verified'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {pay.reviewStatus === 'verified'
                            ? 'تحصيل مثبت'
                            : 'بانتظار متابعة استرداد'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {selectedPayments.length === 0 && (
                  <p className="text-xs text-slate-500">لا توجد دفعات مسجلة بعد لهذا الطلب.</p>
                )}
              </div>

              {canManage && (
                <form onSubmit={handleAddPayment} className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <select
                    value={newPayMethod}
                    onChange={(e) => {
                      const val = e.target.value as 'cod' | 'epayment';
                      setNewPayMethod(val);
                      setNewPayLabel(val === 'cod' ? 'تحصيل نقدي' : 'تحويل محفظة إلكترونية');
                    }}
                    className="px-2.5 py-2 rounded border border-slate-300 bg-white"
                  >
                    <option value="cod">تحصيل نقدي</option>
                    <option value="epayment">دفع إلكتروني</option>
                  </select>
                  <input
                    type="number"
                    min={1}
                    placeholder="المبلغ بالر.ي"
                    value={newPayAmount}
                    onChange={(e) => setNewPayAmount(e.target.value)}
                    className="px-2.5 py-2 rounded border border-slate-300 tabular-nums"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded bg-[#0F4C5C] text-white font-semibold inline-flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة دفعة</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Preview Modal */}
      {printableOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  ملخص طلب / فاتورة معاينة — نوديسك كلينك
                </h3>
                <p className="text-xs text-slate-500 font-mono" dir="ltr">
                  {printableOrder.orderNumber} · {printableOrder.createdAt}
                </p>
              </div>
              <button type="button" onClick={() => setPrintableOrder(null)} className="text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs space-y-1">
              <p><strong>العميل:</strong> {printableOrder.customerName}</p>
              <p><strong>الهاتف:</strong> <span dir="ltr">{printableOrder.phone}</span></p>
              <p><strong>الاستلام:</strong> {printableOrder.deliveryMethod === 'delivery' ? printableOrder.address : 'استلام من الصيدلية'}</p>
            </div>
            <table className="w-full text-xs border-t border-b border-slate-200">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 text-start">الصنف</th>
                  <th className="py-2 text-center">الكمية</th>
                  <th className="py-2 text-end">المجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {printableOrder.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2">{it.name}</td>
                    <td className="py-2 text-center tabular-nums">{it.quantity}</td>
                    <td className="py-2 text-end tabular-nums">{formatPrice(it.unitPrice * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between font-bold text-sm text-[#0F4C5C]">
              <span>الإجمالي</span>
              <span className="tabular-nums">{formatPrice(printableOrder.total)}</span>
            </div>
            <div className="flex justify-end gap-2 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
