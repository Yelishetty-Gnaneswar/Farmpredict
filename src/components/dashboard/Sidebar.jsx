import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Leaf,
    CloudSun,
    TrendingUp,
    Droplets,
    LineChart,
    ShieldAlert,
    History,
    User,
    LogOut,
    FileText
} from 'lucide-react';

const Sidebar = () => {
    const { t } = useLanguage();
    const { logout } = useAuth();
    
    // Updated paths to match top-level routes
    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: t('home'), exact: true },
        { path: '/predict', icon: Leaf, label: t('cropRec') },
        { path: '/disease-detection', icon: ShieldAlert, label: t('diseaseDet') },
        { path: '/weather-insights', icon: CloudSun, label: t('weather') },
        { path: '/yield-prediction', icon: TrendingUp, label: t('yield') },
        { path: '/irrigation-planner', icon: Droplets, label: t('irrigation') },
        { path: '/market-insights', icon: LineChart, label: t('market') },
        { path: '/disease-alerts', icon: ShieldAlert, label: t('alerts') }, // Hidden or combined conceptually if needed
        { path: '/government-schemes', icon: FileText, label: t('govtSchemes') },
        { path: '/history', icon: History, label: t('history') },
        { path: '/profile', icon: User, label: t('profile') }
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20 shadow-sm">
            {/* Logo */}
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-200">
                    FP
                </div>
                <span className="text-xl font-bold font-['Outfit'] text-emerald-900 tracking-tight">Farm Predict</span>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                <nav className="space-y-1.5">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${isActive
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 scale-[1.02]'
                                    : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                                }`
                            }
                        >
                            <item.icon size={20} className="shrink-0" />
                            <span className="truncate">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Logout Footer */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold transition-all"
                >
                    <LogOut size={20} />
                    <span>{t('logout')}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
