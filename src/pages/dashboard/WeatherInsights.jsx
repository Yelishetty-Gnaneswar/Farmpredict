import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Calendar, AlertTriangle, X, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line
} from 'recharts';
import { useLanguage } from '../../context/LanguageContext';

const weatherData = [
    { day: 'Mon', temp: 28, rain: 5, humidity: 45 },
    { day: 'Tue', temp: 30, rain: 0, humidity: 40 },
    { day: 'Wed', temp: 32, rain: 10, humidity: 55 },
    { day: 'Thu', temp: 29, rain: 45, humidity: 85 },
    { day: 'Fri', temp: 27, rain: 20, humidity: 70 },
    { day: 'Sat', temp: 28, rain: 5, humidity: 60 },
    { day: 'Sun', temp: 31, rain: 0, humidity: 40 },
];

const WeatherInsights = () => {
    const { t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [showHistory, setShowHistory] = useState(false);

    // Dynamic date generation
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // Generate history data
    const historyData = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (30 - i));
        return {
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            temp: 25 + Math.random() * 10,
            rain: Math.random() < 0.3 ? Math.random() * 20 : 0,
            humidity: 40 + Math.random() * 30
        };
    });

    useEffect(() => {
        // Fetch real data from backend
        fetch('http://localhost:8000/api/dashboard/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Error fetching weather stats:", err));
    }, []);

    return (
        <div className="space-y-8 pb-12">
            <header>
                <h1 className="text-3xl font-bold text-darkSlate font-['Outfit'] mb-2">{t('weatherIntel')}</h1>
                <p className="text-slate-500 font-medium">{t('weatherIntelDesc')}</p>
            </header>

            {/* Current Weather Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center h-full">
                        <div>
                            <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-4 py-1.5 rounded-full backdrop-blur-sm">
                                <Calendar size={16} />
                                <span className="text-sm font-bold">{t('today')}, {dateString}</span>
                            </div>
                            <h2 className="text-6xl font-black font-['Outfit'] mb-2">{stats?.current_temp || '28'}°C</h2>
                            <p className="text-blue-100 font-bold text-xl mb-6">Partly Cloudy • feels like 31°C</p>

                            <div className="flex gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                        <Wind size={20} />
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">{t('windLabel')}</p>
                                        <p className="font-bold">12 km/h</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                        <Droplets size={20} />
                                    </div>
                                    <div>
                                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">{t('humidity')}</p>
                                        <p className="font-bold">{stats?.humidity || '65'}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-0 flex flex-col items-center">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Sun size={120} className="text-yellow-300 drop-shadow-2xl" />
                            </motion.div>
                            <div className="mt-4 text-center">
                                <div className="p-2 bg-yellow-400/30 rounded-xl backdrop-blur-md border border-yellow-300/30">
                                    <p className="text-sm font-bold flex items-center gap-2">
                                        <AlertTriangle size={16} /> {t('uvIndexLabel')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between"
                >
                    <h3 className="text-lg font-bold text-darkSlate font-['Outfit'] mb-4">{t('soilEnv')}</h3>
                    <div className="space-y-6">
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-amber-700 font-bold text-sm flex items-center gap-2">
                                    <Droplets size={16} /> {t('moisture')}
                                </span>
                                <span className="text-amber-900 font-black">{stats?.soil_moisture || '42'}%</span>
                            </div>
                            <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats?.soil_moisture || 42}%` }}
                                    className="h-full bg-amber-500"
                                ></motion.div>
                            </div>
                            <p className="text-amber-600 text-xs mt-2 font-bold">Safe threshold: 30% - 60%</p>
                        </div>

                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-emerald-700 font-bold text-sm flex items-center gap-2">
                                    <Thermometer size={16} /> {t('soilTemp')}
                                </span>
                                <span className="text-emerald-900 font-black">24°C</span>
                            </div>
                            <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "65%" }}
                                    className="h-full bg-emerald-500"
                                ></motion.div>
                            </div>
                            <p className="text-emerald-600 text-xs mt-2 font-bold">Ideal for current planting</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowHistory(true)}
                        className="mt-6 w-full py-3 bg-slate-50 text-slate-600 font-bold rounded-xl text-sm border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                    >
                        View Detailed History <ChevronRight size={16} />
                    </button>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-darkSlate font-['Outfit']">{t('tempTrend')}</h3>
                            <p className="text-sm text-slate-500 font-medium">7-Day fluctuation analysis</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            <span className="text-xs font-bold text-slate-400">{t('rainfall')} (mm)</span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weatherData}>
                                <defs>
                                    <linearGradient id="colorTempInsight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorTempInsight)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-darkSlate font-['Outfit']">{t('rainfallProb')}</h3>
                            <p className="text-sm text-slate-500 font-medium">Precipitation forecast by day</p>
                        </div>
                        <CloudRain className="text-blue-400" size={24} />
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weatherData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="rain" fill="#60a5fa" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* 7-Day Mini Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {weatherData.map((data, idx) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        key={idx}
                        className={`p-4 rounded-2xl border text-center transition-all hover:shadow-md cursor-pointer ${idx === 3 ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'}`}
                    >
                        <p className={`text-xs font-bold uppercase mb-3 ${idx === 3 ? 'text-blue-100' : 'text-slate-400'}`}>{data.day}</p>
                        <div className="flex justify-center mb-3">
                            {data.rain > 30 ? <CloudRain size={24} /> : data.temp > 30 ? <Sun size={24} /> : <Cloud size={24} />}
                        </div>
                        <p className="text-xl font-black font-['Outfit']">{data.temp}°</p>
                        <p className={`text-[10px] font-bold mt-1 ${idx === 3 ? 'text-blue-100' : 'text-slate-400'}`}>{data.rain}mm {t('rainfall')}</p>
                    </motion.div>
                ))}
            </div>

            {/* History Modal */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-darkSlate font-['Outfit']">Historical Weather Trends</h3>
                                    <p className="text-slate-500 font-medium text-sm">30-Day fluctuation analysis for temperature and rainfall</p>
                                </div>
                                <button 
                                    onClick={() => setShowHistory(false)}
                                    className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="grid grid-cols-1 gap-8">
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                                <Thermometer className="text-orange-500" size={20} /> Temperature History (°C)
                                            </h4>
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                                    <span className="text-xs font-bold text-slate-500">Max Temp</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={historyData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                                    <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <div className="flex justify-between items-center mb-6">
                                            <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                                <CloudRain className="text-blue-500" size={20} /> Rainfall Trends (mm)
                                            </h4>
                                        </div>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={historyData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} cursor={{fill: '#f1f5f9'}} />
                                                    <Bar dataKey="rain" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WeatherInsights;
