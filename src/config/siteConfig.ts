export interface SiteConfig {
  brand: {
    nameAr: string;
    nameEn: string;
    tagline: string;
    shortAbout: string;
    vision: string;
    mission: string;
    logoUrl: string | null; // Replace with official logo URL when approved
    prototypeNotice: string;
    heroImage: string;
    clinicGallery: { url: string; caption: string }[];
  };
  theme: {
    petrolPrimary: string;
    petrolDark: string;
    skyAccent: string;
    canvasBg: string;
    note: string;
  };
  contact: {
    city: string;
    address: string;
    landmark: string;
    phones: { label: string; value: string; isDemoPlaceholder?: boolean }[];
    whatsappDisplay: string;
    whatsappUrl: string | null; // null shows prototype informational popover instead of dead external link
    email: string;
    workingDays: string;
    workingPeriods: { label: string; time: string }[];
    directionsUrl: string | null;
    directionsNote: string;
  };
  currency: {
    code: string;
    symbolAr: string;
    exchangeRatesFromYER: Record<string, { label: string; symbol: string; rate: number }>;
  };
  payment: {
    codLabel: string;
    codFeeYER: number;
    deliveryFeeYER: number;
    freeDeliveryThresholdYER: number;
    ePaymentLabel: string;
    ePaymentFeeYER: number;
    ePaymentNetworks: { id: string; name: string; accountHint: string }[];
    collectionNote: string;
  };
  bookingRules: {
    visitTypes: string[];
    periods: string[];
    unavailableDatesDemo: string[]; // Dates simulated as unavailable for prototype testing
    capacityPolicyNote: string;
  };
  prescriptionRules: {
    allowedExtensions: string[];
    maxFileSizeMB: number;
    helperText: string;
  };
  reviewsPolicy: {
    moderationNotice: string;
    allowPublicRating: boolean;
  };
  features: {
    showCareersPage: boolean;
    allowGeneralCareerInterest: boolean;
    showSurveyPage: boolean;
    showDualPaymentPreview: boolean;
    showFloatingContactButton: boolean;
  };
}

