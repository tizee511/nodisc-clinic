import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SafeImage } from '../components/SafeImage';
import { BookActionButton } from '../components/BookActionLink';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t, services, departments, doctors } = useLanguage();

  const service = services.find((s) => s.slug === slug || s.id === slug);

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'الخدمة غير متوفرة' : 'Service not found'}
        </h1>
        <Link to="/services" className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold">
          {t('nav.services')}
        </Link>
      </div>
    );
  }

  const dept = departments.find((d) => d.id === service.departmentId);
  const doctor = doctors.find((d) => d.id === service.doctorId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-10">
      <div>
        <Breadcrumbs
          items={[
            { label: t('nav.services'), to: '/services' },
            ...(dept ? [{ label: dept.nameAr, to: `/departments/${dept.slug}` }] : []),
            { label: service.title },
          ]}
        />

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-5 flex flex-col justify-center">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              {dept && (
                <Link to={`/departments/${dept.slug}`} className="text-[#0284C7] font-semibold hover:underline">
                  {dept.nameAr}
                </Link>
              )}
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {service.durationNote}
              </span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              {service.title}
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">{service.shortDesc}</p>

            <div className="space-y-2.5 pt-2">
              {service.details.map((line, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0F4C5C] mt-0.5 shrink-0" />
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <BookActionButton
                departmentId={service.departmentId}
                serviceId={service.id}
                doctorId={service.doctorId || undefined}
                sourceLabel={service.title}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('common.bookService')}</span>
              </BookActionButton>

              {doctor && (
                <Link
                  to={`/doctors/${doctor.slug}`}
                  className="px-4 py-3 rounded-lg border border-slate-300 hover:border-[#0F4C5C] text-slate-800 text-sm font-medium"
                >
                  {doctor.nameAr}
                </Link>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <SafeImage
              src={service.image}
              alt={service.title}
              aspectClass="aspect-[4/3] lg:h-full lg:aspect-auto min-h-[240px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl border border-slate-200 p-5 text-xs text-slate-600">
        {lang === 'ar'
          ? 'ملاحظة: النصوص التعريفية لهذه الخدمة قصيرة وقابلة للاستبدال بالمحتوى الطبي المعتمد الذي يرسله المركز. عند الضغط على «احجز هذه الخدمة» يتم نقل القسم والخدمة تلقائيًا إلى نموذج الموعد.'
          : 'Note: Service descriptions are structured replaceable summaries. Clicking "Book This Service" automatically passes both the department and service into the appointment form.'}
      </div>
    </div>
  );
};
