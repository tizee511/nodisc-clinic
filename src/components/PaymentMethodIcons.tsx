import React, { useEffect, useState } from 'react';
import { Banknote, Landmark, Smartphone, Wallet } from 'lucide-react';

interface WalletEmblemProps {
  id: string;
  size?: 'sm' | 'md';
  logoUrl?: string;
  name?: string;
}

export const WalletBrandIcon: React.FC<WalletEmblemProps> = ({
  id,
  size = 'md',
  logoUrl,
  name,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const dim = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  const iconDim = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  if (logoUrl && logoUrl.trim() && !imgError) {
    return (
      <span
        className={`${dim} rounded-lg bg-white border border-slate-200 overflow-hidden inline-flex items-center justify-center p-0.5 shrink-0`}
      >
        <img
          src={logoUrl}
          alt={name || id}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      </span>
    );
  }

  switch (id) {
    case 'kuraimi':
      return (
        <span
          className={`${dim} rounded-lg bg-emerald-600/15 border border-emerald-500/35 text-emerald-500 inline-flex items-center justify-center shrink-0`}
          aria-hidden="true"
        >
          <Landmark className={iconDim} />
        </span>
      );
    case 'jawali':
      return (
        <span
          className={`${dim} rounded-lg bg-sky-500/15 border border-sky-400/35 text-sky-400 inline-flex items-center justify-center shrink-0`}
          aria-hidden="true"
        >
          <Smartphone className={iconDim} />
        </span>
      );
    case 'jeeb':
      return (
        <span
          className={`${dim} rounded-lg bg-teal-500/15 border border-teal-400/35 text-teal-400 inline-flex items-center justify-center shrink-0`}
          aria-hidden="true"
        >
          <Wallet className={iconDim} />
        </span>
      );
    case 'onecash':
      return (
        <span
          className={`${dim} rounded-lg bg-amber-500/15 border border-amber-400/35 text-amber-400 inline-flex items-center justify-center shrink-0 font-mono font-bold text-xs`}
          aria-hidden="true"
        >
          1C
        </span>
      );
    case 'flousak':
      return (
        <span
          className={`${dim} rounded-lg bg-indigo-500/15 border border-indigo-400/35 text-indigo-400 inline-flex items-center justify-center shrink-0`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={iconDim}
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
            <path d="M6 15h4" />
          </svg>
        </span>
      );
    default:
      return (
        <span
          className={`${dim} rounded-lg bg-slate-500/15 border border-slate-400/35 text-slate-400 inline-flex items-center justify-center shrink-0`}
          aria-hidden="true"
        >
          <Banknote className={iconDim} />
        </span>
      );
  }
};

export function getShortWalletLabel(id: string, lang: 'ar' | 'en', fallbackName: string): string {
  const map: Record<string, { ar: string; en: string }> = {
    kuraimi: { ar: 'الكريمي حاسب', en: 'Al-Kuraimi Hasib' },
    jawali: { ar: 'جوالي', en: 'Jawali' },
    jeeb: { ar: 'جيب', en: 'Jeeb' },
    onecash: { ar: 'ون كاش', en: 'OneCash' },
    flousak: { ar: 'فلوسك', en: 'Flousak' },
  };
  return map[id]?.[lang] || fallbackName;
}
