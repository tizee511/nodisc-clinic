import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FileCheck2,
  Loader2,
  MessageSquare,
  Search,
  Sparkles,
  Stethoscope,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useClinic } from '../context/ClinicContext';
import { useDataStore } from '../context/DataStoreContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { WizardStepper } from '../components/WizardStepper';
import { AppointmentSubmission, DepartmentId } from '../types/clinic';

type PatientStatus = 'new' | 'returning' | null;
type WizardStep = 1 | 2 | 3 | 4;

export const BookAppointmentPage: React.FC = () => {
  const { lang, isRTL, t, localizedConfig, departments, services, doctors } = useLanguage();
  const { bookingPrefill, clearBookingPrefill, lastAppointment, setLastAppointment } = useClinic();
  const { scheduleSettings, appointments } = useDataStore();

  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<WizardStep>(1);

  // Step 1: Patient Status
  const [patientStatus, setPatientStatus] = useState<PatientStatus>(null);
  const [lookupInput, setLookupInput] = useState<string>('');
  const [lookupState, setLookupState] = useState<'idle' | 'found' | 'not_found' | 'autofilled'>('idle');
  const [matchedRecord, setMatchedRecord] = useState<AppointmentSubmission | null>(null);

  // Step 2: Department, Service, Doctor
  const [departmentId, setDepartmentId] = useState<DepartmentId | ''>(
    bookingPrefill.departmentId || ''
  );
  const [serviceId, setServiceId] = useState<string>(bookingPrefill.serviceId || '');
  const [doctorId, setDoctorId] = useState<string>(bookingPrefill.doctorId || '');

  // Step 3: Visit Type, Day, Period
  const [visitType, setVisitType] = useState<string>(localizedConfig.bookingRules.visitTypes[0]);
  const [preferredDay, setPreferredDay] = useState<string>('2026-11-28');
  const [preferredPeriod, setPreferredPeriod] = useState<string>(
    localizedConfig.bookingRules.periods[0]
  );

  // Step 4: Contact Details
  const [patientName, setPatientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [previousFileNumber, setPreviousFileNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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

  // Keep visitType synced with language changes if it still matches an index
  useEffect(() => {
    if (!localizedConfig.bookingRules.visitTypes.includes(visitType)) {
      const idx = patientStatus === 'returning' && localizedConfig.bookingRules.visitTypes[1] ? 1 : 0;
      setVisitType(localizedConfig.bookingRules.visitTypes[idx]);
    }
    if (!localizedConfig.bookingRules.periods.includes(preferredPeriod)) {
      setPreferredPeriod(localizedConfig.bookingRules.periods[0]);
    }
  }, [localizedConfig, visitType, preferredPeriod, patientStatus]);

  const availableServices = departmentId
    ? services.filter((s) => s.departmentId === departmentId)
    : services;

  const availableDoctors = departmentId
    ? doctors.filter((d) => d.departmentId === departmentId)
    : doctors;

  const closedDates = scheduleSettings.closedDates;

  const handleSelectPatientStatus = (status: 'new' | 'returning') => {
    setPatientStatus(status);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.patientStatus;
      return copy;
    });

    if (status === 'new') {
      setPreviousFileNumber('');
      setLookupInput('');
      setLookupState('idle');
      setMatchedRecord(null);
      setVisitType(localizedConfig.bookingRules.visitTypes[0]);
    } else {
      const followUpType =
        localizedConfig.bookingRules.visitTypes[1] || localizedConfig.bookingRules.visitTypes[0];
      setVisitType(followUpType);
    }
  };

  const handleLookupExistingFile = () => {
    const raw = lookupInput.trim();
    if (!raw) return;

    const normalizedQuery = raw.toLowerCase();
    const queryDigits = raw.replace(/\D/g, '');

    const found = appointments.find((app) => {
      const fileMatch =
        app.previousFileNumber && app.previousFileNumber.toLowerCase() === normalizedQuery;
      const refMatch = app.referenceId.toLowerCase() === normalizedQuery;
      const phoneDigits = app.phone.replace(/\D/g, '');
      const phoneMatch =
        queryDigits.length >= 6 && phoneDigits.endsWith(queryDigits.slice(-9));
      return Boolean(fileMatch || refMatch || phoneMatch);
    });

    if (found) {
      setMatchedRecord(found);
      setLookupState('found');
      if (found.previousFileNumber) {
        setPreviousFileNumber(found.previousFileNumber);
      } else {
        setPreviousFileNumber(raw.toUpperCase());
      }
    } else {
      setMatchedRecord(null);
      setLookupState('not_found');
      if (!previousFileNumber.trim()) {
        setPreviousFileNumber(raw);
      }
    }
  };

  const handleAutofillMatched = () => {
    if (!matchedRecord) return;
    setPatientName(matchedRecord.patientName);
    setPhone(matchedRecord.phone);
    if (matchedRecord.previousFileNumber) {
      setPreviousFileNumber(matchedRecord.previousFileNumber);
    }
    if (!departmentId) {
      setDepartmentId(matchedRecord.departmentId);
    }
    setLookupState('autofilled');
  };

  const handleDepartmentChange = (val: DepartmentId | '') => {
    setDepartmentId(val);
    setServiceId('');
    setDoctorId('');
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.departmentId;
      return copy;
    });
  };

  const validateStep = (step: WizardStep): boolean => {
    const nextErrors: Record<string, string> = {};

    if (step === 1) {
      if (!patientStatus) {
        nextErrors.patientStatus = t('booking.errors.patientStatusRequired');
      }
    } else if (step === 2) {
      if (!departmentId) nextErrors.departmentId = t('booking.errors.departmentRequired');
      if (!serviceId) nextErrors.serviceId = t('booking.errors.serviceRequired');
    } else if (step === 3) {
      if (!preferredDay) {
        nextErrors.preferredDay = t('booking.errors.dayRequired');
      } else if (closedDates.includes(preferredDay)) {
        nextErrors.preferredDay = t('booking.errors.unavailableDay');
      }
      if (!preferredPeriod) nextErrors.preferredPeriod = t('booking.errors.periodRequired');
    } else if (step === 4) {
      if (patientName.trim().length < 3) nextErrors.patientName = t('booking.errors.nameRequired');
      if (phone.replace(/\D/g, '').length < 7) nextErrors.phone = t('booking.errors.phoneRequired');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goToNextStep = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 4) {
      const next = (currentStep + 1) as WizardStep;
      setCurrentStep(next);
      setMaxReachedStep((prev) => (next > prev ? next : prev));
      setErrors({});
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
      setErrors({});
    }
  };

  const jumpToStep = (target: WizardStep) => {
    if (target <= maxReachedStep || target < currentStep) {
      setCurrentStep(target);
      setErrors({});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError('');

    // Validate all steps sequentially if somehow reached early
    for (const s of [1, 2, 3, 4] as WizardStep[]) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
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
        previousFileNumber:
          patientStatus === 'returning' ? previousFileNumber.trim() || undefined : undefined,
        notes: notes.trim() || undefined,
        status: 'pending_review',
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };

      setLastAppointment(submission);
      setIsSubmitting(false);
    }, 550);
  };

  const handleResetNewRequest = () => {
    setLastAppointment(null);
    setCurrentStep(1);
    setMaxReachedStep(1);
    setErrors({});
    setSubmitError('');
  };

  const selectedDeptObj = departments.find((d) => d.id === departmentId);
  const selectedServiceObj = services.find((s) => s.id === serviceId);
  const selectedDoctorObj = doctors.find((d) => d.id === doctorId);

  const stepsMeta: { step: WizardStep; label: string }[] = [
    { step: 1, label: t('booking.wizard.steps.status') },
    { step: 2, label: t('booking.wizard.steps.service') },
    { step: 3, label: t('booking.wizard.steps.schedule') },
    { step: 4, label: t('booking.wizard.steps.details') },
  ];

  const patientStatusLabel =
    patientStatus === 'new'
      ? t('booking.wizard.newPatientTitle')
      : patientStatus === 'returning'
        ? t('booking.wizard.returningPatientTitle')
        : '—';

  const NextArrow = isRTL ? ArrowLeft : ArrowRight;
  const PrevArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs items={[{ label: t('booking.title') }]} />
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">{t('booking.title')}</h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {t('booking.subtitle')}
        </p>
      </div>

      {lastAppointment ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 max-w-3xl space-y-6 shadow-xs">
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
                {lastAppointment.confirmedDateTime ||
                  `${lastAppointment.preferredDay} · ${lastAppointment.preferredPeriod}`}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t('booking.fields.phone')}</span>
              <span className="font-mono font-medium text-slate-800 tabular-nums" dir="ltr">
                {lastAppointment.phone}
              </span>
            </div>
            {lastAppointment.previousFileNumber && (
              <div>
                <span className="text-xs text-slate-500 block">
                  {t('booking.fields.previousFileNumber')}
                </span>
                <span className="font-mono font-semibold text-[#0F4C5C]" dir="ltr">
                  {lastAppointment.previousFileNumber}
                </span>
              </div>
            )}
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

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetNewRequest}
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold hover:bg-[#093542]"
            >
              {t('booking.result.newRequest')}
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              {t('nav.home')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Multi-step Wizard Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Wizard Stepper Header */}
            <WizardStepper
              steps={stepsMeta}
              currentStep={currentStep}
              maxReachedStep={maxReachedStep}
              isStepCompleted={(step) =>
                (step < currentStep || step <= maxReachedStep) &&
                currentStep !== step &&
                ((step === 1 && patientStatus !== null) ||
                  (step === 2 && Boolean(departmentId && serviceId)) ||
                  (step === 3 && Boolean(preferredDay && preferredPeriod)) ||
                  step < currentStep)
              }
              onStepClick={jumpToStep}
              counterLabel={t('booking.wizard.stepCounter')
                .replace('{{current}}', String(currentStep))
                .replace('{{total}}', '4')}
            />

            <div className="p-5 sm:p-8 space-y-6">
              {prefillSource && (
                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs sm:text-sm text-[#093542] flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>
                    {t('booking.prefilledBanner')} ({prefillSource})
                  </span>
                </div>
              )}

              {submitError && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5"
                >
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* STEP 1: NEW OR PREVIOUSLY REGISTERED PATIENT */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5">
                      <h2 className="font-display font-bold text-xl text-slate-900">
                        {t('booking.wizard.step1Title')}
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {t('booking.wizard.step1Subtitle')}
                      </p>
                    </div>

                    {/* Two Prominent Choice Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleSelectPatientStatus('new')}
                        aria-pressed={patientStatus === 'new'}
                        className={`relative text-start rounded-2xl border-2 p-5 sm:p-6 transition-all flex flex-col gap-3 cursor-pointer ${
                          patientStatus === 'new'
                            ? 'border-[#0F4C5C] bg-[#0F4C5C]/[0.04] shadow-sm ring-2 ring-[#0F4C5C]/15'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`w-12 h-12 rounded-xl inline-flex items-center justify-center transition-colors ${
                              patientStatus === 'new'
                                ? 'bg-[#0F4C5C] text-white'
                                : 'bg-slate-100 text-[#0F4C5C]'
                            }`}
                          >
                            <UserPlus className="w-6 h-6" />
                          </span>
                          <span
                            className={`w-6 h-6 rounded-full border-2 inline-flex items-center justify-center transition-colors ${
                              patientStatus === 'new'
                                ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {patientStatus === 'new' && <Check className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="block font-display font-bold text-base sm:text-lg text-slate-900">
                            {t('booking.wizard.newPatientTitle')}
                          </span>
                          <span className="block text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {t('booking.wizard.newPatientDesc')}
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectPatientStatus('returning')}
                        aria-pressed={patientStatus === 'returning'}
                        className={`relative text-start rounded-2xl border-2 p-5 sm:p-6 transition-all flex flex-col gap-3 cursor-pointer ${
                          patientStatus === 'returning'
                            ? 'border-[#0F4C5C] bg-[#0F4C5C]/[0.04] shadow-sm ring-2 ring-[#0F4C5C]/15'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`w-12 h-12 rounded-xl inline-flex items-center justify-center transition-colors ${
                              patientStatus === 'returning'
                                ? 'bg-[#0F4C5C] text-white'
                                : 'bg-slate-100 text-[#0F4C5C]'
                            }`}
                          >
                            <UserCheck className="w-6 h-6" />
                          </span>
                          <span
                            className={`w-6 h-6 rounded-full border-2 inline-flex items-center justify-center transition-colors ${
                              patientStatus === 'returning'
                                ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {patientStatus === 'returning' && <Check className="w-3.5 h-3.5" />}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="block font-display font-bold text-base sm:text-lg text-slate-900">
                            {t('booking.wizard.returningPatientTitle')}
                          </span>
                          <span className="block text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {t('booking.wizard.returningPatientDesc')}
                          </span>
                        </div>
                      </button>
                    </div>

                    {errors.patientStatus && (
                      <p className="text-xs sm:text-sm font-medium text-red-600 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{errors.patientStatus}</span>
                      </p>
                    )}

                    {/* Conditional Returning Patient Quick File Lookup */}
                    <AnimatePresence>
                      {patientStatus === 'returning' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                              <FileCheck2 className="w-4 h-4 text-[#0F4C5C]" />
                              <span>{t('booking.wizard.returningLookupTitle')}</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2.5">
                              <input
                                type="text"
                                dir="ltr"
                                value={lookupInput}
                                onChange={(e) => {
                                  setLookupInput(e.target.value);
                                  setPreviousFileNumber(e.target.value);
                                  if (lookupState !== 'idle') setLookupState('idle');
                                }}
                                placeholder={t('booking.wizard.returningLookupPlaceholder')}
                                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm"
                              />
                              <button
                                type="button"
                                onClick={handleLookupExistingFile}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs sm:text-sm font-semibold shrink-0 transition-colors"
                              >
                                <Search className="w-4 h-4" />
                                <span>{t('booking.wizard.returningLookupBtn')}</span>
                              </button>
                            </div>

                            <p className="text-xs text-slate-500">
                              {t('booking.wizard.returningLookupHint')}
                            </p>

                            {lookupState === 'found' && matchedRecord && (
                              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="text-xs sm:text-sm text-emerald-900 font-medium">
                                  {t('booking.wizard.returningMatchFound').replace(
                                    '{{name}}',
                                    matchedRecord.patientName
                                  )}
                                  {matchedRecord.previousFileNumber && (
                                    <span className="font-mono font-bold mx-1.5" dir="ltr">
                                      ({matchedRecord.previousFileNumber})
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={handleAutofillMatched}
                                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shrink-0"
                                >
                                  {t('booking.wizard.returningAutofillBtn')}
                                </button>
                              </div>
                            )}

                            {lookupState === 'autofilled' && (
                              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs sm:text-sm text-emerald-800 font-medium flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{t('booking.wizard.returningAutofillDone')}</span>
                              </div>
                            )}

                            {lookupState === 'not_found' && (
                              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                {t('booking.wizard.returningNoMatch')}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* STEP 2: DEPARTMENT, SERVICE & DOCTOR */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5">
                      <h2 className="font-display font-bold text-xl text-slate-900">
                        {t('booking.wizard.step2Title')}
                      </h2>
                      <p className="text-sm text-slate-600">{t('booking.wizard.step2Subtitle')}</p>
                    </div>

                    {/* Visual Department Cards */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">
                        {t('booking.fields.department')} *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {departments.map((dept) => {
                          const selected = departmentId === dept.id;
                          return (
                            <button
                              key={dept.id}
                              type="button"
                              onClick={() => handleDepartmentChange(dept.id)}
                              className={`text-start p-4 rounded-xl border-2 transition-all flex items-start justify-between gap-3 cursor-pointer ${
                                selected
                                  ? 'border-[#0F4C5C] bg-[#0F4C5C]/[0.04] ring-1 ring-[#0F4C5C]/20'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div className="space-y-1 min-w-0">
                                <span className="block font-bold text-sm text-slate-900">
                                  {dept.nameAr}
                                </span>
                                <span className="block text-xs text-slate-500 line-clamp-1">
                                  {dept.shortDesc}
                                </span>
                              </div>
                              <span
                                className={`w-5 h-5 rounded-full border-2 inline-flex items-center justify-center shrink-0 mt-0.5 ${
                                  selected
                                    ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white'
                                    : 'border-slate-300'
                                }`}
                              >
                                {selected && <Check className="w-3 h-3" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.departmentId && (
                        <p className="text-xs text-red-600 mt-1">{errors.departmentId}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Service */}
                      <div>
                        <label
                          htmlFor="bk-service"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          {t('booking.fields.service')} *
                        </label>
                        <select
                          id="bk-service"
                          value={serviceId}
                          onChange={(e) => {
                            const nextSrvId = e.target.value;
                            setServiceId(nextSrvId);
                            setErrors((prev) => {
                              const copy = { ...prev };
                              delete copy.serviceId;
                              return copy;
                            });
                            const matched = services.find((s) => s.id === nextSrvId);
                            if (matched) {
                              if (!departmentId) setDepartmentId(matched.departmentId);
                              if (matched.doctorId) setDoctorId(matched.doctorId);
                            }
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white ${
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
                        <label
                          htmlFor="bk-doctor"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          {t('booking.fields.doctor')}
                        </label>
                        <div className="relative">
                          <select
                            id="bk-doctor"
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                          >
                            <option value="">{t('booking.fields.selectDoctor')}</option>
                            {availableDoctors.map((doc) => (
                              <option key={doc.id} value={doc.id}>
                                {doc.nameAr}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: VISIT TYPE, PREFERRED DAY & PERIOD */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5">
                      <h2 className="font-display font-bold text-xl text-slate-900">
                        {t('booking.wizard.step3Title')}
                      </h2>
                      <p className="text-sm text-slate-600">{t('booking.wizard.step3Subtitle')}</p>
                    </div>

                    {/* Visit Type Pills */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">
                        {t('booking.fields.visitType')}
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {localizedConfig.bookingRules.visitTypes.map((vt) => {
                          const selected = visitType === vt;
                          return (
                            <button
                              key={vt}
                              type="button"
                              onClick={() => setVisitType(vt)}
                              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2 ${
                                selected
                                  ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white shadow-xs'
                                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                              }`}
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              <span>{vt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preferred Day */}
                    <div className="max-w-sm">
                      <label
                        htmlFor="bk-day"
                        className="block text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        {t('booking.fields.preferredDay')} *
                      </label>
                      <input
                        id="bk-day"
                        type="date"
                        value={preferredDay}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPreferredDay(val);
                          if (closedDates.includes(val)) {
                            setErrors((prev) => ({
                              ...prev,
                              preferredDay: t('booking.errors.unavailableDay'),
                            }));
                          } else {
                            setErrors((prev) => {
                              const copy = { ...prev };
                              delete copy.preferredDay;
                              return copy;
                            });
                          }
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm tabular-nums bg-white ${
                          errors.preferredDay ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {errors.preferredDay && (
                        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.preferredDay}</span>
                        </p>
                      )}
                    </div>

                    {/* Preferred Period Cards */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">
                        {t('booking.fields.preferredPeriod')} *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {localizedConfig.bookingRules.periods.map((period) => {
                          const selected = preferredPeriod === period;
                          return (
                            <button
                              key={period}
                              type="button"
                              onClick={() => setPreferredPeriod(period)}
                              className={`text-start p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                selected
                                  ? 'border-[#0F4C5C] bg-[#0F4C5C]/[0.04] ring-1 ring-[#0F4C5C]/20'
                                  : 'border-slate-200 hover:border-slate-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span
                                  className={`w-9 h-9 rounded-lg inline-flex items-center justify-center shrink-0 ${
                                    selected
                                      ? 'bg-[#0F4C5C] text-white'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  <Clock className="w-4 h-4" />
                                </span>
                                <span className="font-semibold text-xs sm:text-sm text-slate-900">
                                  {period}
                                </span>
                              </div>
                              <span
                                className={`w-5 h-5 rounded-full border-2 inline-flex items-center justify-center shrink-0 ${
                                  selected
                                    ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white'
                                    : 'border-slate-300'
                                }`}
                              >
                                {selected && <Check className="w-3 h-3" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.preferredPeriod && (
                        <p className="text-xs text-red-600 mt-1">{errors.preferredPeriod}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: PATIENT CONTACT DETAILS & FINAL CONFIRMATION */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5">
                      <h2 className="font-display font-bold text-xl text-slate-900">
                        {t('booking.wizard.step4Title')}
                      </h2>
                      <p className="text-sm text-slate-600">{t('booking.wizard.step4Subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Patient Name */}
                      <div>
                        <label
                          htmlFor="bk-name"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          {t('booking.fields.patientName')} *
                        </label>
                        <input
                          id="bk-name"
                          type="text"
                          value={patientName}
                          onChange={(e) => {
                            setPatientName(e.target.value);
                            if (errors.patientName) {
                              setErrors((prev) => {
                                const copy = { ...prev };
                                delete copy.patientName;
                                return copy;
                              });
                            }
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white ${
                            errors.patientName ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                        {errors.patientName && (
                          <p className="text-xs text-red-600 mt-1">{errors.patientName}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="bk-phone"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          {t('booking.fields.phone')} *
                        </label>
                        <input
                          id="bk-phone"
                          type="tel"
                          dir="ltr"
                          placeholder="+967 770 000 000"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) {
                              setErrors((prev) => {
                                const copy = { ...prev };
                                delete copy.phone;
                                return copy;
                              });
                            }
                          }}
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm tabular-nums bg-white ${
                            errors.phone ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                        )}
                      </div>

                      {/* Previous File Number if Returning */}
                      {patientStatus === 'returning' && (
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="bk-file-num"
                            className="block text-sm font-semibold text-slate-800 mb-1.5"
                          >
                            {t('booking.fields.previousFileNumber')}
                          </label>
                          <input
                            id="bk-file-num"
                            type="text"
                            dir="ltr"
                            placeholder="MR-2210"
                            value={previousFileNumber}
                            onChange={(e) => setPreviousFileNumber(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                          />
                        </div>
                      )}

                      {/* Optional Note */}
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="bk-notes"
                          className="block text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          {t('booking.fields.notes')}
                        </label>
                        <textarea
                          id="bk-notes"
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>
                    </div>

                    {/* Compact Final Review Box */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                      <h3 className="text-xs font-bold text-slate-700">
                        {t('booking.wizard.reviewBoxTitle')}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-700">
                        <div>
                          <span className="text-slate-500">
                            {t('booking.wizard.patientStatusLabel')}:{' '}
                          </span>
                          <span className="font-semibold text-slate-900">{patientStatusLabel}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">{t('booking.fields.department')}: </span>
                          <span className="font-semibold text-slate-900">
                            {selectedDeptObj?.nameAr || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">{t('booking.fields.service')}: </span>
                          <span className="font-semibold text-slate-900">
                            {selectedServiceObj?.title || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">
                            {t('booking.fields.preferredDay')}:{' '}
                          </span>
                          <span className="font-semibold text-slate-900 tabular-nums">
                            {preferredDay} · {preferredPeriod}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step Footer Navigation */}
              <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
                <div className="w-full sm:w-auto">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={goToPrevStep}
                      className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
                    >
                      <PrevArrow className="w-4 h-4" />
                      <span>{t('booking.wizard.prevBtn')}</span>
                    </button>
                  )}
                </div>

                <div className="w-full sm:w-auto">
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors shadow-xs"
                    >
                      <span>{t('booking.wizard.nextBtn')}</span>
                      <NextArrow className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#0F4C5C] hover:bg-[#093542] disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-xs"
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
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Live Summary Panel */}
          <aside className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 lg:sticky lg:top-24 shadow-xs">
            <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              {t('booking.summaryTitle')}
            </h2>

            <dl className="space-y-3.5 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <dt className="text-xs text-slate-500">{t('booking.wizard.patientStatusLabel')}</dt>
                  <dd className="font-semibold text-slate-900 mt-0.5">{patientStatusLabel}</dd>
                  {patientStatus === 'returning' && previousFileNumber.trim() && (
                    <dd className="text-xs font-mono text-[#0F4C5C] mt-0.5" dir="ltr">
                      {previousFileNumber}
                    </dd>
                  )}
                </div>
                {currentStep !== 1 && (
                  <button
                    type="button"
                    onClick={() => jumpToStep(1)}
                    className="text-xs font-semibold text-[#0F4C5C] hover:underline shrink-0"
                  >
                    {t('booking.wizard.editStep')}
                  </button>
                )}
              </div>

              <div className="flex items-start justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="space-y-2 min-w-0">
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
                      {selectedDoctorObj?.nameAr ||
                        (lang === 'ar' ? 'يُحدّد حسب القسم' : 'Assigned by department')}
                    </dd>
                  </div>
                </div>
                {maxReachedStep >= 2 && currentStep !== 2 && (
                  <button
                    type="button"
                    onClick={() => jumpToStep(2)}
                    className="text-xs font-semibold text-[#0F4C5C] hover:underline shrink-0"
                  >
                    {t('booking.wizard.editStep')}
                  </button>
                )}
              </div>

              <div className="flex items-start justify-between gap-2 pt-2 border-t border-slate-100">
                <div className="space-y-2 min-w-0">
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
                </div>
                {maxReachedStep >= 3 && currentStep !== 3 && (
                  <button
                    type="button"
                    onClick={() => jumpToStep(3)}
                    className="text-xs font-semibold text-[#0F4C5C] hover:underline shrink-0"
                  >
                    {t('booking.wizard.editStep')}
                  </button>
                )}
              </div>

              {(patientName.trim() || phone.trim()) && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <dt className="text-xs text-slate-500">{t('booking.fields.patientName')}</dt>
                  <dd className="font-semibold text-slate-900">{patientName || '—'}</dd>
                  {phone.trim() && (
                    <dd className="text-xs font-mono text-slate-700 tabular-nums" dir="ltr">
                      {phone}
                    </dd>
                  )}
                </div>
              )}
            </dl>
          </aside>
        </div>
      )}
    </div>
  );
};
