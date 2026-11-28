/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { DataStoreProvider } from './context/DataStoreContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ClinicProvider } from './context/ClinicContext';
import { Layout } from './components/Layout';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DepartmentPage } from './pages/DepartmentPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DoctorProfilePage } from './pages/DoctorProfilePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { LibraryPage } from './pages/LibraryPage';
import { LibraryDetailPage } from './pages/LibraryDetailPage';
import { NewsDetailPage, NewsPage } from './pages/NewsPage';
import { StoriesPage, StoryDetailPage } from './pages/StoriesPage';
import { BookAppointmentPage } from './pages/BookAppointmentPage';
import { CampaignDetailPage, CampaignsPage } from './pages/CampaignsPage';
import { StoreHomePage } from './pages/store/StoreHomePage';
import { StoreOffersPage } from './pages/store/StoreOffersPage';
import { StoreWishlistPage } from './pages/store/StoreWishlistPage';
import { StoreCategoryPage } from './pages/store/StoreCategoryPage';
import { ProductDetailPage } from './pages/store/ProductDetailPage';
import { CartPage } from './pages/store/CartPage';
import { CheckoutPage } from './pages/store/CheckoutPage';
import { OrderResultPage } from './pages/store/OrderResultPage';
import { PrescriptionOrderPage } from './pages/store/PrescriptionOrderPage';
import { StorePoliciesPage } from './pages/store/StorePoliciesPage';
import {
  CareersPage,
  ComplaintsPage,
  ContactPage,
  SearchPage,
  SurveyPage,
} from './pages/SupportPages';

// Admin Control Panel Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminHomepageEditor } from './pages/admin/AdminHomepageEditor';
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminScheduleSmsPage } from './pages/admin/AdminScheduleSmsPage';
import { AdminCampaignsPage } from './pages/admin/AdminCampaignsPage';
import { AdminStoreStructurePage } from './pages/admin/AdminStoreStructurePage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminPrescriptionsPage } from './pages/admin/AdminPrescriptionsPage';
import { AdminInboxPage } from './pages/admin/AdminInboxPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

const NotFoundPage: React.FC = () => {
  const { lang, t } = useLanguage();
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
      <h1 className="font-display font-bold text-3xl text-slate-900">
        {lang === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
      </h1>
      <p className="text-sm text-slate-600">
        {lang === 'ar'
          ? 'يمكنك العودة إلى الصفحة الرئيسية أو استخدام البحث للوصول إلى المحتوى المطلوب.'
          : 'Return to the home page or use search to find the section you need.'}
      </p>
      <div className="flex justify-center gap-3 pt-2">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-lg bg-[#0F4C5C] text-white text-sm font-semibold"
        >
          {t('nav.home')}
        </Link>
        <Link
          to="/search"
          className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium"
        >
          {t('nav.search')}
        </Link>
      </div>
    </div>
  );
};

export default function App() {
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => {
      setMapsQuotaExceeded(true);
    };
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  return (
    <DataStoreProvider>
      <LanguageProvider>
        <ClinicProvider>
          {mapsQuotaExceeded && (
            <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
              <span>
                Google Maps Platform quota reached. If you are the app owner, visit{' '}
                <a
                  href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold text-amber-950 hover:text-amber-800"
                >
                  maps developer site
                </a>{' '}
                for instructions to update your account.
              </span>
            </div>
          )}
          <BrowserRouter>
            <Routes>
              {/* Admin Control Panel Routes (uses AdminLayout internally, or standalone login) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminOverviewPage />} />
              <Route path="/admin/homepage" element={<AdminHomepageEditor />} />
              <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
              <Route path="/admin/content" element={<AdminContentPage />} />
              <Route path="/admin/bookings" element={<AdminBookingsPage />} />
              <Route path="/admin/schedule-sms" element={<AdminScheduleSmsPage />} />
              <Route path="/admin/campaigns" element={<AdminCampaignsPage />} />
              <Route path="/admin/store-structure" element={<AdminStoreStructurePage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/prescriptions" element={<AdminPrescriptionsPage />} />
              <Route path="/admin/inbox" element={<AdminInboxPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />

              {/* Public Clinic Website & Store Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/departments/:slug" element={<DepartmentPage />} />
                <Route path="/doctors" element={<DoctorsPage />} />
                <Route path="/doctors/:slug" element={<DoctorProfilePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:slug" element={<ServiceDetailPage />} />
                <Route path="/library" element={<LibraryPage />} />
                <Route path="/library/:slug" element={<LibraryDetailPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsDetailPage />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/stories/:slug" element={<StoryDetailPage />} />
                <Route path="/book" element={<BookAppointmentPage />} />
                <Route path="/campaigns" element={<CampaignsPage />} />
                <Route path="/campaigns/:slug" element={<CampaignDetailPage />} />

                {/* Store & Pharmacy Routes */}
                <Route path="/store" element={<StoreHomePage />} />
                <Route path="/store/offers" element={<StoreOffersPage />} />
                <Route path="/store/wishlist" element={<StoreWishlistPage />} />
                <Route path="/store/category/:slug" element={<StoreCategoryPage />} />
                <Route path="/store/product/:slug" element={<ProductDetailPage />} />
                <Route path="/store/cart" element={<CartPage />} />
                <Route path="/store/checkout" element={<CheckoutPage />} />
                <Route path="/store/order-result" element={<OrderResultPage />} />
                <Route path="/store/prescription" element={<PrescriptionOrderPage />} />
                <Route path="/store/policies" element={<StorePoliciesPage />} />
                <Route path="/store/policies/:policySlug" element={<StorePoliciesPage />} />

                {/* Support & Search */}
                <Route path="/policies/:policySlug" element={<StorePoliciesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/complaints" element={<ComplaintsPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/survey" element={<SurveyPage />} />
                <Route path="/search" element={<SearchPage />} />

                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ClinicProvider>
      </LanguageProvider>
    </DataStoreProvider>
  );
}
