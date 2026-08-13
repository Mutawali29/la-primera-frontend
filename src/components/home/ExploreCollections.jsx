import { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

// Explore Our Collections — pakai foto potrait (product card aspect 3:4)
import potrait1 from '../../assets/img/collect/potrait1.jpg';
import potrait2 from '../../assets/img/collect/potrait2.jpg';
import potrait3 from '../../assets/img/collect/potrait3.jpg';
import potrait4 from '../../assets/img/collect/potrait4.jpg';
import potrait5 from '../../assets/img/collect/potrait5.jpg';

// Promo cards — landscape (miring) & single-person (wa) photos
import miring1 from '../../assets/img/collect/miring1.jpeg';
import miring2 from '../../assets/img/collect/miring2.jpeg';
import wa1 from '../../assets/img/collect/wa1.jpeg';
import wa3 from '../../assets/img/collect/wa3.jpeg';

// Data statis (non-teks) — teks diambil dari t() di dalam komponen
const categoriesMeta = [
  { key: 'jaketHitam', image: potrait1, hasBadge: false },
  { key: 'hoodiePutih', image: potrait2, hasBadge: false },
  { key: 'paketJaketHoodie', image: potrait3, hasBadge: true },
  { key: 'setelanSerasi', image: potrait4, hasBadge: false },
  { key: 'lihatSemua', image: potrait5, hasBadge: false },
];

const promoCardsMeta = {
  left: { key: 'left', image: miring1, imgPosition: 'object-center', linkTo: '/shop' },
  topMiddle: { key: 'topMiddle', image: wa1, imgPosition: 'object-[center_30%]', linkTo: '/shop' },
  bottomMiddle: { key: 'bottomMiddle', image: miring2, imgPosition: 'object-center', linkTo: '/shop' },
  right: { key: 'right', image: wa3, imgPosition: 'object-[center_30%] sm:object-top', linkTo: '/shop' },
};

function ExploreCollections() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const categories = categoriesMeta.map((c) => ({
    name: t(`explore.categories.${c.key}.name`),
    price: t(`explore.categories.${c.key}.price`),
    image: c.image,
    badge: c.hasBadge ? t(`explore.categories.${c.key}.badge`) : null,
  }));

  const promoCards = {
    left: {
      label: t('explore.promo.left.label'),
      title: t('explore.promo.left.title'),
      highlight: t('explore.promo.left.highlight'),
      desc: t('explore.promo.left.desc'),
      buttonText: t('explore.promo.left.button'),
      image: promoCardsMeta.left.image,
      imgPosition: promoCardsMeta.left.imgPosition,
      linkTo: promoCardsMeta.left.linkTo,
    },
    topMiddle: {
      label: t('explore.promo.topMiddle.label'),
      title: t('explore.promo.topMiddle.title'),
      linkText: t('explore.promo.topMiddle.link'),
      image: promoCardsMeta.topMiddle.image,
      imgPosition: promoCardsMeta.topMiddle.imgPosition,
      linkTo: promoCardsMeta.topMiddle.linkTo,
    },
    bottomMiddle: {
      title: t('explore.promo.bottomMiddle.title'),
      desc: t('explore.promo.bottomMiddle.desc'),
      linkText: t('explore.promo.bottomMiddle.link'),
      image: promoCardsMeta.bottomMiddle.image,
      imgPosition: promoCardsMeta.bottomMiddle.imgPosition,
      linkTo: promoCardsMeta.bottomMiddle.linkTo,
    },
    right: {
      label: t('explore.promo.right.label'),
      title: t('explore.promo.right.title'),
      linkText: t('explore.promo.right.link'),
      image: promoCardsMeta.right.image,
      imgPosition: promoCardsMeta.right.imgPosition,
      linkTo: promoCardsMeta.right.linkTo,
    },
  };

  const handleButtonClick = (linkTo) => {
    if (linkTo) navigate(linkTo);
  };

  return (
    <div className="relative bg-[#FDFBF9] dark:bg-gray-900 overflow-hidden">
      <BackgroundTexture />

      {/* ============ EXPLORE OUR COLLECTIONS ============ */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-14 lg:pt-20 pb-10 lg:pb-14">
          <div className="relative">
            <SmokeCollision />
            <div className="relative z-10 flex items-end justify-between mb-3">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-red-700 dark:text-red-400 mb-2">
                  {t('explore.sectionLabel')}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{t('explore.title')}</h2>
              </div>
              <button
                onClick={() => navigate('/shop')}
                className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-200 border-b border-gray-900/30 dark:border-gray-200/30 hover:border-red-700 dark:hover:border-red-400 hover:text-red-700 dark:hover:text-red-400 pb-0.5 transition-colors outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-600 rounded-sm"
              >
                {t('explore.viewAll')}
              </button>
            </div>
          </div>

          <StitchLine className="mb-8 lg:mb-10 max-w-xs" />

          <div className="rounded-[28px] border border-rose-100 dark:border-gray-700 bg-rose-50/50 dark:bg-gray-800/50 p-4 sm:p-5 lg:p-6">
            <ul
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-1 px-1 pb-1
                         sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6
                         [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              {categories.map((category) => (
                <li key={category.name} className="shrink-0 w-[42vw] snap-start sm:w-auto sm:shrink">
                  <button
                    onClick={() => navigate(`/shop?category=${encodeURIComponent(category.name)}`)}
                    aria-label={`${category.name}, ${category.price}`}
                    className="group relative block w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 text-left
                               shadow-sm shadow-black/5
                               outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <ProgressiveImage
                      src={category.image}
                      alt={category.name}
                      imgClassName="object-center motion-safe:group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-white text-sm font-semibold tracking-wide">{category.name}</h3>
                        {category.badge && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-white bg-red-600 px-1.5 py-0.5 rounded">
                            {category.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-white/70 text-xs mt-0.5">{category.price}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <StitchLine className="w-full" />
      </div>

      {/* ============ PROMO — SOROTAN MUSIM INI ============ */}
      <section className="relative overflow-hidden">
        <GhostWordmark />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-10 lg:pt-14 pb-16 lg:pb-24">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-red-700 dark:text-red-400 mb-6 lg:mb-8">
            {t('explore.spotlight')}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <FeatureCard
              card={promoCards.left}
              onClick={() => handleButtonClick(promoCards.left.linkTo)}
              className="lg:col-span-1 h-[300px] lg:h-[420px]"
            />

            <div className="lg:col-span-2 flex flex-col gap-6">
              <EditorialCard
                card={promoCards.topMiddle}
                onClick={() => handleButtonClick(promoCards.topMiddle.linkTo)}
                className="h-[220px] lg:h-[192px]"
              />
              <EditorialCard
                card={promoCards.bottomMiddle}
                onClick={() => handleButtonClick(promoCards.bottomMiddle.linkTo)}
                className="h-[220px] lg:h-[192px]"
              />
            </div>

            <EditorialCard
              card={promoCards.right}
              onClick={() => handleButtonClick(promoCards.right.linkTo)}
              className="lg:col-span-1 h-[300px] lg:h-[420px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// ============ ELEMEN DEKORATIF ============

const LEFT_SMOKE = [
  { size: 130, blur: 'blur-2xl', from: { x: -360, y: 260, rotate: -14 }, to: { x: -18, y: 6, rotate: -4 }, delay: 0 },
  { size: 90, blur: 'blur-xl', from: { x: -300, y: 340, rotate: 10 }, to: { x: 10, y: 22, rotate: 6 }, delay: 0.05 },
  { size: 160, blur: 'blur-3xl', from: { x: -420, y: 180, rotate: -20 }, to: { x: -34, y: -12, rotate: -10 }, delay: 0.02 },
  { size: 70, blur: 'blur-lg', from: { x: -220, y: 380, rotate: 16 }, to: { x: 4, y: 30, rotate: 8 }, delay: 0.1 },
  { size: 110, blur: 'blur-xl', from: { x: -380, y: 120, rotate: -8 }, to: { x: -22, y: -24, rotate: -6 }, delay: 0.04 },
];

const RIGHT_SMOKE = [
  { size: 120, blur: 'blur-2xl', from: { x: 340, y: -240, rotate: 14 }, to: { x: 20, y: -8, rotate: 5 }, delay: 0.03 },
  { size: 85, blur: 'blur-xl', from: { x: 280, y: -320, rotate: -10 }, to: { x: -8, y: -26, rotate: -6 }, delay: 0.08 },
  { size: 150, blur: 'blur-3xl', from: { x: 400, y: -160, rotate: 20 }, to: { x: 32, y: 10, rotate: 9 }, delay: 0.01 },
  { size: 65, blur: 'blur-lg', from: { x: 200, y: -360, rotate: -16 }, to: { x: -2, y: -32, rotate: -8 }, delay: 0.11 },
  { size: 100, blur: 'blur-xl', from: { x: 360, y: -100, rotate: 8 }, to: { x: 24, y: 20, rotate: 6 }, delay: 0.06 },
];

function SmokeCollision() {
  const introRef = useRef(null);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  const flashRef = useRef(null);
  const puffRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    const allParticles = [...leftRefs.current, ...rightRefs.current].filter(Boolean);

    if (prefersReducedMotion) {
      gsap.set(allParticles, { x: 0, y: 0, rotate: 0, opacity: 0.55, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      leftRefs.current.forEach((el, i) => el && gsap.set(el, { ...LEFT_SMOKE[i].from, opacity: 0, scale: 0.6 }));
      rightRefs.current.forEach((el, i) => el && gsap.set(el, { ...RIGHT_SMOKE[i].from, opacity: 0, scale: 0.6 }));
      gsap.set(flashRef.current, { opacity: 0, scale: 0.3 });
      gsap.set(puffRef.current, { opacity: 0, scale: 0.4 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: introRef.current, start: 'top 78%', once: true },
      });

      leftRefs.current.forEach((el, i) => {
        if (!el) return;
        const cfg = LEFT_SMOKE[i];
        tl.to(el, { ...cfg.to, opacity: 0.65, scale: 1, duration: 1.1, ease: 'power3.out' }, cfg.delay);
      });
      rightRefs.current.forEach((el, i) => {
        if (!el) return;
        const cfg = RIGHT_SMOKE[i];
        tl.to(el, { ...cfg.to, opacity: 0.65, scale: 1, duration: 1.1, ease: 'power3.out' }, cfg.delay);
      });

      tl.to(flashRef.current, { opacity: 0.9, scale: 1.4, duration: 0.14, ease: 'power2.out' }, 0.95)
        .to(flashRef.current, { opacity: 0, scale: 2, duration: 0.55, ease: 'power2.out' }, '>-0.02')
        .to(puffRef.current, { opacity: 0.5, scale: 1.6, duration: 0.5, ease: 'power2.out' }, 0.98)
        .to(puffRef.current, { opacity: 0, scale: 2.3, duration: 0.9, ease: 'power2.out' }, '>-0.1')
        .to(allParticles, { scale: 1.12, duration: 0.12 }, 0.95)
        .to(allParticles, { scale: 1, opacity: 0.4, duration: 0.7, ease: 'power2.out' }, 1.08)
        .to(allParticles, {
          opacity: 0.55,
          duration: 2.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.25, from: 'random' },
        }, 1.6);
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={introRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {LEFT_SMOKE.map((cfg, i) => (
        <div
          key={`l-${i}`}
          ref={(el) => (leftRefs.current[i] = el)}
          className={`absolute left-1/2 top-1/2 ${cfg.blur} rounded-[46%_54%_58%_42%/50%_42%_58%_50%] mix-blend-screen`}
          style={{
            width: cfg.size,
            height: cfg.size,
            marginLeft: -cfg.size / 2,
            marginTop: -cfg.size / 2,
            background:
              'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95) 0%, rgba(253,164,175,0.35) 45%, rgba(253,164,175,0) 75%)',
            willChange: 'transform, opacity',
          }}
        />
      ))}
      {RIGHT_SMOKE.map((cfg, i) => (
        <div
          key={`r-${i}`}
          ref={(el) => (rightRefs.current[i] = el)}
          className={`absolute left-1/2 top-1/2 ${cfg.blur} rounded-[54%_46%_42%_58%/46%_58%_42%_54%] mix-blend-screen`}
          style={{
            width: cfg.size,
            height: cfg.size,
            marginLeft: -cfg.size / 2,
            marginTop: -cfg.size / 2,
            background:
              'radial-gradient(circle at 65% 35%, rgba(255,255,255,0.95) 0%, rgba(252,165,165,0.35) 45%, rgba(252,165,165,0) 75%)',
            willChange: 'transform, opacity',
          }}
        />
      ))}
      <div
        ref={puffRef}
        className="absolute left-1/2 top-1/2 w-40 h-40 -ml-20 -mt-20 rounded-full blur-2xl mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)' }}
      />
      <div
        ref={flashRef}
        className="absolute left-1/2 top-1/2 w-16 h-16 -ml-8 -mt-8 rounded-full bg-white blur-lg"
      />
    </div>
  );
}

function BackgroundTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] mix-blend-multiply">
        <filter id="lp-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#lp-grain)" />
      </svg>
      <div
        className="absolute -top-40 -right-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-[0.08]"
        style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 -left-40 w-[420px] h-[420px] rounded-full blur-3xl opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #fda4af 0%, transparent 70%)' }}
      />
    </div>
  );
}

function StitchLine({ className = '' }) {
  return (
    <svg
      className={`h-[6px] text-rose-300 dark:text-gray-600 ${className}`}
      viewBox="0 0 400 6"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line
        x1="0" y1="3" x2="400" y2="3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="10 8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GhostWordmark() {
  return (
    <p
      aria-hidden="true"
      className="pointer-events-none select-none absolute -top-6 left-1/2 -translate-x-1/2
                 whitespace-nowrap text-[16vw] lg:text-[9vw] font-extrabold tracking-tight
                 text-transparent opacity-[0.05] dark:opacity-[0.08]"
      style={{ WebkitTextStroke: '1px #7f1d1d', transform: 'translateX(-50%) rotate(-2deg)' }}
    >
      LA · PRIMERA
    </p>
  );
}

function ProgressiveImage({ src, alt, imgClassName = '' }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 transition-opacity duration-300 ${
          loaded ? 'opacity-0' : 'opacity-100 animate-pulse'
        }`}
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-500 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </>
  );
}

function FeatureCard({ card, onClick, className = '' }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden group ${className}`}>
      <ProgressiveImage
        src={card.image}
        alt={card.title}
        imgClassName={`${card.imgPosition || 'object-center'} motion-safe:group-hover:scale-[1.03]`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-7">
        <p className="text-white/80 text-xs font-semibold uppercase tracking-[0.15em] mb-3">
          {card.label}
        </p>
        <h3 className="text-white text-lg sm:text-xl font-medium leading-snug">{card.title}</h3>
        <p className="text-white text-4xl sm:text-5xl font-extrabold mb-3 leading-none">
          {card.highlight}
        </p>
        <p className="text-white/70 text-sm mb-5 max-w-[85%]">{card.desc}</p>
        <button
          onClick={onClick}
          aria-label={`${card.buttonText} — ${card.label}, diskon ${card.highlight}`}
          className="inline-flex w-fit items-center gap-2 bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30
                     text-white text-sm font-semibold px-6 py-3 rounded-full transition-[background-color,box-shadow] duration-200
                     outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {card.buttonText}
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function EditorialCard({ card, onClick, className = '' }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden group ${className}`}>
      <ProgressiveImage
        src={card.image}
        alt={card.title}
        imgClassName={`${card.imgPosition || 'object-center'} motion-safe:group-hover:scale-[1.03]`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-6">
        {card.label && (
          <p className="text-white/80 text-[11px] font-semibold uppercase tracking-[0.15em] mb-1.5">
            {card.label}
          </p>
        )}
        <h3 className="text-white text-base sm:text-lg font-semibold leading-snug mb-2 max-w-[85%] sm:max-w-[80%]">
          {card.title}
        </h3>
        {card.desc && (
          <p className="text-white/70 text-xs mb-3 max-w-[75%] hidden sm:block">{card.desc}</p>
        )}
        <button
          onClick={onClick}
          aria-label={`${card.linkText}: ${card.title}`}
          className="inline-flex w-fit items-center text-white text-xs font-semibold uppercase tracking-wide
                     border-b border-white/40 group-hover:border-white pb-0.5 transition-colors
                     outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {card.linkText}
        </button>
      </div>
    </div>
  );
}

export default ExploreCollections;