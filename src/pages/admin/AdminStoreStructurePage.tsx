import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Edit3,
  Eye,
  EyeOff,
  FolderTree,
  Package,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { ProductCategory, StoreMainSection } from '../../types/clinic';

const PRESET_STORE_IMAGES = [
  {
    label: 'التجميل والعناية بالبشرة والشعر',
    url: '/src/assets/images/prod_beauty_skincare_1795548329813.jpg',
  },
  {
    label: 'الفيتامينات والمكملات الغذائية',
    url: '/src/assets/images/prod_family_vitamins_1795548331294.jpg',
  },
  {
    label: 'العناية بالأم والطفل',
    url: '/src/assets/images/prod_mother_baby_1795548330918.jpg',
  },
  {
    label: 'المكملات العصبية والعضلية',
    url: '/src/assets/images/prod_clinical_supplement_1795286629857.jpg',
  },
  {
    label: 'دعامات العمود الفقري',
    url: '/src/assets/images/prod_lumbar_support_1795286630682.jpg',
  },
  {
    label: 'الوسائد الطبية',
    url: '/src/assets/images/prod_cervical_pillow_1795286630838.jpg',
  },
  {
    label: 'أجهزة العلاج الطبيعي',
    url: '/src/assets/images/prod_tens_therapy_1795286630454.jpg',
  },
];

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
    const cleanSlug =
      editingSec.slug.trim() ||
      editingSec.nameEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `group-${Date.now().toString().slice(-4)}`;
    const payload: StoreMainSection = {
      ...editingSec,
      slug: cleanSlug,
    };
    const exists = storeMainSections.some((s) => s.id === payload.id);
    if (exists) {
      setStoreMainSections((prev) => prev.map((s) => (s.id === payload.id ? payload : s)));
      recordAudit('هيكلة المتجر', 'تحديث مجموعة رئيسية', payload.nameAr);
    } else {
      setStoreMainSections((prev) => [...prev, payload]);
      recordAudit('هيكلة المتجر', 'إضافة مجموعة رئيسية جديدة', payload.nameAr);
    }
    setEditingSec(null);
  };

  const handleDeleteSec = (sec: StoreMainSection) => {
    const linkedCats = productCategories.filter((c) => c.mainSectionId === sec.id);
    const linkedProds = products.filter((p) => p.mainSectionId === sec.id);
    if (linkedCats.length > 0 || linkedProds.length > 0) return;
    setStoreMainSections((prev) => prev.filter((s) => s.id !== sec.id));
    recordAudit('هيكلة المتجر', 'حذف مجموعة رئيسية فارغة', sec.nameAr);
  };

  const handleSaveCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    const cleanSlug =
      editingCat.slug.trim() ||
      (editingCat.nameEn || 'category')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `cat-${Date.now().toString().slice(-4)}`;
    const payload: ProductCategory = {
      ...editingCat,
      slug: cleanSlug,
    };
    const exists = productCategories.some((c) => c.id === payload.id);
    if (exists) {
      setProductCategories((prev) => prev.map((c) => (c.id === payload.id ? payload : c)));
      recordAudit('هيكلة المتجر', 'تحديث تصنيف فرعي', payload.nameAr);
    } else {
      setProductCategories((prev) => [...prev, payload]);
      recordAudit('هيكلة المتجر', 'إضافة تصنيف فرعي جديد', payload.nameAr);
    }
    setEditingCat(null);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onResult: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onResult(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const openNewMainGroup = () => {
    const stamp = Date.now();
    setEditingSec({
      id: `sec-${stamp}`,
      slug: `group-${stamp.toString().slice(-4)}`,
      nameAr: '',
      nameEn: '',
      description: '',
      image: PRESET_STORE_IMAGES[0].url,
      order: storeMainSections.length + 1,
      visible: true,
    });
  };

  const openNewSubCategory = (mainSectionId?: string) => {
    const stamp = Date.now();
    setEditingCat({
      id: `cat-${stamp}`,
      slug: `category-${stamp.toString().slice(-4)}`,
      mainSectionId: mainSectionId || storeMainSections[0]?.id || 'sec-beauty-care',
      nameAr: '',
      nameEn: '',
      description: '',
      image: PRESET_STORE_IMAGES[0].url,
      order: productCategories.length + 1,
      visible: true,
    });
  };

  return (
    <AdminLayout titleAr="هيكلة المتجر والمجموعات" titleEn="Store Groups & Subcategories">
      {/* Main Store Groups Header */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-[#0F4C5C]" />
              <span>
                {lang === 'ar'
                  ? `المجموعات الرئيسية للمتجر (${storeMainSections.length} مجموعات مستقلة)`
                  : `Main Store Groups (${storeMainSections.length})`}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'ar'
                ? 'كل مجموعة رئيسية تظهر بشكل مستقل في المتجر وتتفرع منها تصنيفات فرعية متخصصة.'
                : 'Each main group stands independently in the store with its own branching subcategories.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/products"
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إدارة المنتجات والعروض' : 'Products & Offers'}</span>
            </Link>
            {canManage && (
              <button
                type="button"
                onClick={openNewMainGroup}
                className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة مجموعة رئيسية' : 'Add Main Group'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...storeMainSections]
            .sort((a, b) => a.order - b.order)
            .map((sec) => {
              const linkedCats = productCategories.filter((c) => c.mainSectionId === sec.id);
              const linkedProds = products.filter((p) => p.mainSectionId === sec.id);
              const canDelete = linkedCats.length === 0 && linkedProds.length === 0;

              return (
                <div
                  key={sec.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {sec.image && (
                          <img
                            src={sec.image}
                            alt={sec.nameAr}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <div>
                          <span className="text-[11px] font-mono text-slate-400" dir="ltr">
                            #{sec.order} · {sec.nameEn || sec.slug}
                          </span>
                          <h3 className="font-display font-bold text-lg text-slate-900">
                            {sec.nameAr}
                          </h3>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded border text-[11px] font-semibold shrink-0 ${
                          sec.visible
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {sec.visible ? 'ظاهر في المتجر' : 'مخفي'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{sec.description}</p>

                    {linkedCats.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {linkedCats.map((cat) => (
                          <span
                            key={cat.id}
                            className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-medium"
                          >
                            {cat.nameAr}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="text-xs text-slate-500 flex items-center gap-4 tabular-nums">
                      <span>
                        الفروع: <strong>{linkedCats.length}</strong>
                      </span>
                      <span>
                        المنتجات: <strong>{linkedProds.length}</strong>
                      </span>
                    </div>
                  </div>

                  {canManage && (
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSec({ ...sec })}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل المجموعة</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openNewSubCategory(sec.id)}
                          className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-[#0F4C5C] hover:bg-sky-100 text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة فرع</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setStoreMainSections((prev) =>
                              prev.map((s) => (s.id === sec.id ? { ...s, visible: !s.visible } : s))
                            );
                            recordAudit('هيكلة المتجر', 'تبديل ظهور مجموعة رئيسية', sec.nameAr);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium inline-flex items-center gap-1"
                        >
                          {sec.visible ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                          <span>{sec.visible ? 'إخفاء' : 'إظهار'}</span>
                        </button>

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSec(sec)}
                            title="حذف مجموعة فارغة"
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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
            {lang === 'ar'
              ? `التصنيفات الفرعية (${productCategories.length})`
              : `Subcategories (${productCategories.length})`}
          </h2>
          {canManage && (
            <button
              type="button"
              onClick={() => openNewSubCategory()}
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
                  <th className="px-4 py-3 text-start font-semibold">المجموعة الرئيسية المرتبطة</th>
                  <th className="px-4 py-3 text-start font-semibold">عدد المنتجات</th>
                  <th className="px-4 py-3 text-start font-semibold">الظهور</th>
                  <th className="px-4 py-3 text-end font-semibold">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...productCategories]
                  .sort((a, b) => a.order - b.order)
                  .map((cat) => {
                    const sec = storeMainSections.find((s) => s.id === cat.mainSectionId);
                    const count = products.filter((p) => p.categoryId === cat.id).length;
                    return (
                      <tr key={cat.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={cat.image}
                              alt={cat.nameAr}
                              className="w-9 h-9 rounded object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <span className="font-semibold text-slate-900 block">
                                {cat.nameAr}
                              </span>
                              <span className="text-[11px] text-slate-500">{cat.description}</span>
                            </div>
                          </div>
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
                        <td className="px-4 py-3 text-end space-x-2 space-x-reverse whitespace-nowrap">
                          {canManage && (
                            <>
                              <button
                                type="button"
                                onClick={() => setEditingCat({ ...cat })}
                                className="px-2.5 py-1 rounded border border-slate-300 font-medium hover:bg-slate-50"
                              >
                                تعديل
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setProductCategories((prev) =>
                                    prev.map((c) =>
                                      c.id === cat.id ? { ...c, visible: !c.visible } : c
                                    )
                                  )
                                }
                                className="px-2.5 py-1 rounded border border-slate-300 font-medium hover:bg-slate-50"
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

      {/* Add / Edit Main Group Modal */}
      {editingSec && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveSec}
            className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-display font-bold text-lg text-slate-900">
              {storeMainSections.some((s) => s.id === editingSec.id)
                ? 'تعديل المجموعة الرئيسية'
                : 'إضافة مجموعة رئيسية جديدة'}
            </h3>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">الاسم العربي *</label>
                  <input
                    type="text"
                    required
                    value={editingSec.nameAr}
                    onChange={(e) => setEditingSec({ ...editingSec, nameAr: e.target.value })}
                    placeholder="مثال: التجميل والعناية الشخصية"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    الاسم الإنجليزي
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={editingSec.nameEn}
                    onChange={(e) => setEditingSec({ ...editingSec, nameEn: e.target.value })}
                    placeholder="Beauty & Personal Care"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    الرابط المختصر (Slug)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={editingSec.slug}
                    onChange={(e) => setEditingSec({ ...editingSec, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ترتيب العرض</label>
                  <input
                    type="number"
                    min={1}
                    value={editingSec.order}
                    onChange={(e) =>
                      setEditingSec({ ...editingSec, order: Number(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">الوصف المختصر</label>
                <textarea
                  rows={2}
                  value={editingSec.description}
                  onChange={(e) => setEditingSec({ ...editingSec, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">صورة المجموعة</label>
                <select
                  value={editingSec.image || ''}
                  onChange={(e) => setEditingSec({ ...editingSec, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  {PRESET_STORE_IMAGES.map((img) => (
                    <option key={img.url} value={img.url}>
                      {img.label}
                    </option>
                  ))}
                  {editingSec.image &&
                    !PRESET_STORE_IMAGES.some((x) => x.url === editingSec.image) && (
                      <option value={editingSec.image}>صورة مخصصة مرفوعة</option>
                    )}
                </select>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 hover:border-[#0F4C5C] text-xs font-medium text-slate-700 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#0F4C5C]" />
                  <span>رفع صورة مخصصة للمجموعة</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) =>
                      handleImageUpload(e, (url) => setEditingSec({ ...editingSec, image: url }))
                    }
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSec(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                حفظ المجموعة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add / Edit Subcategory Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCat}
            className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-display font-bold text-lg text-slate-900">
              {productCategories.some((c) => c.id === editingCat.id)
                ? 'تعديل التصنيف الفرعي'
                : 'إضافة تصنيف فرعي جديد'}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  المجموعة الرئيسية التابعة لها *
                </label>
                <select
                  value={editingCat.mainSectionId}
                  onChange={(e) =>
                    setEditingCat({ ...editingCat, mainSectionId: e.target.value })
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    اسم التصنيف (عربي) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCat.nameAr}
                    onChange={(e) => setEditingCat({ ...editingCat, nameAr: e.target.value })}
                    placeholder="مثال: العناية بالشعر"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    الاسم الإنجليزي
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={editingCat.nameEn || ''}
                    onChange={(e) => setEditingCat({ ...editingCat, nameEn: e.target.value })}
                    placeholder="Hair Care"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
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

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">صورة التصنيف الفرعي</label>
                <select
                  value={editingCat.image}
                  onChange={(e) => setEditingCat({ ...editingCat, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  {PRESET_STORE_IMAGES.map((img) => (
                    <option key={img.url} value={img.url}>
                      {img.label}
                    </option>
                  ))}
                  {editingCat.image &&
                    !PRESET_STORE_IMAGES.some((x) => x.url === editingCat.image) && (
                      <option value={editingCat.image}>صورة مخصصة مرفوعة</option>
                    )}
                </select>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 hover:border-[#0F4C5C] text-xs font-medium text-slate-700 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#0F4C5C]" />
                  <span>رفع صورة مخصصة للفرع</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) =>
                      handleImageUpload(e, (url) => setEditingCat({ ...editingCat, image: url }))
                    }
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCat(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold"
              >
                حفظ التصنيف
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};
