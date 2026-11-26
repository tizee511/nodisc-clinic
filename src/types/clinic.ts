export type DepartmentId = 'neurosurgery' | 'pain' | 'rehabilitation' | 'pharmacy';

export type PublishStatus = 'published' | 'draft' | 'archived';

export interface Department {
  id: DepartmentId;
  slug: string;
  nameAr: string;
  nameEn: string;
  shortDesc: string;
  fullOverview: string;
  scopeItems: string[];
  image: string;
  gallery?: { url: string; caption: string }[];
  equipmentList?: { name: string; purpose: string }[];
  contactNote: string;
  workingHoursNote: string;
  ctaLabel: string;
  isPharmacy?: boolean;
  order?: number;
  status?: PublishStatus;
}

export interface Doctor {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  roleTitle: string;
  departmentId: DepartmentId;
  imageUrl: string | null;
  imagePlaceholderNote: string;
  bio: string;
  qualifications: string[];
  experiences: string[];
  focusAreas: string[];
  serviceIds: string[];
  isFeatured: boolean;
  isProfileEditableNote: string;
  status?: PublishStatus;
}

export interface MedicalService {
  id: string;
  slug: string;
  title: string;
  departmentId: DepartmentId;
  doctorId: string | null;
  teamLabel?: string;
  shortDesc: string;
  details: string[];
  durationNote: string;
  image: string;
  featuredOnHome?: boolean;
  status?: PublishStatus;
  extraNote?: string;
}

export type LibraryCategory = 'condition' | 'article' | 'procedure' | 'video' | 'faq';

export interface LibraryItem {
  id: string;
  slug: string;
  type: LibraryCategory;
  typeLabel: string;
  title: string;
  departmentId: DepartmentId;
  doctorId?: string;
  authorName?: string;
  publishedAt: string;
  readTime?: string;
  summary: string;
  image: string;
  sections?: { heading: string; body: string }[];
  videoDuration?: string;
  videoPreviewNote?: string;
  faqAnswer?: string;
  relatedServiceIds?: string[];
  featuredOnHome?: boolean;
  status?: PublishStatus;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  categoryLabel: string;
  summary: string;
  body: string[];
  image: string;
  departmentId?: DepartmentId;
  status?: PublishStatus;
  featuredOnHome?: boolean;
}

export interface StoryComment {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface SuccessStory {
  id: string;
  slug: string;
  title: string;
  departmentId: DepartmentId;
  doctorId?: string;
  serviceId?: string;
  patientLabel: string;
  date: string;
  summary: string;
  beforeState: string;
  carePath: string;
  outcome: string;
  image: string;
  featuredOnHome?: boolean;
  status?: PublishStatus;
  comments: StoryComment[];
}

export type CampaignStatus = 'open' | 'full' | 'scheduled' | 'ended';
export type CampaignCapacityPolicy = 'confirmed_only' | 'all_active';

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  departmentId: DepartmentId;
  doctorId?: string;
  serviceSummary: string;
  dayLabel: string;
  periodLabel: string;
  locationLabel: string;
  registrationWindow: string;
  freeScopeExplanation: string;
  totalCapacity: number;
  bookedCount: number;
  status: CampaignStatus;
  image: string;
  notes: string[];
  closedMessage?: string;
}

export interface StoreMainSection {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  description: string;
  image?: string;
  order: number;
  visible: boolean;
}

export interface ProductCategory {
  id: string;
  slug: string;
  mainSectionId: string;
  nameAr: string;
  nameEn?: string;
  description: string;
  image: string;
  order: number;
  visible: boolean;
}

export interface Product {
  id: string;
  slug: string;
  barcode?: string;
  name: string;
  mainSectionId: string;
  categoryId: string;
  supplier?: string;
  unit: string;
  priceYER: number;
  originalPriceYER?: number;
  isOnSale?: boolean;
  offerLabelAr?: string;
  offerLabelEn?: string;
  offerExpiresAt?: string;
  offerType?: 'discount' | 'bundle' | 'medical';
  wholesalePriceYER?: number;
  inStock: boolean;
  stockQty: number;
  reservedQty?: number;
  lowStockThreshold?: number;
  shortDesc: string;
  fullDesc: string;
  options?: string[];
  image: string;
  featured?: boolean;
  visible?: boolean;
  requiresNote?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}

export interface InventoryLogEntry {
  id: string;
  productId: string;
  productName: string;
  delta: number;
  reason: string;
  actorName: string;
  timestamp: string;
}

export interface CartItem {
  productId: string;
  selectedOption?: string;
  quantity: number;
}

