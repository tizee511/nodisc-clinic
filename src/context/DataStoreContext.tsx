import React, { createContext, useContext, useState } from 'react';
import { siteConfig as initialSiteConfig, SiteConfig } from '../config/siteConfig';
import { departmentsData } from '../data/departments';
import { doctorsData } from '../data/doctors';
import { servicesData } from '../data/services';
import { libraryData } from '../data/library';
import { newsData, successStoriesData } from '../data/newsAndStories';
import { campaignsData } from '../data/campaigns';
import {
  productCategoriesData,
  productsData,
  storeMainSectionsData,
} from '../data/products';
import {
  appointmentsSeed,
  auditLogSeed,
  campaignBookingsSeed,
  careerAppsSeed,
  defaultPermissionsMatrix,
  demoUsersSeed,
  homepageSectionsSeed,
  inventoryLogsSeed,
  mediaLibrarySeed,
  orderPaymentsSeed,
  ordersSeed,
  prescriptionsSeed,
  scheduleSettingsSeed,
  smsLogsSeed,
  supportMessagesSeed,
  surveysSeed,
} from '../data/adminSeed';
import {
  AppointmentStatus,
  AppointmentSubmission,
  AuditLogEntry,
  Campaign,
  CampaignBookingRecord,
  CampaignCapacityPolicy,
  CampaignStatus,
  CareerApplicationRecord,
  DemoUser,
  Department,
  DepartmentId,
  Doctor,
  HomepageSectionConfig,
  InventoryLogEntry,
  LibraryItem,
  MediaAsset,
  MedicalService,
  NewsItem,
  OrderFulfillmentStatus,
  OrderPaymentRecord,
  OrderRecord,
  PermissionKey,
  PrescriptionStatus,
  PrescriptionSubmission,
  Product,
  ProductCategory,
  RoleId,
  ScheduleSettings,
  SmsLogEntry,
  StoreMainSection,
  StoryComment,
  SuccessStory,
  SupportMessageRecord,
  SurveyRecord,
} from '../types/clinic';

export interface HomeHeroOverride {
  kickerAr: string;
  titleAr: string;
  subtitleAr: string;
  primaryCtaAr: string;
  secondaryCtaAr: string;
  heroImage: string;
}

const initialHomeHero: HomeHeroOverride = {
  kickerAr: 'رعاية عصبية وحركية متكاملة تحت سقف واحد',
  titleAr: 'نوديسك كلينك — تشخيص دقيق ومسار علاجي متكامل للعمود الفقري والأعصاب',
  subtitleAr:
    'نجمع في نوديسك كلينك بين استشارات جراحة المخ والأعصاب، وعلاج الألم التداخلي، وبرامج التأهيل والعلاج الطبيعي، والصيدلية الطبية في تجربة علاجية منظمة ومريحة.',
  primaryCtaAr: 'طلب موعد',
  secondaryCtaAr: 'تعرّف على أقسامنا',
  heroImage: initialSiteConfig.brand.heroImage,
};

interface DataStoreContextValue {
  // Config & Theme & Homepage
  siteConfigState: SiteConfig;
  setSiteConfigState: React.Dispatch<React.SetStateAction<SiteConfig>>;
  homepageSections: HomepageSectionConfig[];
  setHomepageSections: React.Dispatch<React.SetStateAction<HomepageSectionConfig[]>>;
  homeHero: HomeHeroOverride;
  setHomeHero: React.Dispatch<React.SetStateAction<HomeHeroOverride>>;

  // Core Clinic Entities
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  services: MedicalService[];
  setServices: React.Dispatch<React.SetStateAction<MedicalService[]>>;

  // Content & Media
  library: LibraryItem[];
  setLibrary: React.Dispatch<React.SetStateAction<LibraryItem[]>>;
  news: NewsItem[];
  setNews: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  stories: SuccessStory[];
  setStories: React.Dispatch<React.SetStateAction<SuccessStory[]>>;
  mediaAssets: MediaAsset[];
  setMediaAssets: React.Dispatch<React.SetStateAction<MediaAsset[]>>;

  // Campaigns
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  campaignBookings: CampaignBookingRecord[];
  campaignCapacityPolicy: CampaignCapacityPolicy;
  setCampaignCapacityPolicy: (policy: CampaignCapacityPolicy) => void;
  getCampaignBookedCount: (campaignId: string) => number;
  getCampaignEffectiveStatus: (campaign: Campaign) => CampaignStatus;
  addCampaignBooking: (record: Omit<CampaignBookingRecord, 'status'> & { status?: 'pending' | 'confirmed' }) => { ok: boolean; error?: string };
  updateCampaignBookingStatus: (referenceId: string, status: 'pending' | 'confirmed' | 'cancelled') => { ok: boolean; error?: string };

