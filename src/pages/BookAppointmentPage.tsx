import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Calendar, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useClinic } from '../context/ClinicContext';
import { useDataStore } from '../context/DataStoreContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AppointmentSubmission, DepartmentId } from '../types/clinic';

export const BookAppointmentPage: React.FC = () => {
  const { lang, t, localizedConfig, departments, services, doctors } = useLanguage();
  const { bookingPrefill, clearBookingPrefill, lastAppointment, setLastAppointment } = useClinic();
  const { scheduleSettings } = useDataStore();

  const [departmentId, setDepartmentId] = useState<DepartmentId | ''>(
    bookingPrefill.departmentId || ''
  );
  const [serviceId, setServiceId] = useState<string>(bookingPrefill.serviceId || '');
  const [doctorId, setDoctorId] = useState<string>(bookingPrefill.doctorId || '');
  const [visitType, setVisitType] = useState<string>(localizedConfig.bookingRules.visitTypes[0]);
  const [preferredDay, setPreferredDay] = useState<string>('2026-11-28');
  const [preferredPeriod, setPreferredPeriod] = useState<string>(
    localizedConfig.bookingRules.periods[0]
  );
  const [patientName, setPatientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [previousFileNumber, setPreviousFileNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [simulateNetworkError, setSimulateNetworkError] = useState<boolean>(false);
  const [prefillSource, setPrefillSource] = useState<string | undefined>(
    bookingPrefill.fromSourceLabel
  );

  useEffect(() => {
    if (bookingPrefill.departmentId || bookingPrefill.serviceId || bookingPrefill.doctorId) {
      if (bookingPrefill.departmentId) setDepartmentId(bookingPrefill.departmentId);
      if (bookingPrefill.serviceId) setServiceId(bookingPrefill.serviceId);
      if (bookingPrefill.doctorId) setDoctorId(bookingPrefill.doctorId);
      setPrefillSource(bookingPrefill.fromSourceLabel);
      setLastAppointment(null);
      clearBookingPrefill();
    }
  }, [bookingPrefill, clearBookingPrefill, setLastAppointment]);

  const availableServices = departmentId
    ? services.filter((s) => s.departmentId === departmentId)
    : services;

  const availableDoctors = departmentId
    ? doctors.filter((d) => d.departmentId === departmentId)
    : doctors;

  const handleDepartmentChange = (val: DepartmentId | '') => {
    setDepartmentId(val);
    setServiceId('');
    setDoctorId('');
  };

  const closedDates = scheduleSettings.closedDates;

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!departmentId) nextErrors.departmentId = t('booking.errors.departmentRequired');
    if (!serviceId) nextErrors.serviceId = t('booking.errors.serviceRequired');
    if (!preferredDay) {
      nextErrors.preferredDay = t('booking.errors.dayRequired');
    } else if (closedDates.includes(preferredDay)) {
      nextErrors.preferredDay = t('booking.errors.unavailableDay');
    }
    if (!preferredPeriod) nextErrors.preferredPeriod = t('booking.errors.periodRequired');
    if (patientName.trim().length < 3) nextErrors.patientName = t('booking.errors.nameRequired');
    if (phone.replace(/\D/g, '').length < 7) nextErrors.phone = t('booking.errors.phoneRequired');

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError('');

    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      if (simulateNetworkError) {
        setIsSubmitting(false);
        setSubmitError(t('booking.errors.submitFailed'));
        return;
      }

      const refId = `ND-${Math.floor(100000 + Math.random() * 900000)}`;
      const submission: AppointmentSubmission = {
        referenceId: refId,
        departmentId: departmentId as DepartmentId,
        serviceId,
        doctorId,
        visitType,
        preferredDay,
        preferredPeriod,
        patientName: patientName.trim(),
        phone: phone.trim(),
        previousFileNumber: previousFileNumber.trim() || undefined,
        notes: notes.trim() || undefined,
        status: 'pending_review',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      setLastAppointment(submission);
      setIsSubmitting(false);
    }, 550);
  };

  const triggerConfirmedDemoPreview = () => {
    const dept = departments.find((d) => d.id === (departmentId || 'neurosurgery')) || departments[0];
    const srv = services.find((s) => s.id === (serviceId || 'srv-neuro-consult')) || services[0];
    const sampleName = patientName.trim() || (lang === 'ar' ? 'أحمد عبد الله (معاينة)' : 'Ahmed Abdullah (Demo)');
    const sampleDay = preferredDay || '2026-11-28';
    const samplePeriod = preferredPeriod || localizedConfig.bookingRules.periods[0];
    const demoRef = `ND-${Math.floor(100000 + Math.random() * 900000)}`;

    setLastAppointment({
      referenceId: demoRef,
      departmentId: dept.id,
      serviceId: srv.id,
      doctorId: doctorId || 'dr-mohammed-aljurbani',
      visitType,
      preferredDay: sampleDay,
      preferredPeriod: samplePeriod,
      patientName: sampleName,
      phone: phone.trim() || '+967 770 123 456',
      status: 'confirmed',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      confirmedDateTime: `${sampleDay} · 10:30 ${lang === 'ar' ? 'صباحًا' : 'AM'}`,
      simulatedSmsText:
        lang === 'ar'
          ? `نوديسك كلينك: عزيزي/تي ${sampleName}، تم تأكيد موعدكم (${srv.title} - ${dept.nameAr}) ليوم ${sampleDay} الساعة 10:30 صباحًا. المرجع: ${demoRef}. (رسالة SMS تجريبية للمحاكاة).`
          : `NODISC Clinic: Dear ${sampleName}, your appointment (${srv.title}) is confirmed for ${sampleDay} at 10:30 AM. Ref: ${demoRef}. (Simulated SMS preview).`,
    });
  };

  const selectedDeptObj = departments.find((d) => d.id === departmentId);
  const selectedServiceObj = services.find((s) => s.id === serviceId);
  const selectedDoctorObj = doctors.find((d) => d.id === doctorId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: t('booking.title') }]} />
        <h1 className="font-display font-bold text-3xl text-slate-900">{t('booking.title')}</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {t('booking.subtitle')}
        </p>
      </div>

      {/* Prototype Simulation Tester Toolbar */}
      <div className="bg-slate-100 rounded-xl border border-slate-200 p-4 space-y-3">
        <p className="text-xs font-semibold text-slate-700">{t('booking.scenarioBarTitle')}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setLastAppointment(null);
              setSimulateNetworkError(false);
              setPreferredDay('2026-11-28');
              setErrors({});
              setSubmitError('');
            }}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-slate-800 hover:border-[#0F4C5C]"
          >
            {t('booking.scenarios.normal')}
          </button>
          <button
            type="button"
            onClick={triggerConfirmedDemoPreview}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-[#0F4C5C] hover:bg-sky-50"
          >
            {t('booking.scenarios.confirmed')}
          </button>
          {closedDates[0] && (
            <button
              type="button"
              onClick={() => {
                setLastAppointment(null);
                const unavail = closedDates[0];
                setPreferredDay(unavail);
                setErrors((prev) => ({ ...prev, preferredDay: t('booking.errors.unavailableDay') }));
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-amber-800 hover:bg-amber-50"
            >
              {t('booking.scenarios.unavailableDate')} ({closedDates[0]})
            </button>
          )}
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-red-700 cursor-pointer">
            <input
              type="checkbox"
              checked={simulateNetworkError}
              onChange={(e) => setSimulateNetworkError(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span>{t('booking.scenarios.networkError')}</span>
          </label>
        </div>
      </div>

      {lastAppointment ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 max-w-3xl space-y-6">
          <div className="flex items-start gap-3">
            <CheckCircle2
              className={`w-7 h-7 shrink-0 mt-0.5 ${
                lastAppointment.status === 'confirmed' ? 'text-emerald-600' : 'text-[#0284C7]'
              }`}
            />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#0284C7]">
                {lastAppointment.status === 'confirmed'
                  ? t('booking.result.confirmedStatus')
                  : t('booking.result.pendingStatus')}
              </span>
              <h2 className="font-display font-bold text-2xl text-slate-900">
                {lastAppointment.status === 'confirmed'
                  ? t('booking.result.confirmedTitle')
                  : t('booking.result.pendingTitle')}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed pt-1">
                {t('booking.result.pendingDesc')}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">{t('booking.result.referenceLabel')}</span>
              <span className="font-mono font-bold text-base text-[#0F4C5C] tabular-nums" dir="ltr">
                {lastAppointment.referenceId}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t('booking.fields.patientName')}</span>
              <span className="font-semibold text-slate-900">{lastAppointment.patientName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t('booking.fields.department')}</span>
              <span className="font-medium text-slate-800">
                {departments.find((d) => d.id === lastAppointment.departmentId)?.nameAr}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t('booking.fields.service')}</span>
              <span className="font-medium text-slate-800">
                {services.find((s) => s.id === lastAppointment.serviceId)?.title}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t('booking.fields.preferredDay')}</span>
              <span className="font-medium text-slate-800 tabular-nums">
                {lastAppointment.confirmedDateTime || `${lastAppointment.preferredDay} · ${lastAppointment.preferredPeriod}`}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t('booking.fields.phone')}</span>
              <span className="font-mono font-medium text-slate-800 tabular-nums" dir="ltr">
                {lastAppointment.phone}
              </span>
            </div>
          </div>

          {lastAppointment.simulatedSmsText && (
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F4C5C]">
                <MessageSquare className="w-4 h-4" />
                <span>{t('booking.result.smsPreviewLabel')}</span>
              </div>
              <p className="text-sm text-slate-800 bg-white rounded-lg border border-sky-100 p-3.5 leading-relaxed">
                {lastAppointment.simulatedSmsText}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setLastAppointment(null)}
              className="px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold hover:bg-[#093542]"
            >
              {t('booking.result.newRequest')}
            </button>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              {t('nav.home')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6"
          >
            {prefillSource && (
              <div className="p-3.5 rounded-lg bg-sky-50 border border-sky-200 text-xs sm:text-sm text-[#093542]">
                {t('booking.prefilledBanner')} ({prefillSource})
              </div>
            )}

            {submitError && (
              <div
                role="alert"
                className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5"
              >
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Department */}
              <div>
                <label htmlFor="bk-dept" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('booking.fields.department')} *
                </label>
                <select
                  id="bk-dept"
                  value={departmentId}
                  onChange={(e) => handleDepartmentChange(e.target.value as DepartmentId | '')}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white ${
                    errors.departmentId ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">{t('booking.fields.selectDepartment')}</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nameAr}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-xs text-red-600 mt-1">{errors.departmentId}</p>
                )}
              </div>

              {/* Service */}
              <div>
                <label htmlFor="bk-service" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('booking.fields.service')} *
                </label>
                <select
                  id="bk-service"
                  value={serviceId}
                  onChange={(e) => {
                    const nextSrvId = e.target.value;
                    setServiceId(nextSrvId);
                    const matched = services.find((s) => s.id === nextSrvId);
                    if (matched) {
                      if (!departmentId) setDepartmentId(matched.departmentId);
                      if (matched.doctorId) setDoctorId(matched.doctorId);
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white ${
                    errors.serviceId ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">{t('booking.fields.selectService')}</option>
                  {availableServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                {errors.serviceId && (
                  <p className="text-xs text-red-600 mt-1">{errors.serviceId}</p>
                )}
              </div>

              {/* Doctor */}
              <div>
                <label htmlFor="bk-doctor" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('booking.fields.doctor')}
                </label>
                <select
                  id="bk-doctor"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  <option value="">{t('booking.fields.selectDoctor')}</option>
                  {availableDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Visit Type */}
              <div>
                <label htmlFor="bk-visit" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('booking.fields.visitType')}
                </label>
                <select
                  id="bk-visit"
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                >
                  {localizedConfig.bookingRules.visitTypes.map((vt) => (
                    <option key={vt} value={vt}>
                      {vt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Day */}
              <div>
                <label htmlFor="bk-day" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('booking.fields.preferredDay')} *
                </label>
                <input
                  id="bk-day"
                  type="date"
                  value={preferredDay}
                  onChange={(e) => setPreferredDay(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm tabular-nums ${
                    errors.preferredDay ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.preferredDay && (
                  <p className="text-xs text-red-600 mt-1">{errors.preferredDay}</p>
                )}
              </div>

              {/* Preferred Period */}
              <div>
                <label htmlFor="bk-period" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('booking.fields.preferredPeriod')} *
                </label>
                <select
                  id="bk-period"
                  value={preferredPeriod}
                  onChange={(e) => setPreferredPeriod(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white ${
                    errors.preferredPeriod ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  {localizedConfig.bookingRules.periods.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Name */}
              <div>
                <label htmlFor="bk-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('booking.fields.patientName')} *
                </label>
                <input
                  id="bk-name"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm ${
                    errors.patientName ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.patientName && (
                  <p className="text-xs text-red-600 mt-1">{errors.patientName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="bk-phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('booking.fields.phone')} *
                </label>
                <input
                  id="bk-phone"
                  type="tel"
                  dir="ltr"
                  placeholder="+967 770 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm tabular-nums ${
                    errors.phone ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              {/* Optional Previous File Number */}
              <div className="sm:col-span-2">
                <label htmlFor="bk-file-num" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('booking.fields.previousFileNumber')}
                </label>
                <input
                  id="bk-file-num"
                  type="text"
                  dir="ltr"
                  value={previousFileNumber}
                  onChange={(e) => setPreviousFileNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              {/* Optional Note */}
              <div className="sm:col-span-2">
                <label htmlFor="bk-notes" className="block text-sm font-semibold text-slate-800 mb-1.5">
                  {t('booking.fields.notes')}
                </label>
                <textarea
                  id="bk-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('booking.submitting')}</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>{t('booking.submitButton')}</span>
                </>
              )}
            </button>
          </form>

          {/* Live Summary Panel */}
          <aside className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 space-y-4 lg:sticky lg:top-24">
            <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              {t('booking.summaryTitle')}
            </h2>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500">{t('booking.fields.department')}</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">
                  {selectedDeptObj?.nameAr || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{t('booking.fields.service')}</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">
                  {selectedServiceObj?.title || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{t('booking.fields.doctor')}</dt>
                <dd className="font-medium text-slate-800 mt-0.5">
                  {selectedDoctorObj?.nameAr || (lang === 'ar' ? 'تحديد من فريق القسم' : 'Assigned by department')}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{t('booking.fields.visitType')}</dt>
                <dd className="text-slate-800 mt-0.5">{visitType}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">{t('booking.fields.preferredDay')}</dt>
                <dd className="text-slate-800 mt-0.5 tabular-nums">
                  {preferredDay || '—'} · {preferredPeriod}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
};
