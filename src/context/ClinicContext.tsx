import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppointmentSubmission,
  CampaignBookingRecord,
  CartItem,
  DepartmentId,
  OrderRecord,
  PrescriptionSubmission,
  StoryComment,
} from '../types/clinic';
import { useLanguage } from './LanguageContext';
import { useDataStore } from './DataStoreContext';

const CART_STORAGE_KEY = 'nodisc_cart_v1';
const WISHLIST_STORAGE_KEY = 'nodisc_wishlist_v1';
const CURRENCY_STORAGE_KEY = 'nodisc_currency_v1';

interface BookingPrefill {
  departmentId?: DepartmentId | '';
  serviceId?: string;
  doctorId?: string;
  fromSourceLabel?: string;
}

interface ClinicContextValue {
  cart: CartItem[];
  cartCount: number;
  cartSubtotalYER: number;
  addToCart: (productId: string, quantity: number, selectedOption?: string) => { ok: boolean; message?: string };
  updateCartQuantity: (productId: string, selectedOption: string | undefined, quantity: number) => void;
  removeFromCart: (productId: string, selectedOption?: string) => void;
  clearCart: () => void;

  wishlist: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;

  currencyCode: string;
  setCurrencyCode: (code: string) => void;
  formatPrice: (amountYER: number) => string;

  bookingPrefill: BookingPrefill;
  setBookingPrefill: (prefill: BookingPrefill) => void;
  clearBookingPrefill: () => void;

  lastAppointment: AppointmentSubmission | null;
  setLastAppointment: (app: AppointmentSubmission | null) => void;

  campaignExtraBookings: Record<string, number>;
  registerCampaignBooking: (record: Omit<CampaignBookingRecord, 'status'>) => { ok: boolean; error?: string };
  campaignBookings: CampaignBookingRecord[];

  pendingStoryComments: Record<string, StoryComment[]>;
  addStoryCommentForReview: (storyId: string, comment: StoryComment) => void;

  lastOrder: OrderRecord | null;
  setLastOrder: (order: OrderRecord | null) => void;

  lastPrescription: PrescriptionSubmission | null;
  setLastPrescription: (sub: PrescriptionSubmission | null) => void;
}

