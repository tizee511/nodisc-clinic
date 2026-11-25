import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types/clinic';

interface StockStatusBadgeProps {
  product: Pick<Product, 'inStock' | 'stockQty' | 'reservedQty' | 'lowStockThreshold'>;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const getAvailableStock = (
  product: Pick<Product, 'inStock' | 'stockQty' | 'reservedQty'>
): number => {
  if (!product.inStock) return 0;
  return Math.max(0, product.stockQty - (product.reservedQty || 0));
};

export const isLowStockProduct = (
  product: Pick<Product, 'inStock' | 'stockQty' | 'reservedQty' | 'lowStockThreshold'>
): boolean => {
  const available = getAvailableStock(product);
  const threshold = Math.max(product.lowStockThreshold ?? 5, 8);
  return available > 0 && available <= threshold;
};

export const StockStatusBadge: React.FC<StockStatusBadgeProps> = ({
  product,
  variant = 'compact',
  className = '',
}) => {
  const { lang, t } = useLanguage();
  const available = getAvailableStock(product);
  const lowThreshold = Math.max(product.lowStockThreshold ?? 5, 8);

  const status: 'out' | 'low' | 'in' =
    available <= 0 ? 'out' : available <= lowThreshold ? 'low' : 'in';

  if (variant === 'detailed') {
    const fillPct =
      status === 'out'
        ? 0
        : status === 'low'
        ? Math.max(16, Math.min(40, Math.round((available / 25) * 100)))
        : Math.max(55, Math.min(100, Math.round((available / 30) * 100)));

    return (
      <div
        className={`rounded-xl border px-3.5 py-2.5 space-y-2 ${
          status === 'out'
            ? 'bg-rose-50/70 border-rose-200 text-rose-800'
            : status === 'low'
            ? 'bg-amber-50/80 border-amber-200 text-amber-900'
            : 'bg-emerald-50/75 border-emerald-200 text-emerald-900'
        } ${className}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5">
            {status === 'out' && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {status === 'low' && (
              <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600" />
              </span>
            )}
            {status === 'in' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            <span>
              {status === 'out'
                ? t('store.product.outOfStock')
                : status === 'low'
                ? t('store.product.lowStock')
                : t('store.product.inStock')}
            </span>
          </span>

          {status !== 'out' && (
            <span className="tabular-nums font-bold">
              {status === 'low'
                ? lang === 'ar'
                  ? `متبقي ${available} فقط — اطلب الآن`
                  : `Only ${available} left — order soon`
                : lang === 'ar'
                ? `${available} قطعة جاهزة للشحن`
                : `${available} ready to ship`}
            </span>
          )}
        </div>

        <div className="h-1.5 w-full rounded-full bg-white/80 overflow-hidden border border-black/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === 'out'
                ? 'bg-rose-400'
                : status === 'low'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold whitespace-nowrap ${
        status === 'out'
          ? 'bg-rose-50 border-rose-200 text-rose-700'
          : status === 'low'
          ? 'bg-amber-50 border-amber-200 text-amber-800'
          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
      } ${className}`}
    >
      {status === 'out' ? (
        <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
      ) : status === 'low' ? (
        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
      )}
      <span className="tabular-nums">
        {status === 'out'
          ? t('store.product.outOfStock')
          : status === 'low'
          ? `${t('store.product.lowStock')} (${available})`
          : t('store.product.inStock')}
      </span>
    </span>
  );
};
