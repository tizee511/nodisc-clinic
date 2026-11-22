import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Edit3, Eye, EyeOff, Package, Plus, Search } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Product } from '../../types/clinic';

export const AdminProductsPage: React.FC = () => {
  const {
    storeMainSections,
    productCategories,
    products,
    setProducts,
    showWholesalePrices,
    setShowWholesalePrices,
    inventoryLogs,
    adjustInventory,
    hasPermission,
    recordAudit,
  } = useDataStore();
  const { lang } = useLanguage();
  const { formatPrice } = useClinic();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [mainSecFilter, setMainSecFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>(
    searchParams.get('stock') === 'low' ? 'low' : 'all'
  );

  const [editingPrd, setEditingPrd] = useState<Product | null>(null);
  const [adjustingPrd, setAdjustingPrd] = useState<Product | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(5);
  const [adjustReason, setAdjustReason] = useState<string>('توريد دفعة جديدة');

  const canManageStore = hasPermission('manage_store');
  const canManagePrices = hasPermission('manage_prices');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const avail = p.stockQty - (p.reservedQty || 0);
      if (mainSecFilter !== 'all' && p.mainSectionId !== mainSecFilter) return false;
      if (catFilter !== 'all' && p.categoryId !== catFilter) return false;
      if (stockFilter === 'low' && avail > (p.lowStockThreshold || 3)) return false;
      if (stockFilter === 'out' && avail > 0) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !(p.barcode || '').toLowerCase().includes(q) &&
        !(p.supplier || '').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [products, mainSecFilter, catFilter, stockFilter, query]);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrd) return;
    const avail = editingPrd.stockQty - (editingPrd.reservedQty || 0);
    const updated: Product = {
      ...editingPrd,
      inStock: avail > 0,
    };
    const exists = products.some((p) => p.id === updated.id);
    if (exists) {
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      recordAudit('المنتجات', 'تحديث بيانات/سعر منتج', updated.name);
    } else {
      setProducts((prev) => [updated, ...prev]);
      recordAudit('المنتجات', 'إضافة منتج جديد للمتجر', updated.name);
    }
    setEditingPrd(null);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingPrd || adjustDelta === 0) return;
    adjustInventory(adjustingPrd.id, adjustDelta, adjustReason.trim() || 'تسوية يدوية');
    setAdjustingPrd(null);
  };

  return (
    <AdminLayout titleAr="المنتجات والمخزون" titleEn="Products & Inventory">
      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="اسم المنتج، الباركود، المورد..."
              className="ps-9 pe-3 py-2 rounded-lg border border-slate-300 text-xs w-56"
            />
          </div>

          <select
            value={mainSecFilter}
            onChange={(e) => {
              setMainSecFilter(e.target.value);
              setCatFilter('all');
            }}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">كل الأقسام الرئيسية</option>
            {storeMainSections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameAr}
              </option>
            ))}
          </select>

          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">كل التصنيفات الفرعية</option>
            {productCategories
              .filter((c) => mainSecFilter === 'all' || c.mainSectionId === mainSecFilter)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr}
                </option>
              ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as 'all' | 'low' | 'out')}
            className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
          >
            <option value="all">كل حالات المخزون</option>
            <option value="low">مخزون منخفض / حرج</option>
            <option value="out">نفد المخزون</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {canManagePrices && (
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F4C5C] cursor-pointer px-3 py-2 rounded-lg bg-sky-50 border border-sky-200">
              <input
                type="checkbox"
                checked={showWholesalePrices}
                onChange={(e) => setShowWholesalePrices(e.target.checked)}
              />
              <span>إظهار سعر الجملة (للإدارة فقط)</span>
            </label>
          )}

          {canManageStore && (
            <button
              type="button"
              onClick={() =>
                setEditingPrd({
                  id: `prd-${Date.now()}`,
                  slug: `product-${Date.now().toString().slice(-4)}`,
                  barcode: `6291000${Math.floor(10000 + Math.random() * 89999)}`,
                  name: '',
                  mainSectionId: storeMainSections[0]?.id || 'sec-medical-supplies',
                  categoryId: productCategories[0]?.id || 'cat-supports',
                  supplier: 'مؤسسة الإمداد الطبي التجريبية',
                  unit: 'قطعة',
                  priceYER: 10000,
                  wholesalePriceYER: 7500,
                  inStock: true,
                  stockQty: 10,
                  reservedQty: 0,
                  lowStockThreshold: 3,
                  shortDesc: '',
                  fullDesc: '',
                  image: '/src/assets/images/prod_cervical_pillow_1795286630838.jpg',
                  visible: true,
                })
              }
              className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة منتج</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">المنتج والباركود</th>
                <th className="px-4 py-3 text-start font-semibold">القسم / المورد</th>
                <th className="px-4 py-3 text-start font-semibold">سعر البيع</th>
                {showWholesalePrices && canManagePrices && (
                  <th className="px-4 py-3 text-start font-semibold">سعر الجملة</th>
                )}
                <th className="px-4 py-3 text-start font-semibold">الفعلي / المحجوز / المتاح</th>
                <th className="px-4 py-3 text-start font-semibold">الظهور</th>
                <th className="px-4 py-3 text-end font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const cat = productCategories.find((c) => c.id === p.categoryId);
                const reserved = p.reservedQty || 0;
                const available = Math.max(0, p.stockQty - reserved);
                const isLow = available <= (p.lowStockThreshold || 3);
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900 block">{p.name}</span>
                      <span className="font-mono text-[11px] text-slate-400" dir="ltr">
                        {p.barcode || p.id} · {p.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[#0284C7] font-medium block">{cat?.nameAr}</span>
                      <span className="text-[11px] text-slate-500">{p.supplier || '—'}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-[#0F4C5C] tabular-nums">
                      {formatPrice(p.priceYER)}
                    </td>
                    {showWholesalePrices && canManagePrices && (
                      <td className="px-4 py-3 font-mono text-slate-600 tabular-nums">
                        {p.wholesalePriceYER ? formatPrice(p.wholesalePriceYER) : '—'}
                      </td>
                    )}
                    <td className="px-4 py-3 tabular-nums">
                      <div className="flex items-center gap-2 font-mono">
                        <span title="الفعلي">فعلي: <strong>{p.stockQty}</strong></span>
                        <span className="text-amber-700" title="محجوز لطلبات">محجوز: <strong>{reserved}</strong></span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            available === 0
                              ? 'bg-red-100 text-red-800'
                              : isLow
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          متاح: {available}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={!canManageStore}
                        onClick={() =>
                          setProducts((prev) =>
                            prev.map((x) =>
                              x.id === p.id ? { ...x, visible: x.visible === false ? true : false } : x
                            )
                          )
                        }
                        className={`px-2 py-0.5 rounded border text-[11px] font-medium inline-flex items-center gap-1 ${
                          p.visible !== false
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {p.visible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{p.visible !== false ? 'ظاهر' : 'مخفي'}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-end space-x-1.5 space-x-reverse whitespace-nowrap">
                      {canManageStore && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setAdjustingPrd(p);
                              setAdjustDelta(5);
                              setAdjustReason('توريد دفعة جديدة');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-[#0F4C5C] hover:text-white text-slate-800 font-semibold"
                          >
                            تسوية مخزون
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPrd({ ...p })}
                            className="p-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                            title="تعديل"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Adjustment History Log */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#0F4C5C]" />
            <span>سجل حركات وتعديلات المخزون</span>
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">{inventoryLogs.length} حركة</span>
        </div>
        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-2 text-start font-semibold">الوقت</th>
                <th className="px-4 py-2 text-start font-semibold">المنتج</th>
                <th className="px-4 py-2 text-start font-semibold">التغير</th>
                <th className="px-4 py-2 text-start font-semibold">السبب</th>
                <th className="px-4 py-2 text-start font-semibold">بواسطة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventoryLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-2 font-mono text-slate-500 tabular-nums">{log.timestamp}</td>
                  <td className="px-4 py-2 font-medium text-slate-900">{log.productName}</td>
                  <td
                    className={`px-4 py-2 font-mono font-bold tabular-nums ${
                      log.delta >= 0 ? 'text-emerald-700' : 'text-red-700'
                    }`}
                    dir="ltr"
                  >
                    {log.delta > 0 ? `+${log.delta}` : log.delta}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{log.reason}</td>
                  <td className="px-4 py-2 text-slate-600">{log.actorName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Edit Modal */}
      {editingPrd && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-display font-bold text-lg text-slate-900">بيانات المنتج</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">اسم المنتج *</label>
                <input
                  type="text"
                  required
                  value={editingPrd.name}
                  onChange={(e) => setEditingPrd({ ...editingPrd, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">القسم الرئيسي</label>
                  <select
                    value={editingPrd.mainSectionId}
                    onChange={(e) =>
                      setEditingPrd({ ...editingPrd, mainSectionId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    {storeMainSections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">التصنيف الفرعي</label>
                  <select
                    value={editingPrd.categoryId}
                    onChange={(e) => setEditingPrd({ ...editingPrd, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    {productCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الباركود</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={editingPrd.barcode || ''}
                    onChange={(e) => setEditingPrd({ ...editingPrd, barcode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">المورد</label>
                  <input
                    type="text"
                    value={editingPrd.supplier || ''}
                    onChange={(e) => setEditingPrd({ ...editingPrd, supplier: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">سعر البيع (ر.ي)</label>
                  <input
                    type="number"
                    min={0}
                    disabled={!canManagePrices}
                    value={editingPrd.priceYER}
                    onChange={(e) =>
                      setEditingPrd({ ...editingPrd, priceYER: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">سعر الجملة (ر.ي)</label>
                  <input
                    type="number"
                    min={0}
                    disabled={!canManagePrices}
                    value={editingPrd.wholesalePriceYER || 0}
                    onChange={(e) =>
                      setEditingPrd({
                        ...editingPrd,
                        wholesalePriceYER: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الرصيد الفعلي</label>
                  <input
                    type="number"
                    min={0}
                    value={editingPrd.stockQty}
                    onChange={(e) =>
                      setEditingPrd({ ...editingPrd, stockQty: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الوصف المختصر</label>
                <textarea
                  rows={2}
                  value={editingPrd.shortDesc}
                  onChange={(e) => setEditingPrd({ ...editingPrd, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingPrd(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-xs">
                إلغاء
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold">
                حفظ المنتج
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Adjust Inventory Modal */}
      {adjustingPrd && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form onSubmit={handleAdjustSubmit} className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">
              تسوية مخزون: {adjustingPrd.name}
            </h3>
            <p className="text-xs text-slate-500">
              الرصيد الفعلي الحالي: <strong className="tabular-nums">{adjustingPrd.stockQty}</strong> · المحجوز:{' '}
              <strong className="tabular-nums">{adjustingPrd.reservedQty || 0}</strong>
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  مقدار التعديل (+ لإضافة كمية، - للخصم)
                </label>
                <input
                  type="number"
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">سبب التسوية *</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setAdjustingPrd(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-xs">
                إلغاء
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold">
                اعتماد التسوية
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};
