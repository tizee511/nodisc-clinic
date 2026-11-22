import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShieldAlert, ShieldCheck, UserCheck } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { PERMISSION_LABELS, ROLE_META } from '../../utils/adminLabels';
import { PermissionKey, RoleId } from '../../types/clinic';

const ROLE_IDS: RoleId[] = ['admin', 'editor', 'reception', 'store_manager', 'reports_viewer'];
const PERM_KEYS = Object.keys(PERMISSION_LABELS) as PermissionKey[];

export const AdminUsersPage: React.FC = () => {
  const {
    hasPermission,
    users,
    setUsers,
    currentUser,
    loginAsRole,
    loginWithUser,
    permissionsMatrix,
    toggleRolePermission,
    recordAudit,
  } = useDataStore();
  const { lang } = useLanguage();

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<RoleId>('reception');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;
    const meta = ROLE_META[newRole];
    const id = `USR-${Date.now().toString().slice(-3)}`;
    setUsers((prev) => [
      ...prev,
      {
        id,
        name: newName.trim(),
        email: newEmail.trim(),
        roleId: newRole,
        roleLabelAr: meta.ar,
        roleLabelEn: meta.en,
        active: true,
      },
    ]);
    recordAudit('المستخدمون', 'إضافة حساب تجريبي جديد', newName.trim());
    setNewName('');
    setNewEmail('');
    setFeedback(
      lang === 'ar' ? 'تمت إضافة المستخدم التجريبي للجلسة.' : 'Demo user added for this session.'
    );
  };

  if (!hasPermission('manage_users')) {
    return (
      <AdminLayout titleAr="المستخدمون والصلاحيات" titleEn="Users & Permissions Matrix">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
          <ShieldAlert className="w-8 h-8 text-amber-600 mx-auto" />
          <p className="font-bold text-slate-900">
            {lang === 'ar'
              ? 'إدارة المستخدمين ومصفوفة الصلاحيات متاحة لمدير النظام فقط'
              : 'User and RBAC management is restricted to System Admin'}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              to="/admin/login"
              className="px-4 py-2 rounded-lg bg-[#0F4C5C] text-white text-xs font-semibold"
            >
              {lang === 'ar' ? 'العودة لتبديل الدور' : 'Switch Role'}
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              {lang === 'ar' ? 'لوحة المؤشرات' : 'Overview'}
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout titleAr="المستخدمون والصلاحيات" titleEn="Users & Permissions Matrix">
      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-4 py-3 text-xs font-medium">
          {feedback}
        </div>
      )}

      {/* Demo Users List + Add User */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-base text-slate-900">
                {lang === 'ar' ? 'حسابات الفريق التجريبية' : 'Demo Staff Accounts'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar'
                  ? 'يمكنك تبديل الجلسة فورًا لأي حساب لمحاكاة تأثير الدور على القائمة والإجراءات.'
                  : 'Switch session to any account to observe immediate RBAC effects.'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'الدور' : 'Role'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3 text-start font-semibold">{lang === 'ar' ? 'إجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className={isCurrent ? 'bg-sky-50/40' : 'hover:bg-slate-50'}>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono" dir="ltr">
                          {u.email}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.roleId}
                          onChange={(e) => {
                            const nextRole = e.target.value as RoleId;
                            const meta = ROLE_META[nextRole];
                            setUsers((prev) =>
                              prev.map((x) =>
                                x.id === u.id
                                  ? {
                                      ...x,
                                      roleId: nextRole,
                                      roleLabelAr: meta.ar,
                                      roleLabelEn: meta.en,
                                    }
                                  : x
                              )
                            );
                            recordAudit('المستخدمون', `تعديل دور ${u.name}`, meta.ar);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs bg-white"
                        >
                          {ROLE_IDS.map((rid) => (
                            <option key={rid} value={rid}>
                              {lang === 'ar' ? ROLE_META[rid].ar : ROLE_META[rid].en}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setUsers((prev) =>
                              prev.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))
                            )
                          }
                          className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${
                            u.active
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          {u.active
                            ? lang === 'ar'
                              ? 'نشط'
                              : 'Active'
                            : lang === 'ar'
                            ? 'موقوف'
                            : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F4C5C]">
                            <UserCheck className="w-3.5 h-3.5" />
                            {lang === 'ar' ? 'الجلسة الحالية' : 'Active Session'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={!u.active}
                            onClick={() => loginWithUser(u.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#0F4C5C] text-white hover:bg-[#093542] disabled:opacity-40 text-xs font-semibold"
                          >
                            {lang === 'ar' ? 'تبديل الجلسة' : 'Switch Session'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Demo User Form */}
        <form
          onSubmit={handleAddUser}
          className="xl:col-span-4 bg-white rounded-xl border border-slate-200 p-5 space-y-3 h-fit"
        >
          <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#0284C7]" />
            <span>{lang === 'ar' ? 'إضافة مستخدم تجريبي' : 'Add Demo User'}</span>
          </h3>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={lang === 'ar' ? 'مثال: سارة علي (استقبال)' : 'e.g. Sara Ali'}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {lang === 'ar' ? 'البريد التجريبي' : 'Demo Email'}
            </label>
            <input
              type="email"
              required
              dir="ltr"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="staff@nodisc.example"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {lang === 'ar' ? 'الدور الوظيفي' : 'Role'}
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as RoleId)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
            >
              {ROLE_IDS.map((rid) => (
                <option key={rid} value={rid}>
                  {lang === 'ar' ? ROLE_META[rid].ar : ROLE_META[rid].en}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs font-semibold"
          >
            {lang === 'ar' ? 'إضافة الحساب' : 'Add Account'}
          </button>
        </form>
      </div>

      {/* Interactive Permissions Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
              <span>{lang === 'ar' ? 'مصفوفة الصلاحيات التفاعلية' : 'Interactive Permissions Matrix'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'ar'
                ? 'عدّل صلاحيات أي دور لتشاهد تأثيره المباشر على القائمة الجانبية والإجراءات عند التبديل إليه.'
                : 'Toggle any permission cell and switch to that role to observe live UI gating.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ROLE_IDS.map((rid) => (
              <button
                key={rid}
                type="button"
                onClick={() => loginAsRole(rid)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border ${
                  currentUser?.roleId === rid
                    ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lang === 'ar' ? ROLE_META[rid].ar : ROLE_META[rid].en}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-start font-semibold min-w-[220px]">
                  {lang === 'ar' ? 'الصلاحية / الإجراء' : 'Permission'}
                </th>
                {ROLE_IDS.map((rid) => (
                  <th key={rid} className="px-3 py-3 text-center font-semibold min-w-[110px]">
                    {lang === 'ar' ? ROLE_META[rid].ar : ROLE_META[rid].en}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PERM_KEYS.map((perm) => (
                <tr key={perm} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {lang === 'ar' ? PERMISSION_LABELS[perm].ar : PERMISSION_LABELS[perm].en}
                  </td>
                  {ROLE_IDS.map((rid) => {
                    const checked = !!permissionsMatrix[rid]?.[perm];
                    return (
                      <td key={rid} className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRolePermission(rid, perm)}
                          aria-label={`${ROLE_META[rid].en} - ${PERMISSION_LABELS[perm].en}`}
                          className="w-4 h-4 accent-[#0F4C5C] cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
