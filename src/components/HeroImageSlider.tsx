import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeImage } from './SafeImage';
import { useCarouselSwipe, useReducedMotionPref } from '../hooks/useCarouselSwipe';

interface HeroSlide {
  src: string;
  captionAr: string;
  captionEn: string;
}

interface HeroImageSliderProps {
  primarySrc?: string | null;
  brandName: string;
  lang: 'ar' | 'en';
  isRTL: boolean;
}

const SLIDE_INTERVAL_MS = 3800;

const EXTRA_CLINIC_SLIDES: HeroSlide[] = [
  {
    src: '/src/assets/images/dept_neurosurgery_suite_1795286629702.jpg',
    captionAr: 'عيادة جراحة المخ والأعصاب والعمود الفقري',
    captionEn: 'Neurosurgery & Spine MRI Consultation',
  },
  {
    src: '/src/assets/images/dept_pain_clinic_1795286628900.jpg',
    captionAr: 'وحدة علاج الألم التداخلي والتصوير الموجّه',
    captionEn: 'Interventional Pain & Ultrasound Suite',
  },
  {
    src: '/src/assets/images/dept_rehab_gym_1795286629619.jpg',
    captionAr: 'مركز التأهيل الحركي والعلاج الطبيعي',
    captionEn: 'Physiotherapy & Spine Rehabilitation',
  },
  {
    src: '/src/assets/images/dept_pharmacy_counter_1795286630165.jpg',
    captionAr: 'صيدلية نوديسك للمكملات والمستلزمات الطبية',
    captionEn: 'NODISC Clinical Pharmacy & Support',
  },
];

export const HeroImageSlider: React.FC<HeroImageSliderProps> = ({
  primarySrc,
  brandName,
  lang,
  isRTL,
}) => {
  const reducedMotion = useReducedMotionPref();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);

  const slides = useMemo<HeroSlide[]>(() => {
    const mainSrc = primarySrc || '/src/assets/images/hero_nodisc_clinic_1795286630066.jpg';
    const firstSlide: HeroSlide = {
      src: mainSrc,
      captionAr: 'الاستقبال الرئيسي · نوديسك كلينك',
      captionEn: 'Main Reception · NODISC Clinic',
    };
    const extras = EXTRA_CLINIC_SLIDES.filter((s) => s.src !== mainSrc).slice(0, 3);
    return [firstSlide, ...extras];
  }, [primarySrc]);

  const totalCount = slides.length;
  const maxIndex = Math.max(0, totalCount - 1);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const { dragOffsetPx, isDragging, viewportProps } = useCarouselSwipe({
    activeIndex,
    maxIndex,
    onNext: handleNext,
    onPrev: handlePrev,
  });

  const autoPaused = isHoveredOrFocused || isDragging || reducedMotion;

  useEffect(() => {
    if (autoPaused || maxIndex === 0) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoPaused, maxIndex]);

  const trackWidthPct = totalCount * 100;
  const translateXPct = (activeIndex * 100) / totalCount;
  const currentSlide = slides[activeIndex] || slides[0];

  return (
    <div
      aria-label={lang === 'ar' ? 'معرض صور عيادات نوديسك كلينك' : 'NODISC Clinic Gallery'}
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHoveredOrFocused(true)}
      onMouseLeave={() => setIsHoveredOrFocused(false)}
      onFocusCapture={() => setIsHoveredOrFocused(true)}
      onBlurCapture={() => setIsHoveredOrFocused(false)}
      className="relative rounded-2xl p-[1.5px] bg-gradient-to-br from-[#0F4C5C]/25 via-sky-300/65 to-teal-300/50 shadow-[0_18px_38px_-18px_rgba(15,76,92,0.3)]"
    >
      <div className="relative rounded-[14.5px] bg-white p-1.5 overflow-hidden">
        {/* Top Specular Accent Line */}
        <span
          aria-hidden="true"
          className="pointer-events-none block h-[2.5px] w-full rounded-full bg-gradient-to-r from-[#0F4C5C] via-[#38BDF8] to-teal-400 mb-1.5 opacity-90"
        />

        {/* Sliding Strip Viewport (Swipeable, No Navigation Buttons) */}
        <div
          dir="ltr"
          className={`relative overflow-hidden rounded-xl border border-slate-100 touch-pan-y select-none focus-visible:outline-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab sm:cursor-default'
          }`}
          tabIndex={0}
          {...viewportProps}
        >
          <div
            className={`flex items-stretch ${
              isDragging
                ? 'transition-none'
                : 'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]'
            }`}
            style={{
              width: `${trackWidthPct}%`,
              transform: `translate3d(calc(-${translateXPct}% + ${dragOffsetPx}px), 0, 0)`,
              willChange: 'transform',
            }}
          >
            {slides.map((slide, idx) => (
              <div
                key={slide.src + idx}
                style={{ width: `${100 / totalCount}%` }}
                className="shrink-0"
              >
                <SafeImage
                  src={slide.src}
                  alt={
                    idx === 0
                      ? brandName
                      : lang === 'ar'
                        ? slide.captionAr
                        : slide.captionEn
                  }
                  aspectClass="aspect-[16/10] sm:aspect-[16/10] lg:aspect-[4/3]"
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Subtle Bottom Caption & Passive Progress Strip (No Navigation Buttons) */}
          <div
            dir={isRTL ? 'rtl' : 'ltr'}
            className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#062B35]/85 via-[#062B35]/35 to-transparent px-3.5 sm:px-4 pt-8 pb-3 flex items-end justify-between gap-3"
          >
            <p className="text-[11px] sm:text-xs font-semibold text-white/95 drop-shadow-xs truncate">
              {lang === 'ar' ? currentSlide.captionAr : currentSlide.captionEn}
            </p>

            {/* Passive Animated Progress Segments */}
            <div dir="ltr" aria-hidden="true" className="flex items-center gap-1.5 shrink-0">
              {slides.map((slide, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <span
                    key={slide.src + idx}
                    className={`relative h-1 rounded-full overflow-hidden transition-all duration-300 ${
                      isActive ? 'w-6 bg-white/35' : 'w-2 bg-white/45'
                    }`}
                  >
                    {isActive && (
                      <span
                        key={`${activeIndex}-${autoPaused ? 'paused' : 'run'}`}
                        className={`absolute inset-0 rounded-full bg-white ${
                          !autoPaused ? 'animate-dot-progress' : ''
                        }`}
                        style={
                          !autoPaused
                            ? { animationDuration: `${SLIDE_INTERVAL_MS}ms` }
                            : undefined
                        }
                      />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