  // Store & Inventory
  storeMainSections: StoreMainSection[];
  setStoreMainSections: React.Dispatch<React.SetStateAction<StoreMainSection[]>>;
  productCategories: ProductCategory[];
  setProductCategories: React.Dispatch<React.SetStateAction<ProductCategory[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  showWholesalePrices: boolean;
  setShowWholesalePrices: React.Dispatch<React.SetStateAction<boolean>>;
  inventoryLogs: InventoryLogEntry[];
  adjustInventory: (productId: string, delta: number, reason: string) => void;

  // Appointments, Schedule & SMS
  scheduleSettings: ScheduleSettings;
  setScheduleSettings: React.Dispatch<React.SetStateAction<ScheduleSettings>>;
  appointments: AppointmentSubmission[];
  addAppointment: (app: AppointmentSubmission) => void;
  updateAppointment: (
    referenceId: string,
    updates: Partial<AppointmentSubmission>,
    options?: { simulateSmsFail?: boolean; sendSms?: boolean; actionLabel?: string }
  ) => { ok: boolean; error?: string };
  smsLogs: SmsLogEntry[];
  retrySms: (smsId: string, simulateFail?: boolean) => void;

  // Store Orders & Payments
  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  updateOrderFulfillment: (
    orderNumber: string,
    nextStatus: OrderFulfillmentStatus,
    note?: string
  ) => { ok: boolean; error?: string };
  orderPayments: OrderPaymentRecord[];
  addOrderPayment: (payment: Omit<OrderPaymentRecord, 'id' | 'timestamp'>) => void;
  verifyOrderPayment: (paymentId: string, status: 'verified' | 'refund_pending') => void;

  // Prescriptions
  prescriptions: PrescriptionSubmission[];
  addPrescription: (sub: PrescriptionSubmission) => void;
  updatePrescription: (
    referenceId: string,
    updates: Partial<PrescriptionSubmission>
  ) => void;
  convertPrescriptionToOrder: (
    referenceId: string,
    items: { productId: string; quantity: number }[],
    deliveryMethod: 'delivery' | 'pickup',
    paymentMode: 'cod' | 'epayment'
  ) => { ok: boolean; orderNumber?: string; error?: string };

  // Inbox, Comments, Careers, Surveys
  supportMessages: SupportMessageRecord[];
  addSupportMessage: (msg: Omit<SupportMessageRecord, 'id' | 'createdAt' | 'status'>) => string;
  updateSupportMessage: (id: string, updates: Partial<SupportMessageRecord>) => void;
  addStoryComment: (storyId: string, comment: StoryComment) => void;
  moderateStoryComment: (storyId: string, commentId: string, status: 'approved' | 'rejected') => void;
  careerApps: CareerApplicationRecord[];
  addCareerApp: (app: Omit<CareerApplicationRecord, 'id' | 'createdAt' | 'status'>) => void;
  updateCareerAppStatus: (id: string, status: 'new' | 'reviewed') => void;
  surveys: SurveyRecord[];
  addSurvey: (survey: Omit<SurveyRecord, 'id' | 'createdAt'>) => void;

  // Auth, RBAC & Audit Log
  users: DemoUser[];
  setUsers: React.Dispatch<React.SetStateAction<DemoUser[]>>;
  currentUser: DemoUser | null;
  loginAsRole: (roleId: RoleId) => void;
  loginWithUser: (userId: string) => void;
  logoutAdmin: () => void;
  permissionsMatrix: Record<RoleId, Record<PermissionKey, boolean>>;
  toggleRolePermission: (roleId: RoleId, perm: PermissionKey) => void;
  hasPermission: (perm: PermissionKey) => boolean;
  auditLog: AuditLogEntry[];
  recordAudit: (category: string, action: string, target: string) => void;

  // Reset
  resetAllDemoData: () => void;
}

const DataStoreContext = createContext<DataStoreContextValue | null>(null);

const nowStamp = () => {
  const d = new Date();
  return `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 5)}`;
};

export const DataStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteConfigState, setSiteConfigState] = useState<SiteConfig>(initialSiteConfig);
  const [homepageSections, setHomepageSections] = useState<HomepageSectionConfig[]>(homepageSectionsSeed);
  const [homeHero, setHomeHero] = useState<HomeHeroOverride>(initialHomeHero);

  const [departments, setDepartments] = useState<Department[]>(
    departmentsData.map((d, i) => ({ ...d, order: i + 1, status: 'published' }))
  );
  const [doctors, setDoctors] = useState<Doctor[]>(
    doctorsData.map((d) => ({ ...d, status: 'published' }))
  );
  const [services, setServices] = useState<MedicalService[]>(
    servicesData.map((s) => ({ ...s, status: 'published' }))
  );

  const [library, setLibrary] = useState<LibraryItem[]>(
    libraryData.map((l) => ({ ...l, status: 'published' }))
  );
  const [news, setNews] = useState<NewsItem[]>(
    newsData.map((n) => ({ ...n, status: 'published', featuredOnHome: true }))
  );
  const [stories, setStories] = useState<SuccessStory[]>(
    successStoriesData.map((s) => ({ ...s, status: 'published' }))
  );
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(mediaLibrarySeed);

  const [campaigns, setCampaigns] = useState<Campaign[]>(campaignsData);
  const [campaignBookings, setCampaignBookings] = useState<CampaignBookingRecord[]>(campaignBookingsSeed);
  const [campaignCapacityPolicy, setCampaignCapacityPolicy] =
    useState<CampaignCapacityPolicy>('confirmed_only');

  const [storeMainSections, setStoreMainSections] =
    useState<StoreMainSection[]>(storeMainSectionsData);
  const [productCategories, setProductCategories] =
    useState<ProductCategory[]>(productCategoriesData);
  const [products, setProducts] = useState<Product[]>(productsData);
  const [showWholesalePrices, setShowWholesalePrices] = useState(false);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLogEntry[]>(inventoryLogsSeed);

  const [scheduleSettings, setScheduleSettings] =
    useState<ScheduleSettings>(scheduleSettingsSeed);
  const [appointments, setAppointments] = useState<AppointmentSubmission[]>(appointmentsSeed);
  const [smsLogs, setSmsLogs] = useState<SmsLogEntry[]>(smsLogsSeed);

  const [orders, setOrders] = useState<OrderRecord[]>(ordersSeed);
  const [orderPayments, setOrderPayments] = useState<OrderPaymentRecord[]>(orderPaymentsSeed);
  const [prescriptions, setPrescriptions] = useState<PrescriptionSubmission[]>(prescriptionsSeed);

  const [supportMessages, setSupportMessages] =
    useState<SupportMessageRecord[]>(supportMessagesSeed);
  const [careerApps, setCareerApps] = useState<CareerApplicationRecord[]>(careerAppsSeed);
  const [surveys, setSurveys] = useState<SurveyRecord[]>(surveysSeed);

  const [users, setUsers] = useState<DemoUser[]>(demoUsersSeed);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(demoUsersSeed[0]);
  const [permissionsMatrix, setPermissionsMatrix] =
    useState<Record<RoleId, Record<PermissionKey, boolean>>>(defaultPermissionsMatrix);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(auditLogSeed);

  const recordAudit = (category: string, action: string, target: string) => {
    const actorName = currentUser?.name || 'زائر / جلسة معاينة';
    const actorRole = currentUser?.roleLabelAr || 'معاينة';
    setAuditLog((prev) => [
      {
        id: `AUD-${Date.now().toString().slice(-5)}`,
        timestamp: nowStamp(),
        actorName,
        actorRole,
        category,
        action,
        target,
      },
      ...prev,
    ]);
  };

  const loginAsRole = (roleId: RoleId) => {
    const found = users.find((u) => u.roleId === roleId && u.active) || users[0];
    setCurrentUser(found);
    setAuditLog((prev) => [
      {
        id: `AUD-${Date.now().toString().slice(-5)}`,
        timestamp: nowStamp(),
        actorName: found.name,
        actorRole: found.roleLabelAr,
        category: 'الصلاحيات والدخول',
        action: 'تسجيل دخول تجريبي / تبديل الدور',
        target: found.roleLabelAr,
      },
      ...prev,
    ]);
  };

  const loginWithUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) setCurrentUser(found);
  };

  const logoutAdmin = () => {
    recordAudit('الصلاحيات والدخول', 'تسجيل الخروج من الجلسة', currentUser?.name || '');
    setCurrentUser(null);
  };

  const hasPermission = (perm: PermissionKey): boolean => {
    if (!currentUser) return false;
    return !!permissionsMatrix[currentUser.roleId]?.[perm];
  };

  const toggleRolePermission = (roleId: RoleId, perm: PermissionKey) => {
    setPermissionsMatrix((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [perm]: !prev[roleId][perm],
      },
    }));
    recordAudit('الصلاحيات', `تعديل صلاحية (${perm})`, roleId);
  };

  // Campaign capacity calculation based on policy
  const getCampaignBookedCount = (campaignId: string): number => {
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return 0;
    const baseSeedOffset = Math.max(
      0,
      camp.bookedCount -
        campaignBookingsSeed.filter((b) => b.campaignId === campaignId).length
    );
    const matchingBookings = campaignBookings.filter((b) => {
      if (b.campaignId !== campaignId) return false;
      if (b.status === 'cancelled') return false;
      if (campaignCapacityPolicy === 'confirmed_only') {
        return b.status === 'confirmed';
      }
      return b.status === 'confirmed' || b.status === 'pending';
    });
    return Math.min(camp.totalCapacity, baseSeedOffset + matchingBookings.length);
  };

  const getCampaignEffectiveStatus = (camp: Campaign): CampaignStatus => {
    if (camp.status === 'scheduled' || camp.status === 'ended') return camp.status;
    const booked = getCampaignBookedCount(camp.id);
    if (booked >= camp.totalCapacity) return 'full';
    return 'open';
  };

  const addCampaignBooking = (
    record: Omit<CampaignBookingRecord, 'status'> & { status?: 'pending' | 'confirmed' }
  ): { ok: boolean; error?: string } => {
    const camp = campaigns.find((c) => c.id === record.campaignId);
    if (!camp) return { ok: false, error: 'الحملة غير موجودة.' };
    const effective = getCampaignEffectiveStatus(camp);
    if (effective !== 'open') {
      return { ok: false, error: 'الحملة غير متاحة لاستقبال طلبات جديدة حاليًا.' };
    }
    const booked = getCampaignBookedCount(camp.id);
    if (booked >= camp.totalCapacity) {
      return { ok: false, error: 'اكتملت السعة المخصصة لهذه الحملة.' };
    }
    const nextStatus = record.status || 'confirmed';
    setCampaignBookings((prev) => [{ ...record, status: nextStatus }, ...prev]);
    recordAudit('الحملات', 'تسجيل طلب جديد في حملة', record.referenceId);
    return { ok: true };
  };

  const updateCampaignBookingStatus = (
    referenceId: string,
    status: 'pending' | 'confirmed' | 'cancelled'
  ): { ok: boolean; error?: string } => {
    const target = campaignBookings.find((b) => b.referenceId === referenceId);
    if (!target) return { ok: false, error: 'الطلب غير موجود.' };
    const camp = campaigns.find((c) => c.id === target.campaignId);
    if (status === 'confirmed' && camp && target.status !== 'confirmed') {
      const currentBooked = getCampaignBookedCount(camp.id);
      if (currentBooked >= camp.totalCapacity) {
        return { ok: false, error: 'لا يمكن تأكيد الطلب لاكتمال سعة الحملة وفق السياسة الحالية.' };
      }
    }
    setCampaignBookings((prev) =>
      prev.map((b) => (b.referenceId === referenceId ? { ...b, status } : b))
    );
    recordAudit('الحملات', `تغيير حالة طلب الحملة إلى ${status}`, referenceId);
    return { ok: true };
  };

  // Appointments & SMS
  const addAppointment = (app: AppointmentSubmission) => {
    const withLog: AppointmentSubmission = {
      ...app,
      actionLog: app.actionLog || [
        { time: nowStamp(), actor: 'نموذج الحجز العام', action: 'إنشاء طلب موعد جديد' },
      ],
    };
    setAppointments((prev) => [withLog, ...prev]);
    recordAudit('الحجوزات', 'استلام طلب موعد من الموقع العام', app.referenceId);
  };

  const updateAppointment = (
    referenceId: string,
    updates: Partial<AppointmentSubmission>,
    options?: { simulateSmsFail?: boolean; sendSms?: boolean; actionLabel?: string }
  ): { ok: boolean; error?: string } => {
    const current = appointments.find((a) => a.referenceId === referenceId);
    if (!current) return { ok: false, error: 'الحجز غير موجود.' };

    const targetStatus: AppointmentStatus = updates.status || current.status;
    const targetDay = updates.preferredDay || current.preferredDay;
    const targetPeriod = updates.preferredPeriod || current.preferredPeriod;
    const targetDept: DepartmentId = updates.departmentId || current.departmentId;

    if (targetStatus === 'confirmed' || updates.preferredDay || updates.preferredPeriod) {
      if (scheduleSettings.closedDates.includes(targetDay)) {
        return {
          ok: false,
          error: `التاريخ (${targetDay}) مغلق/إجازة في إعدادات الدوام التجريبية.`,
        };
      }
      if (targetStatus === 'confirmed') {
        const deptCap =
          scheduleSettings.departmentCapacities[targetDept] || scheduleSettings.slotCapacityPerPeriod;
        const confirmedInSlot = appointments.filter(
          (a) =>
            a.referenceId !== referenceId &&
            a.departmentId === targetDept &&
            a.preferredDay === targetDay &&
            a.preferredPeriod === targetPeriod &&
            (a.status === 'confirmed' || a.status === 'attended')
        ).length;

        if (confirmedInSlot >= deptCap) {
          return {
            ok: false,
            error: `اكتملت سعة الفترة المحددة (${confirmedInSlot}/${deptCap}) لهذا القسم في يوم ${targetDay}.`,
          };
        }
      }
    }

    const actor = currentUser?.name || 'موظف الاستقبال';
    const srv = services.find((s) => s.id === (updates.serviceId || current.serviceId));
    const confirmedDateTime =
      updates.confirmedDateTime ||
      current.confirmedDateTime ||
      `${targetDay} · ${targetPeriod}`;

    let smsText = updates.simulatedSmsText || current.simulatedSmsText;
    let smsFollowUpRequired = current.smsFollowUpRequired;

    if (options?.sendSms) {
      smsText = scheduleSettings.smsTemplateConfirmedAr
        .replace('{name}', current.patientName)
        .replace('{service}', srv?.title || '')
        .replace('{date}', targetDay)
        .replace('{time}', confirmedDateTime)
        .replace('{ref}', current.referenceId);

      const smsStatus = options.simulateSmsFail ? 'failed' : 'sent';
      smsFollowUpRequired = !!options.simulateSmsFail;

      setSmsLogs((prev) => [
        {
          id: `SMS-${Date.now().toString().slice(-4)}`,
          referenceId: current.referenceId,
          phone: current.phone,
          message: smsText!,
          timestamp: nowStamp(),
          status: smsStatus,
          attempts: 1,
        },
        ...prev,
      ]);
    }

    setAppointments((prev) =>
      prev.map((a) =>
        a.referenceId === referenceId
          ? {
              ...a,
              ...updates,
              confirmedDateTime,
              simulatedSmsText: smsText,
              smsFollowUpRequired,
              actionLog: [
                ...(a.actionLog || []),
                {
                  time: nowStamp(),
                  actor,
                  action: options?.actionLabel || `تحديث الحالة إلى ${targetStatus}`,
                  note: updates.internalNote,
                },
              ],
            }
          : a
      )
    );

    recordAudit('الحجوزات', options?.actionLabel || `تحديث الحجز (${targetStatus})`, referenceId);
    return { ok: true };
  };

  const retrySms = (smsId: string, simulateFail = false) => {
    const entry = smsLogs.find((s) => s.id === smsId);
    if (!entry) return;
    const nextStatus = simulateFail ? 'failed' : 'sent';
    setSmsLogs((prev) =>
      prev.map((s) =>
        s.id === smsId
          ? { ...s, status: nextStatus, attempts: s.attempts + 1, timestamp: nowStamp() }
          : s
      )
    );
    if (!simulateFail) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.referenceId === entry.referenceId ? { ...a, smsFollowUpRequired: false } : a
        )
      );
    }
    recordAudit(
      'رسائل SMS',
      simulateFail ? 'إعادة محاولة إرسال (تعذر)' : 'إعادة محاولة إرسال (تم بنجاح)',
      entry.referenceId
    );
  };

  // Inventory & Orders
  const adjustInventory = (productId: string, delta: number, reason: string) => {
    const prd = products.find((p) => p.id === productId);
    if (!prd) return;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const nextQty = Math.max(0, p.stockQty + delta);
        return {
          ...p,
          stockQty: nextQty,
          inStock: nextQty - (p.reservedQty || 0) > 0,
        };
      })
    );
    setInventoryLogs((prev) => [
      {
        id: `INV-${Date.now().toString().slice(-5)}`,
        productId,
        productName: prd.name,
        delta,
        reason,
        actorName: currentUser?.name || 'مسؤول المتجر',
        timestamp: nowStamp(),
      },
      ...prev,
    ]);
    recordAudit('المخزون', `تعديل كمية (${delta > 0 ? '+' : ''}${delta}): ${reason}`, prd.name);
  };

  const addOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    if (order.paymentMode === 'epayment') {
      setOrderPayments((prev) => [
        {
          id: `PAY-${Date.now().toString().slice(-4)}`,
          orderNumber: order.orderNumber,
          methodLabel: order.paymentNetwork || 'دفع إلكتروني تجريبي',
          methodType: 'epayment',
          amountYER: order.total,
          reference: `TRN-${Math.floor(10000 + Math.random() * 90000)}`,
          timestamp: nowStamp(),
          reviewStatus: 'pending',
          reviewerName: 'بانتظار المراجعة',
        },
        ...prev,
      ]);
    } else if (order.paymentMode === 'split' && order.splitDetails) {
      setOrderPayments((prev) => [
        {
          id: `PAY-${Date.now().toString().slice(-4)}-A`,
          orderNumber: order.orderNumber,
          methodLabel: order.splitDetails!.method1,
          methodType: 'cod',
          amountYER: order.splitDetails!.amount1,
          reference: `SPL1-${order.orderNumber}`,
          timestamp: nowStamp(),
          reviewStatus: 'pending',
          reviewerName: 'بانتظار المراجعة',
        },
        {
          id: `PAY-${Date.now().toString().slice(-4)}-B`,
          orderNumber: order.orderNumber,
          methodLabel: order.splitDetails!.method2,
          methodType: 'epayment',
          amountYER: order.splitDetails!.amount2,
          reference: `SPL2-${order.orderNumber}`,
          timestamp: nowStamp(),
          reviewStatus: 'pending',
          reviewerName: 'بانتظار المراجعة',
        },
        ...prev,
      ]);
    }
    recordAudit('الطلبات', 'استلام طلب جديد من المتجر', order.orderNumber);
  };

  const updateOrderFulfillment = (
    orderNumber: string,
    nextStatus: OrderFulfillmentStatus,
    note?: string
  ): { ok: boolean; error?: string } => {
    const order = orders.find((o) => o.orderNumber === orderNumber);
    if (!order) return { ok: false, error: 'الطلب غير موجود.' };
    if (order.fulfillmentStatus === nextStatus) return { ok: true };

    const actor = currentUser?.name || 'مسؤول المتجر';

    // Confirming or moving to preparing from pending -> reserve stock if not reserved yet
    if (
      (nextStatus === 'confirmed' ||
        nextStatus === 'preparing' ||
        nextStatus === 'ready_for_delivery') &&
      !order.stockReserved &&
      order.fulfillmentStatus !== 'delivered' &&
      order.fulfillmentStatus !== 'cancelled'
    ) {
      for (const item of order.items) {
        const prd = products.find((p) => p.id === item.productId);
        if (prd) {
          const available = prd.stockQty - (prd.reservedQty || 0);
          if (available < item.quantity) {
            return {
              ok: false,
              error: `الكمية المتاحة من (${prd.name}) لا تكفي للحجز (${available} متاح).`,
            };
          }
        }
      }
      setProducts((prev) =>
        prev.map((p) => {
          const matched = order.items.find((i) => i.productId === p.id);
          if (!matched) return p;
          const nextReserved = (p.reservedQty || 0) + matched.quantity;
          return {
            ...p,
            reservedQty: nextReserved,
            inStock: p.stockQty - nextReserved > 0,
          };
        })
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === orderNumber
            ? {
                ...o,
                fulfillmentStatus: nextStatus,
                stockReserved: true,
                actionLog: [
                  ...(o.actionLog || []),
                  { time: nowStamp(), actor, action: `تحديث الحالة إلى ${nextStatus} وحجز الكمية`, note },
                ],
              }
            : o
        )
      );
      recordAudit('الطلبات', `تحديث حالة الطلب (${nextStatus}) وحجز المخزون`, orderNumber);
      return { ok: true };
    }

    // Delivering order -> deduct actual stock & release reservation
    if (nextStatus === 'delivered' && order.fulfillmentStatus !== 'delivered') {
      setProducts((prev) =>
        prev.map((p) => {
          const matched = order.items.find((i) => i.productId === p.id);
          if (!matched) return p;
          const nextActual = Math.max(0, p.stockQty - matched.quantity);
          const nextReserved = order.stockReserved
            ? Math.max(0, (p.reservedQty || 0) - matched.quantity)
            : p.reservedQty || 0;
          return {
            ...p,
            stockQty: nextActual,
            reservedQty: nextReserved,
            inStock: nextActual - nextReserved > 0,
          };
        })
      );
      order.items.forEach((item) => {
        setInventoryLogs((prev) => [
          {
            id: `INV-${Date.now().toString().slice(-4)}-${item.productId.slice(-2)}`,
            productId: item.productId,
            productName: item.name,
            delta: -item.quantity,
            reason: `تسليم الطلب ${orderNumber}`,
            actorName: actor,
            timestamp: nowStamp(),
          },
          ...prev,
        ]);
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === orderNumber
            ? {
                ...o,
                fulfillmentStatus: 'delivered',
                stockReserved: false,
                actionLog: [
                  ...(o.actionLog || []),
                  { time: nowStamp(), actor, action: 'تسليم الطلب وخصم المخزون الفعلي', note },
                ],
              }
            : o
        )
      );
      recordAudit('الطلبات', 'تسليم الطلب وتحديث المخزون الفعلي', orderNumber);
      return { ok: true };
    }

    // Cancelling order -> release reserved stock & flag verified payments for refund follow-up
    if (nextStatus === 'cancelled' && order.fulfillmentStatus !== 'cancelled') {
      if (order.stockReserved) {
        setProducts((prev) =>
          prev.map((p) => {
            const matched = order.items.find((i) => i.productId === p.id);
            if (!matched) return p;
            const nextReserved = Math.max(0, (p.reservedQty || 0) - matched.quantity);
            return {
              ...p,
              reservedQty: nextReserved,
              inStock: p.stockQty - nextReserved > 0,
            };
          })
        );
      }

      const hasVerifiedPayment = orderPayments.some(
        (p) => p.orderNumber === orderNumber && p.reviewStatus === 'verified'
      );

      if (hasVerifiedPayment) {
        setOrderPayments((prev) =>
          prev.map((p) =>
            p.orderNumber === orderNumber && p.reviewStatus === 'verified'
              ? { ...p, reviewStatus: 'refund_pending' }
              : p
          )
        );
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === orderNumber
            ? {
                ...o,
                fulfillmentStatus: 'cancelled',
                stockReserved: false,
                refundFollowUpRequired: hasVerifiedPayment,
                actionLog: [
                  ...(o.actionLog || []),
                  {
                    time: nowStamp(),
                    actor,
                    action: hasVerifiedPayment
                      ? 'إلغاء الطلب وتحرير المحجوز مع متابعة استرداد المبلغ المثبت'
                      : 'إلغاء الطلب وتحرير الكمية المحجوزة',
                    note,
                  },
                ],
              }
            : o
        )
      );
      recordAudit('الطلبات', 'إلغاء الطلب وتحرير الكميات', orderNumber);
      return { ok: true };
    }

    // Any other valid status transition
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNumber === orderNumber
          ? {
              ...o,
              fulfillmentStatus: nextStatus,
              actionLog: [
                ...(o.actionLog || []),
                { time: nowStamp(), actor, action: `تغيير الحالة إلى ${nextStatus}`, note },
              ],
            }
          : o
      )
    );
    recordAudit('الطلبات', `تغيير حالة الطلب إلى ${nextStatus}`, orderNumber);
    return { ok: true };
  };

  const addOrderPayment = (payment: Omit<OrderPaymentRecord, 'id' | 'timestamp'>) => {
    const id = `PAY-${Date.now().toString().slice(-4)}`;
    setOrderPayments((prev) => [
      { ...payment, id, timestamp: nowStamp() },
      ...prev,
    ]);
    recordAudit('التحصيل', `تسجيل دفعة (${payment.amountYER} ر.ي)`, payment.orderNumber);
  };

  const verifyOrderPayment = (paymentId: string, status: 'verified' | 'refund_pending') => {
    const pay = orderPayments.find((p) => p.id === paymentId);
    setOrderPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? { ...p, reviewStatus: status, reviewerName: currentUser?.name || 'مسؤول المتجر' }
          : p
      )
    );
    if (pay) recordAudit('التحصيل', `تحديث حالة التحصيل إلى ${status}`, pay.orderNumber);
  };

  // Prescriptions
  const addPrescription = (sub: PrescriptionSubmission) => {
    setPrescriptions((prev) => [sub, ...prev]);
    recordAudit('الوصفات', 'استلام وصفة طبية جديدة من الموقع', sub.referenceId);
  };

  const updatePrescription = (
    referenceId: string,
    updates: Partial<PrescriptionSubmission>
  ) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.referenceId === referenceId ? { ...rx, ...updates } : rx))
    );
    recordAudit('الوصفات', `تحديث حالة الوصفة (${updates.status || 'ملاحظة'})`, referenceId);
  };

  const convertPrescriptionToOrder = (
    referenceId: string,
    items: { productId: string; quantity: number }[],
    deliveryMethod: 'delivery' | 'pickup',
    paymentMode: 'cod' | 'epayment'
  ): { ok: boolean; orderNumber?: string; error?: string } => {
    const rx = prescriptions.find((r) => r.referenceId === referenceId);
    if (!rx) return { ok: false, error: 'الوصفة غير موجودة.' };
    if (items.length === 0) return { ok: false, error: 'اختر منتجًا واحدًا على الأقل.' };

    const orderItems = items
      .map((entry) => {
        const p = products.find((x) => x.id === entry.productId);
        if (!p) return null;
        return {
          productId: p.id,
          name: p.name,
          unit: p.unit,
          quantity: entry.quantity,
          unitPrice: p.priceYER,
          categoryId: p.categoryId,
          mainSectionId: p.mainSectionId,
          supplier: p.supplier,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const subtotal = orderItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
    const deliveryFee =
      deliveryMethod === 'pickup' || subtotal >= siteConfigState.payment.freeDeliveryThresholdYER
        ? 0
        : siteConfigState.payment.deliveryFeeYER;
    const total = subtotal + deliveryFee;
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: OrderRecord = {
      orderNumber,
      createdAt: nowStamp(),
      customerName: rx.patientName,
      phone: rx.phone,
      deliveryMethod,
      notes: `طلب محول من الوصفة ${rx.referenceId}${rx.pharmacistNote ? ` — ${rx.pharmacistNote}` : ''}`,
      paymentMode,
      items: orderItems,
      subtotal,
      deliveryFee,
      paymentFee: 0,
      total,
      fulfillmentStatus: 'confirmed',
      stockReserved: true,
      linkedPrescriptionRef: rx.referenceId,
      actionLog: [
        {
          time: nowStamp(),
          actor: currentUser?.name || 'الصيدلي المختص',
          action: `إنشاء طلب متجر من الوصفة ${rx.referenceId} وحجز الكميات`,
        },
      ],
    };

    // Reserve stock
    setProducts((prev) =>
      prev.map((p) => {
        const matched = orderItems.find((i) => i.productId === p.id);
        if (!matched) return p;
        const nextReserved = (p.reservedQty || 0) + matched.quantity;
        return {
          ...p,
          reservedQty: nextReserved,
          inStock: p.stockQty - nextReserved > 0,
        };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setPrescriptions((prev) =>
      prev.map((r) =>
        r.referenceId === referenceId
          ? { ...r, status: 'converted_to_order', linkedOrderNumber: orderNumber, quotedItems: items }
          : r
      )
    );
    recordAudit('الوصفات', `تحويل الوصفة إلى الطلب ${orderNumber}`, referenceId);
    return { ok: true, orderNumber };
  };

  // Inbox & Comments
  const addSupportMessage = (
    msg: Omit<SupportMessageRecord, 'id' | 'createdAt' | 'status'>
  ): string => {
    const id = `MSG-${Math.floor(1000 + Math.random() * 9000)}`;
    setSupportMessages((prev) => [
      { ...msg, id, createdAt: nowStamp(), status: 'new' },
      ...prev,
    ]);
    recordAudit('الرسائل', `استلام ${msg.typeLabel} من الموقع العام`, id);
    return id;
  };

  const updateSupportMessage = (id: string, updates: Partial<SupportMessageRecord>) => {
    setSupportMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    recordAudit('الرسائل', `تحديث متابعة رسالة (${updates.status || 'ملاحظة'})`, id);
  };

  const addStoryComment = (storyId: string, comment: StoryComment) => {
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId ? { ...s, comments: [comment, ...s.comments] } : s
      )
    );
    recordAudit('التعليقات', 'استلام تعليق جديد للمراجعة', storyId);
  };

  const moderateStoryComment = (
    storyId: string,
    commentId: string,
    status: 'approved' | 'rejected'
  ) => {
    setStories((prev) =>
      prev.map((s) =>
        s.id === storyId
          ? {
              ...s,
              comments: s.comments.map((c) => (c.id === commentId ? { ...c, status } : c)),
            }
          : s
      )
    );
    recordAudit('التعليقات', status === 'approved' ? 'اعتماد تعليق للنشر' : 'رفض/أرشفة تعليق', commentId);
  };

  const addCareerApp = (app: Omit<CareerApplicationRecord, 'id' | 'createdAt' | 'status'>) => {
    const id = `CAR-${Math.floor(100 + Math.random() * 900)}`;
    setCareerApps((prev) => [{ ...app, id, createdAt: nowStamp(), status: 'new' }, ...prev]);
    recordAudit('التوظيف', 'تسجيل طلب اهتمام وظيفي عام', app.name);
  };

  const updateCareerAppStatus = (id: string, status: 'new' | 'reviewed') => {
    setCareerApps((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const addSurvey = (survey: Omit<SurveyRecord, 'id' | 'createdAt'>) => {
    const id = `SRV-${Math.floor(100 + Math.random() * 900)}`;
    setSurveys((prev) => [{ ...survey, id, createdAt: nowStamp() }, ...prev]);
  };

  const resetAllDemoData = () => {
    setSiteConfigState(initialSiteConfig);
    setHomepageSections(homepageSectionsSeed);
    setHomeHero(initialHomeHero);
    setDepartments(departmentsData.map((d, i) => ({ ...d, order: i + 1, status: 'published' })));
    setDoctors(doctorsData.map((d) => ({ ...d, status: 'published' })));
    setServices(servicesData.map((s) => ({ ...s, status: 'published' })));
    setLibrary(libraryData.map((l) => ({ ...l, status: 'published' })));
    setNews(newsData.map((n) => ({ ...n, status: 'published', featuredOnHome: true })));
    setStories(successStoriesData.map((s) => ({ ...s, status: 'published' })));
    setMediaAssets(mediaLibrarySeed);
    setCampaigns(campaignsData);
    setCampaignBookings(campaignBookingsSeed);
    setCampaignCapacityPolicy('confirmed_only');
    setStoreMainSections(storeMainSectionsData);
    setProductCategories(productCategoriesData);
    setProducts(productsData);
    setShowWholesalePrices(false);
    setInventoryLogs(inventoryLogsSeed);
    setScheduleSettings(scheduleSettingsSeed);
    setAppointments(appointmentsSeed);
    setSmsLogs(smsLogsSeed);
    setOrders(ordersSeed);
    setOrderPayments(orderPaymentsSeed);
    setPrescriptions(prescriptionsSeed);
    setSupportMessages(supportMessagesSeed);
    setCareerApps(careerAppsSeed);
    setSurveys(surveysSeed);
    setUsers(demoUsersSeed);
    setPermissionsMatrix(defaultPermissionsMatrix);
    setAuditLog([
      {
        id: 'AUD-RESET',
        timestamp: nowStamp(),
        actorName: currentUser?.name || 'النظام',
        actorRole: currentUser?.roleLabelAr || 'إدارة',
        category: 'الإعدادات',
        action: 'إعادة ضبط كافة بيانات المعاينة للوضع الافتراضي',
        target: 'النظام بالكامل',
      },
    ]);
  };

  return (
    <DataStoreContext.Provider
      value={{
        siteConfigState,
        setSiteConfigState,
        homepageSections,
        setHomepageSections,
        homeHero,
        setHomeHero,
        departments,
        setDepartments,
        doctors,
        setDoctors,
        services,
        setServices,
        library,
        setLibrary,
        news,
        setNews,
        stories,
        setStories,
        mediaAssets,
        setMediaAssets,
        campaigns,
        setCampaigns,
        campaignBookings,
        campaignCapacityPolicy,
        setCampaignCapacityPolicy,
        getCampaignBookedCount,
        getCampaignEffectiveStatus,
        addCampaignBooking,
        updateCampaignBookingStatus,
        storeMainSections,
        setStoreMainSections,
        productCategories,
        setProductCategories,
        products,
        setProducts,
        showWholesalePrices,
        setShowWholesalePrices,
        inventoryLogs,
        adjustInventory,
        scheduleSettings,
        setScheduleSettings,
        appointments,
        addAppointment,
        updateAppointment,
        smsLogs,
        retrySms,
        orders,
        addOrder,
        updateOrderFulfillment,
        orderPayments,
        addOrderPayment,
        verifyOrderPayment,
        prescriptions,
        addPrescription,
        updatePrescription,
        convertPrescriptionToOrder,
        supportMessages,
        addSupportMessage,
        updateSupportMessage,
        addStoryComment,
        moderateStoryComment,
        careerApps,
        addCareerApp,
        updateCareerAppStatus,
        surveys,
        addSurvey,
        users,
        setUsers,
        currentUser,
        loginAsRole,
        loginWithUser,
        logoutAdmin,
        permissionsMatrix,
        toggleRolePermission,
        hasPermission,
        auditLog,
        recordAudit,
        resetAllDemoData,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  );
};

export const useDataStore = () => {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error('useDataStore must be used within DataStoreProvider');
  return ctx;
};
