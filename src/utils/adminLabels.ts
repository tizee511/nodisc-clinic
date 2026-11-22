import {
  AppointmentStatus,
  OrderFulfillmentStatus,
  PermissionKey,
  PrescriptionStatus,
  RoleId,
} from '../types/clinic';

export const APPOINTMENT_STATUS_LABELS: Record<
  AppointmentStatus,
  { ar: string; en: string; badgeClass: string }
> = {
  pending_review: {
    ar: 'بانتظار المراجعة',
    en: 'Pending Review',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  needs_revision: {
    ar: 'مقترح تعديل الموعد',
    en: 'Revision Suggested',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  confirmed: {
    ar: 'مؤكد',
    en: 'Confirmed',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  attended: {
    ar: 'حضر',
    en: 'Attended',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
  },
  no_show: {
    ar: 'لم يحضر',
    en: 'No-Show',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
  },
  cancelled: {
    ar: 'ملغى',
    en: 'Cancelled',
    badgeClass: 'bg-red-50 text-red-800 border-red-200',
  },
};

export const ORDER_STATUS_LABELS: Record<
  OrderFulfillmentStatus,
  { ar: string; en: string; badgeClass: string }
> = {
  pending_review: {
    ar: 'جديد / بانتظار المراجعة',
    en: 'Pending Review',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  confirmed: {
    ar: 'مؤكد (محجوز المخزون)',
    en: 'Confirmed (Reserved)',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  preparing: {
    ar: 'قيد التجهيز',
    en: 'Preparing',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  ready_for_delivery: {
    ar: 'جاهز للتسليم',
    en: 'Ready for Delivery',
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },
  delivered: {
    ar: 'تم التسليم',
    en: 'Delivered',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  cancelled: {
    ar: 'ملغى',
    en: 'Cancelled',
    badgeClass: 'bg-red-50 text-red-800 border-red-200',
  },
};

export const PRESCRIPTION_STATUS_LABELS: Record<
  PrescriptionStatus,
  { ar: string; en: string; badgeClass: string }
> = {
  new: {
    ar: 'جديدة',
    en: 'New',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  under_review: {
    ar: 'قيد مراجعة الصيدلي',
    en: 'Under Review',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  needs_contact: {
    ar: 'تحتاج تواصل مع المريض',
    en: 'Needs Contact',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  quote_prepared: {
    ar: 'تم تجهيز التسعيرة',
    en: 'Quote Prepared',
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },
  converted_to_order: {
    ar: 'تم التحويل لطلب متجر',
    en: 'Converted to Order',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  closed: {
    ar: 'مغلقة',
    en: 'Closed',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

export const ROLE_META: Record<RoleId, { ar: string; en: string; descAr: string; descEn: string }> = {
  admin: {
    ar: 'مدير النظام',
    en: 'System Admin',
    descAr: 'صلاحية كاملة على الموقع والمحتوى والحجوزات والمتجر والتقارير والمستخدمين والإعدادات.',
    descEn: 'Full access across website content, bookings, store, reports, users, and system settings.',
  },
  editor: {
    ar: 'محرر المحتوى',
    en: 'Content Editor',
    descAr: 'إدارة الرئيسية والأقسام والأطباء والمكتبة الطبية والأخبار والقصص والوسائط والتعليقات.',
    descEn: 'Manages homepage, departments, doctors, library, news, stories, media, and comment moderation.',
  },
  reception: {
    ar: 'موظف الاستقبال',
    en: 'Receptionist',
    descAr: 'إدارة طلبات المواعيد وتأكيدها وإدارة الدوام ورسائل SMS والحملات والاستفسارات.',
    descEn: 'Manages appointment confirmations, shifts, SMS logs, campaigns, and patient inquiries.',
  },
  store_manager: {
    ar: 'مسؤول المتجر والصيدلية',
    en: 'Store Manager',
    descAr: 'إدارة هيكلة المتجر والمنتجات والمخزون والطلبات والتحصيل ومراجعة الوصفات الطبية.',
    descEn: 'Manages store sections, catalog, stock adjustments, orders, payments, and prescriptions.',
  },
  reports_viewer: {
    ar: 'مستخدم تقارير',
    en: 'Reports Viewer',
    descAr: 'صلاحية اطلاع وقراءة على نظرة عامة والتقارير التحليلية وتصدير CSV والطباعة.',
    descEn: 'Read-only access to overview KPIs, analytics reports, CSV export, and printable views.',
  },
};

export const PERMISSION_LABELS: Record<PermissionKey, { ar: string; en: string }> = {
  view_overview: { ar: 'عرض نظرة عامة', en: 'View Overview' },
  manage_content: { ar: 'إضافة/تعديل المحتوى والأقسام', en: 'Manage Content & Depts' },
  publish_content: { ar: 'نشر المواد على الموقع العام', en: 'Publish Content' },
  archive_records: { ar: 'أرشفة وإخفاء السجلات', en: 'Archive Records' },
  manage_bookings: { ar: 'استعراض وإدارة الحجوزات', en: 'Manage Bookings' },
  confirm_bookings: { ar: 'تأكيد المواعيد وإرسال SMS', en: 'Confirm Bookings & SMS' },
  manage_campaigns: { ar: 'إدارة الحملات الطبية', en: 'Manage Campaigns' },
  manage_store: { ar: 'إدارة المنتجات والمخزون', en: 'Manage Store & Stock' },
  manage_prices: { ar: 'تعديل الأسعار وعرض الجملة', en: 'Manage Prices & Wholesale' },
  manage_orders: { ar: 'إدارة الطلبات والتحصيل', en: 'Manage Orders & Payments' },
  manage_prescriptions: { ar: 'مراجعة وتحويل الوصفات', en: 'Review Prescriptions' },
  manage_inbox: { ar: 'إدارة الرسائل والتعليقات', en: 'Manage Inbox & Comments' },
  view_reports: { ar: 'الاطلاع على التقارير والتصدير', en: 'View & Export Reports' },
  manage_users: { ar: 'إدارة المستخدمين والصلاحيات', en: 'Manage Users & RBAC' },
  manage_settings: { ar: 'تعديل الإعدادات وضبط الديمو', en: 'System Settings & Reset' },
};
