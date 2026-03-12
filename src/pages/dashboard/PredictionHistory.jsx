import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { History, Search, Calendar, Leaf, ArrowRight, Info, Filter, Database, X, Printer, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const PredictionHistory = () => {
    const { t } = useLanguage();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await api.get('/history');
                if (Array.isArray(data)) {
                    setHistory(data);
                }
            } catch (err) {
                // api already handles toast
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const filteredHistory = history.filter(item =>
        item.predicted_crop.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-darkSlate font-['Outfit'] mb-2">{t('analysisHistory')}</h1>
                    <p className="text-slate-500 font-medium">{t('historyDesc')}</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder={t('searchCrop')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium shadow-sm"
                    />
                </div>
            </header>

            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center print:hidden">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-bold">Retrieving records...</p>
                </div>
            ) : filteredHistory.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 print:hidden">
                    {filteredHistory.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 font-['Outfit'] font-black text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    {item.predicted_crop[0]}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-800 font-['Outfit'] capitalize">{item.predicted_crop}</h4>
                                            <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-1">
                                                <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black">
                                            {item.confidence}% {t('confidence')}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
                                        <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Nitrogen</p>
                                            <p className="text-sm font-bold text-slate-700">{item.nitrogen}</p>
                                        </div>
                                        <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Phosphorus</p>
                                            <p className="text-sm font-bold text-slate-700">{item.phosphorus}</p>
                                        </div>
                                        <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Potassium</p>
                                            <p className="text-sm font-bold text-slate-700">{item.potassium}</p>
                                        </div>
                                        <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">pH</p>
                                            <p className="text-sm font-bold text-slate-700">{item.ph}</p>
                                        </div>
                                        <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Temp</p>
                                            <p className="text-sm font-bold text-slate-700">{item.temperature}°C</p>
                                        </div>
                                        <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Humidity</p>
                                            <p className="text-sm font-bold text-slate-700">{item.humidity}%</p>
                                        </div>
                                        <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Rainfall</p>
                                            <p className="text-sm font-bold text-slate-700">{item.rainfall}mm</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedReport(item)}
                                    className="w-full lg:w-fit py-3 px-6 bg-slate-50 text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center justify-center gap-2"
                                >
                                    {t('viewReport')} <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-center print:hidden">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Database size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-400 mb-2 font-['Outfit']">No History Found</h3>
                    <p className="text-slate-500 font-medium max-w-[320px]">
                        {searchTerm ? `No predictions matching "${searchTerm}" found in your records.` : "You haven't performed any crop predictions yet."}
                    </p>
                </div>
            )}

            {/* Premium Report Modal */}
            <AnimatePresence>
                {selectedReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white print:static print:block"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative flex flex-col print:max-h-none print:shadow-none print:rounded-none print:w-full"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-4 border-b border-slate-100 flex justify-between items-center z-20 print:hidden">
                                <h3 className="text-xl font-bold text-darkSlate font-['Outfit']">{t('viewReport')}</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrint}
                                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-2 font-bold text-sm"
                                    >
                                        <Download size={18} /> {t('downloadReport')}
                                    </button>
                                    <button
                                        onClick={() => setSelectedReport(null)}
                                        className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Report Content */}
                            <div id="printable-report" className="p-12 print:p-8">
                                <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">FP</div>
                                            <span className="text-xl font-black text-darkSlate tracking-tight">FARM PREDICT AI</span>
                                        </div>
                                        <h1 className="text-3xl font-black text-slate-800 font-['Outfit'] mb-1">{t('reportTitle')}</h1>
                                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">{t('farmPredictAI')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-400 uppercase mb-1">Report ID</p>
                                        <p className="text-sm font-mono font-bold text-slate-700 mb-4">#PRD-{selectedReport.id.toString().padStart(5, '0')}</p>
                                        <p className="text-xs font-black text-slate-400 uppercase mb-1">Date Generated</p>
                                        <p className="text-sm font-bold text-slate-700">{new Date(selectedReport.created_at).toLocaleDateString()} {new Date(selectedReport.created_at).toLocaleTimeString()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                                            <p className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-2">Recommendation Result</p>
                                            <h2 className="text-5xl font-black text-emerald-800 font-['Outfit'] capitalize mb-4">{selectedReport.predicted_crop}</h2>
                                            <div className="flex items-center gap-3">
                                                <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-emerald-200 flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                    <span className="text-sm font-black text-slate-700">{selectedReport.confidence}% Match Level</span>
                                                </div>
                                                <span className="text-emerald-700/80 font-medium text-sm">Optimal planting choice detected.</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                <h4 className="text-xs font-black text-slate-400 uppercase mb-3 tracking-widest">Soil Parameters</h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                                                        <span className="text-sm font-bold text-slate-500">Nitrogen</span>
                                                        <span className="text-sm font-black text-slate-800">{selectedReport.nitrogen}</span>
                                                    </div>
                                                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                                                        <span className="text-sm font-bold text-slate-500">Phosphorus</span>
                                                        <span className="text-sm font-black text-slate-800">{selectedReport.phosphorus}</span>
                                                    </div>
                                                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                                                        <span className="text-sm font-bold text-slate-500">Potassium</span>
                                                        <span className="text-sm font-black text-slate-800">{selectedReport.potassium}</span>
                                                    </div>
                                                    <div className="flex justify-between py-1">
                                                        <span className="text-sm font-bold text-slate-500">Soil pH</span>
                                                        <span className="text-sm font-black text-slate-800">{selectedReport.ph}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                <h4 className="text-xs font-black text-slate-400 uppercase mb-3 tracking-widest">Climate Parameters</h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                                                        <span className="text-sm font-bold text-slate-500">Temperature</span>
                                                        <span className="text-sm font-black text-slate-800">{selectedReport.temperature}°C</span>
                                                    </div>
                                                    <div className="flex justify-between py-1 border-b border-slate-200/50">
                                                        <span className="text-sm font-bold text-slate-500">Humidity</span>
                                                        <span className="text-sm font-black text-slate-800">{selectedReport.humidity}%</span>
                                                    </div>
                                                    <div className="flex justify-between py-1">
                                                        <span className="text-sm font-bold text-slate-500">Rainfall</span>
                                                        <span className="text-sm font-black text-slate-800">{selectedReport.rainfall}mm</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10">
                                            <Info size={120} />
                                        </div>
                                        <h3 className="text-xl font-bold font-['Outfit'] mb-6 relative z-10">AI Insights</h3>
                                        <div className="space-y-6 relative z-10">
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">1</div>
                                                <p className="text-sm font-medium leading-relaxed">The soil nitrogen levels are ideal for {selectedReport.predicted_crop}. No additional urea required for the first 30 days.</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">2</div>
                                                <p className="text-sm font-medium leading-relaxed">Expected humidity of {selectedReport.humidity}% is perfect for seedling growth in this region.</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">3</div>
                                                <p className="text-sm font-medium leading-relaxed">Ensure a secondary drainage system if rainfall exceeds {Math.round(selectedReport.rainfall * 1.2)}mm in the next 15 days.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-8 flex justify-between items-center opacity-50">
                                    <p className="text-xs font-bold text-slate-400">© 2024 Farm Predict AI Intelligence System. All Rights Reserved.</p>
                                    <p className="text-xs font-medium text-slate-400 italic">This is an automated AI report. Verify with local agricultural experts for critical decisions.</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PredictionHistory;
