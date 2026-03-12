import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ShieldAlert, CheckCircle2, RefreshCcw, AlertCircle, Info, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

import api from '../../services/api';

const DiseaseDetection = () => {
    const { t } = useLanguage();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("File size too large. Please upload an image under 5MB.");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const data = await api.upload('/detect-disease', formData);
            setResult(data);
        } catch (err) {
            setError(err.message || "Failed to analyze image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-darkSlate font-['Outfit'] mb-2 flex items-center gap-3">
                    <ShieldAlert className="text-red-500" size={32} /> {t('diseaseTitle')}
                </h1>
                <p className="text-slate-500 font-medium max-w-2xl">
                    {t('diseaseDesc')}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden"
                    >
                        {/* Glassmorphism Background Decoration */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>

                        {!previewUrl ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative z-10 border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                                    <Camera size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2 font-['Outfit']">{t('awaitingUpload')}</h3>
                                <p className="text-slate-500 font-medium mb-6">PNG, JPG or WEBP (Max. 5MB)</p>
                                <button className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                                    {t('uploadPhoto')}
                                </button>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <div className="relative group rounded-2xl overflow-hidden mb-6 border border-slate-200 bg-slate-50 shadow-inner min-h-[300px] flex items-center justify-center">
                                    <img src={previewUrl} alt="Preview" className="w-full max-h-[400px] object-contain mx-auto transition-transform group-hover:scale-[1.02] duration-500" />

                                    {/* Premium Scanning Line Animation */}
                                    <AnimatePresence>
                                        {loading && (
                                            <motion.div
                                                initial={{ top: 0 }}
                                                animate={{ top: "100%" }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent z-10 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                                            />
                                        )}
                                    </AnimatePresence>

                                    {!loading && !result && (
                                        <button
                                            onClick={reset}
                                            className="absolute top-4 right-4 p-2 bg-white/90 text-slate-600 rounded-xl hover:bg-white hover:text-red-500 shadow-lg backdrop-blur-sm transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl mb-6 font-medium text-sm border border-red-100">
                                        <AlertCircle size={18} /> {error}
                                    </div>
                                )}

                                {!result ? (
                                    <button
                                        onClick={handleUpload}
                                        disabled={loading}
                                        className={`w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                                    >
                                        {loading ? (
                                            <>
                                                <RefreshCcw size={20} className="animate-spin" />
                                                {t('analyzingDisease')}
                                            </>
                                        ) : (
                                            <>{t('uploadPhoto')} <CheckCircle2 size={20} /></>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={reset}
                                        className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                                    >
                                        <RefreshCcw size={20} /> {t('scanAnother')}
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-12 xl:col-span-5 h-full">
                    <AnimatePresence mode="wait">
                        {loading && (
                            <motion.div
                                key="loading-state"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="h-full min-h-[500px] bg-white rounded-3xl border border-slate-100 p-8 flex flex-col items-center justify-center shadow-lg relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-emerald-50/30"></div>
                                <div className="relative z-10 w-32 h-32 mb-8">
                                    <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-25"></div>
                                    <div className="w-full h-full bg-white rounded-full border-4 border-emerald-500 flex items-center justify-center shadow-xl">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        >
                                            <ShieldAlert size={48} className="text-emerald-500" />
                                        </motion.div>
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-darkSlate mb-4 font-['Outfit']">{t('analyzingDisease')}</h3>
                                <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4 shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="h-full bg-emerald-500"
                                    ></motion.div>
                                </div>
                                <p className="text-slate-500 font-medium text-center max-w-[250px]">{t('aiScanning')}</p>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                key="result-state"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="h-full bg-white rounded-3xl border border-slate-100 shadow-xl flex flex-col overflow-hidden"
                            >
                                <div className={`px-8 py-6 flex justify-between items-center ${result.severity === 'High' ? 'bg-red-600' : 'bg-emerald-600'}`}>
                                    <h3 className="text-white font-bold text-lg font-['Outfit'] flex items-center gap-2">
                                        <CheckCircle2 size={22} /> {t('diagnosis')}
                                    </h3>
                                    <span className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm">
                                        {result.confidence}% {t('confidence')}
                                    </span>
                                </div>

                                <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-white to-slate-50/50">
                                    <div className="text-center pb-6 border-b border-slate-100">
                                        <p className="text-slate-500 font-bold mb-1 uppercase tracking-widest text-[10px]">{t('diagnosis')}</p>
                                        <h2 className={`text-3xl font-black font-['Outfit'] ${result.severity === 'High' ? 'text-red-600' : 'text-emerald-700'}`}>
                                            {result.disease_name}
                                        </h2>
                                        <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${result.severity === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                            <AlertCircle size={14} /> {t('riskLevel')}: {result.severity}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0 flex items-center justify-center">
                                                <Info size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm mb-1">{t('diagnosis')}</h4>
                                                <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0 flex items-center justify-center">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm mb-2">{t('prevention')}</h4>
                                                <ul className="space-y-2">
                                                    {result.prevention_tips.map((tip, i) => (
                                                        <li key={i} className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div> {tip}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex-shrink-0 flex items-center justify-center">
                                                <RefreshCcw size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm mb-1">{t('treatment')}</h4>
                                                <p className="text-xs text-slate-600 leading-relaxed font-medium">{result.treatment}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {!loading && !result && (
                            <motion.div
                                key="empty-state"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center bg-slate-50/50"
                            >
                                <div className="w-24 h-24 bg-white rounded-3xl border border-slate-100 flex items-center justify-center mb-8 shadow-sm group hover:scale-105 transition-transform duration-500">
                                    <Upload size={40} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-400 mb-4 font-['Outfit']">{t('diagnosis')}</h3>
                                <p className="text-slate-500 font-medium max-w-[280px]">{t('awaitingUploadDesc')}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DiseaseDetection;
