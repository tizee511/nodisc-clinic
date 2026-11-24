import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { StoreHeader } from './store/StoreHeader';
import { StoreFooter } from './store/StoreFooter';
import { FloatingContactButton } from './FloatingContactButton';

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const isStoreRoute = pathname.startsWith('/store');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {isStoreRoute ? <StoreHeader /> : <Header />}
      <main className="flex-1">{children ?? <Outlet />}</main>
      {isStoreRoute ? <StoreFooter /> : <Footer />}
      <FloatingContactButton />
    </div>
  );
};
