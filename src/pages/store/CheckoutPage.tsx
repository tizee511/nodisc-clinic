import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  FileText,
  Layers,
  Loader2,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
  Upload,
  Wallet,
  X,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClinic } from '../../context/ClinicContext';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { WalletBrandIcon } from '../../components/PaymentMethodIcons';
import { OrderRecord } from '../../types/clinic';

type CheckoutStep = 1 | 2 | 3 | 4;

function extractAccountNumber(hint: string): string {
  const match = hint.match(/\d{6,}/);
  return match ? match[0] : hint;
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, isRTL, t, products, localizedConfig } = useLanguage();
  const { cart, cartSubtotalYER, currencyCode, formatPrice, clearCart, setLastOrder } = useClinic();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<CheckoutStep>(1);

  // Step 1: Fulfillment
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');

  // Step 2: Recipient
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Step 3: Payment
  const networks = localizedConfig.payment.ePaymentNetworks;
  const [paymentMode, setPaymentMode] = useState<'cod' | 'epayment' | 'split'>('cod');
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]?.id || 'kuraimi');

  useEffect(() => {
    if (networks.length > 0 && !networks.some((n) => n.id === selectedNetwork)) {
      setSelectedNetwork(networks[0].id);
    }
  }, [networks, selectedNetwork]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentSenderName, setPaymentSenderName] = useState('');
  const [paymentReceiptName, setPaymentReceiptName] = useState('');
  const [confirmLaterViaWhatsapp, setConfirmLaterViaWhatsapp] = useState(false);

  const deliveryFee =
    deliveryMethod === 'pickup' || cartSubtotalYER >= localizedConfig.payment.freeDeliveryThresholdYER
      ? 0
      : localizedConfig.payment.deliveryFeeYER;

  const paymentFee =
    paymentMode === 'cod'
      ? localizedConfig.payment.codFeeYER
      : localizedConfig.payment.ePaymentFeeYER;

  const totalYER = cartSubtotalYER + deliveryFee + paymentFee;

  const freeDeliveryThreshold = localizedConfig.payment.freeDeliveryThresholdYER;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotalYER);
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotalYER / freeDeliveryThreshold) * 100));

  const [splitMethod1, setSplitMethod1] = useState(localizedConfig.payment.codLabel);
  const [splitAmount1, setSplitAmount1] = useState<string>(String(Math.floor(totalYER / 2)));
  const [splitMethod2, setSplitMethod2] = useState(networks[0]?.name || '');
  const [splitAmount2, setSplitAmount2] = useState<string>(
    String(totalYER - Math.floor(totalYER / 2))
  );

  // Sync split labels if language changes
  useEffect(() => {
    setSplitMethod1((prev) => {
      if (prev === 'نقدًا عند التسليم' || prev === 'Cash on Delivery') {
        return localizedConfig.payment.codLabel;
      }
      return prev;
    });
    if (networks[0] && !networks.some((n) => n.name === splitMethod2) && splitMethod2 !== localizedConfig.payment.codLabel) {
      setSplitMethod2(networks[0].name);
    }
  }, [localizedConfig.payment.codLabel, networks, splitMethod2]);

  // Keep split amounts balanced automatically when delivery fee / total changes
  useEffect(() => {
    const a1 = Number(splitAmount1) || 0;
    if (a1 >= 0 && a1 <= totalYER) {
      setSplitAmount2(String(totalYER - a1));
    } else {
      const half = Math.floor(totalYER / 2);
      setSplitAmount1(String(half));
      setSplitAmount2(String(totalYER - half));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalYER]);

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
        <Link
          to="/store"
          className="inline-flex px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold"
        >
          {t('store.cart.browseStore')}
        </Link>
      </div>
    );
  }

  const activeNetworkObj = networks.find((n) => n.id === selectedNetwork) || networks[0];
  const activeAccountNumber = activeNetworkObj ? extractAccountNumber(activeNetworkObj.accountHint) : '';

  const num1 = Number(splitAmount1) || 0;
  const num2 = Number(splitAmount2) || 0;
  const splitSum = num1 + num2;
  const splitRemaining = totalYER - splitSum;

  const splitElectronicNetwork =
    networks.find((n) => n.name === splitMethod2) ||
    networks.find((n) => n.name === splitMethod1) ||
    null;

  const splitHasElectronic =
    splitMethod1 !== localizedConfig.payment.codLabel ||
    splitMethod2 !== localizedConfig.payment.codLabel;

  // Live stock availability check control
  const stockIssues = cart.filter((item) => {
    const prod = products.find((p) => p.id === item.productId);
    if (!prod) return true;
    const available = prod.stockQty - (prod.reservedQty || 0);
    return !prod.inStock || available < item.quantity;
  });
  const isStockVerified = stockIssues.length === 0;

  const handleCopyAccount = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
    } catch {
      setCopiedId(id);
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 2000);
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentReceiptName(file.name);
      setConfirmLaterViaWhatsapp(false);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.epaymentProof;
        return copy;
      });
    }
  };

  const handleAutoBalanceSplit = () => {
    const remaining = Math.max(0, totalYER - num1);
    setSplitAmount2(String(remaining));
  };

  const applySplitPreset = (firstAmount: number) => {
    const clamped = Math.min(totalYER, Math.max(0, firstAmount));
    setSplitAmount1(String(clamped));
    setSplitAmount2(String(totalYER - clamped));
  };

  const hasElectronicProof =
    paymentReference.trim().length >= 3 ||
    Boolean(paymentReceiptName) ||
    confirmLaterViaWhatsapp;

  const validateStep = (step: CheckoutStep): boolean => {
    const nextErrors: Record<string, string> = {};

    if (step === 2) {
      if (customerName.trim().length < 3) nextErrors.customerName = t('booking.errors.nameRequired');
      if (phone.replace(/\D/g, '').length < 7) nextErrors.phone = t('booking.errors.phoneRequired');
      if (deliveryMethod === 'delivery' && address.trim().length < 5) {
        nextErrors.address = t('store.checkout.errors.addressRequired');
      }
    } else if (step === 3) {
      if (paymentMode === 'epayment') {
        if (!hasElectronicProof) {
          nextErrors.epaymentProof = t('store.checkout.errors.epaymentProofRequired');
        }
      } else if (paymentMode === 'split') {
        if (splitMethod1 === splitMethod2) {
          nextErrors.split = t('store.checkout.errors.splitDuplicateMethod');
        } else if (num1 <= 0 || num2 <= 0) {
          nextErrors.split = t('store.checkout.errors.splitPositiveRequired');
        } else if (Math.abs(splitRemaining) > 0.01) {
          nextErrors.split = t('store.checkout.splitMismatch');
        }
        if (splitHasElectronic && !hasElectronicProof) {
          nextErrors.epaymentProof = t('store.checkout.errors.epaymentProofRequired');
        }
      }
    } else if (step === 4) {
      if (!isStockVerified) {
        nextErrors.stock = t('store.checkout.wizard.stockCheckFail');
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goToNextStep = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 4) {
      const next = (currentStep + 1) as CheckoutStep;
      setCurrentStep(next);
      setMaxReachedStep((prev) => (next > prev ? next : prev));
      setErrors({});
      setSubmitError('');
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as CheckoutStep);
      setErrors({});
      setSubmitError('');
    }
  };

  const jumpToStep = (target: CheckoutStep) => {
    if (target <= maxReachedStep || target < currentStep) {
      setCurrentStep(target);
      setErrors({});
      setSubmitError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError('');

    for (const s of [1, 2, 3, 4] as CheckoutStep[]) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (simulateFail) {
        setIsSubmitting(false);
        setSubmitError(t('store.checkout.paymentFailedError'));
        return;
      }

      const order: OrderRecord = {
        orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        customerName: customerName.trim(),
        phone: phone.trim(),
        deliveryMethod,
        address: deliveryMethod === 'delivery' ? address.trim() : undefined,
        notes: notes.trim() || undefined,
        paymentMode,
        paymentNetwork: paymentMode === 'epayment' ? activeNetworkObj?.name : undefined,
        paymentAccountHint:
          paymentMode === 'epayment'
            ? activeNetworkObj?.accountHint
            : paymentMode === 'split' && splitElectronicNetwork
              ? splitElectronicNetwork.accountHint
              : undefined,
        paymentReference:
          paymentMode !== 'cod' && paymentReference.trim()
            ? paymentReference.trim()
            : paymentMode !== 'cod' && confirmLaterViaWhatsapp
              ? lang === 'ar'
                ? 'سيتم التأكيد عبر واتساب'
                : 'Confirm via WhatsApp'
              : undefined,
        paymentSenderName: paymentMode !== 'cod' ? paymentSenderName.trim() || undefined : undefined,
        paymentReceiptName: paymentMode !== 'cod' ? paymentReceiptName || undefined : undefined,
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
    }, 550);
  };

  const codLabel =
    deliveryMethod === 'pickup'
      ? lang === 'ar'
        ? 'الدفع نقدًا في صيدلية المركز'
        : 'Pay Cash at Clinic Pharmacy'
      : t('store.checkout.cod');

  const stepsMeta: { step: CheckoutStep; label: string }[] = [
    { step: 1, label: t('store.checkout.wizard.steps.delivery') },
    { step: 2, label: t('store.checkout.wizard.steps.recipient') },
    { step: 3, label: t('store.checkout.wizard.steps.payment') },
    { step: 4, label: t('store.checkout.wizard.steps.review') },
  ];

  const NextArrow = isRTL ? ArrowLeft : ArrowRight;
  const PrevArrow = isRTL ? ArrowRight : ArrowLeft;

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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display font-bold text-3xl text-slate-900">
            {t('store.checkout.title')}
          </h1>
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#0F4C5C]" />
            <span>
              {lang === 'ar'
                ? 'وسائل دفع محلية مرنة ومعتمدة لدى نوديسك كلينك'
                : 'Flexible local payment methods verified by NODISC Clinic'}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* 4-Step Checkout Stepper Header */}
          <div className="bg-slate-50/90 border-b border-slate-200 px-4 sm:px-8 py-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#0F4C5C] bg-[#0F4C5C]/10 px-2.5 py-1 rounded-md">
                {t('store.checkout.wizard.stepCounter')
                  .replace('{{current}}', String(currentStep))
                  .replace('{{total}}', '4')}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {stepsMeta.find((s) => s.step === currentStep)?.label}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
              {stepsMeta.map(({ step, label }) => {
                const isActive = currentStep === step;
                const isCompleted = step < currentStep;
                const canJump = step <= maxReachedStep || step < currentStep;

                return (
                  <button
                    key={step}
                    type="button"
                    disabled={!canJump}
                    onClick={() => jumpToStep(step)}
                    className={`flex flex-col items-start sm:items-center text-start sm:text-center gap-1.5 p-2 rounded-xl transition-all ${
                      canJump ? 'cursor-pointer hover:bg-white' : 'cursor-default opacity-65'
                    } ${isActive ? 'bg-white shadow-xs ring-1 ring-[#0F4C5C]/25' : ''}`}
                  >
                    <div className="w-full flex items-center gap-2 sm:justify-center">
                      <span
                        className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isActive
                            ? 'bg-[#0F4C5C] text-white'
                            : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : step}
                      </span>
                      {step < 4 && (
                        <span
                          className={`h-1 flex-1 rounded-full hidden sm:block transition-colors ${
                            currentStep > step ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs font-semibold leading-tight line-clamp-1 ${
                        isActive
                          ? 'text-[#0F4C5C]'
                          : isCompleted
                            ? 'text-emerald-700'
                            : 'text-slate-500'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            {submitError && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5"
              >
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* STEP 1: FULFILLMENT METHOD */}
              {currentStep === 1 && (
                <motion.div
                  key="chk-step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div className="space-y-1.5">
                    <h2 className="font-display font-bold text-xl text-slate-900">
                      {t('store.checkout.wizard.step1Title')}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {t('store.checkout.wizard.step1Subtitle')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      aria-pressed={deliveryMethod === 'delivery'}
                      className={`text-start p-5 sm:p-6 rounded-2xl border-2 transition-all flex flex-col gap-3 cursor-pointer ${
                        deliveryMethod === 'delivery'
                          ? 'border-[#0F4C5C] bg-[#0F4C5C]/[0.04] shadow-sm ring-2 ring-[#0F4C5C]/15'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`w-12 h-12 rounded-xl inline-flex items-center justify-center ${
                            deliveryMethod === 'delivery'
                              ? 'bg-[#0F4C5C] text-white'
                              : 'bg-slate-100 text-[#0F4C5C]'
                          }`}
                        >
                          <Truck className="w-6 h-6" />
                        </span>
                        <span
                          className={`w-6 h-6 rounded-full border-2 inline-flex items-center justify-center ${
                            deliveryMethod === 'delivery'
                              ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {deliveryMethod === 'delivery' && <Check className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="block font-display font-bold text-base sm:text-lg text-slate-900">
                          {t('store.checkout.deliveryHome')}
                        </span>
                        <span className="block text-xs sm:text-sm text-slate-600 tabular-nums">
                          {cartSubtotalYER >= freeDeliveryThreshold
                            ? t('store.cart.freeDelivery')
                            : `${formatPrice(localizedConfig.payment.deliveryFeeYER)} (${
                                lang === 'ar' ? 'مجاني فوق' : 'Free over'
                              } ${formatPrice(freeDeliveryThreshold)})`}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      aria-pressed={deliveryMethod === 'pickup'}
                      className={`text-start p-5 sm:p-6 rounded-2xl border-2 transition-all flex flex-col gap-3 cursor-pointer ${
                        deliveryMethod === 'pickup'
                          ? 'border-[#0F4C5C] bg-[#0F4C5C]/[0.04] shadow-sm ring-2 ring-[#0F4C5C]/15'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`w-12 h-12 rounded-xl inline-flex items-center justify-center ${
                            deliveryMethod === 'pickup'
                              ? 'bg-[#0F4C5C] text-white'
                              : 'bg-slate-100 text-[#0F4C5C]'
                          }`}
                        >
                          <Building2 className="w-6 h-6" />
                        </span>
                        <span
                          className={`w-6 h-6 rounded-full border-2 inline-flex items-center justify-center ${
                            deliveryMethod === 'pickup'
                              ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {deliveryMethod === 'pickup' && <Check className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="block font-display font-bold text-base sm:text-lg text-slate-900">
                          {t('store.checkout.deliveryPickup')}
                        </span>
                        <span className="block text-xs sm:text-sm font-semibold text-emerald-700">
                          {t('store.checkout.freeLabel')}
                        </span>
                      </div>
                    </button>
                  </div>

                  {deliveryMethod === 'pickup' && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#0F4C5C] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 block">
                          {lang === 'ar' ? 'موقع الاستلام المباشر:' : 'Clinic Pickup Location:'}
                        </strong>
                        <span>{localizedConfig.contact.address}</span>
                        <span className="block text-xs text-slate-500">
                          {localizedConfig.contact.landmark}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: RECIPIENT & ADDRESS */}
              {currentStep === 2 && (
                <motion.div
                  key="chk-step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div className="space-y-1.5">
                    <h2 className="font-display font-bold text-xl text-slate-900">
                      {t('store.checkout.wizard.step2Title')}
                    </h2>
                    <p className="text-sm text-slate-600">{t('store.checkout.wizard.step2Subtitle')}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="chk-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t('booking.fields.patientName')} *
                      </label>
                      <input
                        id="chk-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => {
                          setCustomerName(e.target.value);
                          if (errors.customerName) {
                            setErrors((prev) => {
                              const copy = { ...prev };
                              delete copy.customerName;
                              return copy;
                            });
                          }
                        }}
                        placeholder={lang === 'ar' ? 'الاسم الكامل للمستلم' : 'Recipient full name'}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white ${
                          errors.customerName ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {errors.customerName && (
                        <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="chk-phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t('booking.fields.phone')} *
                      </label>
                      <input
                        id="chk-phone"
                        type="tel"
                        dir="ltr"
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
                        placeholder="+967 77..."
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm tabular-nums bg-white ${
                          errors.phone ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {deliveryMethod === 'delivery' ? (
                    <div>
                      <label htmlFor="chk-address" className="block text-sm font-semibold text-slate-800 mb-1.5">
                        {t('store.checkout.address')} *
                      </label>
                      <input
                        id="chk-address"
                        type="text"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (errors.address) {
                            setErrors((prev) => {
                              const copy = { ...prev };
                              delete copy.address;
                              return copy;
                            });
                          }
                        }}
                        placeholder={
                          lang === 'ar'
                            ? 'مثال: صنعاء – شارع حدة – جوار...'
                            : 'e.g., Sana’a – Hadda St. – Near...'
                        }
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white ${
                          errors.address ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                      {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#0F4C5C] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block">
                          {lang === 'ar' ? 'عنوان الاستلام المباشر:' : 'Clinic Pickup Address:'}
                        </strong>
                        <span>{localizedConfig.contact.address}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="chk-notes" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      {t('booking.fields.notes')}
                    </label>
                    <textarea
                      id="chk-notes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT METHOD & VERIFICATION */}
              {currentStep === 3 && (
                <motion.div
                  key="chk-step-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-1">
                      <h2 className="font-display font-bold text-xl text-slate-900">
                        {t('store.checkout.wizard.step3Title')}
                      </h2>
                      <p className="text-sm text-slate-600">{t('store.checkout.wizard.step3Subtitle')}</p>
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      {lang === 'ar' ? 'الإجمالي المستحق:' : 'Amount due:'}{' '}
                      <strong className="text-[#0F4C5C]">{formatPrice(totalYER)}</strong>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Option A: Cash on Delivery / Pickup */}
                    <label
                      className={`block p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMode === 'cod'
                          ? 'border-[#0F4C5C] bg-[#0F4C5C]/[0.04]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="paymentMode"
                            checked={paymentMode === 'cod'}
                            onChange={() => {
                              setPaymentMode('cod');
                              setErrors({});
                            }}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <span className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                              <Banknote className="w-4 h-4 text-[#0F4C5C]" />
                              <span>{codLabel}</span>
                            </span>
                            <p className="text-xs text-slate-500">
                              {deliveryMethod === 'pickup'
                                ? lang === 'ar'
                                  ? 'ادفع نقدًا عند استلام طلبك من صيدلية نوديسك كلينك.'
                                  : 'Pay in cash when picking up your order at NODISC Clinic Pharmacy.'
                                : lang === 'ar'
                                  ? 'ادفع نقدًا للمندوب بعد فحص الطلب والتأكد من استلامه.'
                                  : 'Pay in cash to the courier upon receiving your order.'}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 shrink-0 tabular-nums">
                          {localizedConfig.payment.codFeeYER > 0
                            ? `+${formatPrice(localizedConfig.payment.codFeeYER)}`
                            : t('store.checkout.freeLabel')}
                        </span>
                      </div>
                    </label>

                    {/* Option B: Electronic Payment (Yemeni Wallets & Banks) */}
                    <div
                      className={`rounded-xl border-2 transition-colors ${
                        paymentMode === 'epayment'
                          ? 'border-[#0F4C5C] bg-[#0F4C5C]/[0.03]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <label className="p-4 cursor-pointer flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="paymentMode"
                            checked={paymentMode === 'epayment'}
                            onChange={() => {
                              setPaymentMode('epayment');
                              setErrors({});
                            }}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <span className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-[#0F4C5C]" />
                              <span>{t('store.checkout.epayment')}</span>
                            </span>
                            <p className="text-xs text-slate-500">
                              {lang === 'ar'
                                ? 'التحويل المباشر عبر الكريمي حاسب، محفظة جوالي، جيب، ون كاش، أو فلوسك.'
                                : 'Direct transfer via Al-Kuraimi Hasib, Jawali, Jeeb, OneCash, or Flousak.'}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 shrink-0 tabular-nums">
                          {localizedConfig.payment.ePaymentFeeYER > 0
                            ? `+${formatPrice(localizedConfig.payment.ePaymentFeeYER)}`
                            : t('store.checkout.freeLabel')}
                        </span>
                      </label>

                      {paymentMode === 'epayment' && (
                        <div className="px-4 pb-5 pt-2 border-t border-slate-200/80 space-y-5">
                          {/* Sub-step 1: Select Wallet Card */}
                          <div className="space-y-2.5">
                            <span className="block text-xs font-semibold text-slate-700">
                              1. {t('store.checkout.selectNetwork')}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {networks.map((net) => {
                                const acct = extractAccountNumber(net.accountHint);
                                const isSelected = selectedNetwork === net.id;
                                return (
                                  <button
                                    key={net.id}
                                    type="button"
                                    onClick={() => setSelectedNetwork(net.id)}
                                    className={`text-start p-3 rounded-lg border transition-all flex items-center justify-between gap-2.5 ${
                                      isSelected
                                        ? 'border-[#0F4C5C] bg-white ring-1 ring-[#0F4C5C]/25'
                                        : 'border-slate-200 bg-white/80 hover:border-slate-300'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <WalletBrandIcon
                                        id={net.id}
                                        size="sm"
                                        logoUrl={net.logoUrl}
                                        name={net.name}
                                      />
                                      <div className="min-w-0 space-y-0.5">
                                        <span className="text-xs font-bold text-slate-900 block truncate">
                                          {net.name}
                                        </span>
                                        <span
                                          className="text-[11px] font-mono text-[#0284C7] block tabular-nums"
                                          dir="ltr"
                                        >
                                          {acct}
                                        </span>
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <CheckCircle2 className="w-4 h-4 text-[#0F4C5C] shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Sub-step 2: Account & Transfer Amount Card */}
                          {activeNetworkObj && (
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                  <WalletBrandIcon
                                    id={activeNetworkObj.id}
                                    size="md"
                                    logoUrl={activeNetworkObj.logoUrl}
                                    name={activeNetworkObj.name}
                                  />
                                  <div>
                                    <span className="text-[11px] text-slate-500 block">
                                      2.{' '}
                                      {lang === 'ar'
                                        ? 'حوّل المبلغ إلى الحساب التالي:'
                                        : 'Transfer total amount to:'}
                                    </span>
                                    <strong className="text-sm text-slate-900">
                                      {activeNetworkObj.name}
                                    </strong>
                                  </div>
                                </div>
                                <div className="text-end">
                                  <span className="text-[11px] text-slate-500 block">
                                    {lang === 'ar' ? 'المبلغ المطلوب تحويله' : 'Transfer Amount'}
                                  </span>
                                  <span className="text-sm font-bold text-[#0F4C5C] tabular-nums">
                                    {formatPrice(totalYER)}
                                    {currencyCode !== 'YER' && (
                                      <span className="text-xs text-slate-500 ms-1.5">
                                        ({totalYER.toLocaleString('en-US')} ر.ي)
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-lg p-3 border border-slate-200/80">
                                <div className="min-w-0">
                                  <span className="text-[11px] text-slate-500 block">
                                    {activeNetworkObj.accountHint}
                                  </span>
                                  <span
                                    className="font-mono font-bold text-base text-slate-900 tabular-nums block mt-0.5"
                                    dir="ltr"
                                  >
                                    {activeAccountNumber}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyAccount(activeAccountNumber, activeNetworkObj.id)
                                  }
                                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:border-[#0F4C5C] text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5 transition-colors shrink-0"
                                >
                                  {copiedId === activeNetworkObj.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-emerald-700">
                                        {t('store.checkout.copiedAccount')}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5 text-[#0F4C5C]" />
                                      <span>{t('store.checkout.copyAccount')}</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Sub-step 3: Verification Control */}
                          <div className="space-y-3 bg-white rounded-xl border border-slate-200 p-4">
                            <div className="space-y-0.5">
                              <span className="block text-xs font-bold text-slate-800">
                                3. {t('store.checkout.wizard.verifyRequiredTitle')}
                              </span>
                              <p className="text-[11px] text-slate-500">
                                {t('store.checkout.wizard.verifyRequiredHint')}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label
                                  htmlFor="chk-ref"
                                  className="block text-xs font-medium text-slate-600 mb-1"
                                >
                                  {t('store.checkout.transferRefLabel')}
                                </label>
                                <input
                                  id="chk-ref"
                                  type="text"
                                  dir="ltr"
                                  value={paymentReference}
                                  onChange={(e) => {
                                    setPaymentReference(e.target.value);
                                    if (e.target.value.trim()) setConfirmLaterViaWhatsapp(false);
                                    if (errors.epaymentProof) {
                                      setErrors((prev) => {
                                        const copy = { ...prev };
                                        delete copy.epaymentProof;
                                        return copy;
                                      });
                                    }
                                  }}
                                  placeholder={t('store.checkout.transferRefPlaceholder')}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor="chk-sender"
                                  className="block text-xs font-medium text-slate-600 mb-1"
                                >
                                  {t('store.checkout.transferSenderLabel')}
                                </label>
                                <input
                                  id="chk-sender"
                                  type="text"
                                  value={paymentSenderName}
                                  onChange={(e) => setPaymentSenderName(e.target.value)}
                                  placeholder={
                                    lang === 'ar'
                                      ? 'اسم صاحب الحساب أو رقمه'
                                      : 'Account holder or phone'
                                  }
                                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                              <div>
                                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-300 hover:border-[#0F4C5C] bg-slate-50 hover:bg-white text-xs font-medium text-slate-700 cursor-pointer transition-colors">
                                  <Upload className="w-3.5 h-3.5 text-[#0F4C5C]" />
                                  <span>{t('store.checkout.transferReceiptLabel')}</span>
                                  <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleReceiptChange}
                                    className="sr-only"
                                  />
                                </label>
                                {paymentReceiptName && (
                                  <div className="inline-flex items-center gap-1.5 ms-2 text-xs text-emerald-700 font-medium">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="max-w-[160px] truncate">{paymentReceiptName}</span>
                                    <button
                                      type="button"
                                      onClick={() => setPaymentReceiptName('')}
                                      aria-label={t('common.cancel')}
                                      className="text-slate-400 hover:text-red-600"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              <label className="inline-flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={confirmLaterViaWhatsapp}
                                  onChange={(e) => {
                                    setConfirmLaterViaWhatsapp(e.target.checked);
                                    if (e.target.checked && errors.epaymentProof) {
                                      setErrors((prev) => {
                                        const copy = { ...prev };
                                        delete copy.epaymentProof;
                                        return copy;
                                      });
                                    }
                                  }}
                                />
                                <span>
                                  {lang === 'ar'
                                    ? 'سأرسل إشعار التحويل عبر واتساب بعد تأكيد الطلب'
                                    : 'I will send receipt via WhatsApp after placing order'}
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Option C: Split / Dual Payment */}
                    {localizedConfig.features.showDualPaymentPreview && (
                      <div
                        className={`rounded-xl border-2 transition-colors ${
                          paymentMode === 'split'
                            ? 'border-[#0F4C5C] bg-[#0F4C5C]/[0.03]'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <label className="p-4 cursor-pointer flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="paymentMode"
                              checked={paymentMode === 'split'}
                              onChange={() => {
                                setPaymentMode('split');
                                setErrors({});
                              }}
                              className="mt-1"
                            />
                            <div className="space-y-1">
                              <span className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-[#0F4C5C]" />
                                <span>{t('store.checkout.splitToggle')}</span>
                              </span>
                              <p className="text-xs text-slate-500">
                                {lang === 'ar'
                                  ? 'ادفع جزءًا مقدمًا عبر المحفظة الإلكترونية والباقي نقدًا عند الاستلام، أو قسّم المبلغ بين وسيلتين.'
                                  : 'Pay part via local wallet and the rest on delivery, or split across two wallets.'}
                              </p>
                            </div>
                          </div>
                        </label>

                        {paymentMode === 'split' && (
                          <div className="px-4 pb-5 pt-2 border-t border-slate-200/80 space-y-4">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-slate-500">
                                {lang === 'ar' ? 'توزيع سريع:' : 'Quick split:'}
                              </span>
                              <button
                                type="button"
                                onClick={() => applySplitPreset(Math.floor(totalYER / 2))}
                                className="px-2.5 py-1 rounded-md border border-slate-300 bg-white hover:border-[#0F4C5C] text-slate-700 font-medium"
                              >
                                50% / 50%
                              </button>
                              {totalYER > 5000 && (
                                <button
                                  type="button"
                                  onClick={() => applySplitPreset(totalYER - 5000)}
                                  className="px-2.5 py-1 rounded-md border border-slate-300 bg-white hover:border-[#0F4C5C] text-slate-700 font-medium tabular-nums"
                                >
                                  {lang === 'ar'
                                    ? 'عربون 5,000 ر.ي بالثانية'
                                    : '5,000 YER in second method'}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={handleAutoBalanceSplit}
                                className="px-2.5 py-1 rounded-md bg-[#0F4C5C]/10 hover:bg-[#0F4C5C]/15 text-[#0F4C5C] font-semibold"
                              >
                                {t('store.checkout.autoBalance')}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                                <label className="block text-xs font-semibold text-slate-700">
                                  {t('store.checkout.splitMethod1')} (YER)
                                </label>
                                <select
                                  value={splitMethod1}
                                  onChange={(e) => {
                                    setSplitMethod1(e.target.value);
                                    if (errors.split) {
                                      setErrors((prev) => {
                                        const copy = { ...prev };
                                        delete copy.split;
                                        return copy;
                                      });
                                    }
                                  }}
                                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                                >
                                  <option value={localizedConfig.payment.codLabel}>
                                    {localizedConfig.payment.codLabel}
                                  </option>
                                  {networks.map((n) => (
                                    <option key={n.id} value={n.name}>
                                      {n.name}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="number"
                                  min={1}
                                  value={splitAmount1}
                                  onChange={(e) => setSplitAmount1(e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm tabular-nums bg-white font-semibold"
                                />
                              </div>

                              <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                                <label className="block text-xs font-semibold text-slate-700">
                                  {t('store.checkout.splitMethod2')} (YER)
                                </label>
                                <select
                                  value={splitMethod2}
                                  onChange={(e) => {
                                    setSplitMethod2(e.target.value);
                                    if (errors.split) {
                                      setErrors((prev) => {
                                        const copy = { ...prev };
                                        delete copy.split;
                                        return copy;
                                      });
                                    }
                                  }}
                                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                                >
                                  {networks.map((n) => (
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
                                  min={1}
                                  value={splitAmount2}
                                  onChange={(e) => setSplitAmount2(e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm tabular-nums bg-white font-semibold"
                                />
                              </div>
                            </div>

                            {splitElectronicNetwork && (
                              <div className="bg-white rounded-lg border border-slate-200 p-3.5 space-y-3 text-xs">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <div>
                                    <span className="text-slate-500 block">
                                      {splitElectronicNetwork.name}
                                    </span>
                                    <span
                                      className="font-mono font-bold text-slate-900 tabular-nums"
                                      dir="ltr"
                                    >
                                      {extractAccountNumber(splitElectronicNetwork.accountHint)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                                    <input
                                      type="text"
                                      dir="ltr"
                                      value={paymentReference}
                                      onChange={(e) => {
                                        setPaymentReference(e.target.value);
                                        if (e.target.value.trim()) setConfirmLaterViaWhatsapp(false);
                                        if (errors.epaymentProof) {
                                          setErrors((prev) => {
                                            const copy = { ...prev };
                                            delete copy.epaymentProof;
                                            return copy;
                                          });
                                        }
                                      }}
                                      placeholder={t('store.checkout.transferRefPlaceholder')}
                                      className="px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono w-full sm:w-44"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleCopyAccount(
                                          extractAccountNumber(splitElectronicNetwork.accountHint),
                                          'split-acct'
                                        )
                                      }
                                      className="px-2.5 py-1.5 rounded border border-slate-300 hover:border-[#0F4C5C] text-xs font-semibold shrink-0"
                                    >
                                      {copiedId === 'split-acct'
                                        ? t('store.checkout.copiedAccount')
                                        : t('store.checkout.copyAccount')}
                                    </button>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-slate-300 hover:border-[#0F4C5C] bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer">
                                    <Upload className="w-3.5 h-3.5 text-[#0F4C5C]" />
                                    <span>{paymentReceiptName || t('store.checkout.transferReceiptLabel')}</span>
                                    <input
                                      type="file"
                                      accept="image/*,.pdf"
                                      onChange={handleReceiptChange}
                                      className="sr-only"
                                    />
                                  </label>

                                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={confirmLaterViaWhatsapp}
                                      onChange={(e) => {
                                        setConfirmLaterViaWhatsapp(e.target.checked);
                                        if (e.target.checked && errors.epaymentProof) {
                                          setErrors((prev) => {
                                            const copy = { ...prev };
                                            delete copy.epaymentProof;
                                            return copy;
                                          });
                                        }
                                      }}
                                    />
                                    <span>
                                      {lang === 'ar'
                                        ? 'إرسال الإشعار عبر واتساب'
                                        : 'Send receipt via WhatsApp'}
                                    </span>
                                  </label>
                                </div>
                              </div>
                            )}

                            <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs flex flex-wrap justify-between items-center gap-2 tabular-nums">
                              <span>
                                {t('store.checkout.splitSum')}:{' '}
                                <strong>{formatPrice(splitSum)}</strong>
                              </span>
                              <span
                                className={
                                  Math.abs(splitRemaining) > 0.01
                                    ? 'text-red-600 font-semibold'
                                    : 'text-emerald-700 font-semibold'
                                }
                              >
                                {Math.abs(splitRemaining) <= 0.01
                                  ? lang === 'ar'
                                    ? 'المبلغ مطابق للإجمالي ✓'
                                    : 'Matched to order total ✓'
                                  : `${t('store.checkout.splitRemaining')}: ${formatPrice(splitRemaining)}`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {errors.split && (
                    <p className="text-xs sm:text-sm font-medium text-red-600 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errors.split}</span>
                    </p>
                  )}

                  {errors.epaymentProof && (
                    <p className="text-xs sm:text-sm font-medium text-red-600 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errors.epaymentProof}</span>
                    </p>
                  )}
                </motion.div>
              )}

              {/* STEP 4: FINAL REVIEW & CONFIRM */}
              {currentStep === 4 && (
                <motion.div
                  key="chk-step-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                  className="space-y-6"
                >
                  <div className="space-y-1.5">
                    <h2 className="font-display font-bold text-xl text-slate-900">
                      {t('store.checkout.wizard.step4Title')}
                    </h2>
                    <p className="text-sm text-slate-600">{t('store.checkout.wizard.step4Subtitle')}</p>
                  </div>

                  {/* Stock Verification Control Banner */}
                  <div
                    className={`rounded-xl border p-3.5 text-xs sm:text-sm flex items-center gap-2.5 ${
                      isStockVerified
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {isStockVerified ? (
                      <PackageCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    )}
                    <span className="font-medium">
                      {isStockVerified
                        ? t('store.checkout.wizard.stockCheckOk')
                        : t('store.checkout.wizard.stockCheckFail')}
                    </span>
                  </div>

                  {/* Structured Review Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Fulfillment & Recipient */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                        <span className="text-xs font-bold text-slate-700">
                          {t('store.checkout.contactSection')}
                        </span>
                        <button
                          type="button"
                          onClick={() => jumpToStep(2)}
                          className="text-xs font-semibold text-[#0F4C5C] hover:underline"
                        >
                          {t('store.checkout.wizard.editBtn')}
                        </button>
                      </div>
                      <dl className="space-y-1.5 text-xs">
                        <div>
                          <dt className="text-slate-500">{t('store.checkout.deliveryMethod')}</dt>
                          <dd className="font-semibold text-slate-900">
                            {deliveryMethod === 'pickup'
                              ? t('store.checkout.deliveryPickup')
                              : t('store.checkout.deliveryHome')}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">{t('booking.fields.patientName')}</dt>
                          <dd className="font-semibold text-slate-900">{customerName}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">{t('booking.fields.phone')}</dt>
                          <dd className="font-mono text-slate-800" dir="ltr">
                            {phone}
                          </dd>
                        </div>
                        {deliveryMethod === 'delivery' && address && (
                          <div>
                            <dt className="text-slate-500">{t('store.checkout.address')}</dt>
                            <dd className="text-slate-800">{address}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    {/* Payment Recap */}
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                        <span className="text-xs font-bold text-slate-700">
                          {t('store.checkout.paymentSection')}
                        </span>
                        <button
                          type="button"
                          onClick={() => jumpToStep(3)}
                          className="text-xs font-semibold text-[#0F4C5C] hover:underline"
                        >
                          {t('store.checkout.wizard.editBtn')}
                        </button>
                      </div>
                      <dl className="space-y-1.5 text-xs">
                        <div>
                          <dt className="text-slate-500">{t('store.checkout.paymentSection')}</dt>
                          <dd className="font-semibold text-slate-900">
                            {paymentMode === 'cod'
                              ? codLabel
                              : paymentMode === 'epayment'
                                ? activeNetworkObj?.name || t('store.checkout.epayment')
                                : t('store.checkout.splitToggle')}
                          </dd>
                        </div>
                        {paymentMode === 'split' && (
                          <div className="space-y-0.5 text-slate-700 tabular-nums">
                            <div>
                              {splitMethod1}: <strong>{formatPrice(num1)}</strong>
                            </div>
                            <div>
                              {splitMethod2}: <strong>{formatPrice(num2)}</strong>
                            </div>
                          </div>
                        )}
                        {paymentMode !== 'cod' && (
                          <div>
                            <dt className="text-slate-500">{t('store.checkout.transferRefLabel')}</dt>
                            <dd className="font-mono font-semibold text-[#0F4C5C]">
                              {paymentReference.trim() ||
                                (paymentReceiptName
                                  ? paymentReceiptName
                                  : confirmLaterViaWhatsapp
                                    ? lang === 'ar'
                                      ? 'سيتم الإرسال عبر واتساب'
                                      : 'Confirm via WhatsApp'
                                    : '—')}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>

                  {/* Collection note & fail toggle */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>{localizedConfig.payment.collectionNote}</span>
                    <label className="inline-flex items-center gap-1.5 text-slate-500 hover:text-red-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={simulateFail}
                        onChange={(e) => setSimulateFail(e.target.checked)}
                      />
                      <span>{t('store.checkout.simulateFailToggle')}</span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Footer Controls */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={goToPrevStep}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
                  >
                    <PrevArrow className="w-4 h-4" />
                    <span>{t('store.checkout.wizard.prevBtn')}</span>
                  </button>
                )}
              </div>

              <div>
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F4C5C] hover:bg-[#093542] text-white text-sm font-semibold transition-colors shadow-xs"
                  >
                    <span>{t('store.checkout.wizard.nextBtn')}</span>
                    <NextArrow className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !isStockVerified}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#0F4C5C] hover:bg-[#093542] disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-xs"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{t('store.checkout.placeOrder')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Live Order Summary Sidebar */}
        <aside className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 lg:sticky lg:top-24 shadow-xs">
          <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
            {t('booking.summaryTitle')}
          </h2>

          {deliveryMethod === 'delivery' && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-700">
                  {remainingForFreeDelivery === 0
                    ? lang === 'ar'
                      ? 'تم تفعيل التوصيل المجاني'
                      : 'Free delivery unlocked'
                    : lang === 'ar'
                      ? `أضف ${formatPrice(remainingForFreeDelivery)} للتوصيل المجاني`
                      : `Add ${formatPrice(remainingForFreeDelivery)} for free delivery`}
                </span>
                <span className="font-mono text-[#0F4C5C] font-semibold tabular-nums">
                  {freeDeliveryProgress}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    remainingForFreeDelivery === 0 ? 'bg-emerald-600' : 'bg-[#0F4C5C]'
                  }`}
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          <ul className="space-y-2.5 text-xs divide-y divide-slate-100">
            {cart.map((item) => {
              const p = products.find((x) => x.id === item.productId);
              if (!p) return null;
              return (
                <li
                  key={`${item.productId}-${item.selectedOption || ''}`}
                  className="pt-2 flex justify-between gap-2"
                >
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
            <div className="flex justify-between">
              <span className="text-slate-600">{t('store.checkout.paymentFeeLabel')}</span>
              <span className="tabular-nums">
                {paymentFee === 0 ? t('store.checkout.freeLabel') : formatPrice(paymentFee)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t border-slate-100">
              <span>{t('store.cart.total')}</span>
              <span className="text-[#0F4C5C] tabular-nums">{formatPrice(totalYER)}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#0F4C5C]" />
                <span>{t('store.checkout.paymentSection')}:</span>
              </span>
              {maxReachedStep >= 3 && currentStep !== 3 && (
                <button
                  type="button"
                  onClick={() => jumpToStep(3)}
                  className="text-[11px] font-semibold text-[#0F4C5C] hover:underline"
                >
                  {t('store.checkout.wizard.editBtn')}
                </button>
              )}
            </div>
            <strong className="text-slate-900 block">
              {paymentMode === 'cod'
                ? codLabel
                : paymentMode === 'epayment'
                  ? activeNetworkObj?.name || t('store.checkout.epayment')
                  : t('store.checkout.splitToggle')}
            </strong>
            {paymentMode !== 'cod' && paymentReference.trim() && (
              <span className="text-[#0284C7] font-mono block" dir="ltr">
                Ref: {paymentReference.trim()}
              </span>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
};
