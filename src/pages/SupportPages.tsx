import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, ExternalLink, Mail, MapPin, MessageSquare, Phone, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useClinic } from '../context/ClinicContext';
import { useDataStore } from '../context/DataStoreContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ClinicLocationMap } from '../components/ClinicLocationMap';

export const ContactPage: React.FC = () => {
  const { lang, t, localizedConfig, departments } = useLanguage();
  const { addSupportMessage } = useDataStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sentRef, setSentRef] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (name.trim().length < 2 || phone.replace(/\D/g, '').length < 7 || message.trim().length < 5) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى استكمال الاسم ورقم الهاتف ونص الاستفسار.'
          : 'Please complete your name, phone number, and inquiry message.'
      );
      return;
    }
    const id = addSupportMessage({
      type: 'inquiry',
      typeLabel: lang === 'ar' ? 'استفسار' : 'Inquiry',
      senderName: name.trim(),
      contactInfo: phone.trim(),
      message: message.trim(),
    });
    setSentRef(id);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-10">
      <div>
        <Breadcrumbs items={[{ label: t('supportPages.contactTitle') }]} />
        <h1 className="font-display font-bold text-3xl text-slate-900">
          {t('supportPages.contactTitle')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-display font-bold text-lg text-slate-900">
              {t('home.locationHeading')}
            </h2>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0F4C5C] mt-0.5 shrink-0" />
                <span>{localizedConfig.contact.address}</span>
              </p>
              <p className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#0F4C5C] mt-0.5 shrink-0" />
                <span>
                  {localizedConfig.contact.workingDays} ·{' '}
                  {localizedConfig.contact.workingPeriods.map((p) => p.time).join(' / ')}
                </span>
              </p>
              <div className="space-y-1.5 pt-1">
                {localizedConfig.contact.phones.map((ph, i) => (
                  <p key={i} className="flex items-center gap-2.5 flex-wrap">
                    <Phone className="w-4 h-4 text-[#0F4C5C] shrink-0" />
                    <span>{ph.label}: </span>
                    <a
                      href={`tel:${ph.value.replace(/\s+/g, '')}`}
                      className="font-mono font-semibold text-slate-900 hover:text-[#0F4C5C] tabular-nums"
                      dir="ltr"
                    >
                      {ph.value}
                    </a>
                  </p>
                ))}
                <p className="flex items-center gap-2.5 flex-wrap">
                  <Mail className="w-4 h-4 text-[#0F4C5C] shrink-0" />
                  <span>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}: </span>
                  <a
                    href={`mailto:${localizedConfig.contact.email}`}
                    className="font-mono font-semibold text-slate-900 hover:text-[#0F4C5C]"
                    dir="ltr"
                  >
                    {localizedConfig.contact.email}
                  </a>
                </p>
              </div>
              <p className="text-xs text-[#0284C7] pt-1">{localizedConfig.contact.directionsNote}</p>
              {(localizedConfig.contact.whatsappUrl || localizedConfig.contact.socialLinks) && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                  {localizedConfig.contact.whatsappUrl && (
                    <a
                      href={localizedConfig.contact.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'واتساب المباشر' : 'WhatsApp Chat'}</span>
                    </a>
                  )}
                  {localizedConfig.contact.socialLinks?.facebook && (
                    <a
                      href={localizedConfig.contact.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                    >
                      <span>Facebook</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {localizedConfig.contact.socialLinks?.instagram && (
                    <a
                      href={localizedConfig.contact.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                    >
                      <span>Instagram</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {localizedConfig.contact.socialLinks?.youtube && (
                    <a
                      href={localizedConfig.contact.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
            <h2 className="font-display font-bold text-base text-slate-900">
              {t('footer.departmentsTitle')}
            </h2>
            <ul className="space-y-2 text-xs text-slate-600">
              {departments.map((d) => (
                <li key={d.id} className="pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <strong className="text-slate-900 block">{d.nameAr}</strong>
                  <span>{d.contactNote}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="font-display font-bold text-xl text-slate-900">
            {t('supportPages.inquiryFormTitle')}
          </h2>

          {sentRef && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                {t('supportPages.inquirySuccess')}: <strong className="font-mono" dir="ltr">{sentRef}</strong>
              </span>
            </div>
          )}

          {errorMsg && (
            <p className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {errorMsg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cnt-name" className="block text-sm font-medium text-slate-700 mb-1">
                  {t('booking.fields.patientName')} *
                </label>
                <input
                  id="cnt-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label htmlFor="cnt-phone" className="block text-sm font-medium text-slate-700 mb-1">
                  {t('booking.fields.phone')} *
                </label>
                <input
                  id="cnt-phone"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm tabular-nums"
                />
              </div>
            </div>
            <div>
              <label htmlFor="cnt-msg" className="block text-sm font-medium text-slate-700 mb-1">
                {lang === 'ar' ? 'نص الاستفسار' : 'Inquiry Message'} *
              </label>
              <textarea
                id="cnt-msg"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold"
            >
              {t('common.submit')}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-[#0F4C5C]">
            <Link to="/complaints" className="hover:underline">{t('nav.complaints')}</Link>
            {localizedConfig.features.showCareersPage && (
              <Link to="/careers" className="hover:underline">{t('nav.careers')}</Link>
            )}
            {localizedConfig.features.showSurveyPage && (
              <Link to="/survey" className="hover:underline">{t('nav.survey')}</Link>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Clinic Location Map */}
      <ClinicLocationMap />
    </div>
  );
};

export const ComplaintsPage: React.FC = () => {
  const { lang, t, tArray } = useLanguage();
  const { addSupportMessage } = useDataStore();
  const types = tArray('supportPages.complaintTypes');
  const [msgType, setMsgType] = useState(types[0] || 'Complaint');
  const [text, setText] = useState('');
  const [contact, setContact] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (text.trim().length < 5 || contact.trim().length < 5) {
      setErrorMsg(
        lang === 'ar' ? 'يرجى كتابة نص الرسالة ووسيلة المتابعة.' : 'Please enter details and contact information.'
      );
      return;
    }
    const id = addSupportMessage({
      type: msgType.includes('اقتراح') || msgType.toLowerCase().includes('suggest') ? 'suggestion' : 'complaint',
      typeLabel: msgType,
      senderName: lang === 'ar' ? 'مراجع عبر بوابة الشكاوى' : 'Portal Feedback',
      contactInfo: contact.trim(),
      message: text.trim(),
    });
    setSubmittedRef(id);
    setText('');
    setContact('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-6">
      <Breadcrumbs items={[{ label: t('supportPages.complaintsTitle') }]} />
      <h1 className="font-display font-bold text-3xl text-slate-900">
        {t('supportPages.complaintsTitle')}
      </h1>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5">
        {submittedRef && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm space-y-1">
            <p className="font-semibold">{t('supportPages.complaintSuccess')}</p>
            <p className="text-xs">
              {t('booking.result.referenceLabel')}: <strong className="font-mono" dir="ltr">{submittedRef}</strong>
            </p>
          </div>
        )}
        {errorMsg && (
          <p className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cmp-type" className="block text-sm font-medium text-slate-700 mb-1">
              {t('supportPages.complaintType')}
            </label>
            <select
              id="cmp-type"
              value={msgType}
              onChange={(e) => setMsgType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
            >
              {types.map((tp) => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cmp-body" className="block text-sm font-medium text-slate-700 mb-1">
              {lang === 'ar' ? 'نص الشكوى أو المقترح' : 'Message Details'} *
            </label>
            <textarea
              id="cmp-body"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <div>
            <label htmlFor="cmp-contact" className="block text-sm font-medium text-slate-700 mb-1">
              {lang === 'ar' ? 'بيانات المتابعة (الهاتف أو البريد)' : 'Follow-up Contact (Phone or Email)'} *
            </label>
            <input
              id="cmp-contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold"
          >
            {t('common.submit')}
          </button>
        </form>
      </div>
    </div>
  );
};

export const CareersPage: React.FC = () => {
  const { lang, t, localizedConfig } = useLanguage();
  const { addCareerApp } = useDataStore();
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!localizedConfig.features.showCareersPage) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600">{lang === 'ar' ? 'الصفحة مخفية من الإعدادات.' : 'Page hidden via configuration.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-6">
      <Breadcrumbs items={[{ label: t('supportPages.careersTitle') }]} />
      <h1 className="font-display font-bold text-3xl text-slate-900">
        {t('supportPages.careersTitle')}
      </h1>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-4">
          {t('supportPages.noOpenRoles')}
        </p>

        {localizedConfig.features.allowGeneralCareerInterest && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900">
              {t('supportPages.generalInterestTitle')}
            </h2>

            {submitted ? (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
                {lang === 'ar'
                  ? 'تم تسجيل اهتمامك الوظيفي العام ضمن بيانات النموذج التجريبي.'
                  : 'Your general career interest has been recorded in the demo session.'}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (name.trim() && specialty.trim()) {
                    addCareerApp({ name: name.trim(), specialty: specialty.trim(), phone: phone.trim() });
                    setSubmitted(true);
                  }
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder={t('booking.fields.patientName')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ar' ? 'التخصص الطبي / الإداري' : 'Specialty / Role'}
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder={t('booking.fields.phone')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold"
                >
                  {t('common.submit')}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const SurveyPage: React.FC = () => {
  const { lang, t, localizedConfig } = useLanguage();
  const { addSurvey } = useDataStore();
  const [clarity, setClarity] = useState(5);
  const [ease, setEase] = useState(5);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  if (!localizedConfig.features.showSurveyPage) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-6">
      <Breadcrumbs items={[{ label: t('supportPages.surveyTitle') }]} />
      <h1 className="font-display font-bold text-3xl text-slate-900">
        {t('supportPages.surveyTitle')}
      </h1>

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5">
        {done ? (
          <div className="p-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
            {t('supportPages.surveySuccess')}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addSurvey({ clarityRating: clarity, easeRating: ease, note: note.trim() });
              setDone(true);
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                {lang === 'ar'
                  ? '1. مدى وضوح المعلومات والأقسام في الموقع (من 1 إلى 5)'
                  : '1. Clarity of information and departments (1 to 5)'}
              </label>
              <select
                value={clarity}
                onChange={(e) => setClarity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
              >
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>{v} / 5</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                {lang === 'ar'
                  ? '2. سهولة الوصول إلى طلب الموعد والمتجر (من 1 إلى 5)'
                  : '2. Ease of reaching Appointment Booking and Pharmacy Store (1 to 5)'}
              </label>
              <select
                value={ease}
                onChange={(e) => setEase(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
              >
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>{v} / 5</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                {lang === 'ar' ? 'ملاحظات إضافية للتحسين' : 'Additional improvement notes'}
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold"
            >
              {t('common.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get('q') || '';
  const [query, setQuery] = useState(initial);
  const { lang, t, departments, doctors, services, library, news, stories, campaigns, products } =
    useLanguage();
  const { formatPrice } = useClinic();

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const list: { id: string; type: string; title: string; desc: string; to: string }[] = [];

    departments.forEach((d) => {
      if (d.nameAr.toLowerCase().includes(q) || d.nameEn.toLowerCase().includes(q) || d.shortDesc.toLowerCase().includes(q)) {
        list.push({ id: `d-${d.id}`, type: lang === 'ar' ? 'قسم' : 'Department', title: d.nameAr, desc: d.shortDesc, to: `/departments/${d.slug}` });
      }
    });
    doctors.forEach((d) => {
      if (d.nameAr.toLowerCase().includes(q) || d.nameEn.toLowerCase().includes(q) || d.bio.toLowerCase().includes(q)) {
        list.push({ id: `doc-${d.id}`, type: lang === 'ar' ? 'طبيب' : 'Physician', title: d.nameAr, desc: d.roleTitle, to: `/doctors/${d.slug}` });
      }
    });
    services.forEach((s) => {
      if (s.title.toLowerCase().includes(q) || s.shortDesc.toLowerCase().includes(q)) {
        list.push({ id: `srv-${s.id}`, type: lang === 'ar' ? 'خدمة' : 'Service', title: s.title, desc: s.shortDesc, to: `/services/${s.slug}` });
      }
    });
    library.forEach((l) => {
      if (l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q)) {
        list.push({ id: `lib-${l.id}`, type: l.typeLabel, title: l.title, desc: l.summary, to: `/library/${l.slug}` });
      }
    });
    campaigns.forEach((c) => {
      if (c.title.toLowerCase().includes(q) || c.serviceSummary.toLowerCase().includes(q)) {
        list.push({ id: `cmp-${c.id}`, type: lang === 'ar' ? 'حملة طبية' : 'Campaign', title: c.title, desc: c.serviceSummary, to: `/campaigns/${c.slug}` });
      }
    });
    news.forEach((n) => {
      if (n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)) {
        list.push({ id: `nws-${n.id}`, type: lang === 'ar' ? 'خبر' : 'News', title: n.title, desc: n.summary, to: `/news/${n.slug}` });
      }
    });
    stories.forEach((st) => {
      if (st.title.toLowerCase().includes(q) || st.summary.toLowerCase().includes(q)) {
        list.push({ id: `st-${st.id}`, type: lang === 'ar' ? 'قصة نجاح' : 'Success Story', title: st.title, desc: st.summary, to: `/stories/${st.slug}` });
      }
    });
    products.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q)) {
        list.push({ id: `prd-${p.id}`, type: lang === 'ar' ? 'منتج متجر' : 'Store Product', title: p.name, desc: `${formatPrice(p.priceYER)} · ${p.shortDesc}`, to: `/store/product/${p.slug}` });
      }
    });

    return list;
  }, [query, departments, doctors, services, library, campaigns, news, stories, products, lang, formatPrice]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: t('nav.search') }]} />
        <h1 className="font-display font-bold text-3xl text-slate-900">{t('nav.search')}</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearchParams(query.trim() ? { q: query.trim() } : {});
        }}
        className="relative"
      >
        <Search className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 start-4" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('common.searchPlaceholder')}
          className="w-full ps-12 pe-4 py-3.5 rounded-xl border border-slate-300 bg-white text-sm sm:text-base"
        />
      </form>

      {!query.trim() ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
          <p className="text-sm text-slate-600">{t('common.searchPlaceholder')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {departments.map((d) => (
              <Link
                key={d.id}
                to={`/departments/${d.slug}`}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-sky-50 text-xs font-semibold text-slate-800"
              >
                {d.nameAr}
              </Link>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-4">
          <p className="text-base font-semibold text-slate-900">{t('common.noResults')}</p>
          <p className="text-sm text-slate-500">{t('common.tryAgain')}</p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {departments.map((d) => (
              <Link
                key={d.id}
                to={`/departments/${d.slug}`}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:border-[#0F4C5C]"
              >
                {d.nameAr}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 tabular-nums">
            {lang === 'ar' ? `عدد النتائج: ${results.length}` : `Results found: ${results.length}`}
          </p>
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {results.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="block p-5 hover:bg-slate-50 transition-colors"
              >
                <span className="text-xs font-semibold text-[#0284C7]">{item.type}</span>
                <h2 className="font-display font-bold text-lg text-slate-900 mt-0.5">{item.title}</h2>
                <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