const ClinicContext = createContext<ClinicContextValue | null>(null);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useLanguage();
  const store = useDataStore();
  const liveConfig = store.siteConfigState;
  const liveProducts = store.products;

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore invalid storage
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((id) => typeof id === 'string');
      }
    } catch {
      // ignore invalid storage
    }
    return [];
  });

  const [currencyCode, setCurrencyCodeState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved && saved in liveConfig.currency.exchangeRatesFromYER) {
        return saved;
      }
    } catch {
      // ignore
    }
    return liveConfig.currency.code;
  });

  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill>({});
  const [lastAppointment, setLastAppointmentState] = useState<AppointmentSubmission | null>(null);
  const [pendingStoryComments, setPendingStoryComments] = useState<Record<string, StoryComment[]>>({});
  const [lastOrder, setLastOrderState] = useState<OrderRecord | null>(null);
  const [lastPrescription, setLastPrescriptionState] = useState<PrescriptionSubmission | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const setCurrencyCode = (code: string) => {
    if (code in liveConfig.currency.exchangeRatesFromYER) {
      setCurrencyCodeState(code);
      try {
        localStorage.setItem(CURRENCY_STORAGE_KEY, code);
      } catch {
        // ignore
      }
    }
  };

  const formatPrice = (amountYER: number): string => {
    const rateInfo = liveConfig.currency.exchangeRatesFromYER[currencyCode] || {
      symbol: liveConfig.currency.symbolAr,
      rate: 1,
    };
    const converted = amountYER * rateInfo.rate;
    const formatted =
      currencyCode === 'YER'
        ? Math.round(converted).toLocaleString('en-US')
        : converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const symbol = currencyCode === 'YER' && lang === 'en' ? 'YER' : rateInfo.symbol;
    return `${formatted} ${symbol}`;
  };

  const getAvailableQty = (productId: string) => {
    const p = liveProducts.find((x) => x.id === productId);
    if (!p || !p.inStock || p.visible === false) return 0;
    return Math.max(0, p.stockQty - (p.reservedQty || 0));
  };

  const addToCart = (
    productId: string,
    quantity: number,
    selectedOption?: string
  ): { ok: boolean; message?: string } => {
    const avail = getAvailableQty(productId);
    if (avail <= 0) {
      return {
        ok: false,
        message:
          lang === 'ar'
            ? 'هذا المنتج غير متوفر حاليًا في بيانات المخزون.'
            : 'This product is currently out of stock.',
      };
    }

    const existing = cart.find(
      (item) => item.productId === productId && item.selectedOption === selectedOption
    );
    const currentQty = existing ? existing.quantity : 0;
    const targetQty = currentQty + quantity;

    if (targetQty > avail) {
      return {
        ok: false,
        message:
          lang === 'ar'
            ? `الحد المتاح حاليًا لهذا المنتج هو ${avail} وحدة فقط.`
            : `Only ${avail} available units in demo stock.`,
      };
    }

    setCart((prev) => {
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && item.selectedOption === selectedOption
            ? { ...item, quantity: targetQty }
            : item
        );
      }
      return [...prev, { productId, selectedOption, quantity }];
    });

    return { ok: true };
  };

  const updateCartQuantity = (
    productId: string,
    selectedOption: string | undefined,
    quantity: number
  ) => {
    const avail = getAvailableQty(productId);
    if (quantity <= 0 || avail <= 0) {
      removeFromCart(productId, selectedOption);
      return;
    }

    const clampedQty = Math.min(quantity, avail);
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedOption === selectedOption
          ? { ...item, quantity: clampedQty }
          : item
      )
    );
  };

  const removeFromCart = (productId: string, selectedOption?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedOption === selectedOption)
      )
    );
  };

  const clearCart = () => setCart([]);

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleWishlist = (productId: string): boolean => {
    const exists = wishlist.includes(productId);
    setWishlist((prev) =>
      exists ? prev.filter((id) => id !== productId) : [productId, ...prev]
    );
    return !exists;
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const clearWishlist = () => setWishlist([]);

  const wishlistCount = wishlist.filter((id) =>
    liveProducts.some((p) => p.id === id && p.visible !== false)
  ).length;

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotalYER = cart.reduce((acc, item) => {
    const prod = liveProducts.find((p) => p.id === item.productId);
    return acc + (prod ? prod.priceYER * item.quantity : 0);
  }, 0);

  const setLastAppointment = (app: AppointmentSubmission | null) => {
    setLastAppointmentState(app);
    if (app) {
      const exists = store.appointments.some((a) => a.referenceId === app.referenceId);
      if (!exists) {
        store.addAppointment(app);
      }
    }
  };

  const registerCampaignBooking = (record: Omit<CampaignBookingRecord, 'status'>) => {
    return store.addCampaignBooking({ ...record, status: 'confirmed' });
  };

  const addStoryCommentForReview = (storyId: string, comment: StoryComment) => {
    store.addStoryComment(storyId, comment);
    setPendingStoryComments((prev) => ({
      ...prev,
      [storyId]: [comment, ...(prev[storyId] || [])],
    }));
  };

  const setLastOrder = (order: OrderRecord | null) => {
    setLastOrderState(order);
    if (order) {
      const exists = store.orders.some((o) => o.orderNumber === order.orderNumber);
      if (!exists) {
        store.addOrder(order);
      }
    }
  };

  const setLastPrescription = (sub: PrescriptionSubmission | null) => {
    setLastPrescriptionState(sub);
    if (sub) {
      const exists = store.prescriptions.some((r) => r.referenceId === sub.referenceId);
      if (!exists) {
        store.addPrescription(sub);
      }
    }
  };

  return (
    <ClinicContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotalYER,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        currencyCode,
        setCurrencyCode,
        formatPrice,
        bookingPrefill,
        setBookingPrefill,
        clearBookingPrefill: () => setBookingPrefill({}),
        lastAppointment,
        setLastAppointment,
        campaignExtraBookings: {},
        registerCampaignBooking,
        campaignBookings: store.campaignBookings,
        pendingStoryComments,
        addStoryCommentForReview,
        lastOrder,
        setLastOrder,
        lastPrescription,
        setLastPrescription,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error('useClinic must be used within ClinicProvider');
  return ctx;
};
