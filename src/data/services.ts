import { MedicalService } from '../types/clinic';

export const servicesData: MedicalService[] = [
  {
    id: 'srv-neuro-consult',
    slug: 'neurosurgery-consultation',
    title: 'استشارة جراحة المخ والأعصاب والعمود الفقري',
    departmentId: 'neurosurgery',
    doctorId: 'dr-mohammed-aljurbani',
    shortDesc: 'فحص سريري دقيق ومراجعة تقارير الرنين المغناطيسي لوضع خطة علاجية واضحة.',
    details: [
      'تقييم شامل للأعراض العصبية والحركية وفحص المنعكسات.',
      'مراجعة صور الأشعة والرنين المغناطيسي وتوضيح الخيارات العلاجية للمراجع.',
      'تحديد مدى الحاجة إلى العلاج التحفظي أو التأهيل أو التدخل الجراحي.',
    ],
    durationNote: 'مدة الاستشارة التقديرية: 25 – 35 دقيقة',
    image: '/src/assets/images/dept_neurosurgery_suite_1795286629702.jpg',
    featuredOnHome: true,
  },
  {
    id: 'srv-microdiscectomy',
    slug: 'microscopic-disc-evaluation',
    title: 'تقييم جراحة الانزلاق الغضروفي المجهرية',
    departmentId: 'neurosurgery',
    doctorId: 'dr-mohammed-aljurbani',
    shortDesc: 'استشارة تحضيرية وتقييم للتدخل المجهري محدود التوغل لتحرير جذور الأعصاب.',
    details: [
      'مراجعة مؤشرات الجراحة المجهرية في حالات الضغط العصبي المستمر.',
      'شرح خطوات الإجراء وفترة النقاهة المتوقعة وخطة التأهيل اللاحقة.',
      'تنسيق الفحوصات اللازمة قبل الإجراء الجراحي.',
    ],
    durationNote: 'تقييم تخصصي بموعد محدد',
    image: '/src/assets/images/dept_neurosurgery_suite_1795286629702.jpg',
    featuredOnHome: true,
  },
  {
    id: 'srv-spine-mri-review',
    slug: 'spine-imaging-second-opinion',
    title: 'مراجعة أشعة العمود الفقري والرأي الطبي',
    departmentId: 'neurosurgery',
    doctorId: 'dr-mohammed-aljurbani',
    shortDesc: 'قراءة تفصيلية لأشعة الرنين والمقطعية للرقبة والظهر مع تقرير توصية متكامل.',
    details: [
      'مقارنة صور الرنين المغناطيسي السابقة والحالية لتقييم تطور الحالة.',
      'توجيه المريض نحو المسار الأنسب بين الجراحة أو علاج الألم أو العلاج الطبيعي.',
    ],
    durationNote: '20 – 30 دقيقة',
    image: '/src/assets/images/hero_nodisc_clinic_1795286630066.jpg',
  },
  {
    id: 'srv-pain-eval',
    slug: 'chronic-pain-assessment',
    title: 'تقييم الألم المزمن ووضع الخطة التداخلية',
    departmentId: 'pain',
    doctorId: 'team-pain-unit',
    teamLabel: 'فريق عيادة علاج الألم',
    shortDesc: 'دراسة شاملة لمصدر الألم العصبي أو العضلي وتحديد التدخل غير الجراحي الأنسب.',
    details: [
      'تصنيف نوع الألم (عصبي، مفصلي، عضلي) ومراجعة الأدوية السابقة.',
      'اقتراح بروتوكول علاجي متدرج يقلل الاعتماد على المسكنات الفموية.',
    ],
    durationNote: '30 دقيقة',
    image: '/src/assets/images/dept_pain_clinic_1795286628900.jpg',
    featuredOnHome: true,
  },
  {
    id: 'srv-nerve-block',
    slug: 'targeted-nerve-root-intervention',
    title: 'التدخلات الموجهة لتخفيف آلام جذور الأعصاب',
    departmentId: 'pain',
    doctorId: 'team-pain-unit',
    teamLabel: 'فريق عيادة علاج الألم',
    shortDesc: 'إجراءات دقيقة موجهة لتخفيف التهاب العصب وتسكين آلام الظهر والرقبة دون جراحة.',
    details: [
      'حقن علاجي موضعي موجه لتخفيف التورم والالتهاب حول جذر العصب.',
      'إجراء نهاري لا يتطلب مبيتًا، مع متابعة سريرية لاحقة وربط ببرنامج التأهيل.',
    ],
    durationNote: 'إجراء عيادي نهاري (تحت الإشراف الطبي)',
    image: '/src/assets/images/dept_pain_clinic_1795286628900.jpg',
  },
  {
    id: 'srv-rehab-spine',
    slug: 'spinal-physiotherapy-program',
    title: 'برنامج العلاج الطبيعي لآلام الظهر والرقبة',
    departmentId: 'rehabilitation',
    doctorId: 'team-rehab-unit',
    teamLabel: 'فريق التأهيل والعلاج الطبيعي',
    shortDesc: 'جلسات علاج يدوي وتمارين موجهة وأجهزة تسكين لتقليل الضغط عن الفقرات.',
    details: [
      'جلسة تقييم أولية للمرونة ونطاق الحركة وتحديد مواضع الشد العضلي.',
      'مزيج من العلاج اليدوي، والتمارين العلاجية المتدرجة، والتحفيز الكهربائي.',
    ],
    durationNote: '45 – 60 دقيقة للجلسة',
    image: '/src/assets/images/dept_rehab_gym_1795286629619.jpg',
    featuredOnHome: true,
  },
  {
    id: 'srv-rehab-postop',
    slug: 'post-surgery-rehabilitation',
    title: 'التأهيل الحركي بعد جراحات العمود الفقري',
    departmentId: 'rehabilitation',
    doctorId: 'team-rehab-unit',
    teamLabel: 'فريق التأهيل والعلاج الطبيعي',
    shortDesc: 'خطة تعافٍ متدرجة وآمنة بإشراف مشترك لاستعادة الحركة الطبيعية وتجنب الانتكاس.',
    details: [
      'بداية لطيفة لتمارين التنفس والحركة الآمنة وفق توصية الجراح.',
      'تدريب المراجع على أوضاع الجلوس والنوم والرفع السليم لحماية الفقرات.',
    ],
    durationNote: 'برنامج من 6 إلى 12 جلسة حسب التقييم',
    image: '/src/assets/images/dept_rehab_gym_1795286629619.jpg',
  },
  {
    id: 'srv-pharmacy-consult',
    slug: 'clinical-prescription-dispensing',
    title: 'صرف الوصفات والمستلزمات الطبية التخصصية',
    departmentId: 'pharmacy',
    doctorId: null,
    teamLabel: 'فريق الصيدلية السريرية',
    shortDesc: 'مراجعة الوصفات الطبية والتأكد من التداخلات الدوائية وتوفير الدعامات المعتمدة.',
    details: [
      'مراجعة الجرعات الدوائية وشرح طريقة الاستخدام الآمنة للمريض.',
      'توفير دعامات الظهر والرقبة وأجهزة العلاج المنزلي عبر المتجر أو الاستلام المباشر.',
    ],
    durationNote: 'متاح يوميًا خلال ساعات عمل الصيدلية',
    image: '/src/assets/images/dept_pharmacy_counter_1795286630165.jpg',
  },
];

export const getServiceById = (id: string) =>
  servicesData.find((s) => s.id === id || s.slug === id);

export const getServicesByDepartment = (departmentId: string) =>
  servicesData.filter((s) => s.departmentId === departmentId);