export const siteConfig: SiteConfig = {
  brand: {
    nameAr: 'نوديسك كلينك',
    nameEn: 'NODISC Clinic',
    tagline: 'مركز تخصصي متكامل لجراحة المخ والأعصاب وعلاج الألم والتأهيل والصيدلية',
    shortAbout:
      'منظومة طبية متخصصة تجمع التقييم الجراحي الدقيق، وعلاج الألم التداخلي، وبرامج التأهيل والعلاج الطبيعي، والصيدلية الطبية تحت سقف واحد.',
    vision:
      'تقديم رعاية تخصصية موثوقة لمشكلات العمود الفقري والأعصاب والألم المزمن وفق مسار علاجي متكامل يبدأ بالتشخيص الدقيق وينتهي بالتأهيل.',
    mission:
      'تنسيق الجهود بين جراحة المخ والأعصاب وعلاج الألم والعلاج الطبيعي والصيدلية لتوفير تجربة علاجية واضحة وآمنة للمريض.',
    logoUrl: null, // ضع مسار الشعار الرسمي هنا عند اعتماده
    prototypeNotice:
      'نموذج تصوري تفاعلي ببيانات تجريبية قابلة للاستبدال — جميع الطلبات والمدفوعات ورسائل SMS والتعليقات محاكاة محلية.',
    heroImage: '/src/assets/images/hero_nodisc_clinic_1795286630066.jpg',
    clinicGallery: [
      {
        url: '/src/assets/images/hero_nodisc_clinic_1795286630066.jpg',
        caption: 'الاستقبال الرئيسي وصالة انتظار المراجعين (صورة تصورية)',
      },
      {
        url: '/src/assets/images/dept_neurosurgery_suite_1795286629702.jpg',
        caption: 'عيادة استشارات جراحة المخ والأعصاب والعمود الفقري',
      },
      {
        url: '/src/assets/images/dept_rehab_gym_1795286629619.jpg',
        caption: 'وحدة التأهيل الحركي والعلاج الطبيعي',
      },
      {
        url: '/src/assets/images/dept_pharmacy_counter_1795286630165.jpg',
        caption: 'الصيدلية الطبية ومنفذ صرف الوصفات',
      },
    ],
  },
  theme: {
    petrolPrimary: '#0F4C5C',
    petrolDark: '#093542',
    skyAccent: '#0284C7',
    canvasBg: '#F8FAFC',
    note: 'لوحة ألوان مبدئية (أزرق بترولي وسماوي) قابلة للتعديل بعد اعتماد الشعار النهائي.',
  },
  contact: {
    city: 'صنعاء (عنوان تجريبي قابل للاستبدال)',
    address: 'شارع الستين الجنوبي — مبنى المركز الطبي التخصصي (موقع تجريبي للمعاينة)',
    landmark: 'جوار التقاطع الرئيسي — تتوفر مواقف للمراجعين',
    phones: [
      { label: 'الاستقبال والمواعيد', value: '+967 1 000 100', isDemoPlaceholder: true },
      { label: 'قسم الصيدلية والطلبات', value: '+967 1 000 200', isDemoPlaceholder: true },
    ],
    whatsappDisplay: '+967 770 000 000 (رقم تجريبي)',
    whatsappUrl: null,
    email: 'info@nodisc-clinic.example',
    workingDays: 'السبت إلى الخميس',
    workingPeriods: [
      { label: 'الفترة الصباحية', time: '09:00 صباحًا – 01:30 ظهرًا' },
      { label: 'الفترة المسائية', time: '04:00 عصرًا – 08:30 مساءً' },
    ],
    directionsUrl: null,
    directionsNote: 'سيتم ربط رابط خرائط Google المعتمد عند تزويدنا بالإحداثيات النهائية من المركز.',
  },
  currency: {
    code: 'YER',
    symbolAr: 'ر.ي',
    exchangeRatesFromYER: {
      YER: { label: 'ريال يمني (افتراضي)', symbol: 'ر.ي', rate: 1 },
      SAR: { label: 'ريال سعودي (معاينة)', symbol: 'ر.س', rate: 0.007 },
      USD: { label: 'دولار أمريكي (معاينة)', symbol: '$', rate: 0.00188 },
    },
  },
  payment: {
    codLabel: 'نقدًا عند التسليم',
    codFeeYER: 0,
    deliveryFeeYER: 1500,
    freeDeliveryThresholdYER: 35000,
    ePaymentLabel: 'دفع إلكتروني تجريبي',
    ePaymentFeeYER: 0,
    ePaymentNetworks: [
      { id: 'kuraimi', name: 'حوالة / محفظة إلكترونية (اسم شبكة قابل للإعداد)', accountHint: 'حساب تجريبي: 1000-2000-30' },
      { id: 'jawali', name: 'محفظة دفع محلية (اسم شبكة قابل للإعداد)', accountHint: 'رمز تاجر تجريبي: NODISC-01' },
      { id: 'card', name: 'بطاقة بنكية تجريبية', accountHint: 'بوابة دفع إلكتروني قيد الربط' },
    ],
    collectionNote: 'أسماء شبكات الدفع والرسوم وأرقام التحصيل قابلة للاستبدال ببيانات المركز المعتمدة.',
  },
  bookingRules: {
    visitTypes: ['استشارة أولى', 'متابعة حالة', 'مراجعة أشعة وتقارير', 'جلسة علاجية / تقييم'],
    periods: ['الفترة الصباحية (09:00 – 01:30)', 'الفترة المسائية (04:00 – 08:30)'],
    unavailableDatesDemo: ['2026-11-27', '2026-12-04'], // أمثلة لأيام غير متاحة (الجمعة / إجازة تجريبية)
    capacityPolicyNote:
      'تُحتسب السعة المتبقية للحملات تلقائيًا من عدد المقاعد المعتمدة لكل يوم حملة، ويمكن تعديل قاعدة الاحتساب من إعدادات المركز.',
  },
  prescriptionRules: {
    allowedExtensions: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    maxFileSizeMB: 10,
    helperText: 'يُقبل إرفاق صورة واضحة للوصفة (JPG, PNG, WEBP) أو ملف PDF بحد أقصى 10 ميجابايت.',
  },
  reviewsPolicy: {
    moderationNotice:
      'تخضع جميع التعليقات والتقييمات لمراجعة الفريق التحريري قبل النشر لضمان خصوصية المرضى ودقة المحتوى الطبي.',
    allowPublicRating: true,
  },
  features: {
    showCareersPage: true,
    allowGeneralCareerInterest: true,
    showSurveyPage: true,
    showDualPaymentPreview: true,
    showFloatingContactButton: true,
  },
};
