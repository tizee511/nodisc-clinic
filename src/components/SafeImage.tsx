import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  aspectClass?: string;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  aspectClass = 'aspect-[4/3]',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`${aspectClass} ${className} bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200 flex flex-col items-center justify-center p-4 text-center border border-slate-200`}
        role="img"
        aria-label={alt}
      >
        <Building2 className="w-8 h-8 text-[#0F4C5C]/50 mb-2" strokeWidth={1.5} />
        <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-[22ch]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`${aspectClass} overflow-hidden bg-slate-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
