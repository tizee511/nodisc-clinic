/// <reference types="google.maps" />
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  APIProvider,
  APILoadingStatus,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { ExternalLink, LocateFixed, MapPin, Navigation } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ResolvedClinicPlace {
  position: google.maps.LatLngLiteral;
  displayName: string;
  formattedAddress: string;
  googleMapsURI: string | null;
}

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const QUOTA_ERROR_PATTERNS = [
  'RESOURCE_EXHAUSTED',
  'OVER_QUERY_LIMIT',
  'QuotaExceededError',
  'OverQuotaMapError',
  '429',
];

function isQuotaError(err: unknown): boolean {
  const text =
    err instanceof Error
      ? `${err.name} ${err.message}`
      : typeof err === 'object' && err !== null
        ? JSON.stringify(err)
        : String(err);
  return QUOTA_ERROR_PATTERNS.some((pattern) => text.includes(pattern));
}

const RecenterControl: React.FC<{
  position: google.maps.LatLngLiteral;
  label: string;
}> = ({ position, label }) => {
  const map = useMap();

  const handleRecenter = useCallback(() => {
    if (!map) return;
    map.panTo(position);
    map.setZoom(16);
  }, [map, position]);

  return (
    <button
      type="button"
      onClick={handleRecenter}
      title={label}
      className="absolute bottom-3 start-3 z-10 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/95 hover:bg-white text-slate-800 border border-slate-200 shadow-md text-xs font-semibold transition-colors cursor-pointer"
    >
      <LocateFixed className="w-3.5 h-3.5 text-[#0F4C5C]" />
      <span>{label}</span>
    </button>
  );
};

interface InteractiveMapCanvasProps {
  clinicName: string;
  clinicLandmark: string;
  clinicAddress: string;
  directionsFallbackUrl: string;
  lang: 'ar' | 'en';
}

