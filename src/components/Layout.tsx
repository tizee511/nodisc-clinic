import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { StoreHeader } from './store/StoreHeader';
import { StoreFooter } from './store/StoreFooter';
import { FloatingContactButton } from './FloatingContactButton';
import { MobileBottomNav } from './MobileBottomNav';
import { ClinicAnnouncementBar } from './ClinicAnnouncementBar';

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isStoreRoute = pathname.startsWith('/store');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 text-slate-900 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0 overflow-x-clip">
      {!isStoreRoute && <ClinicAnnouncementBar />}
      {isStoreRoute ? <StoreHeader /> : <Header />}
      <main className="flex-1 min-w-0">{children ?? <Outlet />}</main>
      {isStoreRoute ? <StoreFooter /> : <Footer />}
      <FloatingContactButton />
      <MobileBottomNav />
    </div>
  );
};
