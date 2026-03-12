import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Droplets, Thermometer, FlaskConical, Wind, ArrowRight, CheckCircle2, AlertTriangle, CloudSun, TrendingUp, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

import api from '../../services/api';

const InputField = ({ label, name, type = 'number', icon: Icon, value, onChange, placeholder, step = '1' }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-emerald-500" />
            </div>
            <input
                type={type}
                name={name}
                step={step}
                required
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-slate-700 placeholder-slate-400 shadow-sm"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
);

const CropRecommendation = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        ph: '',
        temperature: '',
        humidity: '',
        rainfall: ''
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await api.post('/predict-crop', {
                nitrogen: parseInt(formData.nitrogen),
                phosphorus: parseInt(formData.phosphorus),
                potassium: parseInt(formData.potassium),
                ph: parseFloat(formData.ph),
                temperature: parseFloat(formData.temperature),
                humidity: parseFloat(formData.humidity),
                rainfall: parseFloat(formData.rainfall),
            });

            setResult(data);
        } catch (err) {
            setError(err.message || "Prediction failed. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12 transition-all duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-darkSlate font-['Outfit'] mb-2">{t('cropRec')}</h1>
                <p className="text-slate-500 font-medium">Enter field parameters for AI-powered suggestions.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Form */}
                <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full z-0 opacity-50"></div>

                    <form onSubmit={handlePredict} className="relative z-10 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-darkSlate mb-4 flex items-center gap-2">
                                <FlaskConical size={20} className="text-emerald-500" /> {t('soilParams')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label={t('nitrogen')} name="nitrogen" placeholder="Ratio of N" value={formData.nitrogen} onChange={handleChange} icon={FlaskConical} />
                                <InputField label={t('phosphorus')} name="phosphorus" placeholder="Ratio of P" value={formData.phosphorus} onChange={handleChange} icon={FlaskConical} />
                                <InputField label={t('potassium')} name="potassium" placeholder="Ratio of K" value={formData.potassium} onChange={handleChange} icon={FlaskConical} />
                                <InputField label={t('ph')} name="ph" placeholder="e.g., 6.5" step="0.1" value={formData.ph} onChange={handleChange} icon={FlaskConical} />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100"></div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-darkSlate mb-4 flex items-center gap-2">
                                <CloudSun size={20} className="text-emerald-500" /> {t('weatherEnv')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label={t('temp')} name="temperature" placeholder="e.g., 28.5" step="0.1" value={formData.temperature} onChange={handleChange} icon={Thermometer} />
                                <InputField label={t('humidity')} name="humidity" placeholder="e.g., 82" step="0.1" value={formData.humidity} onChange={handleChange} icon={Wind} />
                                <InputField label={t('rainfall')} name="rainfall" placeholder="e.g., 202.9" step="0.1" value={formData.rainfall} onChange={handleChange} icon={Droplets} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all transform active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('analyzing')}
                                </span>
                            ) : (
                                <>{t('predictCrop')} <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>
                </div>

                {/* Results View */}
                <div className="lg:col-span-5 relative">
                    <AnimatePresence mode="wait">
                        {!result && !loading && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="h-full min-h-[400px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="w-20 h-20 bg-emerald-100/50 rounded-full flex items-center justify-center mb-6">
                                    <Leaf size={40} className="text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-400 mb-2 font-['Outfit']">{t('awaitingParams')}</h3>
                                <p className="text-slate-500 font-medium">{t('awaitingDesc')}</p>
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                                className="h-full min-h-[400px] bg-white rounded-3xl border border-slate-100 p-8 flex flex-col items-center justify-center shadow-lg relative overflow-hidden"
                            >
                                <div className="absolute inset-x-0 top-0 h-1 bg-slate-100 overflow-hidden">
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="h-full w-1/3 bg-emerald-500"
                                    />
                                </div>
                                <div className="relative w-32 h-32 mb-8">
                                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
                                    <div className="relative z-10 w-full h-full bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-500">
                                        <Leaf size={48} className="text-emerald-500 animate-bounce" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-darkSlate mb-2 font-['Outfit'] text-center">AI Intelligence at Work</h3>
                                <p className="text-slate-500 text-center font-medium max-w-[240px]">Scanning 20+ years of regional agricultural data...</p>
                            </motion.div>
                        )}

                        {result && !loading && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="bg-gradient-to-b from-white to-emerald-50/30 rounded-3xl border border-emerald-100 p-1 shadow-2xl overflow-hidden h-full"
                            >
                                <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                                    <h3 className="text-white font-bold text-lg font-['Outfit'] flex items-center gap-2">
                                        <CheckCircle2 size={20} /> {t('analysisComplete')}
                                    </h3>
                                    <span className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm">
                                        {result.confidence}% {t('confidence')}
                                    </span>
                                </div>

                                <div className="p-8 pb-10">
                                    <div className="text-center mb-8">
                                        <p className="text-slate-500 font-semibold mb-2 uppercase tracking-wider text-xs">Recommended Crop</p>
                                        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500 font-['Outfit'] capitalize">
                                            {result.crop}
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-colors">
                                            <div className="mt-1 bg-blue-50 p-2 rounded-lg text-blue-600"><CloudSun size={20} /></div>
                                            <div>
                                                <h4 className="font-bold text-darkSlate text-sm mb-0.5">{t('suitableCond')}</h4>
                                                <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.suitable_conditions}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-colors">
                                            <div className="mt-1 bg-amber-50 p-2 rounded-lg text-amber-600"><FlaskConical size={20} /></div>
                                            <div>
                                                <h4 className="font-bold text-darkSlate text-sm mb-0.5">{t('fertilizerTips')}</h4>
                                                <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.fertilizer_tips}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-colors">
                                            <div className="mt-1 bg-purple-50 p-2 rounded-lg text-purple-600"><TrendingUp size={20} /></div>
                                            <div>
                                                <h4 className="font-bold text-darkSlate text-sm mb-0.5">{t('estimatedYield')}</h4>
                                                <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.estimated_yield}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setResult(null)}
                                        className="w-full mt-8 py-4 bg-white border border-emerald-200 text-emerald-600 font-bold rounded-2xl hover:bg-emerald-50 hover:border-emerald-300 transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                                        {t('runNew')}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CropRecommendation;
