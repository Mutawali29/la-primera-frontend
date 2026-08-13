// src/pages/About.jsx
import { useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Heart, Sparkles, ShieldCheck, ChevronDown, Compass, Target, Quote } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import video from '../assets/video/produk-cinematic.mp4';

gsap.registerPlugin(ScrollTrigger);

function About() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('story');

  const heroTitleRef = useRef(null);
  const heroDescRef = useRef(null);
  const statsRef = useRef(null);
  const statRefs = useRef([]);
  const tabPanelRef = useRef(null);
  const ctaRef = useRef(null);
  const ctaMagneticRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stats = [
    { key: 'founded' },
    { key: 'original' },
    { key: 'focus' },
  ];

  const storySteps = ['p1', 'p2', 'p3'];

  const values = [
    { key: 'quality', icon: ShieldCheck },
    { key: 'customer', icon: Heart },
    { key: 'design', icon: Sparkles },
    { key: 'transparent', icon: CheckCircle2 },
  ];

  const tabs = [
    { id: 'story', label: t('about.tabs.story') },
    { id: 'mission', label: t('about.tabs.mission') },
    { id: 'values', label: t('about.tabs.values') },
  ];

  // Hero intro
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [heroTitleRef.current, heroDescRef.current],
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.15, delay: 0.2 }
      );
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Stats reveal on scroll
  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      statRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        statRefs.current.filter(Boolean),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
        }
      );
    }, statsRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Fade transisi setiap ganti tab
  useLayoutEffect(() => {
    if (prefersReducedMotion || !tabPanelRef.current) return;
    gsap.fromTo(
      tabPanelRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [activeTab, prefersReducedMotion]);

  // CTA reveal
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 88%' },
        }
      );
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Magnetic hover di tombol utama CTA — pola sama seperti CTA di Hero.jsx
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const btn = ctaMagneticRef.current;
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero dengan video background */}
      <section className="relative h-screen overflow-hidden">
        <video
          src={video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          {t('about.hero.title')}
        </video>

        <div className="absolute inset-0 bg-black/55 dark:bg-black/65" />

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 ref={heroTitleRef} className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              {t('about.hero.title')} <span className="text-red-400">{t('about.hero.titleHighlight')}</span>
            </h1>
            <div ref={heroDescRef}>
              <p className="text-xl md:text-2xl leading-relaxed mb-6 drop-shadow-lg">
                {t('about.hero.description1')}
              </p>
              <p className="text-base md:text-lg leading-relaxed text-white/80 max-w-2xl mx-auto">
                {t('about.hero.description2')}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 animate-bounce">
          <ChevronDown className="w-6 h-6" strokeWidth={2} />
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.key} ref={(el) => (statRefs.current[index] = el)} className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {t(`about.stats.${stat.key}.number`)}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base">
                  {t(`about.stats.${stat.key}.label`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-full shadow-md dark:shadow-black/30 ring-1 ring-gray-900/5 dark:ring-white/10 p-1.5 flex gap-1 flex-wrap justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/25'
                      : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div ref={tabPanelRef}>
            {activeTab === 'story' && (
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-stretch">
                <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-gray-900 min-h-[320px] lg:min-h-0">
                  <video
                    src={video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <Quote className="absolute bottom-6 left-6 w-9 h-9 text-white/70" strokeWidth={1.5} />
                </div>

                <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-black/30 ring-1 ring-gray-900/5 dark:ring-white/10 p-8 md:p-10">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    {t('about.story.title')}
                  </h2>
                  <ol className="space-y-7">
                    {storySteps.map((stepKey, index) => (
                      <li key={stepKey} className="flex gap-4">
                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-red-600/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 text-sm font-bold">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed pt-1">
                          {t(`about.story.${stepKey}`)}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('about.mission.title')}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    {t('about.mission.subtitle')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-16">
                  <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-black/30 ring-1 ring-gray-900/5 dark:ring-white/10 p-8 pt-10 overflow-hidden hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600" />
                    <div className="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-5 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                      <Target className="w-7 h-7" strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {t('about.mission.visionTitle')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t('about.mission.visionText')}
                    </p>
                  </div>

                  <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-black/30 ring-1 ring-gray-900/5 dark:ring-white/10 p-8 pt-10 overflow-hidden hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-900 dark:bg-gray-500" />
                    <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 mb-5 group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-gray-600 transition-colors duration-300">
                      <Compass className="w-7 h-7" strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {t('about.mission.missionTitle')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {t('about.mission.missionText')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'values' && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('about.values.title')}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    {t('about.values.subtitle')}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 mb-12">
                  {values.map((value, index) => {
                    const Icon = value.icon;
                    return (
                      <div
                        key={value.key}
                        className="group flex items-start gap-5 bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-black/30 ring-1 ring-gray-900/5 dark:ring-white/10 p-6 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 relative w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                          <Icon className="w-6 h-6" strokeWidth={2} />
                          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5">
                            {t(`about.values.${value.key}.title`)}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {t(`about.values.${value.key}.description`)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="relative bg-gray-900 dark:bg-black rounded-2xl p-8 text-center overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20"
                    style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)' }}
                  />
                  <h3 className="relative text-2xl font-bold text-white mb-4">
                    {t('about.team.title')}
                  </h3>
                  <p className="relative text-white/70 max-w-2xl mx-auto leading-relaxed">
                    {t('about.team.text')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={ctaRef}
            className="relative overflow-hidden rounded-3xl bg-gray-950 dark:bg-black py-16 lg:py-20"
          >
            <p
              aria-hidden="true"
              className="pointer-events-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[22vw] lg:text-[10vw] font-extrabold tracking-tight text-transparent opacity-[0.06]"
              style={{ WebkitTextStroke: '1px #ef4444' }}
            >
              LA · PRIMERA
            </p>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-16 w-[380px] h-[380px] rounded-full blur-3xl opacity-25"
              style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)' }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 -left-20 w-[300px] h-[300px] rounded-full blur-3xl opacity-15"
              style={{ background: 'radial-gradient(circle, #f87171 0%, transparent 70%)' }}
            />

            <div className="relative max-w-2xl mx-auto px-6 sm:px-8 text-center text-white">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-red-400 mb-4">
                La-Primera
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
                {t('about.cta.title')}
              </h2>
              <p className="text-base md:text-lg mb-9 text-white/70">
                {t('about.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  ref={ctaMagneticRef}
                  onClick={() => navigate('/shop')}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-7 rounded-full transition-colors duration-200 shadow-lg shadow-red-600/30 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {t('about.cta.shopButton')}
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="border border-white/30 text-white hover:bg-white hover:text-gray-900 font-semibold py-3.5 px-7 rounded-full transition-colors duration-200 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {t('about.cta.contactButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;