import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { SafeImage } from '../../components/SafeImage';

export const CartPage: React.FC = () => {
  const { lang, t, products, localizedConfig } = useLanguage();
  const {
    cart,
    cartSubtotalYER,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    formatPrice,
  } = useClinic();

  const deliveryFee =
    cartSubtotalYER >= localizedConfig.payment.freeDeliveryThresholdYER || cart.length === 0
      ? 0
      : localizedConfig.payment.deliveryFeeYER;
  const totalYER = cartSubtotalYER + deliveryFee;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12 space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: t('nav.store'), to: '/store' },
            { label: t('store.cart.title') },
          ]}
        />
        <h1 className="font-display font-bold text-3xl text-slate-900">{t('store.cart.title')}</h1>
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
              className="px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold"
            >
              {t('store.cart.browseStore')}
            </Link>
            <Link
              to="/store/prescription"
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium"
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
                  <div className="flex items-center gap-4">
                    <SafeImage
                      src={prd.image}
                      alt={prd.name}
                      aspectClass="w-20 h-20 shrink-0 rounded-lg border border-slate-200"
                    />
                    <div className="space-y-1">
                      <Link
                        to={`/store/product/${prd.slug}`}
                        className="font-display font-bold text-base text-slate-900 hover:text-[#0F4C5C]"
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

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="inline-flex items-center border border-slate-300 rounded-lg">
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
                      <span className="px-3 text-sm font-semibold tabular-nums">
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

                    <span className="font-bold text-sm text-slate-900 tabular-nums min-w-[90px] text-end">
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
              <div className="flex justify-between">
                <span className="text-slate-600">{t('store.cart.deliveryFee')}</span>
                <span className="font-medium tabular-nums">
                  {deliveryFee === 0 ? t('store.cart.freeDelivery') : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-base font-bold text-slate-900">
                <span>{t('store.cart.total')}</span>
                <span className="text-[#0F4C5C] tabular-nums">{formatPrice(totalYER)}</span>
              </div>
            </div>

            <Link
              to="/store/checkout"
              className="block w-full py-3 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold text-center transition-colors"
            >
              {t('store.cart.proceedCheckout')}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
};
