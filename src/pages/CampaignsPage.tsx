import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, CheckCircle2, MapPin, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDataStore } from '../context/DataStoreContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { getFilterTabClass, ScrollableFilterBar } from '../components/ScrollableFilterBar';
import { CampaignStatus } from '../types/clinic';

export const CampaignsPage: React.FC = () => {
  const { lang, t, campaigns, departments } = useLanguage();
  const { getCampaignBookedCount, getCampaignEffectiveStatus } = useDataStore();
  const [statusFilter, setStatusFilter] = useState<'all' | CampaignStatus>('all');

  const statusTabs: { key: 'all' | CampaignStatus; label: string }[] = [
    { key: 'all', label: t('common.all') },
    { key: 'open', label: t('campaigns.status.open') },
    { key: 'full', label: t('campaigns.status.full') },
    { key: 'scheduled', label: t('campaigns.status.scheduled') },
    { key: 'ended', label: t('campaigns.status.ended') },
  ];

  const filteredCampaigns =
    statusFilter === 'all'
      ? campaigns
      : campaigns.filter((c) => getCampaignEffectiveStatus(c) === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: t('campaigns.title') }]} />
        <h1 className="font-display font-bold text-3xl text-slate-900">{t('campaigns.title')}</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {t('campaigns.subtitle')}
        </p>
      </div>

      {/* Campaign Status Filter Bar */}
      <ScrollableFilterBar ariaLabel={lang === 'ar' ? 'تصفية الحملات الطبية' : 'Filter medical campaigns'}>
        {statusTabs.map((tab) => {
          const count =
            tab.key === 'all'
              ? campaigns.length
              : campaigns.filter((c) => getCampaignEffectiveStatus(c) === tab.key).length;
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={getFilterTabClass(isActive)}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] tabular-nums ${
                  isActive ? 'text-sky-200' : 'text-slate-400'
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </ScrollableFilterBar>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCampaigns.map((camp) => {
          const dept = departments.find((d) => d.id === camp.departmentId);
          const booked = getCampaignBookedCount(camp.id);
          const effectiveStatus = getCampaignEffectiveStatus(camp);
          const remaining = Math.max(0, camp.totalCapacity - booked);

          return (
            <Link
              key={camp.id}
              to={`/campaigns/${camp.slug}`}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#0F4C5C]/40 transition-colors"
            >
              <div>
                <SafeImage src={camp.image} alt={camp.title} aspectClass="aspect-[16/9]" />
                <div className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`font-semibold ${
                        effectiveStatus === 'open'
                          ? 'text-emerald-700'
                          : effectiveStatus === 'full'
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {t(`campaigns.status.${effectiveStatus}`)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#0284C7]">{dept?.nameAr}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500">{camp.dayLabel}</span>
                  </div>
                  <h2 className="font-display font-bold text-xl text-slate-900 group-hover:text-[#0F4C5C]">
                    {camp.title}
                  </h2>
                  <p className="text-sm text-slate-600">{camp.serviceSummary}</p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 tabular-nums">
                  {t('home.remainingSeats')}: <strong>{remaining}</strong> / {camp.totalCapacity}
                </span>
                <span className="font-semibold text-[#0F4C5C]">{t('common.readMore')}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const CampaignDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, campaigns, departments, doctors, localizedConfig } = useLanguage();
  const { getCampaignBookedCount, getCampaignEffectiveStatus, addCampaignBooking } = useDataStore();

  const campaign = campaigns.find((c) => c.slug === slug || c.id === slug);

  const [previewOverrideStatus, setPreviewOverrideStatus] = useState<CampaignStatus | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successRef, setSuccessRef] = useState<string | null>(null);

  if (!campaign) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'الحملة غير متوفرة' : 'Campaign not found'}
        </h1>
        <Link to="/campaigns" className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold">
          {t('nav.campaigns')}
        </Link>
      </div>
    );
  }

  const dept = departments.find((d) => d.id === campaign.departmentId);
  const doctor = doctors.find((d) => d.id === campaign.doctorId);

  const bookedCount = getCampaignBookedCount(campaign.id);
  const computedStatus = getCampaignEffectiveStatus(campaign);

  const activeStatus = previewOverrideStatus || computedStatus;
  const remainingSeats =
    activeStatus === 'full' ? 0 : Math.max(0, campaign.totalCapacity - bookedCount);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (name.trim().length < 3 || phone.replace(/\D/g, '').length < 7) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى إدخال الاسم الكامل ورقم الهاتف الصحيح.'
          : 'Please enter a valid full name and phone number.'
      );
      return;
    }

    const refId = `CMP-${Math.floor(10000 + Math.random() * 90000)}`;
    const res = addCampaignBooking({
      referenceId: refId,
      campaignId: campaign.id,
      patientName: name.trim(),
      phone: phone.trim(),
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'confirmed',
    });

    if (!res.ok) {
      setErrorMsg(res.error || t('campaigns.details.fullMessage'));
      return;
    }

    setSuccessRef(refId);
    setName('');
    setPhone('');
    setNotes('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: t('campaigns.title'), to: '/campaigns' },
            { label: campaign.title },
          ]}
        />

        {/* Reviewer State Preview Bar */}
        <div className="mb-6 bg-slate-100 rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-700">
            {t('campaigns.details.previewControls')}:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPreviewOverrideStatus(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                previewOverrideStatus === null
                  ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              {lang === 'ar' ? 'الحالة الفعلية من البيانات' : 'Actual Data State'}
            </button>
            {(['open', 'full', 'scheduled', 'ended'] as CampaignStatus[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setPreviewOverrideStatus(st);
                  setSuccessRef(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  previewOverrideStatus === st
                    ? 'bg-[#0F4C5C] text-white border-[#0F4C5C]'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {t(`campaigns.status.${st}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <SafeImage
              src={campaign.image}
              alt={campaign.title}
              aspectClass="aspect-[16/9]"
              className="rounded-xl border border-slate-200"
            />

            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`font-semibold ${
                    activeStatus === 'open'
                      ? 'text-emerald-700'
                      : activeStatus === 'full'
                      ? 'text-amber-700'
                      : 'text-slate-600'
                  }`}
                >
                  {t(`campaigns.status.${activeStatus}`)}
                </span>
                {dept && (
                  <>
                    <span aria-hidden="true">·</span>
                    <Link to={`/departments/${dept.slug}`} className="text-[#0284C7] font-medium hover:underline">
                      {dept.nameAr}
                    </Link>
                  </>
                )}
                {doctor && (
                  <>
                    <span aria-hidden="true">·</span>
                    <Link to={`/doctors/${doctor.slug}`} className="text-slate-600 hover:underline">
                      {doctor.nameAr}
                    </Link>
                  </>
                )}
              </div>

              <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                {campaign.title}
              </h1>
              <p className="text-base text-slate-700 leading-relaxed">{campaign.serviceSummary}</p>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-sm border-t border-slate-100">
                <div>
                  <dt className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {t('campaigns.details.day')}
                  </dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">{campaign.dayLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{t('campaigns.details.period')}</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">{campaign.periodLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {t('campaigns.details.location')}
                  </dt>
                  <dd className="text-slate-800 mt-0.5">{campaign.locationLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">{t('campaigns.details.registrationWindow')}</dt>
                  <dd className="text-slate-800 mt-0.5">{campaign.registrationWindow}</dd>
                </div>
              </dl>

              <div className="p-4 rounded-lg bg-sky-50 border border-sky-100 space-y-1.5">
                <h2 className="font-display font-bold text-sm text-[#0F4C5C]">
                  {t('campaigns.details.freeMeaning')}
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {campaign.freeScopeExplanation}
                </p>
              </div>

              <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                {campaign.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Registration & Capacity Sidebar */}
          <aside className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 inline-flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#0F4C5C]" />
                  {t('campaigns.details.capacity')}
                </span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {remainingSeats} / {campaign.totalCapacity}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0F4C5C] transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(((campaign.totalCapacity - remainingSeats) / Math.max(1, campaign.totalCapacity)) * 100)
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-500">{localizedConfig.bookingRules.capacityPolicyNote}</p>
            </div>

            <h2 className="font-display font-bold text-xl text-slate-900">
              {t('campaigns.details.registerTitle')}
            </h2>

            {successRef ? (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t('campaigns.details.successMessage')}</span>
                </div>
                <p className="text-xs text-emerald-900">
                  {t('booking.result.referenceLabel')}:{' '}
                  <strong className="font-mono" dir="ltr">{successRef}</strong>
                </p>
              </div>
            ) : activeStatus === 'open' ? (
              <form onSubmit={handleRegister} className="space-y-4">
                {errorMsg && (
                  <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                    {errorMsg}
                  </p>
                )}
                <div>
                  <label htmlFor="cmp-name" className="block text-sm font-medium text-slate-700 mb-1">
                    {t('booking.fields.patientName')} *
                  </label>
                  <input
                    id="cmp-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="cmp-phone" className="block text-sm font-medium text-slate-700 mb-1">
                    {t('booking.fields.phone')} *
                  </label>
                  <input
                    id="cmp-phone"
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="cmp-note" className="block text-sm font-medium text-slate-700 mb-1">
                    {t('booking.fields.notes')}
                  </label>
                  <textarea
                    id="cmp-note"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
                >
                  {t('common.submit')}
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 space-y-3">
                <p>
                  {activeStatus === 'full'
                    ? t('campaigns.details.fullMessage')
                    : activeStatus === 'scheduled'
                    ? t('campaigns.details.scheduledMessage')
                    : t('campaigns.details.endedMessage')}
                </p>
                <Link
                  to="/book"
                  className="inline-block text-xs font-semibold text-[#0F4C5C] hover:underline"
                >
                  {t('nav.bookAppointment')}
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
