import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const OrderResultPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { lastOrder, formatPrice } = useClinic();

  if (!lastOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'لا يوجد طلب حديث في الجلسة' : 'No recent demo order found'}
        </h1>
        <Link to="/store" className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold">
          {t('store.orderResult.continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <Breadcrumbs
        items={[
          { label: t('nav.store'), to: '/store' },
          { label: t('store.orderResult.title') },
        ]}
      />

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 space-y-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#0284C7]">
              {t('store.orderResult.status')}
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              {t('store.orderResult.title')}
            </h1>
            <p className="text-sm text-slate-600 pt-1">{t('store.orderResult.followUpNote')}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-500 block">{t('store.orderResult.orderNumber')}</span>
            <span className="font-mono font-bold text-base text-[#0F4C5C] tabular-nums" dir="ltr">
              {lastOrder.orderNumber}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">{t('store.cart.total')}</span>
            <span className="font-bold text-base text-slate-900 tabular-nums">
              {formatPrice(lastOrder.total)}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">{t('booking.fields.patientName')}</span>
            <span className="font-medium text-slate-800">{lastOrder.customerName}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">{t('store.checkout.paymentSection')}</span>
            <span className="font-medium text-slate-800">
              {lastOrder.paymentMode === 'cod'
                ? t('store.checkout.cod')
                : lastOrder.paymentMode === 'epayment'
                ? `${t('store.checkout.epayment')} (${lastOrder.paymentNetwork || ''})`
                : t('store.checkout.splitToggle')}
            </span>
          </div>
        </div>

        {lastOrder.splitDetails && (
          <div className="p-4 rounded-lg bg-sky-50 border border-sky-200 text-xs space-y-1">
            <p className="font-semibold text-[#0F4C5C]">
              {lang === 'ar' ? 'تفاصيل الدفع بوسيلتين (معاينة):' : 'Split Payment Breakdown:'}
            </p>
            <p>
              {lastOrder.splitDetails.method1}: <strong className="tabular-nums">{formatPrice(lastOrder.splitDetails.amount1)}</strong>
            </p>
            <p>
              {lastOrder.splitDetails.method2}: <strong className="tabular-nums">{formatPrice(lastOrder.splitDetails.amount2)}</strong>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="font-display font-bold text-base text-slate-900">
            {lang === 'ar' ? 'تفاصيل المنتجات المطلوبة' : 'Ordered Items'}
          </h2>
          <ul className="divide-y divide-slate-100 border border-slate-200 rounded-lg px-4 text-sm">
            {lastOrder.items.map((item, idx) => (
              <li key={idx} className="py-3 flex justify-between gap-4">
                <span>
                  {item.name} {item.option ? `(${item.option})` : ''} ×{' '}
                  <strong className="tabular-nums">{item.quantity}</strong>
                </span>
                <span className="font-semibold tabular-nums">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/store"
          className="inline-flex px-6 py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold"
        >
          {t('store.orderResult.continueShopping')}
        </Link>
      </div>
    </div>
  );
};
