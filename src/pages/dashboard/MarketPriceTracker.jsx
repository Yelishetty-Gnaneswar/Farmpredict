import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Search, Filter, Bell, ArrowUpRight, ArrowDownRight, IndianRupee, X, Info, ChevronRight, Globe, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const mockPriceData = [
    { date: '01 Mar', price: 2150 },
    { date: '03 Mar', price: 2200 },
    { date: '05 Mar', price: 2180 },
    { date: '07 Mar', price: 2350 },
    { date: '09 Mar', price: 2420 },
    { date: '11 Mar', price: 2450 },
    { date: '12 Mar', price: 2450 },
];

const MarketPriceTracker = () => {
    const { t } = useLanguage();
    const [commodities, setCommodities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isInsightsOpen, setIsInsightsOpen] = useState(false);
    const [isPriceAlertsOpen, setIsPriceAlertsOpen] = useState(false);

    const priceAlerts = [
        { id: 1, crop: 'Wheat', msg: 'Price crossed ₹2,400 target', time: '10m ago', type: 'positive' },
        { id: 2, crop: 'Rice', msg: 'Market volatility expected due to rain', time: '2h ago', type: 'warning' },
        { id: 3, crop: 'Cotton', msg: 'Export demand surge in Q2', time: '5h ago', type: 'info' }
    ];

    // Mock trend analysis data
    const trendAnalysis = [
        { month: 'Oct', export: 1200, domestic: 3400 },
        { month: 'Nov', export: 1350, domestic: 3200 },
        { month: 'Dec', export: 1500, domestic: 3600 },
        { month: 'Jan', export: 1800, domestic: 3800 },
        { month: 'Feb', export: 2100, domestic: 4000 },
        { month: 'Mar', export: 2400, domestic: 4200 },
    ];

    useEffect(() => {
        // Fetch from backend stats
        fetch('http://localhost:8000/api/dashboard/stats')
            .then(res => res.json())
            .then(data => setCommodities(data.market_trends || []))
            .catch(err => console.error(err));
    }, []);

    const filteredCommodities = commodities.filter(c =>
        c.crop.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-darkSlate font-['Outfit'] mb-2">{t('marketTitle')}</h1>
                    <p className="text-slate-500 font-medium">{t('marketDesc')}</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsPriceAlertsOpen(true)}
                        className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
                    >
                        <Bell size={20} />
                    </button>
                    <button 
                        onClick={() => setIsPriceAlertsOpen(true)}
                        className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"
                    >
                        {t('priceAlerts')}
                    </button>
                </div>
            </header>

            {/* Price Chart & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-darkSlate font-['Outfit']">Wheat ({t('mandiTrend')})</h3>
                            <p className="text-sm text-slate-500 font-medium">{t('perQuintal')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-black text-darkSlate font-['Outfit'] flex items-center gap-1 justify-end">
                                <IndianRupee size={24} className="text-emerald-600" /> 2,450
                            </p>
                            <p className="text-emerald-600 font-bold text-sm flex items-center gap-1 justify-end mt-1">
                                <ArrowUpRight size={16} /> +5.2% Today
                            </p>
                        </div>
                    </div>

                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockPriceData}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Right Panel: Top Commodities */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-4 space-y-6"
                >
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-darkSlate font-['Outfit'] mb-6">{t('marketSearch')}</h3>
                        <div className="relative mb-8">
                            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder={t('searchCommodity')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">{t('topTrending')}</p>
                            {filteredCommodities.length > 0 ? filteredCommodities.map((item, idx) => (
                                <div key={idx} className="p-4 rounded-2xl border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 font-bold group-hover:bg-emerald-100 transition-colors">
                                                {item.crop[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{item.crop}</h4>
                                                <p className="text-xs text-slate-500 font-medium">Mandi Price</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-slate-800 tracking-tight">₹{item.price}</p>
                                            <p className={`text-[10px] font-black uppercase flex items-center gap-0.5 justify-end mt-0.5 ${item.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {item.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                                {item.trend}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center py-8 text-slate-400 font-medium">{t('noResults')}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-indigo-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-lg group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                        <h4 className="text-xl font-bold font-['Outfit'] mb-3 relative z-10">{t('exportPotential')}</h4>
                        <p className="text-indigo-100 text-sm font-medium mb-6 relative z-10 leading-relaxed">
                            {t('organicCottonDemand')}
                        </p>
                        <button 
                            onClick={() => setIsInsightsOpen(true)}
                            className="px-6 py-2.5 bg-white text-indigo-700 font-bold rounded-xl text-sm hover:bg-indigo-50 transition-all relative z-10"
                        >
                            {t('readInsights')}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Insights Modal */}
            <AnimatePresence>
                {isInsightsOpen && (
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
                            className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
                                <div>
                                    <h3 className="text-2xl font-bold font-['Outfit']">Market Trend Insights</h3>
                                    <p className="text-indigo-100 font-medium text-sm">Deep analysis of global and domestic crop demand</p>
                                </div>
                                <button 
                                    onClick={() => setIsInsightsOpen(false)}
                                    className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                                            <Globe size={18} className="text-blue-500" /> Export vs Domestic Demand
                                        </h4>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={trendAnalysis}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                                    <Tooltip />
                                                    <Bar dataKey="export" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                                    <Bar dataKey="domestic" fill="#10b981" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                            <div className="flex items-center gap-3 mb-2 text-emerald-700">
                                                <TrendingUp size={20} />
                                                <h5 className="font-bold">Bullish Trends</h5>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Organic grains are seeing a 15% increase in European markets. Local MSP revisions are expected next month.
                                            </p>
                                        </div>
                                        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                                            <div className="flex items-center gap-3 mb-2 text-amber-700">
                                                <Zap size={20} />
                                                <h5 className="font-bold">Quick Strategy</h5>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                Holding stocks for another 3 weeks might yield 5-8% better returns based on current supply chain disruptions.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-indigo-50 rounded-[32px] border border-indigo-100">
                                    <h4 className="font-bold text-indigo-900 mb-4 tracking-tight">AI Summary</h4>
                                    <p className="text-indigo-800/80 font-medium leading-relaxed">
                                        Market indicators suggest a transition towards high-protein wheat varieties. Government export incentives for processed agricultural products are being expanded under the new trade policy. We recommend diversifying into value-added processing to maximize profit margins in the Q3-Q4 period.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Price Alerts Panel */}
            <AnimatePresence>
                {isPriceAlertsOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsPriceAlertsOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[60] overflow-y-auto"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white sticky top-0">
                                <div>
                                    <h3 className="text-2xl font-bold font-['Outfit']">{t('priceAlerts')}</h3>
                                    <p className="text-emerald-100 font-medium text-sm">Active market watch notifications</p>
                                </div>
                                <button onClick={() => setIsPriceAlertsOpen(false)} className="p-2 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-8 space-y-4">
                                {priceAlerts.map((alert) => (
                                    <motion.div 
                                        key={alert.id}
                                        whileHover={{ x: -4 }}
                                        className="p-5 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group"
                                    >
                                        <div className="flex gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 
                                                ${alert.type === 'positive' ? 'bg-emerald-100 text-emerald-600' : alert.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                                <TrendingUp size={22} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{alert.crop} Impact</h4>
                                                <p className="text-sm text-slate-600 font-medium mt-1">{alert.msg}</p>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2 block">{alert.time}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                <button className="w-full py-4 mt-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-emerald-500 hover:text-emerald-500 transition-all">
                                    + Create New Alert
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MarketPriceTracker;
