import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CloudSun, Leaf, Droplets, TrendingUp, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const DashboardHome = () => {
    const { t } = useLanguage();
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.get('/dashboard/stats');
                setStats(data);
                
                // Only show welcome toast once per session
                if (!sessionStorage.getItem('welcome_shown')) {
                    toast.success(t('welcomeBack') || 'Dashboard data updated!');
                    sessionStorage.setItem('welcome_shown', 'true');
                }
            } catch (err) {
                // api service already handles toast
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchStats();
        }
    }, [token, t]);

    const dynamicWeatherData = stats?.weather_chart || [];

    return (
        <div className="space-y-6 pb-12">
            {/* Health & Sustainability Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
                    <div className="relative z-10 flex items-center gap-8">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                <motion.circle
                                    cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent"
                                    strokeDasharray={364.4}
                                    initial={{ strokeDashoffset: 364.4 }}
                                    animate={{ strokeDashoffset: 364.4 * (1 - 0.82) }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    className="text-emerald-500"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-darkSlate font-['Outfit']">82</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Good</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-darkSlate font-['Outfit'] mb-1">{t('healthScore')}</h3>
                            <p className="text-slate-500 font-medium max-w-md">{t('farmHealthOptimal')}</p>
                            <div className="flex gap-4 mt-4">
                                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">{t('nitrogen')}: 88%</div>
                                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100 uppercase tracking-wider">{t('moisture')}: 92%</div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden xl:flex flex-col items-end gap-2 relative z-10">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('sustainability')}</span>
                        <span className="text-3xl font-black text-emerald-600">A+</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden flex flex-col justify-center"
                >
                    <div className="relative z-10">
                        <h4 className="text-blue-100 font-bold text-xs mb-1 uppercase tracking-wider">{t('aiInsight')}</h4>
                        <p className="text-lg font-bold leading-tight">{t('applyUrea')}</p>
                    </div>
                    <div className="absolute bottom-0 right-0 p-4 opacity-20">
                        <TrendingUp size={80} />
                    </div>
                </motion.div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full transition-colors group-hover:bg-blue-100 z-0"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                            <CloudSun size={24} />
                        </div>
                        <h3 className="text-slate-500 font-medium text-sm mb-1">{t('currentWeather')}</h3>
                        <p className="text-3xl font-bold text-darkSlate">{stats?.current_temp || '28'}°C</p>
                        <p className="text-[11px] text-blue-600 font-bold mt-2 flex items-center gap-1 uppercase tracking-wider">
                            {stats?.humidity || '65'}% {t('humidity')}
                        </p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full transition-colors group-hover:bg-emerald-100 z-0"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                            <Leaf size={24} />
                        </div>
                        <h3 className="text-slate-500 font-medium text-sm mb-1">{t('recommendedCrop')}</h3>
                        <p className="text-3xl font-bold text-darkSlate">{stats?.recommended_crop || 'Wheat'}</p>
                        <p className="text-[11px] text-emerald-600 font-bold mt-2 uppercase tracking-wider">{t('optimalForSeason')}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full transition-colors group-hover:bg-amber-100 z-0"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                            <Droplets size={24} />
                        </div>
                        <h3 className="text-slate-500 font-medium text-sm mb-1">{t('soilMoisture')}</h3>
                        <p className="text-3xl font-bold text-darkSlate">{stats?.soil_moisture || '42'}%</p>
                        <p className="text-[11px] text-amber-600 font-bold mt-2 uppercase tracking-wider">{t('precisionSensorData')}</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full transition-colors group-hover:bg-purple-100 z-0"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-slate-500 font-medium text-sm mb-1">{t('marketPrice')}</h3>
                        <p className="text-3xl font-bold text-darkSlate mr-1">₹{stats?.market_price_wheat || '2,450'}</p>
                        <p className="text-[11px] text-purple-600 font-bold mt-2 uppercase tracking-wider">↑ {t('trackLiveTrends')}</p>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions & Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Crop Prediction Widget */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="col-span-1 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <Leaf size={24} className="text-emerald-100" />
                        </div>
                        <h3 className="text-2xl font-bold font-['Outfit'] mb-2">{t('newSeasonQ')}</h3>
                        <p className="text-emerald-100/90 font-medium mb-8 leading-relaxed">
                            {t('newSeasonDesc')}
                        </p>
                    </div>

                    <Link
                        to="/predict"
                        className="relative z-10 w-full py-4 bg-white text-emerald-700 font-bold rounded-xl shadow-lg hover:bg-emerald-50 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                    >
                        {t('predictBestCrop')}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Weather Trend Chart */}
                <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-96 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-darkSlate font-['Outfit']">{t('climateIntel')}</h3>
                            <p className="text-sm text-slate-500 font-medium">{t('tempRainMonitor')}</p>
                        </div>
                        <Link to="/weather-insights" className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <ArrowRight size={20} className="text-slate-400" />
                        </Link>
                    </div>
                    <div className="flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dynamicWeatherData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTempHome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRainHome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area yAxisId="left" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorTempHome)" />
                                <Area yAxisId="right" type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRainHome)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* News & Alerts */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-80">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-darkSlate font-['Outfit']">{t('regionalDiseaseRisks')}</h3>
                        <Link to="/disease-alerts" className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1 uppercase tracking-wider">
                            <AlertTriangle size={14} /> {t('criticalAlerts')}
                        </Link>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-sm">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-red-800 text-sm">{t('yellowRustAlert')}</h4>
                                <p className="text-xs text-red-700 font-medium">{t('protectCrops')}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-sm">
                                <CloudSun size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-orange-800 text-sm">{t('heatwaveAdvisory')}</h4>
                                <p className="text-xs text-orange-700 font-medium">{t('increaseIrrigation')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities List */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-80">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-darkSlate font-['Outfit']">{t('recentHistory')}</h3>
                        <Link to="/history" className="text-sm text-emerald-600 font-bold hover:underline uppercase tracking-wider text-[11px]">{t('viewAll')}</Link>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {[
                            { title: t('checkedMarketPrice'), desc: t('wheatPriceIncreased'), time: '2 hours ago', icon: TrendingUp, color: 'purple' },
                            { title: t('ranCropPred'), desc: t('cottonMatch'), time: 'Yesterday', icon: Leaf, color: 'emerald' },
                            { title: t('weatherAlert'), desc: t('heavyRainfall'), time: '2 days ago', icon: CloudSun, color: 'blue' },
                        ].map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-${activity.color}-100 text-${activity.color}-600`}>
                                    <activity.icon size={18} />
                                </div>
                                <div>
                                    <h4 className="text-slate-800 font-semibold text-sm">{activity.title}</h4>
                                    <p className="text-slate-500 text-xs mb-1 font-medium">{activity.desc}</p>
                                    <span className="text-[10px] font-bold text-slate-400 opacity-60 uppercase tracking-widest">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardHome;
