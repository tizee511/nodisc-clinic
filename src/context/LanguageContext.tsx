import React, { createContext, useContext, useEffect, useState } from 'react';
import arTranslations from '../locales/ar.json';
import enTranslations from '../locales/en.json';
import {
  enCampaigns,
  enCategories,
  enDepartments,
  enDoctors,
  enLibrary,
  enNews,
  enProducts,
  enServices,
  enSiteText,
  enStoreMainSections,
  enStories,
} from '../data/enContent';
import { SiteConfig } from '../config/siteConfig';
import {
  Campaign,
  Department,
  Doctor,
  HomepageSectionConfig,
  LibraryItem,
  MedicalService,
  NewsItem,
  Product,
  ProductCategory,
  StoreMainSection,
  SuccessStory,
} from '../types/clinic';
import { HomeHeroOverride, useDataStore } from './DataStoreContext';

export type Language = 'ar' | 'en';

const STORAGE_KEY = 'nodisc_lang_v1';

interface LanguageContextValue {
  lang: Language;
  isRTL: boolean;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (path: string) => string;
  tArray: (path: string) => string[];
  localizedConfig: SiteConfig;
  homepageSections: HomepageSectionConfig[];
  homeHero: HomeHeroOverride;
  departments: Department[];
  doctors: Doctor[];
  services: MedicalService[];
  library: LibraryItem[];
  news: NewsItem[];
  stories: SuccessStory[];
  campaigns: Campaign[];
  storeMainSections: StoreMainSection[];
  productCategories: ProductCategory[];
  products: Product[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useDataStore();

  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'en' || saved === 'ar' ? saved : 'ar';
    } catch {
      return 'ar';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage errors
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title =
      lang === 'ar'
        ? `${store.siteConfigState.brand.nameAr} — ${store.siteConfigState.brand.nameEn}`
        : `${store.siteConfigState.brand.nameEn} — Neurosurgery, Pain Management, Rehabilitation & Pharmacy`;
  }, [lang, store.siteConfigState.brand.nameAr, store.siteConfigState.brand.nameEn]);

  // Sync live theme colors to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-petrol', store.siteConfigState.theme.petrolPrimary);
    root.style.setProperty('--color-petrol-dark', store.siteConfigState.theme.petrolDark);
    root.style.setProperty('--color-sky', store.siteConfigState.theme.skyAccent);
    root.style.setProperty('--color-canvas', store.siteConfigState.theme.canvasBg);
  }, [store.siteConfigState.theme]);

  const setLang = (next: Language) => setLangState(next);
  const toggleLang = () => setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));

  const dict = lang === 'ar' ? arTranslations : enTranslations;

  const t = (path: string): string => {
    const val = resolvePath(dict as unknown as Record<string, unknown>, path);
    if (typeof val === 'string') return val;
    const fallback = resolvePath(arTranslations as unknown as Record<string, unknown>, path);
    return typeof fallback === 'string' ? fallback : path;
  };

  const tArray = (path: string): string[] => {
    const val = resolvePath(dict as unknown as Record<string, unknown>, path);
    if (Array.isArray(val)) return val as string[];
    return [];
  };

  const isEn = lang === 'en';
  const liveCfg = store.siteConfigState;

  const localizedConfig: SiteConfig = isEn
    ? {
        ...liveCfg,
        brand: {
          ...liveCfg.brand,
          nameAr: liveCfg.brand.nameEn || 'NODISC Clinic',
          nameEn: liveCfg.brand.nameAr || 'نوديسك كلينك',
          tagline: enTranslations.brand.tagline,
          shortAbout: enSiteText.shortAbout,
          vision: enSiteText.vision,
          mission: enSiteText.mission,
          prototypeNotice: enTranslations.brand.prototypeNotice,
          clinicGallery: liveCfg.brand.clinicGallery.map((g, idx) => ({
            ...g,
            caption: enSiteText.galleryCaptions[idx] || g.caption,
          })),
        },
        contact: {
          ...liveCfg.contact,
          city: enSiteText.city,
          address: enSiteText.address,
          landmark: enSiteText.landmark,
          phones: liveCfg.contact.phones.map((p, idx) => ({
            ...p,
            label: enSiteText.phoneLabels[idx] || p.label,
          })),
          whatsappDisplay: enSiteText.whatsappDisplay,
          workingDays: enSiteText.workingDays,
          workingPeriods: enSiteText.workingPeriods,
          directionsNote: enSiteText.directionsNote,
        },
        payment: {
          ...liveCfg.payment,
          codLabel: enTranslations.store.checkout.cod,
          ePaymentLabel: enTranslations.store.checkout.epayment,
          ePaymentNetworks: liveCfg.payment.ePaymentNetworks.map((net, idx) => ({
            ...net,
            name: enSiteText.ePaymentNetworks[idx]?.name || net.name,
            accountHint: enSiteText.ePaymentNetworks[idx]?.accountHint || net.accountHint,
          })),
          collectionNote: enSiteText.collectionNote,
        },
        bookingRules: {
          ...liveCfg.bookingRules,
          visitTypes: enSiteText.visitTypes,
          periods: enSiteText.periods,
          unavailableDatesDemo: store.scheduleSettings.closedDates,
          capacityPolicyNote: enSiteText.capacityPolicyNote,
        },
        prescriptionRules: {
          ...liveCfg.prescriptionRules,
          helperText: enSiteText.prescriptionHelperText,
        },
        reviewsPolicy: {
          ...liveCfg.reviewsPolicy,
          moderationNotice: enSiteText.moderationNotice,
        },
      }
    : {
        ...liveCfg,
        bookingRules: {
          ...liveCfg.bookingRules,
          unavailableDatesDemo: store.scheduleSettings.closedDates,
        },
      };

  const activeDepartments = [...store.departments]
    .filter((d) => d.status !== 'archived' && d.status !== 'draft')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const departments = isEn
    ? activeDepartments.map((d) => ({ ...d, ...(enDepartments[d.id] || {}) }))
    : activeDepartments;

  const activeDoctors = store.doctors.filter((d) => d.status !== 'archived' && d.status !== 'draft');
  const doctors = isEn
    ? activeDoctors.map((d) => ({ ...d, ...(enDoctors[d.id] || {}) }))
    : activeDoctors;

  const activeServices = store.services.filter((s) => s.status !== 'archived' && s.status !== 'draft');
  const services = isEn
    ? activeServices.map((s) => ({ ...s, ...(enServices[s.id] || {}) }))
    : activeServices;

  const activeLibrary = store.library.filter((l) => l.status !== 'archived' && l.status !== 'draft');
  const library = isEn
    ? activeLibrary.map((l) => ({ ...l, ...(enLibrary[l.id] || {}) }))
    : activeLibrary;

  const activeNews = store.news.filter((n) => n.status !== 'archived' && n.status !== 'draft');
  const news = isEn ? activeNews.map((n) => ({ ...n, ...(enNews[n.id] || {}) })) : activeNews;

  const activeStories = store.stories.filter((s) => s.status !== 'archived' && s.status !== 'draft');
  const stories = isEn
    ? activeStories.map((s) => ({ ...s, ...(enStories[s.id] || {}) }))
    : activeStories;

  const campaigns = isEn
    ? store.campaigns.map((c) => ({ ...c, ...(enCampaigns[c.id] || {}) }))
    : store.campaigns;

  const activeMainSections = [...store.storeMainSections]
    .filter((s) => s.visible !== false)
    .sort((a, b) => a.order - b.order);

  const storeMainSections = isEn
    ? activeMainSections.map((s) => ({
        ...s,
        nameAr: enStoreMainSections[s.id]?.nameAr || s.nameEn || s.nameAr,
        description: enStoreMainSections[s.id]?.description || s.description,
      }))
    : activeMainSections;

  const activeCategories = [...store.productCategories]
    .filter((c) => c.visible !== false)
    .sort((a, b) => a.order - b.order);

  const productCategories = isEn
    ? activeCategories.map((c) => ({ ...c, ...(enCategories[c.id] || {}) }))
    : activeCategories;

  const activeProducts = store.products.filter((p) => p.visible !== false);
  const products = isEn
    ? activeProducts.map((p) => ({
        ...p,
        ...(enProducts[p.id] || {}),
        inStock: p.stockQty - (p.reservedQty || 0) > 0 && p.inStock,
      }))
    : activeProducts.map((p) => ({
        ...p,
        inStock: p.stockQty - (p.reservedQty || 0) > 0 && p.inStock,
      }));

  const homepageSections = [...store.homepageSections].sort((a, b) => a.order - b.order);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isRTL: lang === 'ar',
        setLang,
        toggleLang,
        t,
        tArray,
        localizedConfig,
        homepageSections,
        homeHero: store.homeHero,
        departments,
        doctors,
        services,
        library,
        news,
        stories,
        campaigns,
        storeMainSections,
        productCategories,
        products,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
};
