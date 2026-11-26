import React from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Lock,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export type PolicySlug = 'returns' | 'shipping' | 'privacy' | 'terms';

interface PolicyDoc {
  slug: PolicySlug;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  updatedAr: string;
  updatedEn: string;
  icon: React.ComponentType<{ className?: string }>;
  accentGradient: string;
  badgeBg: string;
  sections: {
    headingAr: string;
    headingEn: string;
    pointsAr: string[];
    pointsEn: string[];
  }[];
}

export const StorePoliciesPage: React.FC = () => {
  const { policySlug } = useParams<{ policySlug?: string }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lang, isRTL, localizedConfig } = useLanguage();
  const { formatPrice } = useClinic();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const isStoreContext = pathname.startsWith('/store');
  const activeSlug: PolicySlug =
    policySlug === 'shipping' ||
    policySlug === 'privacy' ||
    policySlug === 'terms' ||
    policySlug === 'returns'
      ? policySlug
      : isStoreContext
      ? 'returns'
      : 'privacy';

  const freeThreshold = formatPrice(localizedConfig.payment.freeDeliveryThresholdYER);
  const deliveryFee = formatPrice(localizedConfig.payment.deliveryFeeYER);

  const policies: PolicyDoc[] = [
    {
      slug: 'returns',
      titleAr: 'سياسة الاستبدال والاسترجاع',
      titleEn: 'Return & Exchange Policy',
      subtitleAr: 'ضوابط واضحة تحفظ حق المشتري وتضمن سلامة المنتجات الطبية والصيدلانية',
      subtitleEn: 'Clear guidelines protecting buyer rights and medical product safety',
      updatedAr: 'آخر تحديث: نوفمبر 2026',
      updatedEn: 'Last updated: November 2026',
      icon: RefreshCw,
      accentGradient: 'from-[#0F4C5C] to-[#0284C7]',
      badgeBg: 'bg-sky-50 text-[#0F4C5C] border-sky-200',
      sections: [
        {
          headingAr: '1. المدة المسموحة للاستبدال والاسترجاع',
          headingEn: '1. Eligible Return Window',
          pointsAr: [
            'يحق للعميل طلب استبدال أو استرجاع الأجهزة التأهيلية والدعامات والمستلزمات الطبية غير المستخدمة خلال 7 أيام من تاريخ الاستلام.',
            'يشترط أن يكون المنتج بحالته الأصلية، غير مفتوح الغلاف المصنعي، وبكامل ملحقاته وفاتورة أو رقم الطلب المرجعي.',
          ],
          pointsEn: [
            'Unused rehabilitation devices, braces, and medical supplies may be returned or exchanged within 7 days of delivery.',
            'Items must remain in original sealed packaging with all accessories and the order reference number.',
          ],
        },
        {
          headingAr: '2. ضوابط السلامة الصيدلانية (الأدوية والمكملات)',
          headingEn: '2. Pharmacy Safety Restrictions',
          pointsAr: [
            'حرصاً على سلامة المرضى، لا يمكن استرجاع الأدوية والمكملات الغذائية أو المنتجات المبردة والحساسة للحرارة بعد خروجها من الصيدلية إلا في حال وجود خطأ في التجهيز أو تلف مصنعي.',
            'لا يشمل الاسترجاع الأحزمة والدعامات الطبية المفصّلة حسب المقاس بعد فتحها وتجربتها لأسباب صحية.',
          ],
          pointsEn: [
            'For patient safety, medications, supplements, and temperature-sensitive items cannot be returned once dispensed unless damaged or incorrectly fulfilled.',
            'Opened personal orthopedic supports cannot be returned once unsealed for hygiene reasons.',
          ],
        },
        {
          headingAr: '3. خطأ الطلب أو العيب المصنعي',
          headingEn: '3. Defective or Incorrect Items',
          pointsAr: [
            'في حال وصول منتج تالف أو مختلف عن الطلب المؤكد، يتكفل متجر صيدلية نوديسك بكامل تكاليف الاستبدال الفوري والتوصيل دون أي رسوم إضافية.',
            'يُسترد المبلغ عند الاسترجاع المقبول خلال 24 إلى 72 ساعة عمل عبر نفس وسيلة الدفع (الكريمي، المحفظة الإلكترونية، أو نقداً).',
          ],
          pointsEn: [
            'If an item arrives damaged or differs from your confirmed order, NODISC Store covers full replacement and courier costs.',
            'Approved refunds are processed within 24–72 business hours via the original payment method.',
          ],
        },
      ],
    },
    {
      slug: 'shipping',
      titleAr: 'سياسة الشحن والتوصيل',
      titleEn: 'Shipping & Delivery Policy',
      subtitleAr: 'آليات تجهيز الطلبات، مناطق التغطية، ومواعيد التسليم في صنعاء والمركز',
      subtitleEn: 'Order fulfillment, coverage areas, and pharmacy pickup timelines',
      updatedAr: 'آخر تحديث: نوفمبر 2026',
      updatedEn: 'Last updated: November 2026',
      icon: Truck,
      accentGradient: 'from-emerald-600 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      sections: [
        {
          headingAr: '1. طرق الاستلام المتاحة ومناطق التغطية',
          headingEn: '1. Fulfillment & Coverage Areas',
          pointsAr: [
            'الاستلام المباشر من صيدلية نوديسك كلينك (مركز ابن سيناء الطبي — صنعاء) خلال ساعات العمل الرسمية بعد تجهيز الطلب ومراجعته صيدلانياً.',
            'التوصيل المنزلي داخل أمانة العاصمة صنعاء، مع إمكانية التنسيق للشحن إلى المحافظات الأخرى عبر مكاتب النقل الموثوقة وفق طبيعة المنتج.',
          ],
          pointsEn: [
            'Direct pharmacy pickup at NODISC Clinic (Ibn Sina Medical Center, Sana’a) during official hours after pharmacist review.',
            'Home courier delivery across Sana’a, with inter-governorate dispatch available for eligible non-perishable items.',
          ],
        },
        {
          headingAr: '2. رسوم التوصيل والتوصيل المجاني',
          headingEn: '2. Delivery Fees & Free Threshold',
          pointsAr: [
            `رسوم التوصيل القياسية داخل صنعاء هي ${deliveryFee}، ويُمنح توصيل مجاني تلقائياً للطلبات التي تبلغ ${freeThreshold} فأكثر.`,
            'الاستلام المباشر من فرع الصيدلية مجاني بالكامل لأي قيمة طلب.',
          ],
          pointsEn: [
            `Standard local delivery within Sana’a is ${deliveryFee}, with automatic free delivery on orders of ${freeThreshold} or more.`,
            'Direct pharmacy pickup is always free regardless of order total.',
          ],
        },
        {
          headingAr: '3. مواعيد التسليم وفحص الطلب',
          headingEn: '3. Delivery Windows & Inspection',
          pointsAr: [
            'تُسلم الطلبات المؤكدة داخل صنعاء غالباً خلال نفس اليوم أو خلال 24 ساعة عمل كحد أقصى مع مراعاة تغليف المستلزمات الطبية بشكل آمن.',
            'يحق للعميل مطابقة المنتجات مع الفاتورة والتأكد من سلامة العبوات وتاريخ الصلاحية أمام المندوب قبل إتمام التوقيع أو الدفع عند الاستلام.',
          ],
          pointsEn: [
            'Confirmed orders inside Sana’a are typically delivered same-day or within 24 business hours in protective medical packaging.',
            'Customers may inspect packaging integrity and expiration dates against the invoice upon delivery.',
          ],
        },
      ],
    },
    {
      slug: 'privacy',
      titleAr: 'سياسة الخصوصية وحماية البيانات',
      titleEn: 'Privacy & Data Protection Policy',
      subtitleAr: 'التزامنا بحماية خصوصية المراجعين وبياناتهم الطبية وطلبات المتجر',
      subtitleEn: 'Our commitment to safeguarding patient medical records and store orders',
      updatedAr: 'آخر تحديث: نوفمبر 2026',
      updatedEn: 'Last updated: November 2026',
      icon: Lock,
      accentGradient: 'from-[#0284C7] to-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      sections: [
        {
          headingAr: '1. سرية البيانات الصحية والوصفات الطبية',
          headingEn: '1. Medical & Prescription Confidentiality',
          pointsAr: [
            'تُعامل جميع بيانات المراجعين، الاستشارات، صور أشعة الرنين المغناطيسي (MRI)، والوصفات الطبية المرفوعة بسرية طبية تامة ولا يطلع عليها سوى الطاقم الطبي والصيدلاني المختص.',
            'تُستخدم بيانات التواصل فقط لتنسيق المواعيد، متابعة خطط العلاج، أو تأكيد وتوصيل طلبات المتجر.',
          ],
          pointsEn: [
            'All patient profiles, consultation notes, MRI references, and uploaded prescriptions are treated with strict medical confidentiality.',
            'Contact details are strictly used for appointment coordination, follow-ups, and pharmacy order fulfillment.',
          ],
        },
        {
          headingAr: '2. بيانات الدفع والمعاملات الإلكترونية',
          headingEn: '2. Payment & Transaction Security',
          pointsAr: [
            'لا يقوم الموقع بتخزين كلمات مرور محافظك الإلكترونية أو بياناتك البنكية السرية؛ إذ تتم التحويلات مباشرة عبر شبكتك البنكية ويُكتفى برقم المرجع أو إشعار التحويل للمطابقة المالية.',
            'يحتفظ العميل بحق طلب تحديث بياناته أو تصحيحها عبر التواصل المباشر مع إدارة المركز.',
          ],
          pointsEn: [
            'We never store wallet PINs or banking credentials; transfers occur directly through your wallet provider with only the reference ID recorded for verification.',
            'Patients and customers may request data updates or corrections at any time via clinic support.',
          ],
        },
      ],
    },
    {
      slug: 'terms',
      titleAr: 'الشروط والأحكام',
      titleEn: 'Terms & Conditions',
      subtitleAr: 'الأحكام المنظمة لاستخدام الموقع التعريفي، حجز المواعيد، والشراء من المتجر',
      subtitleEn: 'Governing terms for website use, appointment bookings, and pharmacy orders',
      updatedAr: 'آخر تحديث: نوفمبر 2026',
      updatedEn: 'Last updated: November 2026',
      icon: FileText,
      accentGradient: 'from-[#0F4C5C] to-amber-600',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      sections: [
        {
          headingAr: '1. المحتوى التوعوي والاستشارات الطبية',
          headingEn: '1. Medical Content & Appointments',
          pointsAr: [
            'المقالات والإرشادات الطبية المنشورة في المكتبة التوعوية تهدف إلى التثقيف الصحي العام ولا تغني عن الفحص السريري المباشر لدى الاستشاري المختص.',
            'يُعد طلب الحجز الإلكتروني طلباً منظماً لتأكيد الموعد ويتم تثبيته وفق الجدول الفعلي للعيادة وفي حال الطوارئ الحرجة يجب التوجه لأقرب قسم طوارئ فوراً.',
          ],
          pointsEn: [
            'Educational articles and guidance in the medical library are informational and do not replace direct clinical evaluation.',
            'Online bookings are scheduled according to clinic availability; acute medical emergencies require immediate ER care.',
          ],
        },
        {
          headingAr: '2. طلبات الصيدلية والوصفات والأسعار',
          headingEn: '2. Pharmacy Orders, Prescriptions & Pricing',
          pointsAr: [
            'تُراجع كافة الطلبات المرتبطة بوصفات طبية أو دعامات تخصصية من قِبل الصيدلاني المختص قبل التجهيز، وللمتجر الحق في التواصل مع العميل للتأكد من المقاس أو الجرعة الصحيحة.',
            'تُعرض الأسعار بوضوح بالريال اليمني (مع إمكانية العرض بالعملات المرجعية المعتمدة) وتُطبق كوبونات الخصم وفق شروط الحد الأدنى المعلنة لكل كوبون.',
          ],
          pointsEn: [
            'Orders involving prescriptions or specialized braces undergo pharmacist review prior to dispatch to confirm sizing or dosage.',
            'Prices are displayed transparently in YER (with supported display currencies), and promo codes apply per their stated minimum thresholds.',
          ],
        },
      ],
    },
  ];

  const currentPolicy = policies.find((p) => p.slug === activeSlug) || policies[0];
  const ActiveIcon = currentPolicy.icon;

  const handleSelectPolicy = (slug: PolicySlug) => {
    navigate(isStoreContext ? `/store/policies/${slug}` : `/policies/${slug}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div className="space-y-2">
        <Breadcrumbs
          items={[
            ...(isStoreContext ? [{ label: lang === 'ar' ? 'المتجر' : 'Store', to: '/store' }] : []),
            { label: lang === 'ar' ? 'السياسات والشروط' : 'Policies & Terms' },
            { label: lang === 'ar' ? currentPolicy.titleAr : currentPolicy.titleEn },
          ]}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              {lang === 'ar' ? currentPolicy.titleAr : currentPolicy.titleEn}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {lang === 'ar' ? currentPolicy.subtitleAr : currentPolicy.subtitleEn}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${currentPolicy.badgeBg}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? currentPolicy.updatedAr : currentPolicy.updatedEn}</span>
          </span>
        </div>
      </div>

      {/* Interactive Policy Switcher Tabs */}
      <div
        role="tablist"
        aria-label={lang === 'ar' ? 'السياسات والشروط القانونية' : 'Store & Clinic Policies'}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {policies.map((pol) => {
          const Icon = pol.icon;
          const isActive = pol.slug === activeSlug;
          return (
            <button
              key={pol.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectPolicy(pol.slug)}
              className={`btn-interactive text-start rounded-2xl p-3.5 border flex items-center gap-3 ${
                isActive
                  ? `btn-sheen bg-gradient-to-r ${pol.accentGradient} text-white border-transparent shadow-[0_8px_20px_-6px_rgba(15,76,92,0.45)]`
                  : 'bg-white border-slate-200 text-slate-800 hover:border-[#0284C7]/60 hover:bg-sky-50/60 shadow-2xs'
              }`}
            >
              <span
                className={`w-9 h-9 rounded-xl inline-flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : `${pol.badgeBg} border`
                }`}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-xs sm:text-sm font-bold leading-snug">
                {lang === 'ar' ? pol.titleAr : pol.titleEn}
              </span>
            </button>
          );
        })}
      </div>

      {/* Policy Content Card */}
      <motion.article
        key={currentPolicy.slug}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
        className="rounded-2xl p-[1.5px] bg-gradient-to-br from-[#0F4C5C]/25 via-[#0284C7]/25 to-slate-200 shadow-xs"
      >
        <div className="rounded-[14.5px] bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <span
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${currentPolicy.accentGradient} text-white inline-flex items-center justify-center shadow-xs shrink-0`}
            >
              <ActiveIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900">
                {lang === 'ar' ? currentPolicy.titleAr : currentPolicy.titleEn}
              </h2>
              <p className="text-xs text-slate-500">
                {localizedConfig.brand.nameAr} · {localizedConfig.contact.city}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {currentPolicy.sections.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#0F4C5C]">
                  {lang === 'ar' ? sec.headingAr : sec.headingEn}
                </h3>
                <ul className="space-y-2.5">
                  {(lang === 'ar' ? sec.pointsAr : sec.pointsEn).map((pt, pIdx) => (
                    <li
                      key={pIdx}
                      className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed bg-slate-50/75 border border-slate-200/70 rounded-xl p-3.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {lang === 'ar'
                ? 'لأي استفسار حول الطلبات أو الشحن أو الخصوصية يسعدنا تواصلكم المباشر.'
                : 'Questions about orders, shipping, or privacy? Reach out to our team anytime.'}
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/contact"
                className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] text-[#0F4C5C] text-xs font-bold"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}</span>
              </Link>
              <Link
                to={isStoreContext ? '/store' : '/book'}
                className="btn-interactive btn-sheen inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white text-xs font-bold shadow-xs"
              >
                <span>
                  {isStoreContext
                    ? lang === 'ar'
                      ? 'العودة إلى المتجر'
                      : 'Back to Store'
                    : lang === 'ar'
                    ? 'حجز موعد'
                    : 'Book Appointment'}
                </span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};
