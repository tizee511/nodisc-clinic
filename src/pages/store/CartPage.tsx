import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { STORE_COUPONS, useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SafeImage } from '../../components/SafeImage';

export const CartPage: React.FC = () => {
  const { lang, t, products, localizedConfig } = useLanguage();
  const {
    cart,
    cartSubtotalYER,
    appliedCoupon,
    couponDiscountYER,
    applyCoupon,
    clearCoupon,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    formatPrice,
  } = useClinic();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const deliveryFee =
    cartSubtotalYER >= localizedConfig.payment.freeDeliveryThresholdYER || cart.length === 0
      ? 0
      : localizedConfig.payment.deliveryFeeYER;
  const totalYER = Math.max(0, cartSubtotalYER - couponDiscountYER) + deliveryFee;

  const handleApplyCoupon = (code: string) => {
    const res = applyCoupon(code);
    setCouponMsg({ ok: res.ok, text: res.message });
    if (res.ok) setCouponInput('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: t('nav.store'), to: '/store' },
            { label: t('store.cart.title') },
          ]}
        />
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">{t('store.cart.title')}</h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="font-display font-bold text-xl text-slate-900">
            {t('store.cart.emptyTitle')}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">{t('store.cart.emptyDesc')}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/store"
              className="btn-interactive btn-sheen px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border border-sky-300/35 text-sm font-bold shadow-xs"
            >
              {t('store.cart.browseStore')}
            </Link>
            <Link
              to="/store/prescription"
              className="btn-interactive px-6 py-2.5 rounded-xl border-2 border-[#0F4C5C]/25 bg-white hover:border-[#0284C7] text-[#0F4C5C] text-sm font-bold"
            >
              {t('nav.prescriptionOrder')}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {cart.map((item) => {
              const prd = products.find((p) => p.id === item.productId);
              if (!prd) return null;

              return (
                <div
                  key={`${item.productId}-${item.selectedOption || 'default'}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <SafeImage
                      src={prd.image}
                      alt={prd.name}
                      aspectClass="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg border border-slate-200"
                    />
                    <div className="space-y-1 min-w-0">
                      <Link
                        to={`/store/product/${prd.slug}`}
                        className="font-display font-bold text-sm sm:text-base text-slate-900 hover:text-[#0F4C5C] block"
                      >
                        {prd.name}
                      </Link>
                      <div className="text-xs text-slate-500 flex flex-wrap gap-2">
                        <span>{prd.unit}</span>
                        {item.selectedOption && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{item.selectedOption}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#0F4C5C] tabular-nums">
                        {formatPrice(prd.priceYER)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-4">
                    <div className="inline-flex items-center border border-slate-300 rounded-lg shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(prd.id, item.selectedOption, item.quantity - 1)
                        }
                        aria-label={lang === 'ar' ? 'إنقاص الكمية' : 'Decrease'}
                        className="p-2 text-slate-600 hover:text-slate-900"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 sm:px-3 text-sm font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= prd.stockQty}
                        onClick={() =>
                          updateCartQuantity(prd.id, item.selectedOption, item.quantity + 1)
                        }
                        aria-label={lang === 'ar' ? 'زيادة الكمية' : 'Increase'}
                        className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-bold text-sm text-slate-900 tabular-nums min-w-0 sm:min-w-[90px] text-end">
                      {formatPrice(prd.priceYER * item.quantity)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFromCart(prd.id, item.selectedOption)}
                      aria-label={t('store.cart.remove')}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="p-4 flex justify-end">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-medium text-slate-500 hover:text-red-600"
              >
                {t('store.cart.clearCart')}
              </button>
            </div>
          </div>

          <aside className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
              {t('booking.summaryTitle')}
            </h2>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">{t('store.cart.subtotal')}</span>
                <span className="font-semibold tabular-nums">{formatPrice(cartSubtotalYER)}</span>
              </div>

              {appliedCoupon && couponDiscountYER > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>
                    {lang === 'ar' ? `خصم الكوبون (${appliedCoupon.code})` : `Coupon (${appliedCoupon.code})`}
                  </span>
                  <span className="tabular-nums">-{formatPrice(couponDiscountYER)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-600">{t('store.cart.deliveryFee')}</span>
                <span className="font-medium tabular-nums">
                  {deliveryFee === 0 ? t('store.cart.freeDelivery') : formatPrice(deliveryFee)}
                </span>
              </div>
              {cartSubtotalYER < localizedConfig.payment.freeDeliveryThresholdYER && (
                <p className="text-xs text-[#0284C7] bg-sky-50/70 border border-sky-100 rounded-lg p-2.5 tabular-nums">
                  {lang === 'ar'
                    ? `أضف منتجات بقيمة ${formatPrice(
                        localizedConfig.payment.freeDeliveryThresholdYER - cartSubtotalYER
                      )} للحصول على توصيل مجاني.`
                    : `Add ${formatPrice(
                        localizedConfig.payment.freeDeliveryThresholdYER - cartSubtotalYER
                      )} more for free delivery.`}
                </p>
              )}

              {/* Promo Coupon Box */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#0F4C5C]" />
                  <span>{lang === 'ar' ? 'كوبون وقسيمة الخصم' : 'Promo Coupon'}</span>
                </span>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <span className="font-semibold">
                      <span className="font-mono font-bold me-1.5" dir="ltr">
                        {appliedCoupon.code}
                      </span>
                      {lang === 'ar' ? appliedCoupon.titleAr : appliedCoupon.titleEn}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        clearCoupon();
                        setCouponMsg(null);
                      }}
                      aria-label={t('common.cancel')}
                      className="text-emerald-700 hover:text-red-600 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        dir="ltr"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          if (couponMsg) setCouponMsg(null);
                        }}
                        placeholder="NODISC20"
                        className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(couponInput)}
                        className="btn-interactive btn-sheen px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border border-sky-300/30 text-xs font-bold shrink-0"
                      >
                        {lang === 'ar' ? 'تطبيق' : 'Apply'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {STORE_COUPONS.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleApplyCoupon(c.code)}
                          className="btn-interactive text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border border-dashed border-[#0284C7]/50 bg-gradient-to-r from-sky-50 to-emerald-50/50 text-[#0F4C5C] hover:border-[#0284C7] hover:bg-sky-100/70"
                          title={lang === 'ar' ? c.titleAr : c.titleEn}
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {couponMsg && !appliedCoupon && (
                  <p className={`text-[11px] ${couponMsg.ok ? 'text-emerald-700' : 'text-red-600'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-bold text-slate-900">
                <span>{t('store.cart.total')}</span>
                <span className="text-[#0F4C5C] tabular-nums">{formatPrice(totalYER)}</span>
              </div>
            </div>

            <Link
              to="/store/checkout"
              className="btn-interactive btn-sheen btn-sheen-auto block w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0F4C5C] to-[#0284C7] text-white border border-sky-300/40 text-sm font-bold text-center shadow-[0_8px_20px_-6px_rgba(15,76,92,0.48)]"
            >
              {t('store.cart.proceedCheckout')}
            </Link>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
              {lang === 'ar'
                ? 'طرق الدفع المتاحة: نقدًا عند الاستلام، الكريمي حاسب، جوالي، جيب، ون كاش، فلوسك، أو الدفع المزدوج.'
                : 'Supported payments: Cash on delivery, Al-Kuraimi, Jawali, Jeeb, OneCash, Flousak, or split payment.'}
            </p>
          </aside>
        </div>
      )}
    </div>
  );
};
