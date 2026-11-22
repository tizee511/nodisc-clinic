import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, FileText, FileUp, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const PrescriptionOrderPage: React.FC = () => {
  const { lang, t, localizedConfig } = useLanguage();
  const { lastPrescription, setLastPrescription } = useClinic();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const chosen = e.target.files?.[0];
    if (!chosen) return;

    const maxBytes = localizedConfig.prescriptionRules.maxFileSizeMB * 1024 * 1024;
    if (!localizedConfig.prescriptionRules.allowedExtensions.includes(chosen.type)) {
      setErrorMsg(
        lang === 'ar'
          ? 'صيغة الملف غير مدعومة. يُرجى إرفاق صورة (JPG/PNG/WEBP) أو ملف PDF.'
          : 'Unsupported file type. Please attach an image (JPG/PNG/WEBP) or PDF.'
      );
      return;
    }

    if (chosen.size > maxBytes) {
      setErrorMsg(
        lang === 'ar'
          ? `حجم الملف يتجاوز الحد المسموح (${localizedConfig.prescriptionRules.maxFileSizeMB} ميجابايت).`
          : `File size exceeds maximum (${localizedConfig.prescriptionRules.maxFileSizeMB} MB).`
      );
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(chosen);
    if (chosen.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(chosen));
    } else {
      setPreviewUrl(undefined);
    }
  };

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!file) {
      setErrorMsg(
        lang === 'ar' ? 'يرجى إرفاق صورة الوصفة الطبية أولًا.' : 'Please attach a prescription file first.'
      );
      return;
    }
    if (name.trim().length < 3 || phone.replace(/\D/g, '').length < 7) {
      setErrorMsg(
        lang === 'ar'
          ? 'يرجى كتابة الاسم الكامل ورقم الهاتف الصحيح.'
          : 'Please enter a valid full name and phone number.'
      );
      return;
    }

    setLastPrescription({
      referenceId: `RX-${Math.floor(100000 + Math.random() * 900000)}`,
      patientName: name.trim(),
      phone: phone.trim(),
      notes: notes.trim() || undefined,
      fileName: file.name,
      fileSizeLabel: `${(file.size / 1024).toFixed(0)} KB`,
      fileType: file.type,
      previewUrl,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'new',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: t('nav.store'), to: '/store' },
            { label: t('store.prescription.title') },
          ]}
        />
        <h1 className="font-display font-bold text-3xl text-slate-900">
          {t('store.prescription.title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          {t('store.prescription.subtitle')}
        </p>
      </div>

      {lastPrescription ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 space-y-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-[#0284C7]">
                {t('store.prescription.resultStatus')}
              </span>
              <h2 className="font-display font-bold text-2xl text-slate-900 mt-0.5">
                {t('store.prescription.resultTitle')}
              </h2>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">{t('booking.result.referenceLabel')}</span>
              <span className="font-mono font-bold text-base text-[#0F4C5C] tabular-nums" dir="ltr">
                {lastPrescription.referenceId}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t('booking.fields.patientName')}</span>
              <span className="font-semibold text-slate-900">{lastPrescription.patientName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">{t('booking.fields.phone')}</span>
              <span className="font-mono text-slate-800 tabular-nums" dir="ltr">
                {lastPrescription.phone}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">
                {lang === 'ar' ? 'الملف المرفق' : 'Attached File'}
              </span>
              <span className="text-slate-800">
                {lastPrescription.fileName} ({lastPrescription.fileSizeLabel})
              </span>
            </div>
          </div>

          {lastPrescription.previewUrl && (
            <div className="max-w-sm rounded-lg overflow-hidden border border-slate-200">
              <img
                src={lastPrescription.previewUrl}
                alt={lastPrescription.fileName}
                className="w-full h-auto object-contain max-h-64 bg-slate-50"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setLastPrescription(null);
                handleRemoveFile();
                setName('');
                setPhone('');
                setNotes('');
              }}
              className="px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold"
            >
              {lang === 'ar' ? 'إرسال وصفة أخرى' : 'Submit Another Prescription'}
            </button>
            <Link
              to="/store"
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium"
            >
              {t('store.orderResult.continueShopping')}
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6"
        >
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {errorMsg}
            </div>
          )}

          {/* File Upload & Preview */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800">
              {t('store.prescription.dropLabel')} *
            </label>
            <p className="text-xs text-slate-500">{localizedConfig.prescriptionRules.helperText}</p>

            {!file ? (
              <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#0F4C5C] bg-slate-50 cursor-pointer transition-colors text-center">
                <FileUp className="w-8 h-8 text-[#0F4C5C] mb-2" />
                <span className="text-sm font-semibold text-slate-800">
                  {t('store.prescription.dropLabel')}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-[#0F4C5C] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        {(file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{t('store.prescription.removeFile')}</span>
                  </button>
                </div>

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="max-h-64 rounded-lg border border-slate-200 bg-white object-contain"
                  />
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rx-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                {t('booking.fields.patientName')} *
              </label>
              <input
                id="rx-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label htmlFor="rx-phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
                {t('booking.fields.phone')} *
              </label>
              <input
                id="rx-phone"
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm tabular-nums"
              />
            </div>
          </div>

          <div>
            <label htmlFor="rx-notes" className="block text-sm font-semibold text-slate-800 mb-1.5">
              {t('booking.fields.notes')}
            </label>
            <textarea
              id="rx-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
          >
            {t('store.prescription.submitBtn')}
          </button>
        </form>
      )}
    </div>
  );
};