const InteractiveMapCanvas: React.FC<InteractiveMapCanvasProps> = ({
  clinicName,
  clinicLandmark,
  clinicAddress,
  directionsFallbackUrl,
  lang,
}) => {
  const apiStatus = useApiLoadingStatus();
  const placesLib = useMapsLibrary('places');
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);
  const [isResolving, setIsResolving] = useState(true);
  const [lookupError, setLookupError] = useState(false);
  const [resolvedPlace, setResolvedPlace] = useState<ResolvedClinicPlace | null>(null);

  useEffect(() => {
    if (apiStatus === APILoadingStatus.AUTH_FAILURE) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      setLookupError(true);
      setIsResolving(false);
    } else if (apiStatus === APILoadingStatus.FAILED) {
      setLookupError(true);
      setIsResolving(false);
    }
  }, [apiStatus]);

  const searchQueries = useMemo(() => {
    if (lang === 'ar') {
      return [
        'مركز ابن سيناء الطبي التشخيصي شارع تعز صنعاء',
        'جولة 45 شارع تعز صنعاء',
        'شارع تعز صنعاء اليمن',
        'صنعاء اليمن',
      ];
    }
    return [
      'Ibn Sina Medical Diagnostic Center Taiz Street Sanaa',
      'Roundabout 45 Taiz Street Sanaa',
      'Taiz Street Sanaa Yemen',
      'Sanaa Yemen',
    ];
  }, [lang]);

  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    const resolveClinicLocation = async () => {
      setIsResolving(true);
      setLookupError(false);

      try {
        for (const query of searchQueries) {
          const response = await placesLib.Place.searchByText({
            textQuery: query,
            fields: ['displayName', 'location', 'formattedAddress', 'googleMapsURI'],
            language: lang,
            region: 'ye',
            maxResultCount: 1,
            internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
          });

          if (cancelled) return;

          const topPlace = response?.places?.[0];
          if (topPlace?.location) {
            setResolvedPlace({
              position: {
                lat: topPlace.location.lat(),
                lng: topPlace.location.lng(),
              },
              displayName: topPlace.displayName || clinicLandmark,
              formattedAddress: topPlace.formattedAddress || clinicAddress,
              googleMapsURI: topPlace.googleMapsURI ?? null,
            });
            setInfoWindowOpen(true);
            setIsResolving(false);
            return;
          }
        }

        if (!cancelled) {
          setLookupError(true);
          setIsResolving(false);
        }
      } catch (error) {
        if (cancelled) return;
        if (isQuotaError(error)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setLookupError(true);
        setIsResolving(false);
      }
    };

    void resolveClinicLocation();

    return () => {
      cancelled = true;
    };
  }, [placesLib, searchQueries, lang, clinicLandmark, clinicAddress]);

  const externalDirectionsUrl = resolvedPlace?.googleMapsURI || directionsFallbackUrl;

  if (lookupError || (!isResolving && !resolvedPlace)) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8 text-center space-y-3">
        <div className="w-11 h-11 rounded-full bg-[#0F4C5C]/10 text-[#0F4C5C] flex items-center justify-center mx-auto">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <p className="font-display font-bold text-base text-slate-900">{clinicLandmark}</p>
          <p className="text-sm text-slate-600">{clinicAddress}</p>
        </div>
        <a
          href={externalDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs sm:text-sm font-semibold transition-colors"
        >
          <Navigation className="w-4 h-4" />
          <span>{lang === 'ar' ? 'فتح الموقع في خرائط جوجل' : 'Open in Google Maps'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  if (isResolving || !resolvedPlace) {
    return (
      <div
        className="w-full h-[320px] sm:h-[380px] rounded-xl border border-slate-200 bg-slate-100 animate-pulse flex flex-col items-center justify-center gap-2 text-slate-500 text-xs sm:text-sm"
        aria-busy="true"
      >
        <MapPin className="w-6 h-6 text-[#0F4C5C]/60" />
        <span>{lang === 'ar' ? 'جاري تحميل الخريطة التفاعلية...' : 'Loading interactive map...'}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={resolvedPlace.position}
        defaultZoom={16}
        gestureHandling="cooperative"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={true}
        zoomControl={true}
        clickableIcons={false}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        <AdvancedMarker
          ref={markerRef}
          position={resolvedPlace.position}
          title={clinicName}
          onClick={() => setInfoWindowOpen((prev) => !prev)}
        >
          <Pin
            background="#0F4C5C"
            borderColor="#093542"
            glyphColor="#FFFFFF"
            scale={1.15}
          />
        </AdvancedMarker>

        {infoWindowOpen && marker && (
          <InfoWindow
            anchor={marker}
            maxWidth={280}
            onCloseClick={() => setInfoWindowOpen(false)}
          >
            <div className="space-y-1.5 text-start p-0.5" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <p className="font-display font-bold text-sm text-slate-900 leading-snug">
                {clinicName}
              </p>
              <p className="text-xs font-medium text-[#0F4C5C] leading-snug">
                {clinicLandmark}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">{clinicAddress}</p>
              <div className="pt-1">
                <a
                  href={externalDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:underline"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'الاتجاهات عبر خرائط جوجل' : 'Directions on Google Maps'}</span>
                </a>
              </div>
            </div>
          </InfoWindow>
        )}

        <RecenterControl
          position={resolvedPlace.position}
          label={lang === 'ar' ? 'توسيط الموقع' : 'Center Map'}
        />
      </GoogleMap>
    </div>
  );
};

export const ClinicLocationMap: React.FC = () => {
  const { lang, localizedConfig } = useLanguage();
  const [providerError, setProviderError] = useState(false);

  const clinicName =
    lang === 'ar' ? localizedConfig.brand.nameAr : localizedConfig.brand.nameEn;
  const clinicLandmark = localizedConfig.contact.landmark;
  const clinicAddress = localizedConfig.contact.address;
  const directionsQuery =
    lang === 'ar'
      ? 'مركز ابن سيناء الطبي التشخيصي، صنعاء، شارع تعز، جولة 45'
      : 'Ibn Sina Medical Diagnostic Center, Taiz Street, Sanaa, Yemen';
  const directionsFallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(directionsQuery)}`;

  const handleProviderError = useCallback((error: unknown) => {
    if (isQuotaError(error)) {
      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
    }
    setProviderError(true);
  }, []);

  return (
    <section
      aria-labelledby="clinic-location-map-title"
      className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 lg:p-7 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#0F4C5C]/10 text-[#0F4C5C] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </span>
            <h2
              id="clinic-location-map-title"
              className="font-display font-bold text-lg sm:text-xl text-slate-900"
            >
              {lang === 'ar'
                ? 'موقع عيادات نوديسك كلينك على الخريطة'
                : 'NODISC Clinic Interactive Location Map'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            {clinicLandmark} — {clinicAddress}
          </p>
        </div>

        <a
          href={directionsFallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:border-[#0F4C5C]/40 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition-colors shrink-0"
        >
          <Navigation className="w-3.5 h-3.5 text-[#0F4C5C]" />
          <span>{lang === 'ar' ? 'عرض الاتجاهات' : 'Get Directions'}</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {!MAPS_API_KEY || providerError ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8 text-center space-y-3">
          <div className="w-11 h-11 rounded-full bg-[#0F4C5C]/10 text-[#0F4C5C] flex items-center justify-center mx-auto">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <p className="font-display font-bold text-base text-slate-900">{clinicLandmark}</p>
            <p className="text-sm text-slate-600">{clinicAddress}</p>
          </div>
          <a
            href={directionsFallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0F4C5C] hover:bg-[#093542] text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            <Navigation className="w-4 h-4" />
            <span>{lang === 'ar' ? 'فتح الموقع في خرائط جوجل' : 'Open in Google Maps'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : (
        <APIProvider
          apiKey={MAPS_API_KEY}
          language={lang}
          region="YE"
          libraries={['places', 'marker']}
          onError={handleProviderError}
        >
          <InteractiveMapCanvas
            clinicName={clinicName}
            clinicLandmark={clinicLandmark}
            clinicAddress={clinicAddress}
            directionsFallbackUrl={directionsFallbackUrl}
            lang={lang}
          />
        </APIProvider>
      )}
    </section>
  );
};
