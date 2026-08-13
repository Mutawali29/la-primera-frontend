import { useState, useRef, useLayoutEffect } from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';
import CategoryFilter from '../components/shop/CategoryFilter';

gsap.registerPlugin(ScrollTrigger);

// Foto desain asli hoodie LPRM — depan (logo) & belakang (rasi bintang "Never Lost Hope")
import lprmFront from '../assets/img/blog/lprm-front.png';
import lprmBack from '../assets/img/blog/lprm-back.png';

function Blog() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const imageRefs = useRef([]);
  const newsletterRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const categories = [
    { id: 'all', name: t('blog.categories.all') },
    { id: 'hoodie', name: t('blog.categories.hoodie') },
    { id: 'tshirt', name: t('blog.categories.tshirt') },
  ];

  const posts = [
    { id: 'lprm-story', category: 'hoodie', image: lprmFront, titleKey: 'lprmStory' },
    { id: 'size-guide', category: 'hoodie', image: lprmBack, titleKey: 'sizeGuide' },
  ];

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter((post) => post.category === activeCategory);

  // Hero intro — fade + slide-up saat pertama render
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [heroTitleRef.current, heroSubtitleRef.current],
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Scroll reveal untuk card artikel — stagger, retrigger tiap kali daftar berubah (filter kategori)
  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      cardRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    const cards = cardRefs.current.filter(Boolean);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%' },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, [activeCategory, prefersReducedMotion]);

  // Newsletter card — scale + fade saat masuk viewport
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        newsletterRef.current,
        { y: 32, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: newsletterRef.current, start: 'top 88%' },
        }
      );
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Parallax halus gambar saat hover per-card
  const handleCardMouseMove = (index) => (e) => {
    if (prefersReducedMotion) return;
    const img = imageRefs.current[index];
    if (!img) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(img, { x: relX * 14, y: relY * 10, duration: 0.6, ease: 'power2.out' });
  };

  const handleCardMouseLeave = (index) => () => {
    if (prefersReducedMotion) return;
    const img = imageRefs.current[index];
    if (!img) return;
    gsap.to(img, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section ref={heroRef} className="relative bg-gradient-to-r from-red-600 to-red-800 text-white pt-20 pb-28 lg:pb-32 rounded-b-[2.5rem] lg:rounded-b-[3.5rem] overflow-hidden">
        {/* Dekorasi glow — konsisten dengan aksen radial di ExploreCollections */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #fecaca 0%, transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 -left-20 w-[320px] h-[320px] rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 ref={heroTitleRef} className="text-5xl md:text-6xl font-bold mb-6">
              {t('blog.hero.title')} <span className="text-red-200">{t('blog.hero.titleHighlight')}</span>
            </h1>
            <p ref={heroSubtitleRef} className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-red-50">
              {t('blog.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter kategori — jarak dari hero dikurangi supaya tidak terlalu menjorok ke atas */}
        <div className="relative z-10 -mt-8 lg:-mt-10 mb-12">
          <div className="max-w-fit mx-auto bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl dark:shadow-black/40 ring-1 ring-gray-900/5 dark:ring-white/10">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              className=""
            />
          </div>
        </div>

        {/* Grid artikel */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPosts.map((post, index) => {
            const title = t(`blog.posts.${post.titleKey}.title`);
            const excerpt = t(`blog.posts.${post.titleKey}.excerpt`);
            const author = t(`blog.posts.${post.titleKey}.author`);
            const date = t(`blog.posts.${post.titleKey}.date`);

            return (
              <article
                key={post.id}
                ref={(el) => (cardRefs.current[index] = el)}
                onMouseMove={handleCardMouseMove(index)}
                onMouseLeave={handleCardMouseLeave(index)}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md dark:shadow-black/30 ring-1 ring-gray-900/5 dark:ring-white/10 hover:shadow-2xl dark:hover:shadow-black/50 transition-shadow duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    ref={(el) => (imageRefs.current[index] = el)}
                    src={post.image}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-contain p-6 will-change-transform"
                  />
                </div>

                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" strokeWidth={2} />
                      {author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                      {date}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                    {title}
                  </h2>

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                    {excerpt}
                  </p>

                  <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:gap-2.5 transition-[gap] duration-200 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 rounded-sm">
                    {t('blog.meta.readMore')}
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Newsletter */}
        <section
          ref={newsletterRef}
          className="mt-20 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            {t('blog.newsletter.title')}
          </h3>
          <p className="text-lg mb-8 text-red-100 max-w-xl mx-auto">
            {t('blog.newsletter.subtitle')}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              {t('blog.newsletter.placeholder')}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder={t('blog.newsletter.placeholder')}
              className="flex-1 px-6 py-3 rounded-full text-gray-900 bg-white outline-none focus:ring-4 focus:ring-red-300"
            />
            <button
              type="submit"
              className="bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 whitespace-nowrap outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t('blog.newsletter.button')}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Blog;