import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, MapPin, Users, Info, ArrowRight, BellRing, X, TrendingUp, IndianRupee } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const DiseaseAlerts = () => {
    const { t } = useLanguage();
    const [isPriceAlertsOpen, setIsPriceAlertsOpen] = useState(false);

    const regionalAlerts = [
        {
            id: 1,
            type: 'Critical',
            disease: 'Yellow Rust',
            location: 'Ambala District',
            distance: '15km away',
            date: '2 hours ago',
            severity: 'High',
            action: 'Immediate fungicide treatment recommended.'
        },
        {
            id: 2,
            type: 'Warning',
            disease: 'Leaf Spot',
            location: 'Regional Punjab',
            distance: '45km away',
            date: 'Yesterday',
            severity: 'Medium',
            action: 'Monitor moisture levels and improve drainage.'
        },
    ];

    const priceAlerts = [
        { id: 1, crop: 'Wheat', oldPrice: 2400, newPrice: 2450, trend: 'up', time: '10 mins ago' },
        { id: 2, crop: 'Rice', oldPrice: 3200, newPrice: 3180, trend: 'down', time: '1 hour ago' },
        { id: 3, crop: 'Cotton', oldPrice: 6200, newPrice: 6500, trend: 'up', time: '3 hours ago' },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-darkSlate font-['Outfit'] mb-2">{t('alertsTitle')}</h1>
                    <p className="text-slate-500 font-medium">{t('alertsDesc')}</p>
                </div>
                <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 border-2 border-white rounded-full bg-slate-200 overflow-hidden shadow-sm">
                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                        </div>
                    ))}
                    <div className="w-10 h-10 border-2 border-white rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                        +82
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Active Alerts List */}
                <div className="lg:col-span-8 space-y-6">
                    <h3 className="text-xl font-bold text-darkSlate font-['Outfit'] flex items-center gap-2">
                        <BellRing className="text-red-500" size={24} /> {t('alertsTitle')}
                    </h3>

                    {regionalAlerts.map((alert, idx) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-6 rounded-3xl border ${alert.type === 'Critical' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'} relative overflow-hidden group`}
                        >
                            <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${alert.type === 'Critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                                    <AlertTriangle size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md mb-1 inline-block ${alert.type === 'Critical' ? 'bg-red-600/10 text-red-700' : 'bg-orange-600/10 text-orange-700'}`}>
                                                {alert.type} {t('riskLevel')}
                                            </span>
                                            <h4 className="text-xl font-bold text-slate-800">{alert.disease}</h4>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">{alert.date}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                            <MapPin size={16} className="text-blue-500" /> {alert.location}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                                            <Users size={16} className="text-emerald-500" /> {alert.distance}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/60 rounded-2xl border border-white flex items-center justify-between">
                                        <p className="text-sm font-medium text-slate-700">{alert.action}</p>
                                        <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                            <ArrowRight size={20} className="text-slate-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Prevention Panel */}
                <div className="lg:col-span-4 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-900 p-8 rounded-3xl text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden"
                    >
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <ShieldCheck className="mb-6 opacity-60" size={48} />
                        <h3 className="text-2xl font-bold font-['Outfit'] mb-4">{t('advisory')}</h3>
                        <p className="text-emerald-100/80 text-sm font-medium mb-6 leading-relaxed">
                            Your farm is currently in a <b>Low Risk</b> zone, but surrounding areas show activity. Enable auto-alerts to stay updated.
                        </p>
                        <button 
                            onClick={() => setIsPriceAlertsOpen(true)}
                            className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-400 transition-all"
                        >
                            {t('priceAlerts')}
                        </button>
                    </motion.div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h4 className="font-bold text-darkSlate mb-4 flex items-center gap-2">
                            <Info className="text-blue-500" size={18} /> {t('advisory')}
                        </h4>
                        <ul className="space-y-4">
                            {[
                                "Report any unusual leaf coloring immediately.",
                                "Isolate infected plants to prevent spores spreading.",
                                "Wash all field equipment after use in risk zones.",
                                "Coordinate with neighbors for synced spraying."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {/* Alerts Panel (Slide-over) */}
            <AnimatePresence>
                {isPriceAlertsOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPriceAlertsOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 px-4"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-darkSlate font-['Outfit'] flex items-center gap-2">
                                    <BellRing size={24} className="text-emerald-500" /> Notifications
                                </h3>
                                <button
                                    onClick={() => setIsPriceAlertsOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <X size={24} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Price Movements</h4>
                                    <div className="space-y-4">
                                        {priceAlerts.map(alert => (
                                            <div key={alert.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${alert.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                        <TrendingUp size={20} />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-slate-800">{alert.crop}</h5>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{alert.time}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-slate-800 flex items-center justify-end gap-1">
                                                        <IndianRupee size={14} /> {alert.newPrice}
                                                    </p>
                                                    <p className={`text-[10px] font-bold ${alert.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                        {alert.trend === 'up' ? '+' : '-'}{Math.abs(alert.newPrice - alert.oldPrice)}/quintal
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Recent Disease Risks</h4>
                                    <div className="space-y-4">
                                        {regionalAlerts.map(alert => (
                                            <div key={alert.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h5 className="font-bold text-slate-800">{alert.disease}</h5>
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${alert.type === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                                        {alert.type}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium">{alert.location} • {alert.distance}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-slate-100">
                                <button className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all uppercase tracking-widest text-sm">
                                    Mark All As Read
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DiseaseAlerts;
