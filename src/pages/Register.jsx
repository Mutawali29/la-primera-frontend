import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Check, X } from 'lucide-react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const alertRef = useRef(null);
  const strengthBarRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Entrance animation — card + icon muncul halus saat halaman dibuka
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        iconRef.current,
        { scale: 0.6, opacity: 0, rotate: -8 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)', delay: 0.1 }
      );
    });
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Shake singkat pada card setiap kali muncul error baru
  useLayoutEffect(() => {
    if (prefersReducedMotion || !errors.general || !cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { x: -8 },
      { x: 0, duration: 0.45, ease: 'elastic.out(1, 0.4)' }
    );
  }, [errors.general, prefersReducedMotion]);

  // Alert (sukses/error) — fade + slide-down setiap kali muncul
  useLayoutEffect(() => {
    if (prefersReducedMotion || !alertRef.current) return;
    if (successMessage || errors.general) {
      gsap.fromTo(
        alertRef.current,
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [successMessage, errors.general, prefersReducedMotion]);

  // Kekuatan password — skor 0-4 berdasarkan panjang, huruf besar/kecil, angka, simbol
  const passwordStrength = useMemo(() => {
    const pw = formData.password;
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
    if (/\d/.test(pw)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pw)) score += 1;
    return score;
  }, [formData.password]);

  const strengthConfig = [
    { label: t('auth.register.password.strengthEmpty'), color: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-400 dark:text-gray-500' },
    { label: t('auth.register.password.strengthWeak'), color: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
    { label: t('auth.register.password.strengthFair'), color: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
    { label: t('auth.register.password.strengthGood'), color: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400' },
    { label: t('auth.register.password.strengthStrong'), color: 'bg-green-500', text: 'text-green-600 dark:text-green-400' },
  ];
  const currentStrength = strengthConfig[passwordStrength];

  // Animasi lebar bar kekuatan password
  useLayoutEffect(() => {
    if (!strengthBarRef.current) return;
    const widthPercent = (passwordStrength / 4) * 100;
    if (prefersReducedMotion) {
      gsap.set(strengthBarRef.current, { width: `${widthPercent}%` });
      return;
    }
    gsap.to(strengthBarRef.current, { width: `${widthPercent}%`, duration: 0.35, ease: 'power2.out' });
  }, [passwordStrength, prefersReducedMotion]);

  // Status kecocokan konfirmasi password — feedback real-time, bukan cuma muncul setelah submit
  const confirmStatus = useMemo(() => {
    if (!formData.confirmPassword) return null;
    return formData.confirmPassword === formData.password ? 'match' : 'mismatch';
  }, [formData.password, formData.confirmPassword]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: t('auth.register.errorPasswordMismatch') });
      return;
    }

    try {
      const result = await register(formData);
      setSuccessMessage(t('auth.register.successMessage'));

      // Redirect ke halaman verifikasi OTP, bawa email lewat router state —
      // BUKAN ke home, karena user belum login (register() tidak lagi
      // langsung mengeluarkan token, harus verifikasi OTP dulu).
      setTimeout(() => {
        navigate('/verify-otp', {
          state: { email: result?.email || formData.email },
        });
      }, 1200);
    } catch (error) {
      if (error?.response === undefined && error?.message?.includes('Network Error')) {
        setErrors({ general: t('auth.register.errorNetwork') });
      } else if (error?.errors) {
        setErrors(error.errors);
      } else if (error?.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: t('auth.register.errorUnknown') });
      }
    }
  };

  const renderError = (fieldName) => {
    if (errors[fieldName]) {
      const errorMessage = Array.isArray(errors[fieldName]) ? errors[fieldName][0] : errors[fieldName];
      return <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div ref={iconRef} className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
            <UserPlus className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.register.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('auth.register.subtitle')}</p>
        </div>

        <div
          ref={cardRef}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-black/30 ring-1 ring-gray-900/5 dark:ring-white/10 p-8"
        >
          <div ref={alertRef}>
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-green-800 dark:text-green-300 text-sm">{successMessage}</p>
              </div>
            )}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-red-800 dark:text-red-300 text-sm">{errors.general}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.register.firstNameLabel')}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                  placeholder="John"
                  required
                />
                {renderError('firstName')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.register.lastNameLabel')}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                  placeholder="Doe"
                  required
                />
                {renderError('lastName')}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.register.emailLabel')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                placeholder="john@example.com"
                required
              />
              {renderError('email')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.register.phoneLabel')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                placeholder="08123456789"
                required
              />
              {renderError('phone')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.register.passwordLabel')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${errors.password ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t('auth.register.hidePassword') : t('auth.register.showPassword')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={2} /> : <Eye className="h-5 w-5" strokeWidth={2} />}
                </button>
              </div>
              {renderError('password')}

              {/* Indikator kekuatan password */}
              {formData.password && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      ref={strengthBarRef}
                      className={`h-full rounded-full transition-colors duration-300 ${currentStrength.color}`}
                      style={{ width: 0 }}
                    />
                  </div>
                  <p className={`mt-1 text-xs font-medium ${currentStrength.text}`}>
                    {currentStrength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.register.confirmPasswordLabel')}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-20 border ${errors.confirmPassword ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                  placeholder="••••••••"
                  required
                />
                {/* Indikator kecocokan real-time, sebelum submit */}
                {confirmStatus && (
                  <span className="absolute right-12 top-1/2 -translate-y-1/2">
                    {confirmStatus === 'match' ? (
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" strokeWidth={2.5} />
                    ) : (
                      <X className="h-5 w-5 text-red-500 dark:text-red-400" strokeWidth={2.5} />
                    )}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? t('auth.register.hidePassword') : t('auth.register.showPassword')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" strokeWidth={2} /> : <Eye className="h-5 w-5" strokeWidth={2} />}
                </button>
              </div>
              {renderError('confirmPassword')}
              {confirmStatus === 'mismatch' && !errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {t('auth.register.errorPasswordMismatch')}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-[0.98] shadow-lg hover:shadow-red-500/25 flex items-center justify-center outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" strokeWidth={2} />
                  {t('auth.register.submittingButton')}
                </>
              ) : t('auth.register.submitButton')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.register.haveAccount')}
              <Link to="/login" className="ml-1 text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-medium">
                {t('auth.register.loginLink')}
              </Link>
            </p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {t('auth.register.termsPrefix')}{' '}
              <Link to="/terms" className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300">
                {t('auth.register.termsLink')}
              </Link>{' '}{t('auth.register.termsAnd')}{' '}
              <Link to="/privacy" className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300">
                {t('auth.register.privacyLink')}
              </Link>{' '}{t('auth.register.termsSuffix')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;