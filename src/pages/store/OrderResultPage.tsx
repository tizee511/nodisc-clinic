import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageSquare, Printer } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const OrderResultPage: React.FC = () => {
  const { lang, t, localizedConfig } = useLanguage();
  const { lastOrder, formatPrice } = useClinic();

  if (!lastOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {lang === 'ar' ? 'لا يوجد طلب حديث في الجلسة' : 'No recent order found'}
        </h1>
        <Link to="/store" className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold">
          {t('store.orderResult.continueShopping')}
        </Link>
      </div>
    );
  }

  const whatsappConfirmUrl = localizedConfig.contact.whatsappUrl
    ? `${localizedConfig.contact.whatsappUrl}?text=${encodeURIComponent(
        lang === 'ar'
          ? `مرحبًا صيدلية نوديسك كلينك، أود متابعة طلبي رقم ${lastOrder.orderNumber} بمبلغ ${lastOrder.total.toLocaleString('en-US')} ر.ي.${
              lastOrder.paymentReference ? ` رقم المرجع: ${lastOrder.paymentReference}` : ''
            }`
          : `Hello NODISC Pharmacy, I would like to follow up on Order ${lastOrder.orderNumber} totaling ${lastOrder.total.toLocaleString('en-US')} YER.${
              lastOrder.paymentReference ? ` Ref: ${lastOrder.paymentReference}` : ''
            }`
      )}`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <Breadcrumbs
        items={[
          { label: t('nav.store'), to: '/store' },
          { label: t('store.orderResult.title') },
        ]}
      />

      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
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

          <button
            type="button"
            onClick={() => window.print()}
            className="print:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 hover:border-[#0F4C5C] text-xs font-semibold text-slate-700"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'ar' ? 'طباعة الإيصال' : 'Print Receipt'}</span>
          </button>
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
            <span className="text-xs text-slate-500 block">{t('store.checkout.deliveryMethod')}</span>
            <span className="font-medium text-slate-800">
              {lastOrder.deliveryMethod === 'pickup'
                ? t('store.checkout.deliveryPickup')
                : `${t('store.checkout.deliveryHome')} — ${lastOrder.address || ''}`}
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-xs text-slate-500 block">{t('store.checkout.paymentSection')}</span>
            <span className="font-semibold text-slate-900">
              {lastOrder.paymentMode === 'cod'
                ? lastOrder.deliveryMethod === 'pickup'
                  ? lang === 'ar'
                    ? 'نقدًا في صيدلية المركز'
                    : 'Cash at Clinic Pharmacy'
                  : t('store.checkout.cod')
                : lastOrder.paymentMode === 'epayment'
                ? lastOrder.paymentNetwork || t('store.checkout.epayment')
                : t('store.checkout.splitToggle')}
            </span>
            {lastOrder.paymentAccountHint && (
              <span className="block text-xs text-slate-600 mt-0.5">{lastOrder.paymentAccountHint}</span>
            )}
            {(lastOrder.paymentReference || lastOrder.paymentSenderName || lastOrder.paymentReceiptName) && (
              <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700">
                {lastOrder.paymentReference && (
                  <span>
                    {lang === 'ar' ? 'مرجع التحويل:' : 'Transfer Ref:'}{' '}
                    <strong className="font-mono text-[#0F4C5C]" dir="ltr">
                      {lastOrder.paymentReference}
                    </strong>
                  </span>
                )}
                {lastOrder.paymentSenderName && (
                  <span>
                    {lang === 'ar' ? 'باسم المحوّل:' : 'Sender:'} <strong>{lastOrder.paymentSenderName}</strong>
                  </span>
                )}
                {lastOrder.paymentReceiptName && (
                  <span>
                    {lang === 'ar' ? 'الإشعار المرفق:' : 'Receipt File:'}{' '}
                    <strong>{lastOrder.paymentReceiptName}</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {lastOrder.splitDetails && (
          <div className="p-4 rounded-lg bg-sky-50 border border-sky-200 text-xs space-y-1">
            <p className="font-semibold text-[#0F4C5C]">
              {lang === 'ar' ? 'تفاصيل الدفع بوسيلتين:' : 'Split Payment Breakdown:'}
            </p>
            <p>
              {lastOrder.splitDetails.method1}:{' '}
              <strong className="tabular-nums">{formatPrice(lastOrder.splitDetails.amount1)}</strong>
            </p>
            <p>
              {lastOrder.splitDetails.method2}:{' '}
              <strong className="tabular-nums">{formatPrice(lastOrder.splitDetails.amount2)}</strong>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="font-display font-bold text-base text-slate-900">
            {lang === 'ar' ? 'تفاصيل المنتجات والفاتورة' : 'Items & Billing Summary'}
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
            <li className="py-2.5 flex justify-between text-xs text-slate-600">
              <span>{t('store.cart.deliveryFee')}</span>
              <span className="tabular-nums">
                {lastOrder.deliveryFee === 0 ? t('store.cart.freeDelivery') : formatPrice(lastOrder.deliveryFee)}
              </span>
            </li>
            <li className="py-3 flex justify-between font-bold text-slate-900">
              <span>{t('store.cart.total')}</span>
              <span className="text-[#0F4C5C] tabular-nums">{formatPrice(lastOrder.total)}</span>
            </li>
          </ul>
        </div>

        <div className="print:hidden flex flex-wrap items-center gap-3">
          {whatsappConfirmUrl && (
            <a
              href={whatsappConfirmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>
                {lang === 'ar'
                  ? 'إرسال رقم الطلب أو الإشعار عبر واتساب'
                  : 'Send Order / Receipt via WhatsApp'}
              </span>
            </a>
          )}
          <Link
            to="/store"
            className="inline-flex px-6 py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors"
          >
            {t('store.orderResult.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
};
