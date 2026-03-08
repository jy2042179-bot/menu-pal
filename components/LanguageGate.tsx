'use client';
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { TargetLanguage } from '../types';
import { UI_LANGUAGE_OPTIONS } from '../i18n';

interface LanguageGateProps {
    onSelectLanguage: (lang: TargetLanguage) => void;
}

/**
 * 強制首次語言選擇畫面
 * 用戶必須選擇語言才能繼續使用 App
 * 改進：可捲動的語言列表 + 捲動提示箭頭
 */
export const LanguageGate: React.FC<LanguageGateProps> = ({ onSelectLanguage }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showScrollHint, setShowScrollHint] = useState(true);

    const handleSelect = (lang: TargetLanguage) => {
        // 儲存語言選擇
        localStorage.setItem('ui_language', lang);
        localStorage.setItem('has_selected_language', 'true');
        onSelectLanguage(lang);
    };

    // 捲動時隱藏提示箭頭
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const handleScroll = () => {
            const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
            if (isNearBottom) setShowScrollHint(false);
        };
        // 檢查是否需要捲動（內容高度 > 容器高度）
        const checkOverflow = () => {
            if (el.scrollHeight <= el.clientHeight) {
                setShowScrollHint(false);
            }
        };
        el.addEventListener('scroll', handleScroll);
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => {
            el.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', checkOverflow);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen h-screen p-4 pb-8 bg-gradient-to-b from-pink-50 via-fuchsia-50 to-pink-100">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-3xl shadow-pink text-center my-4 flex flex-col overflow-hidden border border-pink-100"
                style={{ maxHeight: 'calc(100vh - 64px)' }}
            >
                {/* 固定的頭部 */}
                <div className="p-6 sm:p-8 pb-3 shrink-0">
                    {/* Logo */}
                    <motion.div
                        initial={{ y: -20, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }}
                        className="w-20 h-20 bg-gradient-to-br from-pink-400 to-fuchsia-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-pink"
                    >
                        <span className="text-4xl">🌭</span>
                    </motion.div>

                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-3xl font-bold text-stone-700 tracking-tight mb-2">
                            SausageMenuPal
                        </h1>
                        <p className="text-stone-500 text-base">
                            Please select your language
                        </p>
                        <p className="text-stone-400 text-sm mt-1">
                            請選擇您的語言
                        </p>
                    </motion.div>
                </div>

                {/* 可捲動的語言選項區域 */}
                <div className="relative flex-1 min-h-0">
                    <div
                        ref={scrollRef}
                        className="overflow-y-auto px-6 sm:px-8 pb-6 pt-3"
                        style={{ maxHeight: '100%' }}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                        >
                            {UI_LANGUAGE_OPTIONS.map((option, index) => (
                                <motion.button
                                    key={option.value}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.03 }}
                                    onClick={() => handleSelect(option.value)}
                                    className="flex flex-col items-center gap-2 p-4 bg-pink-50/60 hover:bg-pink-100 border-2 border-transparent hover:border-pink-400 rounded-2xl transition-all duration-200 group active:scale-95 shadow-sm"
                                >
                                    <span className="text-3xl group-hover:scale-110 transition-transform">
                                        {option.flag}
                                    </span>
                                    <span className="text-sm font-medium text-stone-600 group-hover:text-pink-600">
                                        {option.label}
                                    </span>
                                </motion.button>
                            ))}
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-xs text-stone-400 mt-6"
                        >
                            You can change the language anytime in the app.
                        </motion.p>
                    </div>

                    {/* 捲動提示箭頭 */}
                    {showScrollHint && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, y: [0, 6, 0] }}
                            transition={{ y: { repeat: Infinity, duration: 1.5 } }}
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none"
                        >
                            <div className="bg-pink-500/90 text-white rounded-full p-2 shadow-pink">
                                <ChevronDown size={20} />
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
