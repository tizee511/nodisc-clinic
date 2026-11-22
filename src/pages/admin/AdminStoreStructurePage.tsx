import React, { useState } from 'react';
import { Check, Edit3, Eye, EyeOff, FolderTree, Plus } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { ProductCategory, StoreMainSection } from '../../types/clinic';

export const AdminStoreStructurePage: React.FC = () => {
  const {
    storeMainSections,
    setStoreMainSections,
    productCategories,
    setProductCategories,
    products,
    hasPermission,
    recordAudit,
  } = useDataStore();
  const { lang } = useLanguage();

  const [editingSec, setEditingSec] = useState<StoreMainSection | null>(null);
  const [editingCat, setEditingCat] = useState<ProductCategory | null>(null);
  const canManage = hasPermission('manage_store');

  const handleSaveSec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSec) return;
    setStoreMainSections((prev) => prev.map((s) => (s.id === editingSec.id ? editingSec : s)));
    recordAudit('هيكلة المتجر', 'تحديث قسم رئيسي للمتجر', editingSec.nameAr);
    setEditingSec(null);
  };

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    const exists = productCategories.some((c) => c.id === editingCat.id);
    if (exists) {
      setProductCategories((prev) => prev.map((c) => (c.id === editingCat.id ? editingCat : c)));
      recordAudit('هيكلة المتجر', 'تحديث تصنيف فرعي', editingCat.nameAr);
    } else {
      setProductCategories((prev) => [...prev, editingCat]);
      recordAudit('هيكلة المتجر', 'إضافة تصنيف فرعي جديد', editingCat.nameAr);
    }
    setEditingCat(null);
  };

  return (
    <AdminLayout titleAr="هيكلة المتجر والتصنيفات" titleEn="Store Structure & Categories">
      {/* 2 Main Store Sections */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-[#0F4C5C]" />
            <span>{lang === 'ar' ? 'الأقسام الرئيسية للمتجر (2 أقسام)' : 'Main Store Sections'}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {storeMainSections.map((sec) => {
            const linkedCats = productCategories.filter((c) => c.mainSectionId === sec.id);
            const linkedProds = products.filter((p) => p.mainSectionId === sec.id);
            return (
              <div key={sec.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400" dir="ltr">
                      {sec.nameEn}
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-900">{sec.nameAr}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${
                      sec.visible
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {sec.visible ? 'ظاهر في المتجر' : 'مخفي'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{sec.description}</p>
                <div className="text-xs text-slate-500 flex items-center gap-4 tabular-nums">
                  <span>التصنيفات الفرعية: <strong>{linkedCats.length}</strong></span>
                  <span>المنتجات المرتبطة: <strong>{linkedProds.length}</strong></span>
                </div>
                {canManage && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setEditingSec({ ...sec })}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل القسم</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStoreMainSections((prev) =>
                          prev.map((s) => (s.id === sec.id ? { ...s, visible: !s.visible } : s))
                        );
                        recordAudit('هيكلة المتجر', 'تبديل ظهور قسم رئيسي', sec.nameAr);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium inline-flex items-center gap-1"
                    >
                      {sec.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{sec.visible ? 'إخفاء مؤقت' : 'إظهار'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Subcategories */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display font-bold text-lg text-slate-900">
            {lang === 'ar' ? 'التصنيفات الفرعية' : 'Subcategories'}
          </h2>
          {canManage && (
            <button
              type="button"
              onClick={() =>
                setEditingCat({
                  id: `cat-${Date.now()}`,
                  slug: `category-${Date.now().toString().slice(-4)}`,
                  mainSectionId: storeMainSections[0]?.id || 'sec-medical-supplies',
                  nameAr: '',
                  description: '',
                  image: '/src/assets/images/prod_cervical_pillow_1795286630838.jpg',
                  order: productCategories.length + 1,
                  visible: true,
                })
              }
              className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة تصنيف فرعي</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">التصنيف الفرعي</th>
                  <th className="px-4 py-3 text-start font-semibold">القسم الرئيسي المرتبط</th>
                  <th className="px-4 py-3 text-start font-semibold">عدد المنتجات</th>
                  <th className="px-4 py-3 text-start font-semibold">الظهور</th>
                  <th className="px-4 py-3 text-end font-semibold">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {productCategories.map((cat) => {
                  const sec = storeMainSections.find((s) => s.id === cat.mainSectionId);
                  const count = products.filter((p) => p.categoryId === cat.id).length;
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 block">{cat.nameAr}</span>
                        <span className="text-[11px] text-slate-500">{cat.description}</span>
                      </td>
                      <td className="px-4 py-3 text-[#0284C7] font-medium">{sec?.nameAr}</td>
                      <td className="px-4 py-3 font-mono font-semibold tabular-nums">{count}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded border text-[11px] font-medium ${
                            cat.visible
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {cat.visible ? 'ظاهر' : 'مخفي'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-end space-x-2 space-x-reverse">
                        {canManage && (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditingCat({ ...cat })}
                              className="px-2.5 py-1 rounded border border-slate-300 font-medium"
                            >
                              تعديل
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setProductCategories((prev) =>
                                  prev.map((c) => (c.id === cat.id ? { ...c, visible: !c.visible } : c))
                                )
                              }
                              className="px-2.5 py-1 rounded border border-slate-300 font-medium"
                            >
                              {cat.visible ? 'إخفاء' : 'إظهار'}
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
      </section>

      {/* Edit Main Section Modal */}
      {editingSec && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveSec} className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">تعديل القسم الرئيسي</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الاسم العربي *</label>
                <input
                  type="text"
                  required
                  value={editingSec.nameAr}
                  onChange={(e) => setEditingSec({ ...editingSec, nameAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الوصف</label>
                <textarea
                  rows={2}
                  value={editingSec.description}
                  onChange={(e) => setEditingSec({ ...editingSec, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingSec(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-xs">
                إلغاء
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                حفظ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Subcategory Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveCat} className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">بيانات التصنيف الفرعي</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">القسم الرئيسي *</label>
                <select
                  value={editingCat.mainSectionId}
                  onChange={(e) => setEditingCat({ ...editingCat, mainSectionId: e.target.value })}
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
                <label className="block font-semibold text-slate-700 mb-1">اسم التصنيف *</label>
                <input
                  type="text"
                  required
                  value={editingCat.nameAr}
                  onChange={(e) => setEditingCat({ ...editingCat, nameAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الوصف</label>
                <textarea
                  rows={2}
                  value={editingCat.description}
                  onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingCat(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-xs">
                إلغاء
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold">
                حفظ التصنيف
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};
