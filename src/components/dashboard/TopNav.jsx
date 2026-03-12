import React, { useState } from 'react';
import { Bell, Globe, ChevronDown, User, Search, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const TopNav = () => {
    const { language, setLanguage, t } = useLanguage();
    const { user } = useAuth();
    const displayName = user?.name || 'Farmer';
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const languages = ['English', 'Hindi', 'Telugu'];
    
    const notifications = [
        { id: 1, title: t('yellowRustAlert'), msg: t('protectCrops'), time: '10 min ago', type: 'warning' },
        { id: 2, title: t('checkedMarketPrice'), msg: t('wheatPriceIncreased'), time: '1 hour ago', type: 'success' },
        { id: 3, title: t('weatherAlert'), msg: t('heavyRainfall'), time: '2 hours ago', type: 'info' }
    ];

    return (
        <header className="h-20 bg-gradient-to-r from-[#10B981] to-[#34D399] sticky top-0 z-40 px-8 flex items-center justify-between shadow-lg shadow-emerald-500/10">
            {/* Page Context (Left) */}
            <div className="flex items-center gap-4">
                <div className="lg:hidden text-white cursor-pointer mr-2">
                    <Menu size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold font-['Outfit'] text-white drop-shadow-sm">{t('welcome')}, {displayName} 👋</h2>
                    <p className="text-xs text-emerald-50 font-medium opacity-90">{t('overview')}</p>
                </div>
            </div>

            {/* Actions (Right) */}
            <div className="flex items-center gap-5">
                
                {/* Search - For efficiency */}
                <div className="hidden md:flex items-center bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 text-white">
                    <Search size={16} className="opacity-80" />
                    <input 
                        type="text" 
                        placeholder="Search dashboard..." 
                        className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-white/60 ml-2 w-48 font-medium" 
                    />
                </div>

                {/* Language Switcher */}
                <div className="relative">
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="flex items-center gap-2 text-white hover:bg-white/10 font-bold px-4 py-2 rounded-full transition-all border border-white/20"
                    >
                        <Globe size={18} />
                        <span className="text-xs hidden sm:inline">{language}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isLangOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden"
                            >
                                {languages.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => {
                                            setLanguage(lang);
                                            setIsLangOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-slate-700 text-sm font-bold transition-colors border-b border-slate-50 last:border-0"
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all border ${isNotifOpen ? 'bg-white/20 border-white/40 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                    >
                        <Bell size={20} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-amber-400 rounded-full border border-emerald-500"></span>
                    </button>

                    <AnimatePresence>
                        {isNotifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-glow"
                            >
                                <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/80">
                                    <h4 className="font-black text-darkSlate text-sm uppercase tracking-tighter">Notifications</h4>
                                    <button className="text-[10px] text-emerald-600 font-black uppercase hover:underline">Clear all</button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer group">
                                            <div className="flex gap-3">
                                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notif.type === 'warning' ? 'bg-amber-500' : notif.type === 'success' ? 'bg-emerald-500' : 'bg-blue-400'}`} />
                                                <div>
                                                    <h5 className="text-xs font-black text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{notif.title}</h5>
                                                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">{notif.msg}</p>
                                                    <span className="text-[8px] text-slate-400 font-black mt-2 block uppercase tracking-widest">{notif.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-3 text-center text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-colors tracking-widest border-t border-slate-50">
                                    History Archive
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile Avatar */}
                <Link to="/profile" className="flex items-center gap-3 pl-2 border-l border-white/20 hover:scale-110 transition-transform">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 font-black shadow-lg overflow-hidden border-2 border-white/50">
                        {user?.photo ? (
                            <img src={user.photo} alt="profile" className="w-full h-full object-cover" />
                        ) : (
                            displayName.charAt(0).toUpperCase()
                        )}
                    </div>
                </Link>

            </div>
        </header>
    );
};

export default TopNav;
