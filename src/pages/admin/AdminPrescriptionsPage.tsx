import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, FileText, Plus, Search, ShoppingBag, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { PRESCRIPTION_STATUS_LABELS } from '../../utils/adminLabels';
import { PrescriptionStatus, PrescriptionSubmission } from '../../types/clinic';

export const AdminPrescriptionsPage: React.FC = () => {
  const {
    prescriptions,
    updatePrescription,
    convertPrescriptionToOrder,
    products,
    hasPermission,
  } = useDataStore();
  const { lang } = useLanguage();
  const { formatPrice } = useClinic();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRef, setSelectedRef] = useState<string | null>(null);

  const [pharmacistNote, setPharmacistNote] = useState('');
  const [pickedItems, setPickedItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [addProdId, setAddProdId] = useState(products[0]?.id || '');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('pickup');
  const [paymentMode, setPaymentMode] = useState<'cod' | 'epayment'>('cod');
  const [feedback, setFeedback] = useState<string>('');

  const canManage = hasPermission('manage_prescriptions');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prescriptions.filter((rx) => {
      if (statusFilter !== 'all' && rx.status !== statusFilter) return false;
      if (
        q &&
        !rx.referenceId.toLowerCase().includes(q) &&
        !rx.patientName.toLowerCase().includes(q) &&
        !rx.phone.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [prescriptions, query, statusFilter]);

  const selectedRx = prescriptions.find((r) => r.referenceId === selectedRef) || null;

  const openRxDrawer = (rx: PrescriptionSubmission) => {
    setSelectedRef(rx.referenceId);
    setPharmacistNote(rx.pharmacistNote || '');
    setPickedItems(rx.quotedItems || []);
    setFeedback('');
  };

  const addCatalogItem = () => {
    if (!addProdId) return;
    setPickedItems((prev) => {
      const existing = prev.find((i) => i.productId === addProdId);
      if (existing) {
        return prev.map((i) =>
          i.productId === addProdId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId: addProdId, quantity: 1 }];
    });
  };

  const pickedSubtotal = pickedItems.reduce((acc, item) => {
    const p = products.find((x) => x.id === item.productId);
    return acc + (p ? p.priceYER * item.quantity : 0);
  }, 0);

  const handleConvert = () => {
    if (!selectedRx) return;
    updatePrescription(selectedRx.referenceId, { pharmacistNote });
    const res = convertPrescriptionToOrder(
      selectedRx.referenceId,
      pickedItems,
      deliveryMethod,
      paymentMode
    );
    if (res.ok) {
      setFeedback(`تم تحويل الوصفة وإنشاء طلب المتجر المرتبط رقم (${res.orderNumber}) بنجاح.`);
    } else {
      setFeedback(res.error || 'تعذر التحويل.');
    }
  };

  return (
    <AdminLayout titleAr="مراجعة الوصفات الطبية" titleEn="Prescriptions Queue">
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-auto flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="رقم الوصفة، المريض، الهاتف..."
              className="ps-9 pe-3 py-2 rounded-lg border border-slate-300 text-xs w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto max-w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">كل الحالات</option>
            {Object.entries(PRESCRIPTION_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {lang === 'ar' ? v.ar : v.en}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-slate-500 tabular-nums">{filtered.length} وصفة</span>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">المرجع</th>
                <th className="px-4 py-3 text-start font-semibold">المريض</th>
                <th className="px-4 py-3 text-start font-semibold">الملف المرفق</th>
                <th className="px-4 py-3 text-start font-semibold">الحالة</th>
                <th className="px-4 py-3 text-start font-semibold">الطلب المرتبط</th>
                <th className="px-4 py-3 text-end font-semibold">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((rx) => {
                const st = PRESCRIPTION_STATUS_LABELS[rx.status];
                return (
                  <tr key={rx.referenceId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-[#0F4C5C]" dir="ltr">
                      {rx.referenceId}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{rx.patientName}</span>
                      <span className="font-mono text-[11px] text-slate-500" dir="ltr">{rx.phone}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {rx.fileName} ({rx.fileSizeLabel})
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${st.badgeClass}`}>
                        {lang === 'ar' ? st.ar : st.en}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#0284C7]" dir="ltr">
                      {rx.linkedOrderNumber || '—'}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button
                        type="button"
                        onClick={() => openRxDrawer(rx)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0F4C5C] hover:text-white text-slate-800 font-semibold"
                      >
                        مراجعة وتحويل
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rx Review & Convert Drawer */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex justify-end">
          <div className="bg-white w-full max-w-xl h-full overflow-y-auto border-s border-slate-200 p-6 space-y-6">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#0284C7]" dir="ltr">
                  {selectedRx.referenceId}
                </span>
                <h2 className="font-display font-bold text-xl text-slate-900">
                  {selectedRx.patientName}
                </h2>
                <p className="text-xs text-slate-500 font-mono" dir="ltr">{selectedRx.phone}</p>
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
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {/* Attachment Preview */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 inline-flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#0F4C5C]" />
                  {selectedRx.fileName} ({selectedRx.fileSizeLabel})
                </span>
                <span className="text-[11px] text-slate-500">معاينة مرفق الجلسة</span>
              </div>
              {selectedRx.previewUrl ? (
                <img
                  src={selectedRx.previewUrl}
                  alt={selectedRx.fileName}
                  className="max-h-56 w-full object-contain rounded-lg border border-slate-200 bg-white"
                />
              ) : (
                <div className="p-4 rounded-lg bg-white border border-slate-200 text-xs text-slate-500 text-center">
                  ملف PDF / مستند مرفق ({selectedRx.fileType})
                </div>
              )}
              {selectedRx.notes && (
                <p className="text-xs text-slate-700 bg-white p-3 rounded border border-slate-200">
                  <strong>ملاحظة المراجع:</strong> {selectedRx.notes}
                </p>
              )}
            </div>

            {/* Pharmacist Workflow */}
            {canManage && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">حالة الوصفة</label>
                    <select
                      value={selectedRx.status}
                      onChange={(e) =>
                        updatePrescription(selectedRx.referenceId, {
                          status: e.target.value as PrescriptionStatus,
                          pharmacistNote,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      {Object.entries(PRESCRIPTION_STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v.ar}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ملاحظة الصيدلي</label>
                    <input
                      type="text"
                      value={pharmacistNote}
                      onChange={(e) => setPharmacistNote(e.target.value)}
                      onBlur={() =>
                        updatePrescription(selectedRx.referenceId, { pharmacistNote })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                {/* Pick Catalog Items & Convert to Linked Order */}
                {selectedRx.status !== 'converted_to_order' && (
                  <div className="bg-sky-50/50 rounded-xl border border-sky-200 p-4 space-y-4">
                    <h3 className="font-display font-bold text-sm text-[#0F4C5C] flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4" />
                      <span>تجهيز أصناف الوصفة وتحويلها إلى طلب متجر</span>
                    </h3>

                    <div className="flex gap-2 text-xs">
                      <select
                        value={addProdId}
                        onChange={(e) => setAddProdId(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({formatPrice(p.priceYER)})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addCatalogItem}
                        className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] text-white font-semibold inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة</span>
                      </button>
                    </div>

                    {pickedItems.length > 0 && (
                      <ul className="divide-y divide-slate-200 bg-white rounded-lg border border-slate-200 px-3 text-xs">
                        {pickedItems.map((it) => {
                          const p = products.find((x) => x.id === it.productId);
                          if (!p) return null;
                          return (
                            <li key={it.productId} className="py-2 flex items-center justify-between gap-2">
                              <span className="truncate flex-1">{p.name}</span>
                              <input
                                type="number"
                                min={1}
                                value={it.quantity}
                                onChange={(e) =>
                                  setPickedItems((prev) =>
                                    prev.map((x) =>
                                      x.productId === it.productId
                                        ? { ...x, quantity: Math.max(1, Number(e.target.value) || 1) }
                                        : x
                                    )
                                  )
                                }
                                className="w-14 px-2 py-1 rounded border border-slate-300 text-center tabular-nums"
                              />
                              <span className="font-semibold tabular-nums w-24 text-end">
                                {formatPrice(p.priceYER * it.quantity)}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setPickedItems((prev) =>
                                    prev.filter((x) => x.productId !== it.productId)
                                  )
                                }
                                className="text-red-600 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </li>
                          );
                        })}
                        <li className="py-2 flex justify-between font-bold text-[#0F4C5C]">
                          <span>الإجمالي المبدئي للأصناف</span>
                          <span className="tabular-nums">{formatPrice(pickedSubtotal)}</span>
                        </li>
                      </ul>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <select
                        value={deliveryMethod}
                        onChange={(e) => setDeliveryMethod(e.target.value as 'delivery' | 'pickup')}
                        className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="pickup">استلام من الصيدلية</option>
                        <option value="delivery">توصيل للمنزل</option>
                      </select>
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value as 'cod' | 'epayment')}
                        className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="cod">الدفع عند الاستلام</option>
                        <option value="epayment">دفع إلكتروني</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      disabled={pickedItems.length === 0}
                      onClick={handleConvert}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] disabled:opacity-50 text-white text-xs font-semibold"
                    >
                      إنشاء طلب متجر مرتبط وحجز المخزون
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
