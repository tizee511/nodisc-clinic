import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { OrderRecord } from '../../types/clinic';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, t, products, localizedConfig } = useLanguage();
  const { cart, cartSubtotalYER, formatPrice, clearCart, setLastOrder } = useClinic();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [paymentMode, setPaymentMode] = useState<'cod' | 'epayment' | 'split'>('cod');
  const [selectedNetwork, setSelectedNetwork] = useState(
    localizedConfig.payment.ePaymentNetworks[0].id
  );
  const [showSplitPreview, setShowSplitPreview] = useState(false);

  const deliveryFee =
    deliveryMethod === 'pickup' || cartSubtotalYER >= localizedConfig.payment.freeDeliveryThresholdYER
      ? 0
      : localizedConfig.payment.deliveryFeeYER;
  const paymentFee =
    paymentMode === 'cod'
      ? localizedConfig.payment.codFeeYER
      : localizedConfig.payment.ePaymentFeeYER;
  const totalYER = cartSubtotalYER + deliveryFee + paymentFee;

  const [splitMethod1, setSplitMethod1] = useState(localizedConfig.payment.codLabel);
  const [splitAmount1, setSplitAmount1] = useState<string>(String(Math.floor(totalYER / 2)));
  const [splitMethod2, setSplitMethod2] = useState(
    localizedConfig.payment.ePaymentNetworks[0].name
  );
  const [splitAmount2, setSplitAmount2] = useState<string>(
    String(totalYER - Math.floor(totalYER / 2))
  );

  const [simulateFail, setSimulateFail] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          {t('store.cart.emptyTitle')}
        </h1>
        <Link to="/store" className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold">
          {t('store.cart.browseStore')}
        </Link>
      </div>
    );
  }

  const num1 = Number(splitAmount1) || 0;
  const num2 = Number(splitAmount2) || 0;
  const splitSum = num1 + num2;
  const splitRemaining = totalYER - splitSum;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError('');

    const nextErrors: Record<string, string> = {};
    if (customerName.trim().length < 3) nextErrors.customerName = t('booking.errors.nameRequired');
    if (phone.replace(/\D/g, '').length < 7) nextErrors.phone = t('booking.errors.phoneRequired');
    if (deliveryMethod === 'delivery' && address.trim().length < 5) {
      nextErrors.address =
        lang === 'ar' ? 'يرجى إدخال عنوان التوصيل.' : 'Please enter your delivery address.';
    }
    if (paymentMode === 'split' && Math.abs(splitRemaining) > 0.01) {
      nextErrors.split = t('store.checkout.splitMismatch');
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      if (simulateFail) {
        setIsSubmitting(false);
        setSubmitError(t('store.checkout.paymentFailedError'));
        return;
      }

      const networkObj = localizedConfig.payment.ePaymentNetworks.find(
        (n) => n.id === selectedNetwork
      );

      const order: OrderRecord = {
        orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryMethod,
        address: deliveryMethod === 'delivery' ? address.trim() : undefined,
        notes: notes.trim() || undefined,
        paymentMode,
        paymentNetwork: paymentMode === 'epayment' ? networkObj?.name : undefined,
        splitDetails:
          paymentMode === 'split'
            ? {
                method1: splitMethod1,
                amount1: num1,
                method2: splitMethod2,
                amount2: num2,
              }
            : undefined,
        items: cart
          .map((c) => {
            const p = products.find((item) => item.id === c.productId);
            if (!p) return null;
            return {
              productId: p.id,
              name: p.name,
              unit: p.unit,
              option: c.selectedOption,
              quantity: c.quantity,
              unitPrice: p.priceYER,
              categoryId: p.categoryId,
              mainSectionId: p.mainSectionId,
              supplier: p.supplier,
            };
          })
          .filter((x): x is NonNullable<typeof x> => x !== null),
        subtotal: cartSubtotalYER,
        deliveryFee,
        paymentFee,
        total: totalYER,
        fulfillmentStatus: 'pending_review',
        stockReserved: false,
      };

      setLastOrder(order);
      clearCart();
      setIsSubmitting(false);
      navigate('/store/order-result');
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: t('nav.store'), to: '/store' },
            { label: t('store.cart.title'), to: '/store/cart' },
            { label: t('store.checkout.title') },
          ]}
        />
        <h1 className="font-display font-bold text-3xl text-slate-900">
          {t('store.checkout.title')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {submitError && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5"
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Contact & Delivery */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-display font-bold text-lg text-slate-900">
              {t('store.checkout.contactSection')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="chk-name" className="block text-sm font-medium text-slate-700 mb-1">
                  {t('booking.fields.patientName')} *
                </label>
                <input
                  id="chk-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm ${
                    errors.customerName ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label htmlFor="chk-phone" className="block text-sm font-medium text-slate-700 mb-1">
                  {t('booking.fields.phone')} *
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm tabular-nums ${
                    errors.phone ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-medium text-slate-700">
                {t('store.checkout.deliveryMethod')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3.5 rounded-lg border cursor-pointer flex items-center gap-2.5 text-sm ${
                    deliveryMethod === 'delivery'
                      ? 'border-[#0F4C5C] bg-sky-50/70 font-semibold text-[#0F4C5C]'
                      : 'border-slate-300 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'delivery'}
                    onChange={() => setDeliveryMethod('delivery')}
                  />
                  <span>{t('store.checkout.deliveryHome')}</span>
                </label>
                <label
                  className={`p-3.5 rounded-lg border cursor-pointer flex items-center gap-2.5 text-sm ${
                    deliveryMethod === 'pickup'
                      ? 'border-[#0F4C5C] bg-sky-50/70 font-semibold text-[#0F4C5C]'
                      : 'border-slate-300 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => setDeliveryMethod('pickup')}
                  />
                  <span>{t('store.checkout.deliveryPickup')}</span>
                </label>
              </div>
            </div>

            {deliveryMethod === 'delivery' && (
              <div>
                <label htmlFor="chk-address" className="block text-sm font-medium text-slate-700 mb-1">
                  {t('store.checkout.address')} *
                </label>
                <input
                  id="chk-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm ${
                    errors.address ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
              </div>
            )}

            <div>
              <label htmlFor="chk-notes" className="block text-sm font-medium text-slate-700 mb-1">
                {t('booking.fields.notes')}
              </label>
              <textarea
                id="chk-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
              />
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display font-bold text-lg text-slate-900">
                {t('store.checkout.paymentSection')}
              </h2>

              {localizedConfig.features.showDualPaymentPreview && (
                <label className="inline-flex items-center gap-2 text-xs font-medium text-[#0F4C5C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSplitPreview}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setShowSplitPreview(next);
                      if (!next && paymentMode === 'split') setPaymentMode('cod');
                      if (next) setPaymentMode('split');
                    }}
                  />
                  <span>{t('store.checkout.splitToggle')}</span>
                </label>
              )}
            </div>

            <div className="space-y-3">
              <label
                className={`block p-4 rounded-lg border cursor-pointer ${
                  paymentMode === 'cod'
                    ? 'border-[#0F4C5C] bg-sky-50/60'
                    : 'border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-900">
                  <input
                    type="radio"
                    name="paymentMode"
                    checked={paymentMode === 'cod'}
                    onChange={() => setPaymentMode('cod')}
                  />
                  <span>{t('store.checkout.cod')}</span>
                </div>
              </label>

              <label
                className={`block p-4 rounded-lg border cursor-pointer space-y-3 ${
                  paymentMode === 'epayment'
                    ? 'border-[#0F4C5C] bg-sky-50/60'
                    : 'border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-900">
                  <input
                    type="radio"
                    name="paymentMode"
                    checked={paymentMode === 'epayment'}
                    onChange={() => setPaymentMode('epayment')}
                  />
                  <span>{t('store.checkout.epayment')}</span>
                </div>

                {paymentMode === 'epayment' && (
                  <div className="ps-6 space-y-2">
                    <label htmlFor="chk-network" className="block text-xs font-medium text-slate-600">
                      {t('store.checkout.selectNetwork')}
                    </label>
                    <select
                      id="chk-network"
                      value={selectedNetwork}
                      onChange={(e) => setSelectedNetwork(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      {localizedConfig.payment.ePaymentNetworks.map((net) => (
                        <option key={net.id} value={net.id}>
                          {net.name} — {net.accountHint}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </label>

              {/* Split / Dual Payment Preview */}
              {showSplitPreview && localizedConfig.features.showDualPaymentPreview && (
                <div
                  className={`p-4 rounded-lg border space-y-4 ${
                    paymentMode === 'split'
                      ? 'border-[#0F4C5C] bg-sky-50/60'
                      : 'border-slate-300'
                  }`}
                >
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-900 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentMode === 'split'}
                      onChange={() => setPaymentMode('split')}
                    />
                    <span>{t('store.checkout.splitToggle')}</span>
                  </label>

                  {paymentMode === 'split' && (
                    <div className="space-y-4 ps-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-600 mb-1">
                            {t('store.checkout.splitMethod1')} (YER)
                          </label>
                          <select
                            value={splitMethod1}
                            onChange={(e) => setSplitMethod1(e.target.value)}
                            className="w-full px-2.5 py-2 rounded border border-slate-300 text-xs bg-white mb-2"
                          >
                            <option value={localizedConfig.payment.codLabel}>
                              {localizedConfig.payment.codLabel}
                            </option>
                            {localizedConfig.payment.ePaymentNetworks.map((n) => (
                              <option key={n.id} value={n.name}>
                                {n.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min={0}
                            value={splitAmount1}
                            onChange={(e) => setSplitAmount1(e.target.value)}
                            className="w-full px-3 py-2 rounded border border-slate-300 text-sm tabular-nums bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-600 mb-1">
                            {t('store.checkout.splitMethod2')} (YER)
                          </label>
                          <select
                            value={splitMethod2}
                            onChange={(e) => setSplitMethod2(e.target.value)}
                            className="w-full px-2.5 py-2 rounded border border-slate-300 text-xs bg-white mb-2"
                          >
                            {localizedConfig.payment.ePaymentNetworks.map((n) => (
                              <option key={n.id} value={n.name}>
                                {n.name}
                              </option>
                            ))}
                            <option value={localizedConfig.payment.codLabel}>
                              {localizedConfig.payment.codLabel}
                            </option>
                          </select>
                          <input
                            type="number"
                            min={0}
                            value={splitAmount2}
                            onChange={(e) => setSplitAmount2(e.target.value)}
                            className="w-full px-3 py-2 rounded border border-slate-300 text-sm tabular-nums bg-white"
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded bg-white border border-slate-200 text-xs flex flex-wrap justify-between gap-2 tabular-nums">
                        <span>
                          {t('store.checkout.splitSum')}: <strong>{formatPrice(splitSum)}</strong>
                        </span>
                        <span
                          className={
                            Math.abs(splitRemaining) > 0.01
                              ? 'text-red-600 font-semibold'
                              : 'text-emerald-700 font-semibold'
                          }
                        >
                          {t('store.checkout.splitRemaining')}: {formatPrice(splitRemaining)}
                        </span>
                      </div>
                      {errors.split && <p className="text-xs text-red-600">{errors.split}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500">{localizedConfig.payment.collectionNote}</p>

            <label className="inline-flex items-center gap-2 text-xs text-red-700 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={simulateFail}
                onChange={(e) => setSimulateFail(e.target.checked)}
              />
              <span>{t('store.checkout.simulateFailToggle')}</span>
            </label>
          </section>
        </div>

        {/* Summary & Place Order */}
        <aside className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 space-y-5 lg:sticky lg:top-24">
          <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            {t('booking.summaryTitle')}
          </h2>

          <ul className="space-y-2.5 text-xs divide-y divide-slate-100">
            {cart.map((item) => {
              const p = products.find((x) => x.id === item.productId);
              if (!p) return null;
              return (
                <li key={`${item.productId}-${item.selectedOption || ''}`} className="pt-2 flex justify-between gap-2">
                  <span className="text-slate-700">
                    {p.name} × <strong className="tabular-nums">{item.quantity}</strong>
                  </span>
                  <span className="font-semibold text-slate-900 tabular-nums shrink-0">
                    {formatPrice(p.priceYER * item.quantity)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="pt-3 border-t border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">{t('store.cart.subtotal')}</span>
              <span className="tabular-nums">{formatPrice(cartSubtotalYER)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t('store.cart.deliveryFee')}</span>
              <span className="tabular-nums">
                {deliveryFee === 0 ? t('store.cart.freeDelivery') : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t border-slate-100">
              <span>{t('store.cart.total')}</span>
              <span className="text-[#0F4C5C] tabular-nums">{formatPrice(totalYER)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{t('store.checkout.placeOrder')}</span>
          </button>
        </aside>
      </form>
    </div>
  );
};
