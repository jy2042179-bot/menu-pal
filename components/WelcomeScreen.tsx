import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, Globe, History, Settings, CheckCircle, Lock, PenTool, ChevronDown, X, Plus, LogOut, BookOpen, MessageCircle, HelpCircle, Users, Sun, Moon } from 'lucide-react';
import { TargetLanguage } from '../types';
import { LANGUAGE_OPTIONS } from '../constants';
import { UI_LANGUAGE_OPTIONS, getUIText, getTranslatedLanguageName } from '../i18n';

interface WelcomeScreenProps {
    onLanguageChange: (lang: TargetLanguage) => void;
    selectedLanguage: TargetLanguage;
    onImagesSelected: (files: File[], isHandwritingMode: boolean) => void;
    onViewHistory: () => void;
    onOpenSettings: () => void;
    isVerified: boolean;
    onUpgradeClick: () => void;
    hidePrice: boolean;
    onHidePriceChange: (hide: boolean) => void;
    uiLanguage: TargetLanguage;
    onUILanguageChange: (lang: TargetLanguage) => void;
    onLogout: () => void;
    onViewLibrary: () => void;
    menuCount: number;
    onOpenPhrases: () => void;
    onOpenOnboarding: () => void;
    remainingUses: number;
    dailyLimit: number;
    isPro: boolean;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
    onLanguageChange,
    selectedLanguage,
    onImagesSelected,
    onViewHistory,
    onOpenSettings,
    isVerified,
    onUpgradeClick,
    hidePrice,
    onHidePriceChange,
    uiLanguage,
    onUILanguageChange,
    onLogout,
    onViewLibrary,
    menuCount,
    onOpenPhrases,
    onOpenOnboarding,
    remainingUses,
    dailyLimit,
    isPro,
    isDarkMode,
    onToggleTheme
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const [isHandwritingMode, setIsHandwritingMode] = useState(false);
    const [showLangDropdown, setShowLangDropdown] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [showPlanTooltip, setShowPlanTooltip] = useState(false);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const [appBuyers, setAppBuyers] = useState<number>(0);


