// common/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import logo from "../../assets/img/scraps/12.PNG";

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { lang, changeLang, t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [cartCount, setCartCount] = useState(3); // Dummy cart count

    const navRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Animasi masuk navbar saat pertama render
    useEffect(() => {
        gsap.fromTo(
            navRef.current,
            { y: -24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
    }, []);

    // Animasi buka/tutup menu mobile
    useEffect(() => {
        if (!mobileMenuRef.current) return;
        if (isMenuOpen) {
            gsap.fromTo(
                mobileMenuRef.current,
                { height: 0, opacity: 0 },
                { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
        }
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setIsProfileDropdownOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        closeAllMenus();
    };

    const toggleLang = () => changeLang(lang === 'id' ? 'en' : 'id');

    // Animasi hover kecil untuk tombol ikon (lang, theme, avatar)
    const handleIconEnter = (e) => {
        gsap.to(e.currentTarget, { scale: 1.06, duration: 0.15, ease: 'power1.out' });
    };
    const handleIconLeave = (e) => {
        gsap.to(e.currentTarget, { scale: 1, duration: 0.15, ease: 'power1.out' });
    };

    const getNavlinkClass = ({ isActive }) =>
        `relative px-3 py-2 text-[15px] font-medium tracking-tight transition-colors duration-200 ${
            isActive
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400'
        }`;

    const getMobileNavlinkClass = ({ isActive }) =>
        `block px-4 py-2.5 text-base font-medium w-full text-left rounded-lg transition-colors duration-200 ${
            isActive
                ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800/60'
        }`;

    return (
        <nav
            ref={navRef}
            className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 dark:shadow-[0_1px_0_rgba(255,255,255,0.04)] sticky top-0 z-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" onClick={closeAllMenus} className="flex items-center">
                            <img src={logo} className="h-11 w-auto dark:invert" alt="La Primera" />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center">
                        <div className="flex items-center gap-1">
                            <NavLink to="/" className={getNavlinkClass} onClick={closeAllMenus}>{t('navbar.home')}</NavLink>
                            <NavLink to="/shop" className={getNavlinkClass} onClick={closeAllMenus}>{t('navbar.shop')}</NavLink>
                            <NavLink to="/blog" className={getNavlinkClass} onClick={closeAllMenus}>{t('navbar.blog')}</NavLink>
                            <NavLink to="/about" className={getNavlinkClass} onClick={closeAllMenus}>{t('navbar.about')}</NavLink>
                            <NavLink to="/contact" className={getNavlinkClass} onClick={closeAllMenus}>{t('navbar.contact')}</NavLink>

                            {isAuthenticated && user?.role === 'admin' && (
                                <NavLink to="/admin/dashboard" className={getNavlinkClass} onClick={closeAllMenus}>{t('navbar.admin')}</NavLink>
                            )}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Language + Theme grouped in one segmented control */}
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 gap-0.5">
                            <button
                                onClick={toggleLang}
                                onMouseEnter={handleIconEnter}
                                onMouseLeave={handleIconLeave}
                                className="flex items-center justify-center min-w-[38px] h-7 px-2 text-xs font-semibold text-gray-700 dark:text-gray-100 rounded-full hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                aria-label="Ganti bahasa"
                            >
                                {lang === 'id' ? 'ID' : 'EN'}
                            </button>
                            <button
                                onClick={toggleTheme}
                                onMouseEnter={handleIconEnter}
                                onMouseLeave={handleIconLeave}
                                className="flex items-center justify-center w-7 h-7 rounded-full text-gray-700 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                aria-label="Ganti tema"
                            >
                                {theme === 'light' ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden lg:flex items-center bg-gray-50 dark:bg-gray-800 px-3.5 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {t('navbar.welcomeBack')}, <span className="font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</span>
                                    </span>
                                </div>

                                <Link
                                    to="/checkout"
                                    onClick={closeAllMenus}
                                    onMouseEnter={handleIconEnter}
                                    onMouseLeave={handleIconLeave}
                                    className="relative flex items-center bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l-1.1 5m0 0h4.4m0 0l1.1-5M7 13h10m-5 8a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                                    {t('navbar.checkout')}
                                    {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>}
                                </Link>

                                <div className="relative">
                                    <button
                                        onClick={toggleProfileDropdown}
                                        onMouseEnter={handleIconEnter}
                                        onMouseLeave={handleIconLeave}
                                        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
                                    >
                                        <div className="w-9 h-9 ring-2 ring-gray-100 dark:ring-gray-700 rounded-full">
                                            {user?.avatar ? (
                                                <img className="h-full w-full rounded-full object-cover" src={user.avatar} alt={user.name} />
                                            ) : (
                                                <div className="h-full w-full bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-base">
                                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-100 dark:border-gray-700">
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10">
                                                        {user?.avatar ? (
                                                            <img className="h-full w-full rounded-full object-cover" src={user.avatar} alt={user.name} />
                                                        ) : (
                                                            <div className="h-full w-full bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full flex items-center justify-center text-white font-bold">
                                                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                                                        {user?.role && <span className="text-xs text-red-600 font-medium capitalize">{user.role}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-2">
                                                {isAuthenticated && user?.role === 'admin' && (
                                                    <Link to="/admin/dashboard" onClick={closeAllMenus} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 hover:text-red-600 transition-colors duration-150">
                                                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.827 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.827 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.827-2.37-2.37.996.608 2.296.07 2.573-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {t('navbar.admin')}
                                                    </Link>
                                                )}
                                                <Link to="/profile" onClick={closeAllMenus} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 hover:text-red-600 transition-colors duration-150">
                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> {t('navbar.profileSettings')}
                                                </Link>
                                                <Link to="/my-orders" onClick={closeAllMenus} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 hover:text-red-600 transition-colors duration-150">
                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> {t('navbar.myOrders')} <span className="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">2</span>
                                                </Link>
                                                <Link to="/wishlist" onClick={closeAllMenus} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 hover:text-red-600 transition-colors duration-150">
                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> {t('navbar.wishlist')} <span className="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">5</span>
                                                </Link>
                                            </div>
                                            <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                                                <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150">
                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> {t('navbar.signOut')}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" onClick={closeAllMenus} className="text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 text-sm font-medium transition-colors">{t('navbar.login')}</Link>
                                <Link to="/register" onClick={closeAllMenus} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">{t('navbar.register')}</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: lang + theme + hamburger */}
                    <div className="md:hidden flex items-center gap-1">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 gap-0.5">
                            <button
                                onClick={toggleLang}
                                className="flex items-center justify-center min-w-[34px] h-7 px-1.5 text-xs font-semibold text-gray-700 dark:text-gray-100 rounded-full"
                                aria-label="Ganti bahasa"
                            >
                                {lang === 'id' ? 'ID' : 'EN'}
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="flex items-center justify-center w-7 h-7 rounded-full text-gray-700 dark:text-gray-100"
                                aria-label="Ganti tema"
                            >
                                {theme === 'light' ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                )}
                            </button>
                        </div>
                        <button onClick={toggleMenu} className="text-gray-600 dark:text-gray-300 hover:text-red-600 p-2 rounded-md transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}</svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                {isMenuOpen && (
                    <div ref={mobileMenuRef} className="md:hidden overflow-hidden">
                        <div className="px-2 pt-2 pb-4 space-y-1 border-t border-gray-100 dark:border-gray-800">
                            <NavLink to="/" className={getMobileNavlinkClass} onClick={closeAllMenus}>{t('navbar.home')}</NavLink>
                            <NavLink to="/shop" className={getMobileNavlinkClass} onClick={closeAllMenus}>{t('navbar.shop')}</NavLink>
                            <NavLink to="/blog" className={getMobileNavlinkClass} onClick={closeAllMenus}>{t('navbar.blog')}</NavLink>
                            <NavLink to="/about" className={getMobileNavlinkClass} onClick={closeAllMenus}>{t('navbar.about')}</NavLink>
                            <NavLink to="/contact" className={getMobileNavlinkClass} onClick={closeAllMenus}>{t('navbar.contact')}</NavLink>

                            {isAuthenticated && user?.role === 'admin' && (
                                <NavLink to="/admin/dashboard" className={getMobileNavlinkClass} onClick={closeAllMenus}>{t('navbar.admin')}</NavLink>
                            )}

                            {isAuthenticated ? (
                                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
                                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg mx-2 mb-3 border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 mr-3">
                                                {user?.avatar ? (
                                                    <img className="h-full w-full rounded-full object-cover" src={user.avatar} alt={user.name} />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Link to="/checkout" onClick={closeAllMenus} className="relative flex items-center justify-center w-full bg-red-600 text-white px-3 py-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 mx-2 mb-2" style={{ width: 'calc(100% - 1rem)' }}>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l-1.1 5m0 0h4.4m0 0l1.1-5M7 13h10m-5 8a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg> {t('navbar.checkout')}
                                        {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>}
                                    </Link>
                                    <Link to="/profile" onClick={closeAllMenus} className={getMobileNavlinkClass({ isActive: false })}>{t('navbar.profileSettings')}</Link>
                                    <Link to="/my-orders" onClick={closeAllMenus} className={getMobileNavlinkClass({ isActive: false })}>{t('navbar.myOrders')}</Link>
                                    <Link to="/wishlist" onClick={closeAllMenus} className={getMobileNavlinkClass({ isActive: false })}>{t('navbar.wishlist')}</Link>
                                    <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2.5 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-150">
                                        {t('navbar.signOut')}
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3 space-y-2 px-2">
                                    <Link to="/login" onClick={closeAllMenus} className="block text-center w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2.5 rounded-lg text-base font-medium transition-colors">{t('navbar.login')}</Link>
                                    <Link to="/register" onClick={closeAllMenus} className="block text-center w-full bg-red-600 text-white px-3 py-2.5 rounded-lg text-base font-medium hover:bg-red-700 transition-colors">{t('navbar.register')}</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;