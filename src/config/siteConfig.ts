export interface PaymentNetworkConfig {
  id: string;
  name: string;
  nameEn?: string;
  accountHint: string;
  accountHintEn?: string;
  logoUrl?: string;
  active?: boolean;
}

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
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      youtube?: string;
    };
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
    ePaymentNetworks: PaymentNetworkConfig[];
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
    tagline:
      'الصرح الطبي التخصصي لجراحة المخ والأعصاب والعمود الفقري وعلاج الألم والتأهيل بصنعاء',
    shortAbout:
      'نوديسك كلينك (NODISC Clinic) — صرح طبي تخصصي متكامل لجراحة المخ والأعصاب والعمود الفقري وعلاج الألم والتأهيل الحركي المتقدم والصيدلية السريرية، بإشراف د. محمد عبدالله الجرباني في مركز ابن سيناء الطبي التشخيصي بصنعاء.',
    vision:
      '«رعاية متخصصة تبدأ بالاستماع إلى حالتك وتقييم الفحوصات ومناقشة الخيارات العلاجية المناسبة» — الجمع بين الدقة الجراحية العالية والحرص على تجنب الجراحة متى أمكن العلاج التحفظي والتأهيلي.',
    mission:
      'تنسيق الجهود بين جراحة المخ والأعصاب وعلاج الألم وفق معايير Mayo Clinic والتأهيل الحركي والصيدلية لتوفير تجربة علاجية واضحة وآمنة للمريض.',
    logoUrl: '/src/assets/images/nodisc_full_logo.jpg',
    prototypeNotice:
      'موقع نوديسك كلينك التفاعلي (محاكاة تجريبية للطلبات والمواعيد والدفع داخل الجلسة — مع بيانات العيادة المعتمدة بصنعاء).',
    heroImage: '/src/assets/images/hero_nodisc_clinic_1795286630066.jpg',
    clinicGallery: [
      {
        url: '/src/assets/images/hero_nodisc_clinic_1795286630066.jpg',
        caption: 'الاستقبال الرئيسي في نوديسك كلينك — مركز ابن سيناء الطبي التشخيصي',
      },
      {
        url: '/src/assets/images/dept_neurosurgery_suite_1795286629702.jpg',
        caption: 'عيادة استشارات جراحة المخ والأعصاب والعمود الفقري — د. محمد عبدالله الجرباني',
      },
      {
        url: '/src/assets/images/dept_rehab_gym_1795286629619.jpg',
        caption: 'مركز نوديسك للتأهيل الحركي والشد الرقمي والعلاج الطبيعي',
      },
      {
        url: '/src/assets/images/dept_pharmacy_counter_1795286630165.jpg',
        caption: 'صيدلية ومتجر نوديسك الطبي ومنفذ صرف الوصفات',
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
    city: 'صنعاء — الجمهورية اليمنية',
    address: 'صنعاء – شارع تعز – جولة 45 – فوق صيدلية الفيصل',
    landmark: 'مركز ابن سيناء الطبي التشخيصي (العيادة الاستشارية الرئيسية)',
    phones: [
      { label: 'الهاتف المباشر للعيادة والحجوزات', value: '+967 784545908', isDemoPlaceholder: false },
      { label: 'واتساب نوديسك والمتجر والتأهيل', value: '+967 772070207', isDemoPlaceholder: false },
    ],
    whatsappDisplay: '+967 772070207',
    whatsappUrl: 'https://wa.me/967772070207',
    email: 'info@nodisc-clinic.com',
    workingDays: 'السبت إلى الخميس (تُؤكَّد الأيام والزيارات هاتفياً مسبقاً)',
    workingPeriods: [
      { label: 'الفترة الصباحية', time: '09:00 صباحًا – 02:00 ظهرًا' },
      { label: 'الفترة المسائية', time: '04:00 عصرًا – 09:00 مساءً' },
    ],
    directionsUrl: null,
    directionsNote: 'مركز ابن سيناء الطبي التشخيصي — صنعاء، شارع تعز، جولة 45، فوق صيدلية الفيصل.',
    socialLinks: {
      facebook: 'https://www.facebook.com/profile.php?id=100094729868998',
      instagram: 'https://www.instagram.com/neurospine1j/',
      youtube: 'https://www.youtube.com/channel/UCWkvXXy17cm--SVUqVrJFbg',
    },
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
    ePaymentLabel: 'دفع إلكتروني (محافظ وبنوك محلية)',
    ePaymentFeeYER: 0,
    ePaymentNetworks: [
      {
        id: 'kuraimi',
        name: 'الكريمي حاسب — بنك الكريمي الإسلامي',
        nameEn: 'Al-Kuraimi Hasib — Al-Kuraimi Islamic Bank',
        accountHint: 'حساب رقم: 784545908 (د. محمد عبدالله الجرباني / نوديسك)',
        accountHintEn: 'Account No: 784545908 (Dr. Mohammed Abdullah Al-Jurbani / NODISC)',
        logoUrl: '',
        active: true,
      },
      {
        id: 'jawali',
        name: 'محفظة جوالي — Jawali (كاك بنك)',
        nameEn: 'Jawali Wallet (CAC Bank)',
        accountHint: 'رقم المحفظة: 772070207 (نوديسك كلينك — مبيعات المتجر)',
        accountHintEn: 'Wallet No: 772070207 (NODISC Clinic — Store Sales)',
        logoUrl: '',
        active: true,
      },
      {
        id: 'jeeb',
        name: 'محفظة جيب — Jeeb (بنك التضامن)',
        nameEn: 'Jeeb Wallet (Tadhamon Bank)',
        accountHint: 'رقم المحفظة: 772070207 (نوديسك كلينك — مبيعات المتجر)',
        accountHintEn: 'Wallet No: 772070207 (NODISC Clinic — Store Sales)',
        logoUrl: '',
        active: true,
      },
      {
        id: 'onecash',
        name: 'محفظة ون كاش — OneCash',
        nameEn: 'OneCash Wallet',
        accountHint: 'رقم المحفظة: 772070207 (نوديسك كلينك — مبيعات المتجر)',
        accountHintEn: 'Wallet No: 772070207 (NODISC Clinic — Store Sales)',
        logoUrl: '',
        active: true,
      },
      {
        id: 'flousak',
        name: 'محفظة فلوسك — Flousak (بنك اليمن والكويت)',
        nameEn: 'Flousak Wallet (YKB Bank)',
        accountHint: 'رقم المحفظة: 772070207 (نوديسك كلينك — مبيعات المتجر)',
        accountHintEn: 'Wallet No: 772070207 (NODISC Clinic — Store Sales)',
        logoUrl: '',
        active: true,
      },
    ],
    collectionNote: 'الطلب والتحصيل الإلكتروني عبر هذه المحافظ يعملان بنمط محاكاة محلية داخل المعاينة.',
  },
  bookingRules: {
    visitTypes: ['استشارة أولى', 'متابعة حالة', 'مراجعة أشعة الرنين المغناطيسي', 'جلسة علاج طبيعي / تأهيل'],
    periods: ['الفترة الصباحية (09:00 ص – 02:00 م)', 'الفترة المسائية (04:00 م – 09:00 م)'],
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
