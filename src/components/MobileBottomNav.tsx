import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Activity,
  Calendar,
  FileUp,
  Heart,
  Home,
  Percent,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useClinic } from '../context/ClinicContext';
import { StoreGlyph } from './store/StoreLogoMark';

interface NavTabItem {
  to: string;
  labelAr: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  badge?: number;
  badgeTone?: 'rose' | 'sky';
  isActivePath?: (pathname: string) => boolean;
}

export const MobileBottomNav: React.FC = () => {
  const { pathname } = useLocation();
  const { lang, products } = useLanguage();
  const { cartCount, wishlistCount } = useClinic();

  const isStoreRoute = pathname.startsWith('/store');

  const offersCount = useMemo(
    () =>
      products.filter(
        (p) => p.isOnSale || (p.originalPriceYER !== undefined && p.originalPriceYER > p.priceYER)
      ).length,
    [products]
  );

  const clinicTabs: NavTabItem[] = [
    {
      to: '/',
      labelAr: 'الرئيسية',
      labelEn: 'Home',
      icon: Home,
      end: true,
    },
    {
      to: '/services',
      labelAr: 'نوديسك',
      labelEn: 'Services',
      icon: Activity,
      isActivePath: (p) =>
        p.startsWith('/services') || p.startsWith('/departments') || p.startsWith('/about'),
    },
    {
      to: '/store',
      labelAr: 'المتجر',
      labelEn: 'Store',
      icon: StoreGlyph,
      isActivePath: (p) => p.startsWith('/store'),
    },
    {
      to: '/doctors',
      labelAr: 'عن الطبيب',
      labelEn: 'Doctor',
      icon: User,
      isActivePath: (p) => p.startsWith('/doctors'),
    },
  ];

  const storeTabs: NavTabItem[] = [
    {
      to: '/store',
      labelAr: 'المتجر',
      labelEn: 'Store',
      icon: StoreGlyph,
      end: true,
    },
    {
      to: '/store/offers',
      labelAr: 'العروض',
      labelEn: 'Offers',
      icon: Percent,
      badge: offersCount,
      badgeTone: 'rose',
    },
    {
      to: '/store/prescription',
      labelAr: 'وصفة',
      labelEn: 'Rx Order',
      icon: FileUp,
    },
    {
      to: '/store/wishlist',
      labelAr: 'المفضلة',
      labelEn: 'Saved',
      icon: Heart,
      badge: wishlistCount,
      badgeTone: 'rose',
    },
  ];

  const tabs = isStoreRoute ? storeTabs : clinicTabs;

  return (
    <nav
      aria-label={
        isStoreRoute
          ? lang === 'ar'
            ? 'شريط تنقل المتجر السريع'
            : 'Mobile store navigation'
          : lang === 'ar'
          ? 'شريط تنقل الموقع السريع'
          : 'Mobile site navigation'
      }
      className={`lg:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-md pb-[env(safe-area-inset-bottom)] transition-all duration-300 ${
        isStoreRoute
          ? 'bg-gradient-to-r from-[#06222B]/97 via-[#062B35]/97 to-[#093542]/97 border-[#38BDF8]/25 shadow-[0_-10px_28px_-6px_rgba(6,34,43,0.48)]'
          : 'bg-gradient-to-r from-[#093542]/97 via-[#0F4C5C]/97 to-[#093542]/97 border-sky-300/25 shadow-[0_-10px_28px_-6px_rgba(9,53,66,0.42)]'
      }`}
    >
      <div
        key={isStoreRoute ? 'store-dock' : 'clinic-dock'}
        className="max-w-lg mx-auto px-2 h-[64px] grid grid-cols-5 items-center gap-1 animate-dock-enter"
      >
        {tabs.map((item, idx) => {
          const Icon = item.icon;
          const customActive = item.isActivePath ? item.isActivePath(pathname) : undefined;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={{ animationDelay: `${idx * 45}ms` }}
              className={({ isActive }) => {
                const active = customActive !== undefined ? customActive : isActive;
                return `group relative min-w-0 min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl px-0.5 sm:px-1 animate-tab-spring transition-all duration-200 ease-[cubic-bezier(0.22,1.25,0.36,1)] active:scale-90 ${
                  active
                    ? 'text-[#7DD3FC] font-bold'
                    : 'text-slate-200/80 hover:text-white font-medium'
                }`;
              }}
            >
              {({ isActive }) => {
                const active = customActive !== undefined ? customActive : isActive;
                return (
                  <>
                    <span
                      aria-hidden="true"
                      className={`absolute top-0 w-7 sm:w-8 h-1 rounded-full bg-[#38BDF8] shadow-[0_2px_10px_rgba(56,189,248,0.85)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                      }`}
                    />
                    <span
                      className={`relative inline-flex items-center justify-center px-2 sm:px-3 py-1 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        active
                          ? 'bg-[#38BDF8]/20 ring-1 ring-[#38BDF8]/50 shadow-[0_0_16px_rgba(56,189,248,0.35)] animate-icon-bounce'
                          : 'group-hover:-translate-y-0.5 group-hover:bg-white/10'
                      }`}
                    >
                      <Icon
                        className={`w-[19px] h-[19px] sm:w-[20px] sm:h-[20px] transition-transform duration-200 ${
                          active ? 'text-[#7DD3FC]' : 'text-slate-100/90 group-hover:text-white'
                        }`}
                      />
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`absolute -top-1.5 -end-1.5 min-w-[17px] h-[17px] px-1 rounded-full text-[9.5px] font-bold text-white flex items-center justify-center tabular-nums leading-none shadow-md ring-1 ring-white/40 animate-badge-pop ${
                            item.badgeTone === 'rose' ? 'bg-rose-500' : 'bg-[#0284C7]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] sm:text-[10.5px] leading-tight whitespace-nowrap truncate max-w-full transition-colors duration-200">
                      {lang === 'ar' ? item.labelAr : item.labelEn}
                    </span>
                  </>
                );
              }}
            </NavLink>
          );
        })}

        {/* Raised Primary Action Button with Sheen & Spring Press */}
        {isStoreRoute ? (
          <NavLink
            to="/store/cart"
            style={{ animationDelay: '180ms' }}
            className={({ isActive }) =>
              `relative overflow-hidden min-w-0 -mt-4 min-h-[58px] rounded-2xl px-1 sm:px-1.5 py-2 flex flex-col items-center justify-center gap-1 text-white animate-tab-spring transition-all duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 active:scale-90 ${
                isActive
                  ? 'bg-gradient-to-br from-[#38BDF8] via-[#0284C7] to-[#0F4C5C] ring-2 ring-white/60 shadow-[0_10px_24px_-3px_rgba(56,189,248,0.65)] -translate-y-0.5'
                  : 'bg-gradient-to-br from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] ring-1 ring-white/30 shadow-[0_8px_22px_-3px_rgba(14,165,233,0.58)]'
              }`
            }
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/45 to-transparent animate-cta-sheen"
            />
            <span className="relative z-10 inline-flex items-center justify-center">
              <ShoppingBag className="w-[20px] h-[20px] sm:w-[21px] sm:h-[21px]" />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="absolute -top-1.5 -end-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 border border-white/80 text-white text-[9.5px] font-bold flex items-center justify-center tabular-nums leading-none shadow-sm animate-badge-pop"
                >
                  {cartCount}
                </span>
              )}
            </span>
            <span className="relative z-10 text-[10.5px] sm:text-[11px] font-bold leading-tight whitespace-nowrap truncate max-w-full">
              {lang === 'ar' ? 'السلة' : 'Cart'}
            </span>
          </NavLink>
        ) : (
          <NavLink
            to="/book"
            style={{ animationDelay: '180ms' }}
            className={({ isActive }) =>
              `relative overflow-hidden min-w-0 -mt-4 min-h-[58px] rounded-2xl px-1 sm:px-1.5 py-2 flex flex-col items-center justify-center gap-1 text-white animate-tab-spring transition-all duration-250 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 active:scale-90 ${
                isActive
                  ? 'bg-gradient-to-br from-[#38BDF8] via-[#0284C7] to-[#0F4C5C] ring-2 ring-white/60 shadow-[0_10px_24px_-3px_rgba(56,189,248,0.65)] -translate-y-0.5'
                  : 'bg-gradient-to-br from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] ring-1 ring-white/30 shadow-[0_8px_22px_-3px_rgba(14,165,233,0.58)]'
              }`
            }
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/45 to-transparent animate-cta-sheen"
            />
            <Calendar className="relative z-10 w-[20px] h-[20px] sm:w-[21px] sm:h-[21px]" />
            <span className="relative z-10 text-[10.5px] sm:text-[11px] font-bold leading-tight whitespace-nowrap truncate max-w-full">
              {lang === 'ar' ? 'حجز موعد' : 'Book'}
            </span>
          </NavLink>
        )}
      </div>
    </nav>
  );
};
