import { useState, useRef, useLayoutEffect } from 'react';
import { MapPin, Phone, Mail, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

function Contact() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const infoRef = useRef(null);
  const infoCardRefs = useRef([]);
  const formCardRef = useRef(null);
  const faqRef = useRef(null);
  const heroGlowRef = useRef(null);
  const waPulseRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const contactInfo = [
    { key: 'address', icon: MapPin },
    { key: 'phone', icon: Phone },
    { key: 'email', icon: Mail },
    { key: 'hours', icon: Clock },
  ];

  const faqs = ['q1', 'q2', 'q3', 'q4'];
  const subjectOptions = ['inquiry', 'order', 'return', 'complaint', 'suggestion', 'other'];

  // Scroll reveal — info cards
  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      infoCardRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        infoCardRefs.current.filter(Boolean),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: infoRef.current, start: 'top 85%' },
        }
      );
    }, infoRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Scroll reveal — form & FAQ
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [formCardRef.current, faqRef.current],
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: formCardRef.current, start: 'top 85%' },
        }
      );
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Infinite ambient animation — hero decorative glow "bernapas" pelan,
  // memberi kesan hero tetap hidup tanpa mengganggu keterbacaan teks.
  useLayoutEffect(() => {
    if (prefersReducedMotion || !heroGlowRef.current) return;
    const tween = gsap.to(heroGlowRef.current, {
      scale: 1.18,
      opacity: 0.32,
      duration: 3.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
    return () => tween.kill();
  }, [prefersReducedMotion]);

  // Infinite ambient animation — pulse ring di sekitar ikon WhatsApp,
  // pola "tombol chat hidup" yang umum dipakai untuk menarik perhatian
  // ke channel respons tercepat, tanpa perlu badge "Online" palsu.
  useLayoutEffect(() => {
    if (prefersReducedMotion || !waPulseRef.current) return;
    const tween = gsap.fromTo(
      waPulseRef.current,
      { scale: 1, opacity: 0.5 },
      {
        scale: 1.9,
        opacity: 0,
        duration: 1.8,
        ease: 'power1.out',
        repeat: -1,
      }
    );
    return () => tween.kill();
  }, [prefersReducedMotion]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 4000);
    }, 1200);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20 overflow-hidden rounded-b-[2.5rem] lg:rounded-b-[3.5rem]">
        <div
          ref={heroGlowRef}
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #fecaca 0%, transparent 70%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('contact.hero.title')}</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-red-50">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section ref={infoRef} className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.key}
                  ref={(el) => (infoCardRefs.current[index] = el)}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white dark:group-hover:bg-red-600 transition-all duration-300 transform group-hover:scale-110">
                    <Icon className="w-7 h-7" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {t(`contact.info.${info.key}.title`)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    {t(`contact.info.${info.key}.line1`)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {t(`contact.info.${info.key}.line2`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div
              ref={formCardRef}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-black/30 ring-1 ring-gray-900/5 dark:ring-white/10 p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {t('contact.form.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {t('contact.form.subtitle')}
              </p>

              {isSubmitted ? (
                <div className="flex flex-col items-center text-center py-12 px-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50">
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" strokeWidth={2} />
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-1">
                    {t('contact.form.successTitle')}
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    {t('contact.form.successText')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('contact.form.nameLabel')} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder={t('contact.form.namePlaceholder')}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('contact.form.phoneLabel')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder={t('contact.form.phonePlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.form.emailLabel')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.form.subjectLabel')} *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors outline-none"
                    >
                      <option value="">{t('contact.form.subjectPlaceholder')}</option>
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {t(`contact.form.subjectOptions.${opt}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('contact.form.messageLabel')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder={t('contact.form.messagePlaceholder')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${
                      isSubmitting
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/25 hover:shadow-red-600/35'
                    }`}
                  >
                    {isSubmitting ? t('contact.form.submittingButton') : t('contact.form.submitButton')}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Section */}
            <div ref={faqRef}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {t('contact.faq.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {t('contact.faq.subtitle')}
              </p>

              <div className="space-y-3">
                {faqs.map((faqKey, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={faqKey}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-black/30 ring-1 ring-gray-900/5 dark:ring-white/10 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between text-left p-5 gap-4 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red-600"
                      >
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                          {t(`contact.faq.${faqKey}.question`)}
                        </h3>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-red-600 dark:text-red-400' : ''
                          }`}
                          strokeWidth={2}
                        />
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                            {t(`contact.faq.${faqKey}.answer`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/20 rounded-xl p-6 border border-red-100 dark:border-red-900/40">
                <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-4">
                  {t('contact.quickHelp.title')}
                </h3>
                <div className="space-y-3">
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-colors w-fit"
                  >
                    <span className="relative flex items-center justify-center w-5 h-5 mr-3 shrink-0">
                      {/* Ring pulsa infinite — menarik perhatian ke channel respons tercepat */}
                      <span
                        ref={waPulseRef}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-red-500/60 dark:bg-red-400/60"
                      />
                      <svg className="relative w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
                      </svg>
                    </span>
                    {t('contact.quickHelp.whatsapp')}
                  </a>

                  <a
                    href="mailto:cs@la-primera.com"
                    className="flex items-center text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-3 shrink-0" strokeWidth={2} />
                    {t('contact.quickHelp.email')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t('contact.map.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('contact.map.subtitle')}
            </p>
          </div>

          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-xl dark:shadow-black/30">
            <div className="h-96 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
              <div className="text-center text-gray-600 dark:text-gray-300">
                <MapPin className="w-14 h-14 mx-auto mb-4" strokeWidth={1.5} />
                <p className="text-lg font-medium">{t('contact.map.placeholder')}</p>
                <p className="text-sm">{t('contact.info.address.line1')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;