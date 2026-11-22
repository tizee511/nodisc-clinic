import { NewsItem, SuccessStory } from '../types/clinic';

export const newsData: NewsItem[] = [
  {
    id: 'news-rehab-unit-expansion',
    slug: 'rehabilitation-equipment-update',
    title: 'تحديث تجهيزات وحدة التأهيل والعلاج الطبيعي لدعم برامج ما بعد الجراحة',
    date: '2026-11-15',
    categoryLabel: 'تطوير الخدمات',
    departmentId: 'rehabilitation',
    summary:
      'أضاف مركز نوديسك كلينك مسارات تأهيل حركي ووحدات علاج كهربائي حديثة لتعزيز تكامل الرعاية بين الجراحة والعلاج الطبيعي.',
    body: [
      'ضمن خطة التطوير المستمرة لخدمات نوديسك كلينك، تم تحديث وحدة التأهيل والعلاج الطبيعي بمجموعة من التجهيزات المخصصة لإعادة تأهيل العمود الفقري والمفاصل.',
      'تتيح هذه الإضافة تصميم برامج متدرجة للمراجعين بعد إجراءات تحرير الأعصاب أو ضمن المسار التحفظي لآلام الظهر والرقبة.',
      'تنبيه: هذا الخبر محتوى تجريبي للمعاينة، وسيتم استبداله بالأخبار الرسمية المعتمدة من إدارة المركز.',
    ],
    image: '/src/assets/images/dept_rehab_gym_1795286629619.jpg',
  },
  {
    id: 'news-free-spine-campaign',
    slug: 'november-spine-awareness-campaign',
    title: 'الإعلان عن اليوم الطبي المجاني لتقييم آلام الظهر والانزلاق الغضروفي',
    date: '2026-11-18',
    categoryLabel: 'مبادرات مجتمعية',
    departmentId: 'neurosurgery',
    summary:
      'فتح باب التسجيل التجريبي في حملة الاستشارات الأولية المجانية لحالات العمود الفقري بمقر المركز وفق السعة المتاحة.',
    body: [
      'أعلن قسم جراحة المخ والأعصاب عن تخصيص يوم طبي مفتوح لتقديم استشارات تقييمية أولية ومراجعة أشعة الرنين المغناطيسي للمراجعين المسجلين مسبقًا.',
      'يمكن الاطلاع على شروط المجانية والوقت والمكان والتسجيل مباشرة عبر صفحة الحملات في الموقع.',
    ],
    image: '/src/assets/images/hero_nodisc_clinic_1795286630066.jpg',
  },
  {
    id: 'news-pharmacy-prescription-service',
    slug: 'digital-prescription-intake-launch',
    title: 'تفعيل خدمة استقبال طلبات الوصفات الطبية إلكترونيًا عبر صيدلية نوديسك',
    date: '2026-11-19',
    categoryLabel: 'خدمات الصيدلية',
    departmentId: 'pharmacy',
    summary:
      'إتاحة خدمة إرفاق صورة الوصفة الطبية ومراجعتها من الصيدلي المختص قبل التوصيل أو الاستلام المباشر.',
    body: [
      'لتسهيل حصول المراجعين على أدويتهم ودعاماتهم الطبية، وفّر قسم الصيدلية مسارًا رقميًا يتيح إرسال صورة الوصفة ومراجعتها مع فريق الصيدلة.',
      'هذه الخدمة تعمل في النموذج الحالي كمحاكاة تفاعلية كاملة للمراجعة قبل الإطلاق الفعلي.',
    ],
    image: '/src/assets/images/dept_pharmacy_counter_1795286630165.jpg',
  },
];

