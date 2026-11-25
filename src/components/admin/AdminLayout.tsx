import React, { useMemo, useState } from 'react';
import { Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  FileUp,
  FolderTree,
  Globe,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Megaphone,
  Menu,
  MessageSquareMore,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  X,
} from 'lucide-react';
import { useDataStore } from '../../context/DataStoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { ClinicLogoMark } from '../ClinicLogoMark';
import { PermissionKey } from '../../types/clinic';

interface NavGroup {
  groupAr: string;
  groupEn: string;
  items: {
    to: string;
    labelAr: string;
    labelEn: string;
    icon: React.ComponentType<{ className?: string }>;
    perm: PermissionKey;
    badgeCount?: number;
  }[];
}

export const AdminLayout: React.FC<{
  titleAr: string;
  titleEn: string;
  children: React.ReactNode;
}> = ({ titleAr, titleEn, children }) => {
  const {
    currentUser,
    logoutAdmin,
    hasPermission,
    appointments,
    orders,
    prescriptions,
    supportMessages,
    stories,
    smsLogs,
  } = useDataStore();
  const { lang, setLang, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  if (!currentUser) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const pendingBookingsCount = appointments.filter(
    (a) => a.status === 'pending_review' || a.status === 'needs_revision'
  ).length;
  const newOrdersCount = orders.filter((o) => o.fulfillmentStatus === 'pending_review').length;
  const newRxCount = prescriptions.filter(
    (rx) => rx.status === 'new' || rx.status === 'under_review'
  ).length;
  const pendingCommentsCount = stories.reduce(
    (acc, s) => acc + s.comments.filter((c) => c.status === 'pending').length,
    0
  );
  const newInboxCount =
    supportMessages.filter((m) => m.status === 'new').length + pendingCommentsCount;
  const failedSmsCount = smsLogs.filter((s) => s.status === 'failed').length;

  const totalNotifs =
    pendingBookingsCount + newOrdersCount + newRxCount + newInboxCount + failedSmsCount;

  const navGroups: NavGroup[] = useMemo(
    () => [
      {
        groupAr: 'نظرة عامة',
        groupEn: 'Overview',
        items: [
          {
            to: '/admin',
            labelAr: 'لوحة المؤشرات',
            labelEn: 'Overview',
            icon: LayoutDashboard,
            perm: 'view_overview',
          },
        ],
      },
      {
        groupAr: 'إدارة الموقع والمحتوى',
        groupEn: 'Website & Content',
        items: [
          {
            to: '/admin/homepage',
            labelAr: 'الرئيسية والهوية',
            labelEn: 'Homepage & Brand',
            icon: LayoutTemplate,
            perm: 'manage_content',
          },
          {
            to: '/admin/departments',
            labelAr: 'الأقسام والأطباء والخدمات',
            labelEn: 'Depts, Doctors & Services',
            icon: Building2,
            perm: 'manage_content',
          },
          {
            to: '/admin/content',
            labelAr: 'المكتبة والأخبار والوسائط',
            labelEn: 'Content & Media Library',
            icon: FileText,
            perm: 'manage_content',
          },
        ],
      },
      {
        groupAr: 'الحجوزات والدوام والحملات',
        groupEn: 'Bookings, Shifts & Campaigns',
        items: [
          {
            to: '/admin/bookings',
            labelAr: 'إدارة الحجوزات',
            labelEn: 'Bookings',
            icon: CalendarCheck2,
            perm: 'manage_bookings',
            badgeCount: pendingBookingsCount,
          },
          {
            to: '/admin/schedule-sms',
            labelAr: 'الدوام وإشعارات SMS',
            labelEn: 'Schedule & SMS Log',
            icon: Clock,
            perm: 'manage_bookings',
            badgeCount: failedSmsCount,
          },
          {
            to: '/admin/campaigns',
            labelAr: 'الحملات الطبية',
            labelEn: 'Campaigns',
            icon: Megaphone,
            perm: 'manage_campaigns',
          },
        ],
      },
      {
        groupAr: 'المتجر والطلبات والوصفات',
        groupEn: 'Store, Orders & Rx',
        items: [
          {
            to: '/admin/store-structure',
            labelAr: 'هيكلة المتجر والتصنيفات',
            labelEn: 'Store Structure',
            icon: FolderTree,
            perm: 'manage_store',
          },
          {
            to: '/admin/products',
            labelAr: 'المنتجات والمخزون',
            labelEn: 'Products & Inventory',
            icon: Package,
            perm: 'manage_store',
          },
          {
            to: '/admin/orders',
            labelAr: 'طلبات المتجر والتحصيل',
            labelEn: 'Orders & Payments',
            icon: ShoppingCart,
            perm: 'manage_orders',
            badgeCount: newOrdersCount,
          },
          {
            to: '/admin/prescriptions',
            labelAr: 'مراجعة الوصفات الطبية',
            labelEn: 'Prescriptions Queue',
            icon: FileUp,
            perm: 'manage_prescriptions',
            badgeCount: newRxCount,
          },
        ],
      },
      {
        groupAr: 'التفاعل والرسائل',
        groupEn: 'Engagement & Inbox',
        items: [
          {
            to: '/admin/inbox',
            labelAr: 'البريد والتعليقات والتقييم',
            labelEn: 'Inbox & Moderation',
            icon: MessageSquareMore,
            perm: 'manage_inbox',
            badgeCount: newInboxCount,
          },
        ],
      },
      {
        groupAr: 'التقارير',
        groupEn: 'Analytics',
        items: [
          {
            to: '/admin/reports',
            labelAr: 'التقارير والتحليلات',
            labelEn: 'Reports & Export',
            icon: BarChart3,
            perm: 'view_reports',
          },
        ],
      },
      {
        groupAr: 'المستخدمون والصلاحيات',
        groupEn: 'Users & RBAC',
        items: [
          {
            to: '/admin/users',
            labelAr: 'الأدوار ومصفوفة الصلاحيات',
            labelEn: 'Users & Permissions',
            icon: ShieldCheck,
            perm: 'manage_users',
          },
        ],
      },
      {
        groupAr: 'الإعدادات',
        groupEn: 'Settings',
        items: [
          {
            to: '/admin/settings',
            labelAr: 'إعدادات النظام وسجل الأنشطة',
            labelEn: 'Settings & Audit Log',
            icon: Settings,
            perm: 'manage_settings',
          },
        ],
      },
    ],
    [pendingBookingsCount, newOrdersCount, newRxCount, newInboxCount, failedSmsCount]
  );

  const visibleGroups = navGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => hasPermission(item.perm)),
    }))
    .filter((g) => g.items.length > 0);

  const activeGroup = navGroups.find((g) =>
    g.items.some((item) => item.to === location.pathname)
  );

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = quickQuery.trim();
    if (!q) return;
    if (q.toUpperCase().startsWith('ORD') && hasPermission('manage_orders')) {
      navigate(`/admin/orders?q=${encodeURIComponent(q)}`);
    } else if (q.toUpperCase().startsWith('RX') && hasPermission('manage_prescriptions')) {
      navigate(`/admin/prescriptions?q=${encodeURIComponent(q)}`);
    } else if (hasPermission('manage_bookings')) {
      navigate(`/admin/bookings?q=${encodeURIComponent(q)}`);
    } else if (hasPermission('manage_store')) {
      navigate(`/admin/products?q=${encodeURIComponent(q)}`);
    }
    setQuickQuery('');
  };

  const renderSidebarContent = (isMobileDrawer = false) => (
    <div className="flex flex-col h-full bg-white">
      {/* Brand / Collapse Header */}
      <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
        {(!collapsed || isMobileDrawer) && (
          <Link to="/admin" className="truncate" onClick={() => setMobileOpen(false)}>
            <ClinicLogoMark compact />
          </Link>
        )}
        {isMobileDrawer ? (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label={lang === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={lang === 'ar' ? 'طي أو توسيع القائمة' : 'Toggle sidebar'}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 ms-auto"
          >
            {collapsed ? (
              isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : isRTL ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Prototype Note */}
      {(!collapsed || isMobileDrawer) && (
        <div className="px-4 py-2.5 bg-sky-50/70 border-b border-sky-100 text-[11px] text-[#093542] flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
          <span className="truncate">
            {lang === 'ar'
              ? 'لوحة إدارة محاكاة مرتبطة بالموقع'
              : 'Synced Frontend Admin Prototype'}
          </span>
        </div>
      )}

      {/* Groups */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {visibleGroups.map((group) => (
          <div key={group.groupEn} className="space-y-1">
            {(!collapsed || isMobileDrawer) && (
              <p className="px-2.5 text-[11px] font-semibold text-slate-400">
                {lang === 'ar' ? group.groupAr : group.groupEn}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin'}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed && !isMobileDrawer ? (lang === 'ar' ? item.labelAr : item.labelEn) : undefined}
                    className={({ isActive }) =>
                      `flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#0F4C5C] text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-[#0F4C5C]'
                      }`
                    }
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" />
                      {(!collapsed || isMobileDrawer) && (
                        <span className="truncate">
                          {lang === 'ar' ? item.labelAr : item.labelEn}
                        </span>
                      )}
                    </span>
                    {(!collapsed || isMobileDrawer) &&
                      typeof item.badgeCount === 'number' &&
                      item.badgeCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-current text-[10px] font-bold tabular-nums">
                          {item.badgeCount}
                        </span>
                      )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Quick Switch / Logout */}
      <div className="p-3 border-t border-slate-200 space-y-2 shrink-0">
        {(!collapsed || isMobileDrawer) && (
          <div className="px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <p className="font-semibold text-slate-900 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-[#0F4C5C] font-medium">
              {lang === 'ar' ? currentUser.roleLabelAr : currentUser.roleLabelEn}
            </p>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Link
            to="/admin/login"
            onClick={() => setMobileOpen(false)}
            className="flex-1 px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50 text-center truncate"
          >
            {collapsed && !isMobileDrawer
              ? lang === 'ar'
                ? 'تبديل'
                : 'Role'
              : lang === 'ar'
              ? 'تبديل الدور'
              : 'Switch Role'}
          </Link>
          <button
            type="button"
            onClick={() => {
              logoutAdmin();
              navigate('/admin/login');
            }}
            title={lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            className="p-2 rounded-lg border border-slate-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-x-clip">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 border-e border-slate-200 bg-white sticky top-0 h-screen transition-all duration-200 ${
          collapsed ? 'w-[70px]' : 'w-68'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full bg-white border-e border-slate-200 z-10">
            {renderSidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 min-h-16 py-2 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={lang === 'ar' ? 'فتح القائمة' : 'Open menu'}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-sm sm:text-lg leading-snug text-slate-900 truncate">
                {lang === 'ar' ? titleAr : titleEn}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search */}
            <form onSubmit={handleQuickSearch} className="hidden md:block relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="search"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder={
                  lang === 'ar' ? 'بحث سريع برقم مرجعي أو اسم...' : 'Quick search ref or name...'
                }
                className="ps-8 pe-3 py-1.5 rounded-lg border border-slate-300 text-xs w-52 bg-slate-50 focus:bg-white"
              />
            </form>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                aria-label={lang === 'ar' ? 'الإشعارات' : 'Notifications'}
                className="relative p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <Bell className="w-4 h-4" />
                {totalNotifs > 0 && (
                  <span className="absolute -top-1 -end-1 min-w-[1.1rem] h-4 px-1 rounded-full bg-[#0284C7] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {totalNotifs}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="fixed inset-x-3 top-16 sm:inset-x-auto sm:absolute sm:end-0 sm:top-full sm:mt-2 sm:w-72 bg-white rounded-xl border border-slate-200 shadow-lg p-3 z-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">
                      {lang === 'ar' ? 'تنبيهات العمليات' : 'Operational Alerts'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {pendingBookingsCount > 0 && hasPermission('manage_bookings') && (
                      <Link
                        to="/admin/bookings?status=pending_review"
                        onClick={() => setNotifOpen(false)}
                        className="block p-2 rounded-lg hover:bg-slate-50 text-slate-700"
                      >
                        {lang === 'ar'
                          ? `${pendingBookingsCount} طلبات مواعيد تحتاج مراجعة`
                          : `${pendingBookingsCount} pending appointment requests`}
                      </Link>
                    )}
                    {newOrdersCount > 0 && hasPermission('manage_orders') && (
                      <Link
                        to="/admin/orders?status=pending_review"
                        onClick={() => setNotifOpen(false)}
                        className="block p-2 rounded-lg hover:bg-slate-50 text-slate-700"
                      >
                        {lang === 'ar'
                          ? `${newOrdersCount} طلبات متجر جديدة`
                          : `${newOrdersCount} new store orders`}
                      </Link>
                    )}
                    {newRxCount > 0 && hasPermission('manage_prescriptions') && (
                      <Link
                        to="/admin/prescriptions"
                        onClick={() => setNotifOpen(false)}
                        className="block p-2 rounded-lg hover:bg-slate-50 text-slate-700"
                      >
                        {lang === 'ar'
                          ? `${newRxCount} وصفات طبية للمراجعة`
                          : `${newRxCount} prescriptions awaiting review`}
                      </Link>
                    )}
                    {failedSmsCount > 0 && hasPermission('manage_bookings') && (
                      <Link
                        to="/admin/schedule-sms"
                        onClick={() => setNotifOpen(false)}
                        className="block p-2 rounded-lg bg-red-50 text-red-800"
                      >
                        {lang === 'ar'
                          ? `${failedSmsCount} رسائل SMS تعذر إرسالها`
                          : `${failedSmsCount} failed SMS deliveries`}
                      </Link>
                    )}
                    {newInboxCount > 0 && hasPermission('manage_inbox') && (
                      <Link
                        to="/admin/inbox"
                        onClick={() => setNotifOpen(false)}
                        className="block p-2 rounded-lg hover:bg-slate-50 text-slate-700"
                      >
                        {lang === 'ar'
                          ? `${newInboxCount} رسائل وتعليقات بانتظار المراجعة`
                          : `${newInboxCount} inbox messages & comments`}
                      </Link>
                    )}
                    {totalNotifs === 0 && (
                      <p className="text-slate-500 py-2 text-center">
                        {lang === 'ar' ? 'لا توجد تنبيهات معلقة' : 'No pending alerts'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Preview Public Website Button */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === 'ar' ? 'معاينة الموقع' : 'Preview Site'}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1440px] w-full mx-auto space-y-5">
          {/* Breadcrumb inside page body */}
          <nav
            aria-label={lang === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}
            className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500"
          >
            <Link to="/admin" className="hover:text-[#0F4C5C] font-medium">
              {lang === 'ar' ? 'لوحة الإدارة' : 'Admin'}
            </Link>
            {activeGroup && location.pathname !== '/admin' && (
              <>
                <span className="text-slate-300">/</span>
                <span>{lang === 'ar' ? activeGroup.groupAr : activeGroup.groupEn}</span>
              </>
            )}
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">
              {lang === 'ar' ? titleAr : titleEn}
            </span>
          </nav>

          {children}
        </main>
      </div>
    </div>
  );
};