export type AppointmentStatus =
  | 'pending_review'
  | 'needs_revision'
  | 'confirmed'
  | 'cancelled'
  | 'attended'
  | 'no_show';

export interface AppointmentActionLog {
  time: string;
  actor: string;
  action: string;
  note?: string;
}

export interface AppointmentSubmission {
  referenceId: string;
  departmentId: DepartmentId;
  serviceId: string;
  doctorId: string;
  visitType: string;
  preferredDay: string;
  preferredPeriod: string;
  patientName: string;
  phone: string;
  previousFileNumber?: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  confirmedDateTime?: string;
  simulatedSmsText?: string;
  smsFollowUpRequired?: boolean;
  internalNote?: string;
  actionLog?: AppointmentActionLog[];
}

export interface CampaignBookingRecord {
  referenceId: string;
  campaignId: string;
  patientName: string;
  phone: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export type OrderFulfillmentStatus =
  | 'pending_review'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderPaymentRecord {
  id: string;
  orderNumber: string;
  methodLabel: string;
  methodType: 'cod' | 'epayment';
  amountYER: number;
  reference: string;
  timestamp: string;
  reviewStatus: 'pending' | 'verified' | 'refund_pending';
  reviewerName: string;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  notes?: string;
  paymentMode: 'cod' | 'epayment' | 'split';
  paymentNetwork?: string;
  paymentAccountHint?: string;
  paymentReference?: string;
  paymentSenderName?: string;
  paymentReceiptName?: string;
  splitDetails?: {
    method1: string;
    amount1: number;
    method2: string;
    amount2: number;
  };
  items: {
    productId: string;
    name: string;
    unit: string;
    option?: string;
    quantity: number;
    unitPrice: number;
    categoryId?: string;
    mainSectionId?: string;
    supplier?: string;
  }[];
  subtotal: number;
  discountYER?: number;
  couponCode?: string;
  deliveryFee: number;
  paymentFee: number;
  total: number;
  fulfillmentStatus: OrderFulfillmentStatus;
  stockReserved?: boolean;
  linkedPrescriptionRef?: string;
  refundFollowUpRequired?: boolean;
  actionLog?: AppointmentActionLog[];
}

export type PrescriptionStatus =
  | 'new'
  | 'under_review'
  | 'needs_contact'
  | 'quote_prepared'
  | 'converted_to_order'
  | 'closed';

export interface PrescriptionSubmission {
  referenceId: string;
  patientName: string;
  phone: string;
  notes?: string;
  fileName: string;
  fileSizeLabel: string;
  fileType: string;
  previewUrl?: string;
  createdAt: string;
  status: PrescriptionStatus;
  pharmacistNote?: string;
  quotedItems?: { productId: string; quantity: number }[];
  linkedOrderNumber?: string;
}

export interface SmsLogEntry {
  id: string;
  referenceId: string;
  phone: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
}

export interface SupportMessageRecord {
  id: string;
  type: 'inquiry' | 'complaint' | 'suggestion' | 'quality';
  typeLabel: string;
  senderName: string;
  contactInfo: string;
  message: string;
  createdAt: string;
  status: 'new' | 'in_progress' | 'closed';
  internalNote?: string;
}

export interface CareerApplicationRecord {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  createdAt: string;
  status: 'new' | 'reviewed';
}

export interface SurveyRecord {
  id: string;
  clarityRating: number;
  easeRating: number;
  note: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'document';
  description: string;
  uploadedAt: string;
}

export type RoleId = 'admin' | 'editor' | 'reception' | 'store_manager' | 'reports_viewer';

export type PermissionKey =
  | 'view_overview'
  | 'manage_content'
  | 'publish_content'
  | 'archive_records'
  | 'manage_bookings'
  | 'confirm_bookings'
  | 'manage_campaigns'
  | 'manage_store'
  | 'manage_prices'
  | 'manage_orders'
  | 'manage_prescriptions'
  | 'manage_inbox'
  | 'view_reports'
  | 'manage_users'
  | 'manage_settings';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  roleId: RoleId;
  roleLabelAr: string;
  roleLabelEn: string;
  active: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  category: string;
  action: string;
  target: string;
}

export interface HomepageSectionConfig {
  id:
    | 'hero'
    | 'campaign'
    | 'departments'
    | 'doctor'
    | 'services'
    | 'stories'
    | 'library'
    | 'news'
    | 'faq'
    | 'location';
  labelAr: string;
  labelEn: string;
  visible: boolean;
  order: number;
}

export interface ScheduleSettings {
  slotCapacityPerPeriod: number;
  departmentCapacities: Record<DepartmentId, number>;
  closedDates: string[];
  smsTemplateConfirmedAr: string;
  smsTemplateConfirmedEn: string;
}
