import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Calendar, Waves, Sun, Wind, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const IrrigationPlanning = () => {
    const { t } = useLanguage();
    const [plan, setPlan] = useState({
        nextWatering: "18:00 Today",
        duration: "45 mins",
        volume: "1200 Liters",
        frequency: "Every 2 days",
        status: "Automated - Optimized"
    });
    const [isIrrigating, setIsIrrigating] = useState(false);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isIrrigating) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
            setSeconds(0);
        }
        return () => clearInterval(interval);
    }, [isIrrigating]);

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const schedule = [
        { time: '06:00 AM', action: 'Drip Irrigation', duration: '20m', status: 'Completed', icon: CheckCircle2, color: 'emerald' },
        { time: '06:00 PM', action: 'Full Flow', duration: '45m', status: 'Pending', icon: Clock, color: 'blue' },
        { time: '06:00 AM', action: 'Nutrient Mix', duration: '15m', status: 'Upcoming', icon: Calendar, color: 'purple' },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-darkSlate font-['Outfit'] mb-2">{t('irrigationTitle')}</h1>
                <p className="text-slate-500 font-medium">{t('irrigationDesc')}</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Status Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
                >
                    <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                                    <Waves size={14} className={isIrrigating ? "animate-pulse" : ""} /> {isIrrigating ? "System Running" : t('systemOnline')}
                                </div>
                                <h2 className="text-2xl font-bold font-['Outfit'] mb-1">
                                    {isIrrigating ? "Active Irrigation" : t('nextWatering')}
                                </h2>
                                <p className="text-blue-100 font-medium mb-6">
                                    {isIrrigating ? "Currently watering Wheat fields" : "Controlled drip irrigation for Wheat fields"}
                                </p>
                                <div className="flex flex-wrap gap-4 text-3xl font-black font-['Outfit']">
                                    {isIrrigating ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-emerald-300 font-mono tracking-wider">{formatTime(seconds)}</span>
                                            <span className="text-sm font-bold text-emerald-200 mt-2 uppercase tracking-widest">Elapsed</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>{plan.nextWatering}</span>
                                            <span className="text-blue-300 opacity-50 font-light hidden md:inline">|</span>
                                            <span className="text-blue-100">{plan.duration}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0 px-8 py-4 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-md text-center">
                                <p className="text-xs font-bold text-blue-100 uppercase mb-1">{t('targetVolume')}</p>
                                <p className="text-2xl font-black">{plan.volume}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                                <Waves size={20} />
                            </div>
                            <p className="text-xs font-bold text-blue-600 uppercase mb-1">{t('moisture')}</p>
                            <p className="text-2xl font-black text-darkSlate">42%</p>
                            <p className="text-xs text-slate-500 font-medium mt-1">Sufficient for 24h</p>
                        </div>
                        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-600 mb-4 shadow-sm">
                                <Sun size={20} />
                            </div>
                            <p className="text-xs font-bold text-amber-600 uppercase mb-1">{t('evaporation')}</p>
                            <p className="text-2xl font-black text-darkSlate">High</p>
                            <p className="text-xs text-slate-500 font-medium mt-1">Rate: 0.8mm/hr</p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-600 mb-4 shadow-sm">
                                <Wind size={20} />
                            </div>
                            <p className="text-xs font-bold text-slate-600 uppercase mb-1">{t('windSpeed')}</p>
                            <p className="text-2xl font-black text-darkSlate">12 km/h</p>
                            <p className="text-xs text-slate-500 font-medium mt-1">Normal drift detected</p>
                        </div>
                    </div>
                </motion.div>

                {/* Automation & Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-darkSlate font-['Outfit']">{t('automation')}</h3>
                        <div 
                            onClick={() => setIsIrrigating(!isIrrigating)}
                            className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${isIrrigating ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                            <motion.div 
                                animate={{ x: isIrrigating ? 24 : 0 }}
                                className="w-4 h-4 bg-white rounded-full"
                            ></motion.div>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start gap-4">
                            <AlertTriangle className="text-orange-500 mt-1 shrink-0" size={20} />
                            <div>
                                <h4 className="font-bold text-orange-800 text-sm">{t('lowRainWarning')}</h4>
                                <p className="text-xs text-orange-700 font-medium mt-1">{t('rainAdjustDesc')}</p>
                            </div>
                        </div>

                        <div className="p-4 border border-slate-100 rounded-2xl space-y-3">
                            <h4 className="font-bold text-slate-800 text-sm">{t('pumpEfficiency')}</h4>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-emerald-500"></div>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                <span>75% Optimal</span>
                                <span>{t('maintenanceDue')} 12 {t('days')}</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsIrrigating(!isIrrigating)}
                        className={`mt-8 w-full py-4 font-black rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 ${isIrrigating ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                    >
                        <Waves size={20} className={isIrrigating ? "animate-spin" : ""} /> 
                        {isIrrigating ? "Stop Irrigation" : t('manualOverride')}
                    </button>
                </motion.div>

                {/* Timeline Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-darkSlate font-['Outfit']">{t('upcomingSchedule')}</h3>
                        <button className="text-sm font-bold text-blue-600 hover:rotate-180 transition-transform duration-500">
                            <Calendar size={20} />
                        </button>
                    </div>

                    <div className="space-y-8 relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                        {schedule.map((item, idx) => (
                            <div key={idx} className="relative flex items-center gap-6 group">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all group-hover:scale-110 shadow-sm bg-${item.color}-100 text-${item.color}-600 border-2 border-white`}>
                                    <item.icon size={18} />
                                </div>
                                <div className="flex-1 pb-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-slate-800">{item.action}</h4>
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-${item.color}-50 text-${item.color}-600 border border-${item.color}-100`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                        <div className="flex items-center gap-1.5"><Clock size={12} /> {item.time}</div>
                                        <div className="flex items-center gap-1.5"><Waves size={12} /> {item.duration}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default IrrigationPlanning;
