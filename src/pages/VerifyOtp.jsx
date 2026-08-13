import { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MailCheck, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // detik — samakan dengan cooldown di backend

function VerifyOtp() {
  const { verifyOtp, resendOtp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const email = location.state?.email || '';

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  const inputRefs = useRef([]);
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const alertRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Kalau halaman ini diakses langsung tanpa lewat Register (tidak ada email
  // di router state), tidak ada gunanya menampilkan form OTP kosong.
  const hasSession = Boolean(email);

  // Entrance animation
  useLayoutEffect(() => {
    if (prefersReducedMotion || !hasSession) return;
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
  }, [prefersReducedMotion, hasSession]);

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

  // Countdown resend — jalan otomatis begitu halaman dibuka (baru saja
  // register, jadi kode pertama pasti sudah terkirim)
  useEffect(() => {
    if (!hasSession || cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [hasSession, cooldown]);

  // Fokuskan kotak pertama saat halaman dibuka
  useEffect(() => {
    if (hasSession) inputRefs.current[0]?.focus();
  }, [hasSession]);

  const handleDigitChange = (index, rawValue) => {
    const value = rawValue.replace(/\D/g, '');
    if (!value) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    // Dukung paste seluruh kode sekaligus ke satu kotak
    if (value.length > 1) {
      const pasted = value.slice(0, OTP_LENGTH).split('');
      setDigits((prev) => {
        const next = [...prev];
        pasted.forEach((d, i) => {
          if (index + i < OTP_LENGTH) next[index + i] = d;
        });
        return next;
      });
      const lastFilled = Math.min(index + pasted.length, OTP_LENGTH) - 1;
      inputRefs.current[lastFilled]?.focus();
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setDigits(next);
    const lastIndex = Math.min(pasted.length, OTP_LENGTH) - 1;
    inputRefs.current[lastIndex]?.focus();
  };

  const otpCode = digits.join('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (otpCode.length !== OTP_LENGTH) {
      setErrors({ general: t('auth.verifyOtp.errorIncomplete') });
      return;
    }

    try {
      await verifyOtp(email, otpCode);
      setSuccessMessage(t('auth.register.successMessage'));
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      if (error?.response === undefined && error?.message?.includes('Network Error')) {
        setErrors({ general: t('auth.verifyOtp.errorNetwork') });
      } else if (error?.message) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: t('auth.register.errorUnknown') });
      }
      // Reset input supaya user coba lagi dari awal, bukan menebak digit mana yang salah
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setErrors({});
    setSuccessMessage('');
    try {
      await resendOtp(email);
      setSuccessMessage(t('auth.verifyOtp.resendSuccess'));
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (error) {
      // Backend mengirim retry_after (detik) saat 429 — sinkronkan cooldown lokal
      if (error?.retry_after) {
        setCooldown(error.retry_after);
      }
      setErrors({ general: error?.message || t('auth.register.errorUnknown') });
    } finally {
      setIsResending(false);
    }
  }, [cooldown, isResending, email, resendOtp, t]);

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-black/30 ring-1 ring-gray-900/5 dark:ring-white/10 p-8">
          <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" strokeWidth={2} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.verifyOtp.noSessionFound')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('auth.verifyOtp.noSessionText')}
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            {t('auth.verifyOtp.backToRegister')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div ref={iconRef} className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
            <MailCheck className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.verifyOtp.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('auth.verifyOtp.subtitle')}{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{email}</span>
          </p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                {t('auth.verifyOtp.codeLabel')}
              </label>
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={OTP_LENGTH}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 outline-none"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== OTP_LENGTH}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-[0.98] shadow-lg hover:shadow-red-500/25 flex items-center justify-center outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" strokeWidth={2} />
                  {t('auth.verifyOtp.submittingButton')}
                </>
              ) : t('auth.verifyOtp.submitButton')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.verifyOtp.resendPrompt')}{' '}
              {cooldown > 0 ? (
                <span className="text-gray-400 dark:text-gray-500">
                  {t('auth.verifyOtp.resendIn')} {cooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                >
                  {isResending && <Loader2 className="animate-spin w-3.5 h-3.5" strokeWidth={2} />}
                  {t('auth.verifyOtp.resendButton')}
                </button>
              )}
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
              {t('auth.verifyOtp.changeEmail')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;