    const t = getUIText(uiLanguage);
    const currentFlag = UI_LANGUAGE_OPTIONS.find(opt => opt.value === uiLanguage)?.flag || '🌐';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/user-stats');
                const data = await res.json();
                if (data.success && data.totalUsers) setAppBuyers(data.totalUsers);
            } catch (e) { console.error("Failed to fetch user stats", e); }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        try { screen.orientation?.lock?.('portrait').catch(() => { }); } catch (e) { }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const combined = [...selectedFiles, ...newFiles].slice(0, 4);
            setSelectedFiles(combined);
            setShowPreview(true);
            e.target.value = '';
        }
    };

    useEffect(() => {
        const urls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
        return () => { urls.forEach(url => URL.revokeObjectURL(url)); };
    }, [selectedFiles]);

    const handleRemoveImage = (index: number) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
        if (newFiles.length === 0) setShowPreview(false);
    };

    const handleStartScanning = () => {
        if (selectedFiles.length > 0) {
            onImagesSelected(selectedFiles, isHandwritingMode);
            setShowPreview(false);
            setSelectedFiles([]);
        }
    };

    // ── 共用樣式（使用 CSS 變數，自動跟隨主題切換） ──
    const s = {
        bg: 'var(--bg-primary)',
        card: 'var(--glass-bg)',
        cardBorder: 'var(--glass-border)',
        cardHover: 'var(--glass-shine)',
        text1: 'var(--text-primary)',
        text2: 'var(--text-secondary)',
        text3: 'var(--text-tertiary)',
        brand: 'var(--brand-primary)',
        brandGlow: 'var(--brand-glow)',
        green: 'var(--accent-green)',
    };

    return (
        <div className="flex flex-col h-full relative overflow-hidden" style={{ background: s.bg, transition: 'background 0.3s' }}>

            {/* ── 背景光暈 ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute rounded-full" style={{
                    width: 500, height: 500, top: '-15%', right: '-20%',
                    background: 'radial-gradient(circle, rgba(255,107,43,0.08) 0%, transparent 70%)',
                    filter: 'blur(80px)'
                }} />
                <div className="absolute rounded-full" style={{
                    width: 400, height: 400, bottom: '10%', left: '-15%',
                    background: 'radial-gradient(circle, rgba(255,159,94,0.06) 0%, transparent 70%)',
                    filter: 'blur(60px)'
                }} />
            </div>

            {/* ── Image Preview Overlay ── */}
            {showPreview && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-6"
                    style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}>
                    <div className="w-full max-w-lg rounded-3xl p-6 relative max-h-[90%] overflow-y-auto"
                        style={{ background: 'var(--bg-tertiary)', border: `1px solid ${s.cardBorder}` }}>
                        <button onClick={() => { setShowPreview(false); setSelectedFiles([]); }}
                            className="absolute top-4 right-4 p-2 rounded-full transition-colors"
                            style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <X size={20} style={{ color: s.text2 }} />
                        </button>

                        <h2 className="text-2xl font-bold text-center mb-6" style={{ color: s.text1 }}>
                            {t.selectedMenus}
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[0, 1, 2, 3].map((index) => (
                                <div key={index} className="aspect-[3/4] rounded-xl relative overflow-hidden flex items-center justify-center"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: `2px dashed ${s.cardBorder}` }}>
                                    {previewUrls[index] ? (
                                        <>
                                            <img src={previewUrls[index]} alt={`Menu ${index + 1}`} className="w-full h-full object-cover" />
                                            <button onClick={() => handleRemoveImage(index)}
                                                className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1 shadow-md">
                                                <X size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => fileInputRef.current?.click()}
                                            disabled={selectedFiles.length >= 4}
                                            className="w-full h-full flex flex-col items-center justify-center transition-colors disabled:opacity-30">
                                            <Plus size={32} style={{ color: s.text3, marginBottom: 8 }} />
                                            <span className="text-xs font-semibold" style={{ color: s.text3 }}>{t.addPhoto}</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-sm mb-6" style={{ color: s.text3 }}>
                            {selectedFiles.length} / 4 {t.maxPhotos}
                        </p>

                        <button onClick={handleStartScanning}
                            className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #ff6b2b, #ff9a5c)', color: 'white', boxShadow: `0 4px 20px ${s.brandGlow}` }}>
                            <Camera size={24} />
                            {t.startScanning}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Header (Glass) ── */}
            <div className="flex justify-between items-center px-4 py-3 z-20 sticky top-0"
                style={{ background: 'var(--header-bg)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${s.cardBorder}`, transition: 'background 0.3s' }}>
                <button onClick={onOpenSettings} className="p-2.5 rounded-xl transition-all"
                    style={{ background: s.card, border: `1px solid ${s.cardBorder}` }}>
                    <Settings size={18} style={{ color: s.text2 }} />
                </button>

                {/* 語言選擇 */}
                <div className="relative">
                    <button onClick={() => setShowLangDropdown(!showLangDropdown)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all"
                        style={{ background: s.card, border: `1px solid ${s.cardBorder}` }}>
                        <span className="text-lg">{currentFlag}</span>
                        <ChevronDown size={14} style={{ color: s.text3, transition: 'transform 0.2s', transform: showLangDropdown ? 'rotate(180deg)' : '' }} />
                    </button>

                    {showLangDropdown && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setShowLangDropdown(false)} />
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 rounded-2xl py-2 z-40 min-w-[200px] max-h-[50vh] overflow-y-auto hide-scrollbar"
                                style={{ background: 'var(--bg-card)', border: `1px solid ${s.cardBorder}`, boxShadow: 'var(--card-shadow)' }}>
                                {UI_LANGUAGE_OPTIONS.map((opt) => (
                                    <button key={opt.value}
                                        onClick={() => { onUILanguageChange(opt.value); onLanguageChange(opt.value); setShowLangDropdown(false); }}
                                        className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors text-left"
                                        style={{ background: uiLanguage === opt.value ? 'rgba(255,107,43,0.1)' : 'transparent', color: uiLanguage === opt.value ? s.brand : s.text2 }}>
                                        <span className="text-lg">{opt.flag}</span>
                                        <span className="text-sm flex-1 font-medium">{getTranslatedLanguageName(opt.value, uiLanguage)}</span>
                                        {uiLanguage === opt.value && <span style={{ color: s.brand, fontSize: 14 }}>✓</span>}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* 菜單庫 */}
                <button onClick={onViewLibrary} className="p-2.5 rounded-xl transition-all relative"
                    style={{ background: s.card, border: `1px solid ${s.cardBorder}` }}>
                    <BookOpen size={18} style={{ color: s.text2 }} />
                    {menuCount > 0 && (
                        <span className="absolute -top-1 -right-1 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: s.brand, color: 'white', fontSize: 10 }}>
                            {menuCount > 99 ? '99+' : menuCount}
                        </span>
                    )}
                </button>

                <button onClick={onViewHistory} className="p-2.5 rounded-xl transition-all"
                    style={{ background: s.card, border: `1px solid ${s.cardBorder}` }}>
                    <History size={18} style={{ color: s.text2 }} />
                </button>

                <button onClick={onOpenOnboarding} className="p-2.5 rounded-xl transition-all"
                    style={{ background: s.card, border: `1px solid ${s.cardBorder}` }}>
                    <HelpCircle size={18} style={{ color: s.text2 }} />
                </button>

                {isVerified && (
                    <button onClick={() => { if (window.confirm(t.logout + '?')) onLogout(); }}
                        className="p-2.5 rounded-xl transition-all"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <LogOut size={18} style={{ color: 'var(--danger-color)' }} />
                    </button>
                )}
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-5 z-10 hide-scrollbar relative">

                {/* 🌓 深色/淺色切換 — 浮動右上角 toggle switch */}
                <button onClick={onToggleTheme} className="absolute top-3 right-0 z-20 flex items-center rounded-full p-[3px] transition-all duration-300 cursor-pointer"
                    style={{
                        width: '62px', height: '32px',
                        background: isDarkMode
                            ? 'linear-gradient(135deg, #1e293b, #334155)'
                            : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        boxShadow: isDarkMode
                            ? '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
                            : '0 2px 8px rgba(251,191,36,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
                    }}>
                    {/* Icons on the track */}
                    <span className="absolute left-[8px] top-1/2 -translate-y-1/2 transition-opacity duration-200"
                        style={{ opacity: isDarkMode ? 0.3 : 1 }}>
                        <Sun size={14} style={{ color: isDarkMode ? '#94a3b8' : '#fff' }} />
                    </span>
                    <span className="absolute right-[8px] top-1/2 -translate-y-1/2 transition-opacity duration-200"
                        style={{ opacity: isDarkMode ? 1 : 0.3 }}>
                        <Moon size={14} style={{ color: isDarkMode ? '#e2e8f0' : '#fbbf24' }} />
                    </span>
                    {/* Sliding knob */}
                    <div className="rounded-full shadow-md transition-transform duration-300 flex items-center justify-center"
                        style={{
                            width: '26px', height: '26px',
                            background: '#fff',
                            transform: isDarkMode ? 'translateX(30px)' : 'translateX(0px)',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        }}>
                        {isDarkMode
                            ? <Moon size={13} style={{ color: '#334155' }} />
                            : <Sun size={13} style={{ color: '#f59e0b' }} />
                        }
                    </div>
                </button>

                {/* Logo + Branding */}
                <motion.div className="text-center pt-6"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="inline-block mb-4">
                        <img src="/dachshund-silhouette.png" alt="Sausage Dog"
                            className="w-48 h-32 mx-auto object-contain drop-shadow-lg"
                            style={{ filter: 'drop-shadow(0 0 20px rgba(255,107,43,0.2))' }} />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight leading-tight" style={{ color: s.text1 }}>
                        Sausage Dog <br /><span style={{ color: s.brand }}>Menu Pal</span>
                    </h1>

                    {/* Plan Badge */}
                    <div className="mt-3">
                        <button onClick={() => !isVerified ? onUpgradeClick() : setShowPlanTooltip(!showPlanTooltip)}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
                            style={{
                                background: isVerified ? 'rgba(30,215,96,0.1)' : 'rgba(255,107,43,0.1)',
                                border: `1px solid ${isVerified ? 'rgba(30,215,96,0.2)' : 'rgba(255,107,43,0.2)'}`,
                                color: isVerified ? s.green : s.brand
                            }}>
                            {isVerified ? <><CheckCircle size={12} /> {t.proUnlimited}</> : <><Lock size={12} /> 升級 PRO / Upgrade</>}
                        </button>
                    </div>

                    {/* Usage */}
                    <div className="mt-2">
                        {isPro ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                                style={{ background: 'rgba(30,215,96,0.1)', border: '1px solid rgba(30,215,96,0.15)', color: s.green }}>
                                ✨ {t.unlimitedUses}
                            </span>
                        ) : (
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold`}
                                style={{
                                    background: remainingUses > 0 ? 'rgba(77,139,245,0.1)' : 'rgba(239,68,68,0.1)',
                                    border: `1px solid ${remainingUses > 0 ? 'rgba(77,139,245,0.15)' : 'rgba(239,68,68,0.15)'}`,
                                    color: remainingUses > 0 ? 'var(--info-color)' : 'var(--danger-color)'
                                }}>
                                📊 {t.remainingUses}: {remainingUses} / {dailyLimit}
                            </span>
                        )}
                    </div>
                </motion.div>

                {/* ── Settings Card (Glass) ── */}
                <motion.div className="w-full max-w-sm mx-auto rounded-2xl p-5 space-y-4"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
                    style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.cardBorder}`, backdropFilter: 'blur(20px)' }}>

                    {/* Translate To */}
                    <div className="rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.cardBorder}` }}>
                        <div className="flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-bold" style={{ color: s.text3 }}>
                            <Globe size={14} /> {t.translateTo}
                        </div>
                        <select value={selectedLanguage}
                            onChange={(e) => onLanguageChange(e.target.value as TargetLanguage)}
                            className="w-full p-3 rounded-lg font-bold text-base text-center focus:outline-none"
                            style={{ background: 'var(--bg-tertiary)', color: s.text1, border: `1px solid ${s.cardBorder}` }}>
                            {LANGUAGE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-tertiary)' }}>
                                    {getTranslatedLanguageName(opt.value, uiLanguage)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Handwriting Toggle */}
                    <div onClick={() => setIsHandwritingMode(!isHandwritingMode)}
                        className="p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                        style={{
                            background: isHandwritingMode ? 'rgba(255,107,43,0.08)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isHandwritingMode ? 'rgba(255,107,43,0.25)' : s.cardBorder}`
                        }}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ background: isHandwritingMode ? 'rgba(255,107,43,0.15)' : 'rgba(255,255,255,0.05)' }}>
                                <PenTool size={18} style={{ color: isHandwritingMode ? s.brand : s.text3 }} />
                            </div>
                            <div>
                                <p className="font-semibold text-sm" style={{ color: isHandwritingMode ? s.text1 : s.text2 }}>{t.handwritingMode}</p>
                                <p className="text-[10px]" style={{ color: s.text3 }}>{t.handwritingDesc}</p>
                            </div>
                        </div>
                        <div className="w-11 h-6 rounded-full p-0.5 transition-colors" style={{ background: isHandwritingMode ? s.brand : 'var(--bg-elevated)' }}>
                            <div className="w-5 h-5 rounded-full bg-white shadow-sm transition-transform" style={{ transform: isHandwritingMode ? 'translateX(20px)' : 'translateX(0)' }} />
                        </div>
                    </div>

                    {/* Hide Price Toggle */}
                    <div onClick={() => onHidePriceChange(!hidePrice)}
                        className="p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                        style={{
                            background: hidePrice ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${hidePrice ? 'rgba(139,92,246,0.25)' : s.cardBorder}`
                        }}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ background: hidePrice ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)' }}>
                                <CheckCircle size={18} style={{ color: hidePrice ? '#8b5cf6' : s.text3 }} />
                            </div>
                            <div>
                                <p className="font-semibold text-sm" style={{ color: hidePrice ? s.text1 : s.text2 }}>{t.hidePrice}</p>
                                <p className="text-[10px]" style={{ color: s.text3 }}>{t.hidePriceDesc}</p>
                            </div>
                        </div>
                        <div className="w-11 h-6 rounded-full p-0.5 transition-colors" style={{ background: hidePrice ? '#8b5cf6' : 'var(--bg-elevated)' }}>
                            <div className="w-5 h-5 rounded-full bg-white shadow-sm transition-transform" style={{ transform: hidePrice ? 'translateX(20px)' : 'translateX(0)' }} />
                        </div>
                    </div>

                    {/* ── Action Buttons ── */}
                    <div className="space-y-3 pt-2">
                        <button onClick={() => cameraInputRef.current?.click()}
                            className="w-full py-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold transition-all active:scale-95"
                            style={{ background: 'var(--brand-gradient)', color: 'white', boxShadow: `0 4px 24px ${s.brandGlow}` }}>
                            <Camera size={28} />
                            <span className="text-base">{t.takePhoto}</span>
                        </button>

                        <button onClick={() => setShowPreview(true)}
                            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
                            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-shine)', color: s.text1 }}>
                            <Upload size={18} />
                            {t.uploadGallery}
                        </button>

                        <button onClick={onOpenPhrases}
                            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
                            style={{ background: 'var(--info-bg)', border: '1px solid rgba(77,139,245,0.15)', color: 'var(--info-color)' }}>
                            <MessageCircle size={18} />
                            {t.phrasesBtn || '餐廳常用語'}
                        </button>
                    </div>
                </motion.div>

                {/* ── User Stats ── */}
                <motion.div className="w-full max-w-sm mx-auto rounded-2xl px-5 py-4"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                    style={{ background: s.card, border: `1px solid ${s.cardBorder}` }}>
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2 font-bold text-sm" style={{ color: s.text2 }}>
                            <Users size={16} /> {t.totalUsers}
                        </div>
                        <div className="font-bold text-base" style={{ color: s.brand }}>
                            {appBuyers} / 500
                        </div>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min((appBuyers / 500) * 100, 100)}%`, background: 'var(--brand-gradient)' }} />
                    </div>
                </motion.div>
            </div>

            {/* Hidden File Inputs */}
            <input type="file" accept="image/*" multiple capture="environment" ref={cameraInputRef} className="hidden" onChange={handleFileChange} />
            <input type="file" accept="image/*" multiple ref={fileInputRef} className="hidden" onChange={handleFileChange} />

            {/* ── Plan Tooltip ── */}
            {showPlanTooltip && typeof document !== 'undefined' && ReactDOM.createPortal(
                <>
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9998, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setShowPlanTooltip(false)} />
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999, width: '85vw', maxWidth: '320px' }}>
                        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', boxShadow: 'var(--card-shadow)', border: `1px solid ${s.cardBorder}`, padding: '24px', position: 'relative' }}>
                            <button onClick={() => setShowPlanTooltip(false)} style={{ position: 'absolute', top: '14px', right: '14px', color: s.text3, background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={16} />
                            </button>
                            <h3 style={{ textAlign: 'center', fontSize: '16px', fontWeight: 700, color: s.text1, marginBottom: '16px' }}>{t.planCompare}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', background: 'rgba(30,215,96,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ color: s.green }}>✓</span>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 700, color: s.text1, margin: 0 }}>{t.planFreeTitle}</p>
                                        <p style={{ fontSize: '12px', color: s.text3, margin: '2px 0 0' }}>{t.planFreeDesc}</p>
                                    </div>
                                </div>
                                <div style={{ borderTop: `1px dashed ${s.cardBorder}` }} />
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', background: 'rgba(255,107,43,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ color: s.brand }}>⭐</span>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 700, color: s.text1, margin: 0 }}>{t.planProTitle}</p>
                                        <p style={{ fontSize: '12px', color: s.text3, margin: '2px 0 0' }}>{t.planProDesc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}

    );
};