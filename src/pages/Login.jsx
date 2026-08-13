// src/pages/Login.jsx
import { useState, useRef, useLayoutEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

function Login() {
    const { login, loading, requestPasswordReset } = useAuth(); // Perhatikan: loading di sini adalah loading untuk login/register, bukan authLoading global
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false); // State ini tidak digunakan di AuthController, hanya untuk UI
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const [showForgotPanel, setShowForgotPanel] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMessage, setForgotMessage] = useState('');
    const [forgotError, setForgotError] = useState('');

    const cardRef = useRef(null);
    const iconRef = useRef(null);
    const alertRef = useRef(null);
    const forgotPanelRef = useRef(null);

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

    // Shake singkat pada card setiap kali muncul error baru — sinyal visual yang jelas tanpa perlu dialog tambahan
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

    // Panel "lupa password" — reveal dengan animasi tinggi, bukan window.prompt() bawaan browser
    useLayoutEffect(() => {
        if (!forgotPanelRef.current) return;
        if (prefersReducedMotion) {
            gsap.set(forgotPanelRef.current, { height: showForgotPanel ? 'auto' : 0, opacity: showForgotPanel ? 1 : 0 });
            return;
        }
        if (showForgotPanel) {
            gsap.set(forgotPanelRef.current, { height: 'auto' });
            const autoHeight = forgotPanelRef.current.offsetHeight;
            gsap.fromTo(
                forgotPanelRef.current,
                { height: 0, opacity: 0 },
                { height: autoHeight, opacity: 1, duration: 0.4, ease: 'power2.out' }
            );
        } else {
            gsap.to(forgotPanelRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
        }
    }, [showForgotPanel, prefersReducedMotion]);

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

        try {
            // Memanggil fungsi login dari useAuth, yang berinteraksi dengan authAPI.login
            const response = await login({ email: formData.email, password: formData.password });

            if (response.success) { // Respons dari useAuth.login sekarang langsung berupa { success: true }
                // useAuth.login sudah menangani penyimpanan token dan user ke local storage
                // useAuth.user sekarang sudah diupdate
                setSuccessMessage(t('auth.login.successMessage'));

                // Logika pengalihan berdasarkan peran user
                // Ambil user dari useAuth context setelah login sukses
                // Pastikan useAuth mengembalikan user yang sudah diupdate
                // Atau, akses role dari data yang dikirim oleh `login` function
                const loggedInUser = JSON.parse(localStorage.getItem('user')); // Ambil dari local storage yang sudah diupdate oleh useAuth

                if (loggedInUser && loggedInUser.role === 'admin') {
                    setTimeout(() => navigate('/admin/dashboard'), 1500); // Arahkan ke dashboard admin
                } else {
                    setTimeout(() => navigate('/'), 1500); // Arahkan ke halaman utama/dashboard user biasa
                }
            } else {
                // Ini seharusnya tidak terpanggil jika useAuth.login melempar error pada kegagalan
                setErrors({ general: response.message || t('auth.login.errorGeneric') });
            }
        } catch (error) {
            console.error('Login Error:', error);
            // Menangani error dari API atau useAuth
            if (error?.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error?.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else if (error?.message?.includes('Network Error')) {
                setErrors({ general: t('auth.login.errorNetwork') });
            } else {
                setErrors({ general: error.message || t('auth.login.errorUnknown') });
            }
        }
    };

    const toggleForgotPanel = () => {
        setForgotMessage('');
        setForgotError('');
        setForgotEmail('');
        setShowForgotPanel((prev) => !prev);
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        if (!forgotEmail) return;

        setForgotLoading(true);
        setForgotMessage('');
        setForgotError('');

        try {
            const result = await requestPasswordReset(forgotEmail);
            if (result.success) {
                setForgotMessage(result.message || t('auth.login.forgot.successMessage'));
            } else {
                setForgotError(result.error?.message || t('auth.login.forgot.errorMessage'));
            }
        } catch (err) {
            setForgotError(err.response?.data?.message || err.message || t('auth.login.forgot.errorMessage'));
        } finally {
            setForgotLoading(false);
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
                        <Lock className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('auth.login.title')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('auth.login.subtitle')}</p>
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('auth.login.emailLabel')}
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
                                {t('auth.login.passwordLabel')}
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
                                    aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={2} /> : <Eye className="h-5 w-5" strokeWidth={2} />}
                                </button>
                            </div>
                            {renderError('password')}
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    {t('auth.login.rememberMe')}
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={toggleForgotPanel}
                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-medium"
                            >
                                {t('auth.login.forgotPassword')}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-[0.98] shadow-lg hover:shadow-red-500/25 flex items-center justify-center outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" strokeWidth={2} />
                                    {t('auth.login.submittingButton')}
                                </>
                            ) : t('auth.login.submitButton')}
                        </button>
                    </form>

                    {/* Panel lupa password — sengaja DI LUAR <form> login, punya submit sendiri (button type="button"),
                        supaya browser tidak ikut memvalidasi field email ini saat form login di-submit meski panel
                        sedang disembunyikan lewat animasi tinggi (bukan display:none, jadi tetap "ada" di DOM). */}
                    <div ref={forgotPanelRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('auth.login.forgot.description')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    placeholder={t('auth.login.forgot.emailPlaceholder')}
                                    className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleForgotSubmit}
                                    disabled={forgotLoading || !forgotEmail}
                                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2"
                                >
                                    {forgotLoading && <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />}
                                    {t('auth.login.forgot.sendButton')}
                                </button>
                            </div>
                            {forgotMessage && (
                                <p className="text-sm text-green-700 dark:text-green-400">{forgotMessage}</p>
                            )}
                            {forgotError && (
                                <p className="text-sm text-red-700 dark:text-red-400">{forgotError}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('auth.login.noAccount')}
                            <Link to="/register" className="ml-1 text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 font-medium">
                                {t('auth.login.registerLink')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;