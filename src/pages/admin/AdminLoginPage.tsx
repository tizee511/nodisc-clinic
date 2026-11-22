import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Globe, LogIn, ShieldCheck } from 'lucide-react';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { ClinicLogoMark } from '../../components/ClinicLogoMark';
import { ROLE_META } from '../../utils/adminLabels';
import { RoleId } from '../../types/clinic';

export const AdminLoginPage: React.FC = () => {
  const { users, currentUser, loginAsRole, loginWithUser, permissionsMatrix } = useDataStore();
  const { lang, setLang, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<RoleId>(currentUser?.roleId || 'admin');
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const handleEnterAdmin = (role: RoleId) => {
    loginAsRole(role);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="hover:opacity-90">
          <ClinicLogoMark />
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-700 inline-flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-[#0F4C5C] hover:bg-slate-50"
          >
            {lang === 'ar' ? 'العودة للموقع العام' : 'Back to Public Site'}
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl w-full mx-auto my-8 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0284C7]">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? 'دخول تجريبي لمحاكاة الصلاحيات (Frontend Prototype)'
                  : 'Demo Authentication & Role Simulation'}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              {lang === 'ar'
                ? 'الدخول إلى لوحة إدارة نوديسك كلينك'
                : 'Sign In to NODISC Clinic Admin Panel'}
            </h1>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {lang === 'ar'
                ? 'الدخول وإتاحة الصفحات والإجراءات في هذا النموذج محاكاة محلية لبيانات المعاينة فقط. اختر أحد الأدوار الخمسة لتجربة انعكاس الصلاحيات مباشرة على القائمة الجانبية والإجراءات.'
                : 'Authentication and role-based access control here are local frontend simulations. Select any of the 5 demo roles below to preview how menus and actions adapt immediately.'}
            </p>
          </div>

          {/* 5 Roles Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => {
              const meta = ROLE_META[u.roleId];
              const isSelected = selectedRole === u.roleId;
              const enabledCount = Object.values(permissionsMatrix[u.roleId] || {}).filter(Boolean).length;
              return (
                <div
                  key={u.id}
                  onClick={() => setSelectedRole(u.roleId)}
                  className={`cursor-pointer rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-colors ${
                    isSelected
                      ? 'border-[#0F4C5C] bg-sky-50/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-bold text-base text-slate-900">
                        {lang === 'ar' ? meta.ar : meta.en}
                      </span>
                      <span className="text-[11px] font-mono text-[#0F4C5C] font-semibold tabular-nums">
                        {enabledCount}/15
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700">{u.name}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? meta.descAr : meta.descEn}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      loginWithUser(u.id);
                      navigate('/admin');
                    }}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-[#0F4C5C] text-white hover:bg-[#093542]'
                        : 'bg-slate-100 text-slate-800 hover:bg-[#0F4C5C] hover:text-white'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'دخول بهذا الدور' : 'Enter with Role'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              {lang === 'ar'
                ? 'يمكنك تعديل صلاحيات كل دور لاحقًا من شاشة المستخدمون والصلاحيات.'
                : 'You can customize role privileges anytime from Users & Permissions.'}
            </p>
            <button
              type="button"
              onClick={() => handleEnterAdmin(selectedRole)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
            >
              <span>
                {lang === 'ar'
                  ? `متابعة كـ ${ROLE_META[selectedRole].ar}`
                  : `Continue as ${ROLE_META[selectedRole].en}`}
              </span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-slate-500">
        {lang === 'ar'
          ? 'نموذج تصوري تفاعلي — نوديسك كلينك 2026'
          : 'Interactive Frontend Prototype — NODISC Clinic 2026'}
      </footer>
    </div>
  );
};
