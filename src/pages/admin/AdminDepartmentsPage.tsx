import React, { useState } from 'react';
import { AlertTriangle, Archive, Check, Edit3, Plus, RotateCcw } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminImageField } from '../../components/admin/AdminImageField';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { Department, DepartmentId, Doctor, MedicalService, PublishStatus } from '../../types/clinic';

export const AdminDepartmentsPage: React.FC = () => {
  const {
    departments,
    setDepartments,
    doctors,
    setDoctors,
    services,
    setServices,
    hasPermission,
    recordAudit,
  } = useDataStore();
  const { lang } = useLanguage();

  const [activeTab, setActiveTab] = useState<'departments' | 'doctors' | 'services'>('departments');

  // Edit Modals / Inline Editors
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingDoc, setEditingDoc] = useState<Doctor | null>(null);
  const [editingSrv, setEditingSrv] = useState<MedicalService | null>(null);

  // Archive Warning Modal
  const [archiveConfirm, setArchiveConfirm] = useState<{
    kind: 'department' | 'doctor' | 'service';
    id: string;
    title: string;
    impacts: string[];
  } | null>(null);

  const canArchive = hasPermission('archive_records');
  const canEdit = hasPermission('manage_content');

  const requestArchiveDepartment = (dept: Department) => {
    const linkedDocs = doctors.filter((d) => d.departmentId === dept.id && d.status !== 'archived').length;
    const linkedServices = services.filter((s) => s.departmentId === dept.id && s.status !== 'archived').length;
    const impacts: string[] = [];
    if (linkedDocs > 0) impacts.push(`${linkedDocs} أطباء/فرق مرتبطين بهذا القسم`);
    if (linkedServices > 0) impacts.push(`${linkedServices} خدمات مرتبطة بهذا القسم`);
    setArchiveConfirm({
      kind: 'department',
      id: dept.id,
      title: dept.nameAr,
      impacts,
    });
  };

  const requestArchiveDoctor = (doc: Doctor) => {
    const linkedServices = services.filter((s) => s.doctorId === doc.id && s.status !== 'archived').length;
    const impacts = linkedServices > 0 ? [`مرتبط بـ ${linkedServices} خدمات طبية حالية`] : [];
    setArchiveConfirm({
      kind: 'doctor',
      id: doc.id,
      title: doc.nameAr,
      impacts,
    });
  };

  const requestArchiveService = (srv: MedicalService) => {
    setArchiveConfirm({
      kind: 'service',
      id: srv.id,
      title: srv.title,
      impacts: [],
    });
  };

  const confirmArchive = () => {
    if (!archiveConfirm) return;
    if (archiveConfirm.kind === 'department') {
      setDepartments((prev) =>
        prev.map((d) => (d.id === archiveConfirm.id ? { ...d, status: 'archived' } : d))
      );
      recordAudit('الأقسام', 'أرشفة قسم', archiveConfirm.title);
    } else if (archiveConfirm.kind === 'doctor') {
      setDoctors((prev) =>
        prev.map((d) => (d.id === archiveConfirm.id ? { ...d, status: 'archived' } : d))
      );
      recordAudit('الأطباء', 'أرشفة ملف طبيب', archiveConfirm.title);
    } else {
      setServices((prev) =>
        prev.map((s) => (s.id === archiveConfirm.id ? { ...s, status: 'archived' } : s))
      );
      recordAudit('الخدمات', 'أرشفة خدمة طبية', archiveConfirm.title);
    }
    setArchiveConfirm(null);
  };

  const restoreStatus = (kind: 'department' | 'doctor' | 'service', id: string) => {
    if (kind === 'department') {
      setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'published' } : d)));
    } else if (kind === 'doctor') {
      setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'published' } : d)));
    } else {
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'published' } : s)));
    }
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    setDepartments((prev) => prev.map((d) => (d.id === editingDept.id ? editingDept : d)));
    recordAudit('الأقسام', 'تعديل بيانات قسم', editingDept.nameAr);
    setEditingDept(null);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc) return;
    const exists = doctors.some((d) => d.id === editingDoc.id);
    if (exists) {
      setDoctors((prev) => prev.map((d) => (d.id === editingDoc.id ? editingDoc : d)));
      recordAudit('الأطباء', 'تحديث ملف طبيب', editingDoc.nameAr);
    } else {
      setDoctors((prev) => [editingDoc, ...prev]);
      recordAudit('الأطباء', 'إضافة طبيب/عضو فريق جديد', editingDoc.nameAr);
    }
    setEditingDoc(null);
  };

  const handleSaveSrv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSrv) return;
    const exists = services.some((s) => s.id === editingSrv.id);
    if (exists) {
      setServices((prev) => prev.map((s) => (s.id === editingSrv.id ? editingSrv : s)));
      recordAudit('الخدمات', 'تحديث خدمة طبية', editingSrv.title);
    } else {
      setServices((prev) => [editingSrv, ...prev]);
      recordAudit('الخدمات', 'إضافة خدمة طبية جديدة', editingSrv.title);
    }
    setEditingSrv(null);
  };

  return (
    <AdminLayout titleAr="الأقسام والأطباء والخدمات" titleEn="Departments, Doctors & Services">
      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'departments', ar: `الأقسام (${departments.length})`, en: `Departments (${departments.length})` },
              { id: 'doctors', ar: `الأطباء والفريق (${doctors.length})`, en: `Doctors & Team (${doctors.length})` },
              { id: 'services', ar: `الخدمات الطبية (${services.length})`, en: `Services (${services.length})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0F4C5C] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {lang === 'ar' ? tab.ar : tab.en}
            </button>
          ))}
        </div>

        {canEdit && activeTab === 'doctors' && (
          <button
            type="button"
            onClick={() =>
              setEditingDoc({
                id: `doc-${Date.now()}`,
                slug: `specialist-${Date.now().toString().slice(-4)}`,
                nameAr: '',
                nameEn: '',
                roleTitle: '',
                departmentId: 'neurosurgery',
                imageUrl: null,
                imagePlaceholderNote: 'صورة تجريبية قابلة للاستبدال',
                bio: '',
                qualifications: ['مؤهل تخصصي قابل للتعديل'],
                experiences: ['خبرة سريرية قابلة للتعديل'],
                focusAreas: ['مجال تركيز تخصصي'],
                serviceIds: [],
                isFeatured: false,
                isProfileEditableNote: 'حقل قابل للاستبدال ببيانات الطبيب المعتمدة',
                status: 'published',
              })
            }
            className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إضافة طبيب / فريق' : 'Add Physician'}</span>
          </button>
        )}

        {canEdit && activeTab === 'services' && (
          <button
            type="button"
            onClick={() =>
              setEditingSrv({
                id: `srv-${Date.now()}`,
                slug: `service-${Date.now().toString().slice(-4)}`,
                title: '',
                departmentId: 'neurosurgery',
                doctorId: doctors[0]?.id || null,
                shortDesc: '',
                details: ['تفصيل إجرائي قابل للتعديل'],
                durationNote: '30 دقيقة',
                image: '/src/assets/images/dept_neurosurgery_suite_1795286629702.jpg',
                featuredOnHome: false,
                status: 'published',
              })
            }
            className="px-3.5 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إضافة خدمة طبية' : 'Add Service'}</span>
          </button>
        )}
      </div>

      {/* Tab 1: Departments */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {departments.map((dept) => {
            const isArchived = dept.status === 'archived';
            return (
              <div
                key={dept.id}
                className={`bg-white rounded-xl border p-5 space-y-4 ${
                  isArchived ? 'border-amber-200 bg-amber-50/30 opacity-75' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-500 font-mono" dir="ltr">
                      {dept.nameEn}
                    </span>
                    <h2 className="font-display font-bold text-lg text-slate-900">{dept.nameAr}</h2>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${
                      isArchived
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {isArchived ? (lang === 'ar' ? 'مؤرشف' : 'Archived') : lang === 'ar' ? 'منشور' : 'Published'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{dept.shortDesc}</p>
                <div className="text-[11px] text-slate-500 flex flex-wrap gap-4">
                  <span>{dept.workingHoursNote}</span>
                  <span>{dept.contactNote}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => setEditingDept({ ...dept })}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'تعديل' : 'Edit'}</span>
                    </button>
                  )}
                  {canArchive &&
                    (isArchived ? (
                      <button
                        type="button"
                        onClick={() => restoreStatus('department', dept.id)}
                        className="px-3 py-1.5 rounded-lg border border-emerald-300 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'استعادة' : 'Restore'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => requestArchiveDepartment(dept)}
                        className="px-3 py-1.5 rounded-lg border border-amber-300 text-xs font-semibold text-amber-800 hover:bg-amber-50 inline-flex items-center gap-1"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'أرشفة' : 'Archive'}</span>
                      </button>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Doctors */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'الطبيب / الفريق' : 'Name'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'الصفة' : 'Role'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'القسم' : 'Department'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3 text-end font-semibold">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => {
                  const dept = departments.find((d) => d.id === doc.departmentId);
                  const isArchived = doc.status === 'archived';
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {doc.nameAr}
                        {doc.isFeatured && (
                          <span className="ms-2 px-1.5 py-0.5 rounded bg-sky-50 text-[#0284C7] text-[10px]">
                            {lang === 'ar' ? 'بارز' : 'Featured'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{doc.roleTitle}</td>
                      <td className="px-4 py-3 text-slate-600">{dept?.nameAr}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded border text-[11px] font-medium ${
                            isArchived
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {isArchived ? (lang === 'ar' ? 'مؤرشف' : 'Archived') : lang === 'ar' ? 'منشور' : 'Published'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-end space-x-2 space-x-reverse whitespace-nowrap">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => setEditingDoc({ ...doc })}
                            className="px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                          >
                            {lang === 'ar' ? 'تعديل' : 'Edit'}
                          </button>
                        )}
                        {canArchive &&
                          (isArchived ? (
                            <button
                              type="button"
                              onClick={() => restoreStatus('doctor', doc.id)}
                              className="px-2.5 py-1 rounded border border-emerald-300 text-emerald-700 font-medium"
                            >
                              {lang === 'ar' ? 'استعادة' : 'Restore'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => requestArchiveDoctor(doc)}
                              className="px-2.5 py-1 rounded border border-amber-300 text-amber-800 font-medium"
                            >
                              {lang === 'ar' ? 'أرشفة' : 'Archive'}
                            </button>
                          ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Services */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'الخدمة' : 'Service'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'القسم' : 'Department'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'المدة التقديرية' : 'Duration'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3 text-end font-semibold">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((srv) => {
                  const dept = departments.find((d) => d.id === srv.departmentId);
                  const isArchived = srv.status === 'archived';
                  return (
                    <tr key={srv.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{srv.title}</td>
                      <td className="px-4 py-3 text-slate-600">{dept?.nameAr}</td>
                      <td className="px-4 py-3 text-slate-600">{srv.durationNote}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded border text-[11px] font-medium ${
                            isArchived
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {isArchived ? (lang === 'ar' ? 'مؤرشف' : 'Archived') : lang === 'ar' ? 'منشور' : 'Published'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-end space-x-2 space-x-reverse whitespace-nowrap">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => setEditingSrv({ ...srv })}
                            className="px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                          >
                            {lang === 'ar' ? 'تعديل' : 'Edit'}
                          </button>
                        )}
                        {canArchive &&
                          (isArchived ? (
                            <button
                              type="button"
                              onClick={() => restoreStatus('service', srv.id)}
                              className="px-2.5 py-1 rounded border border-emerald-300 text-emerald-700 font-medium"
                            >
                              {lang === 'ar' ? 'استعادة' : 'Restore'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => requestArchiveService(srv)}
                              className="px-2.5 py-1 rounded border border-amber-300 text-amber-800 font-medium"
                            >
                              {lang === 'ar' ? 'أرشفة' : 'Archive'}
                            </button>
                          ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {editingDept && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveDept}
            className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-display font-bold text-lg text-slate-900">
              {lang === 'ar' ? 'تعديل بيانات القسم' : 'Edit Department'}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الاسم العربي</label>
                <input
                  type="text"
                  required
                  value={editingDept.nameAr}
                  onChange={(e) => setEditingDept({ ...editingDept, nameAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الاسم الإنجليزي</label>
                <input
                  type="text"
                  dir="ltr"
                  required
                  value={editingDept.nameEn}
                  onChange={(e) => setEditingDept({ ...editingDept, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الوصف المختصر</label>
                <textarea
                  rows={2}
                  value={editingDept.shortDesc}
                  onChange={(e) => setEditingDept({ ...editingDept, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">أوقات العمل</label>
                <input
                  type="text"
                  value={editingDept.workingHoursNote}
                  onChange={(e) =>
                    setEditingDept({ ...editingDept, workingHoursNote: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <AdminImageField
                label="صورة القسم"
                value={editingDept.image}
                onChange={(url) => setEditingDept({ ...editingDept, image: url })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingDept(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold inline-flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                {lang === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveDoc}
            className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-display font-bold text-lg text-slate-900">
              {lang === 'ar' ? 'بيانات الطبيب / الفريق' : 'Physician Details'}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الاسم الكامل (عربي) *</label>
                <input
                  type="text"
                  required
                  value={editingDoc.nameAr}
                  onChange={(e) => setEditingDoc({ ...editingDoc, nameAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">المسمى الوظيفي *</label>
                <input
                  type="text"
                  required
                  value={editingDoc.roleTitle}
                  onChange={(e) => setEditingDoc({ ...editingDoc, roleTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">القسم</label>
                <select
                  value={editingDoc.departmentId}
                  onChange={(e) =>
                    setEditingDoc({ ...editingDoc, departmentId: e.target.value as DepartmentId })
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
                <label className="block font-semibold text-slate-700 mb-1">النبذة التعريفية</label>
                <textarea
                  rows={3}
                  value={editingDoc.bio}
                  onChange={(e) => setEditingDoc({ ...editingDoc, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <AdminImageField
                label="صورة الطبيب / المختص (اختياري)"
                value={editingDoc.imageUrl}
                onChange={(url) => setEditingDoc({ ...editingDoc, imageUrl: url })}
                onClear={() => setEditingDoc({ ...editingDoc, imageUrl: null })}
              />
              <div>
                <label className="block font-semibold text-slate-700 mb-1">حالة النشر</label>
                <select
                  value={editingDoc.status || 'published'}
                  onChange={(e) =>
                    setEditingDoc({ ...editingDoc, status: e.target.value as PublishStatus })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="published">منشور</option>
                  <option value="draft">مسودة</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingDoc(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold"
              >
                {lang === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingSrv && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveSrv}
            className="bg-white rounded-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="font-display font-bold text-lg text-slate-900">
              {lang === 'ar' ? 'بيانات الخدمة الطبية' : 'Service Details'}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">عنوان الخدمة *</label>
                <input
                  type="text"
                  required
                  value={editingSrv.title}
                  onChange={(e) => setEditingSrv({ ...editingSrv, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">القسم</label>
                  <select
                    value={editingSrv.departmentId}
                    onChange={(e) =>
                      setEditingSrv({ ...editingSrv, departmentId: e.target.value as DepartmentId })
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
                  <label className="block font-semibold text-slate-700 mb-1">الطبيب المسؤول</label>
                  <select
                    value={editingSrv.doctorId || ''}
                    onChange={(e) =>
                      setEditingSrv({ ...editingSrv, doctorId: e.target.value || null })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="">فريق القسم</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">الوصف المختصر *</label>
                <textarea
                  rows={2}
                  required
                  value={editingSrv.shortDesc}
                  onChange={(e) => setEditingSrv({ ...editingSrv, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ملاحظة المدة</label>
                <input
                  type="text"
                  value={editingSrv.durationNote}
                  onChange={(e) => setEditingSrv({ ...editingSrv, durationNote: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <AdminImageField
                label="صورة الخدمة الطبية"
                value={editingSrv.image}
                onChange={(url) => setEditingSrv({ ...editingSrv, image: url })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingSrv(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold"
              >
                {lang === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Relationship Impact Warning Modal before Archive */}
      {archiveConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-slate-900">
                  {lang === 'ar' ? 'تأكيد الأرشفة والتنبيه بالارتباطات' : 'Archive Impact Confirmation'}
                </h3>
                <p className="text-xs text-slate-600">
                  {lang === 'ar'
                    ? `أنت على وشك أرشفة "${archiveConfirm.title}" وإخفائه من الموقع العام.`
                    : `You are about to archive "${archiveConfirm.title}" from public view.`}
                </p>
              </div>
            </div>

            {archiveConfirm.impacts.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-semibold">
                  {lang === 'ar' ? 'تنبيه الارتباطات النشطة:' : 'Active linked records:'}
                </p>
                <ul className="list-disc list-inside">
                  {archiveConfirm.impacts.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setArchiveConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-medium"
              >
                {lang === 'ar' ? 'تراجع' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmArchive}
                className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold"
              >
                {lang === 'ar' ? 'تأكيد الأرشفة' : 'Confirm Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