export const successStoriesData: SuccessStory[] = [
  {
    id: 'story-lumbar-recovery',
    slug: 'gradual-recovery-from-lumbar-sciatica',
    title: 'قصة تعافٍ من آلام عرق النسا والعودة للحركة اليومية دون معاناة',
    departmentId: 'neurosurgery',
    doctorId: 'dr-mohammed-aljurbani',
    serviceId: 'srv-neuro-consult',
    patientLabel: 'مراجع — حالة تجريبية عامة (الأحرف الأولى: ع. م.)',
    date: '2026-11-08',
    summary:
      'مسار علاجي متكامل بدأ بتقييم جراحي دقيق ثم خطة تحفظية وتأهيلية أعادت للمراجع قدرته على المشي والعمل.',
    beforeState:
      'معاناة استمرت عدة أشهر من ألم ممتد أسفل الظهر إلى الساق مع صعوبة في الوقوف والمشي لمسافات قصيرة.',
    carePath:
      'مراجعة صور الرنين المغناطيسي في قسم جراحة المخ والأعصاب، ووضع خطة مشتركة شملت تهدئة الالتهاب العصبي وبرنامج تأهيل حركي من 8 جلسات.',
    outcome:
      'تحسن تدريجي في القدرة على المشي وانخفاض ملحوظ في شدة الألم مع الالتزام بتمارين الحفاظ على القوام (محتوى تجريبي قابل للاستبدال).',
    image: '/src/assets/images/dept_neurosurgery_suite_1795286629702.jpg',
    featuredOnHome: true,
    comments: [
      {
        id: 'cmt-1',
        author: 'خالد س. (تعليق تجريبي معتمد)',
        rating: 5,
        text: 'تجربة منظمة ووضوح في شرح الخيارات العلاجية قبل اتخاذ أي خطوة.',
        date: '2026-11-11',
        status: 'approved',
      },
      {
        id: 'cmt-2',
        author: 'أم عبد الله (تعليق تجريبي معتمد)',
        rating: 5,
        text: 'التنسيق بين العيادة وقسم العلاج الطبيعي سهّل المتابعة بشكل كبير.',
        date: '2026-11-14',
        status: 'approved',
      },
    ],
  },
  {
    id: 'story-neck-rehab',
    slug: 'cervical-stiffness-and-posture-rehab',
    title: 'تأهيل تيبّس الرقبة المزمن عبر برنامج العلاج الطبيعي وعلاج الألم',
    departmentId: 'rehabilitation',
    doctorId: 'team-rehab-unit',
    serviceId: 'srv-rehab-spine',
    patientLabel: 'مراجعة — حالة تجريبية عامة (الأحرف الأولى: س. أ.)',
    date: '2026-11-02',
    summary:
      'دمج جلسات فك التشنج العضلي وتصحيح وضع الجلوس اليومي لتخفيف آلام الرقبة والكتفين المزمنة.',
    beforeState:
      'تيبّس متكرر في الرقبة وصداع توتري ناتج عن ساعات العمل الطويلة أمام الحاسوب.',
    carePath:
      'تقييم في قسم علاج الألم متبوعًا بجلسات علاج يدوي وتمارين تقوية عضلات الرقبة واستخدام الوسادة الطبية المناسبة.',
    outcome:
      'استعادة مدى الحركة الطبيعي للرقبة وانخفاض نوبات التوتر العضلي (مثال تجريبي قابل للاستبدال بالمحتوى المعتمد).',
    image: '/src/assets/images/dept_rehab_gym_1795286629619.jpg',
    featuredOnHome: true,
    comments: [
      {
        id: 'cmt-3',
        author: 'ماجد ح. (تعليق تجريبي معتمد)',
        rating: 4,
        text: 'التمارين الإرشادية والاهتمام بالمتابعة بعد الجلسات كانت مفيدة جدًا.',
        date: '2026-11-09',
        status: 'approved',
      },
    ],
  },
  {
    id: 'story-pain-joint-relief',
    slug: 'targeted-pain-relief-for-chronic-back-pain',
    title: 'استعادة النشاط الحركي بعد برنامج علاج الألم الموجه',
    departmentId: 'pain',
    doctorId: 'team-pain-unit',
    serviceId: 'srv-pain-eval',
    patientLabel: 'مراجع — حالة تجريبية عامة (الأحرف الأولى: م. ي.)',
    date: '2026-10-25',
    summary:
      'تقليل الاعتماد اليومي على المسكنات والانتقال الآمن نحو التمارين العلاجية.',
    beforeState:
      'آلام مزمنة في مفاصل أسفل الظهر تحدّ من الحركة الصباحية وجودة النوم.',
    carePath:
      'تقييم شامل في قسم علاج الألم وإجراء تدخل موضعي موجه ثم ربط الحالة بوحدة العلاج الطبيعي.',
    outcome:
      'تحسن في مرونة الحركة الصباحية والقدرة على أداء الأنشطة اليومية براحة أكبر (محتوى تجريبي عام).',
    image: '/src/assets/images/dept_pain_clinic_1795286628900.jpg',
    featuredOnHome: false,
    comments: [],
  },
];

export const getNewsById = (id: string) =>
  newsData.find((n) => n.id === id || n.slug === id);

export const getStoryById = (id: string) =>
  successStoriesData.find((s) => s.id === id || s.slug === id);
