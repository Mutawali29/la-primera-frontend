import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import {
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';
import { useLanguage } from '../../context/LanguageContext';

// Banner slides — 3 banners
import banner1 from '../../assets/img/banner/banner-1.jpg';
import banner2 from '../../assets/img/banner/banner-2.jpg';
import banner3 from '../../assets/img/banner/banner-3.jpg';

// Data statis (non-teks) — teks slide diambil dari t() di dalam komponen
const slidesMeta = [
  { id: 1, key: 'slide1', image: banner1, linkTo: '/shop' },
  { id: 2, key: 'slide2', image: banner2, linkTo: '/shop' },
  { id: 3, key: 'slide3', image: banner3, linkTo: '/shop' },
];

// Trust badges — icon statis, teks diambil dari t()
const trustBadgesMeta = [
  { key: 'shipping', icon: TruckIcon },
  { key: 'returns', icon: ArrowPathIcon },
  { key: 'quality', icon: ShieldCheckIcon },
  { key: 'checkout', icon: LockClosedIcon },
];

const AUTOPLAY_MS = 6000;

// ===== Mobile-only crop focus per slide =====
// Banner 1 (index 0) → fokus kiri di mobile
// Banner 2 (index 1) → fokus tengah di mobile
// Banner 3 (index 2) → fokus kanan di mobile
// Mulai breakpoint `sm` ke atas, semua di-override balik ke `object-center`
// sehingga tampilan desktop 100% sama seperti sebelumnya, tidak berubah.
const MOBILE_FOCUS_CLASSES = [
  'object-[30%_center] sm:object-center',
  'object-center sm:object-center',
  'object-right sm:object-center',
];

function Hero() {
  const { t } = useLanguage();

  // Slides & trust badges dengan teks yang sudah diterjemahkan
  // (dibangun ulang tiap render mengikuti bahasa aktif; tidak memengaruhi
  // urutan/index/mekanisme carousel karena panjang & urutan array tetap sama)
  const slides = slidesMeta.map((s) => ({
    id: s.id,
    image: s.image,
    linkTo: s.linkTo,
    label: t(`hero.${s.key}.label`),
    title: t(`hero.${s.key}.title`),
    subtitle: t(`hero.${s.key}.subtitle`),
    description: t(`hero.${s.key}.description`),
    buttonText: t(`hero.${s.key}.button`),
  }));

  const trustBadges = trustBadgesMeta.map((b) => ({
    title: t(`hero.trust.${b.key}.title`),
    subtitle: t(`hero.trust.${b.key}.subtitle`),
    icon: b.icon,
  }));

  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const touchStartX = useRef(null);
  const isAnimatingRef = useRef(false);

  const sectionRef = useRef(null);
  const curtainRef = useRef(null);
  const glowRef = useRef(null);
  const magneticRef = useRef(null);
  const imageRefs = useRef([]);
  const parallaxRefs = useRef([]);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descRef = useRef(null);
  const btnRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== GSAP: set initial opacity ONCE on mount (never touched by React again) =====
  useLayoutEffect(() => {
    parallaxRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === 0 ? 1 : 0 });
    });
  }, []);

  // ===== Imperative transition — built and played fresh on every call, never
  // tied to a useLayoutEffect+dependency-array cycle. This is the actual fix:
  // previously the curtain timeline lived inside a gsap.context() that was
  // torn down and rebuilt every time `currentSlide` changed. That teardown
  // (`ctx.revert()`) fires on every slide change and rolls back GSAP-tracked
  // properties from whatever transition was still in flight, which is what
  // produced the "flashes back to slide 1" glitch. Building the timeline here
  // and calling it directly from the nav handlers means nothing ever reverts
  // an in-progress transition mid-flight. =====
  const playTransition = useCallback(
    (targetIndex) => {
      const target = ((targetIndex % slides.length) + slides.length) % slides.length;
      if (target === currentSlide || isAnimatingRef.current) return;

      if (prefersReducedMotion) {
        parallaxRefs.current.forEach((el, i) => {
          if (el) gsap.set(el, { opacity: i === target ? 1 : 0 });
        });
        setCurrentSlide(target);
        return;
      }

      isAnimatingRef.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });

      tl.set(curtainRef.current, { scaleX: 0, transformOrigin: 'left center' })
        .to(curtainRef.current, { scaleX: 1, duration: 0.45, ease: 'power3.in' })
        .call(() => {
          // Hard-cut the image swap right as the curtain fully covers the
          // screen — precise and invisible, instead of an independent CSS
          // opacity transition racing against the wipe.
          parallaxRefs.current.forEach((el, i) => {
            if (el) gsap.set(el, { opacity: i === target ? 1 : 0 });
          });

          // Safe to update React state here — the curtain (z-30) fully
          // covers the content (z-10) at this point in the timeline, so the
          // text swap is invisible regardless of React's render timing.
          setCurrentSlide(target);

          const textEls = [
            labelRef.current,
            titleRef.current,
            subtitleRef.current,
            descRef.current,
            btnRef.current,
          ].filter(Boolean);
          gsap.fromTo(
            textEls,
            { y: 44, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, ease: 'power4.out', stagger: 0.08 }
          );
        })
        .set(curtainRef.current, { transformOrigin: 'right center' }, '+=0.05')
        .to(curtainRef.current, { scaleX: 0, duration: 0.5, ease: 'power3.out' });
    },
    [currentSlide, prefersReducedMotion, slides.length]
  );

  const goToSlide = useCallback((index) => playTransition(index), [playTransition]);
  const nextSlide = useCallback(() => playTransition(currentSlide + 1), [currentSlide, playTransition]);
  const prevSlide = useCallback(() => playTransition(currentSlide - 1), [currentSlide, playTransition]);

  // Autoplay + progress bar
  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const startedAt = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(100, (elapsed / AUTOPLAY_MS) * 100));
    }, 50);

    timeoutRef.current = setTimeout(() => {
      playTransition(currentSlide + 1);
    }, AUTOPLAY_MS);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [currentSlide, paused, playTransition]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Swipe support (mobile)
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    touchStartX.current = null;
  };

  const handleButtonClick = (linkTo) => { if (linkTo) navigate(linkTo); };

  // ===== GSAP: magnetic CTA button =====
  useEffect(() => {
    if (prefersReducedMotion) return;
    const btn = magneticRef.current;
    if (!btn) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    };
    const handleMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [prefersReducedMotion]);

  // ===== GSAP: cursor-follow spotlight + subtle image parallax =====
  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section) return;

    const handleMove = (e) => {
      const rect = section.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      if (glow) {
        gsap.to(glow, {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          duration: 0.6,
          ease: 'power2.out',
        });
      }

      const activeWrapper = parallaxRefs.current[currentSlide];
      if (activeWrapper) {
        gsap.to(activeWrapper, {
          x: (relX - 0.5) * 20,
          y: (relY - 0.5) * 14,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    };

    section.addEventListener('mousemove', handleMove);
    return () => section.removeEventListener('mousemove', handleMove);
  }, [currentSlide, prefersReducedMotion]);

  const slide = slides[currentSlide];

  return (
    <>
      {/* ============ HERO — full-bleed image, GSAP-driven transitions ============ */}
      <section
        ref={sectionRef}
        className="group relative z-0 w-full h-[85vh] min-h-[560px] overflow-hidden bg-gray-900"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Banner promosi"
      >
        {/* Background images — opacity is set and controlled entirely by GSAP
            (mount-only init effect + playTransition's imperative timeline).
            React never writes an opacity style here, so it can never race
            with or overwrite what GSAP has set on the DOM.
            object-position: mobile-only per-slide focus via MOBILE_FOCUS_CLASSES,
            overridden back to object-center at `sm:` so desktop is unchanged. */}
        {slides.map((s, index) => (
          <div
            key={s.id}
            ref={(el) => (parallaxRefs.current[index] = el)}
            className="absolute -inset-2"
          >
            <img
              ref={(el) => (imageRefs.current[index] = el)}
              src={s.image}
              alt={s.title}
              fetchPriority={index === 0 ? 'high' : 'low'}
              loading={index === 0 ? 'eager' : 'lazy'}
              className={`w-full h-full object-cover ${MOBILE_FOCUS_CLASSES[index]}`}
            />
          </div>
        ))}

        {/* Curtain — sweeps across on every slide change (GSAP-controlled only) */}
        <div
          ref={curtainRef}
          className="absolute inset-0 z-30 bg-red-600 pointer-events-none"
          style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
        />

        {/* Cursor-follow spotlight glow */}
        <div
          ref={glowRef}
          className="hidden lg:block absolute z-10 w-[420px] h-[420px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 70%)',
          }}
        />

        {/* Readability overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-[5]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[5]" />

        {/* Nav arrows */}
        <button
          onClick={prevSlide}
          aria-label="Slide sebelumnya"
          className="hidden sm:flex items-center justify-center absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20
                     w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white
                     opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Slide berikutnya"
          className="hidden sm:flex items-center justify-center absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20
                     w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white
                     opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Konten */}
        <div
          className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex flex-col justify-end pb-16 lg:pb-20"
          aria-live="polite"
        >
          <div className="max-w-xl">
            <p ref={labelRef} className="text-xs font-semibold tracking-[0.15em] uppercase text-red-400 mb-4">
              {slide.label}
            </p>
            <h1 ref={titleRef} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[0.95] mb-3">
              {slide.title}
            </h1>
            <h2 ref={subtitleRef} className="italic text-xl sm:text-2xl text-white/90 font-normal mb-5">
              {slide.subtitle}
            </h2>
            <p ref={descRef} className="text-white/70 text-sm leading-relaxed mb-7 max-w-sm">
              {slide.description}
            </p>
            <button
              ref={(el) => { btnRef.current = el; magneticRef.current = el; }}
              onClick={() => handleButtonClick(slide.linkTo)}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700
                         hover:shadow-lg hover:shadow-red-600/30
                         text-white text-sm font-semibold px-6 py-3 rounded-full
                         transition-[background-color,box-shadow] duration-200"
            >
              {slide.buttonText}
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Indikator slide */}
          <div className="flex items-center gap-2 mt-10 max-w-[220px]">
            {slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => goToSlide(index)}
                aria-label={`Tampilkan: ${s.label}`}
                aria-current={index === currentSlide}
                className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden"
              >
                <span
                  className="block h-full bg-red-500 rounded-full transition-[width] duration-100 ease-linear"
                  style={{
                    width:
                      index === currentSlide
                        ? `${progress}%`
                        : index < currentSlide
                        ? '100%'
                        : '0%',
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/60 hidden lg:block animate-bounce">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ============ TRUST BADGES ============ */}
      <div className="relative z-20 -mt-10 lg:-mt-14 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-2.5">
          <div className="bg-rose-100 dark:bg-gray-800 rounded-xl px-6 sm:px-8 lg:px-10 py-7">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-7 gap-x-4 lg:divide-x lg:divide-rose-200/60 dark:lg:divide-gray-700">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.title} className="flex items-center gap-3 lg:pl-8 lg:first:pl-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{badge.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{badge.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-10 lg:h-14 bg-white dark:bg-gray-900" />
    </>
  );
}

export default Hero;