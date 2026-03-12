import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Search, Filter, Bookmark, CheckCircle2, HelpCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const schemes = [
    {
        id: 1,
        name: "PM-Kisan Samman Nidhi",
        provider: "Government of India",
        benefit: "₹6,000 per year in 3 installments",
        eligibility: "Small and marginal farmers with up to 2 hectares of land.",
        description: "A central sector scheme to provide income support to all landholding farmers' families in the country to supplement their financial needs.",
        category: "Income Support",
        status: "Active"
    },
    {
        id: 2,
        name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        provider: "Ministry of Agriculture",
        benefit: "Financial support to farmers suffering crop loss/damage",
        eligibility: "All farmers including sharecroppers and tenant farmers.",
        description: "A government-sponsored crop insurance scheme that integrates multiple stakeholders on a single platform.",
        category: "Insurance",
        status: "Active"
    },
    {
        id: 3,
        name: "Soil Health Card Scheme",
        provider: "Dept. of Agriculture",
        benefit: "Free soil testing and nutrient recommendations",
        eligibility: "All farmers are eligible once every 2 years.",
        description: "Provides information to farmers on the nutrient status of their soil along with recommendations on appropriate dosage of nutrients.",
        category: "Soil Health",
        status: "Active"
    },
    {
        id: 4,
        name: "Kisan Credit Card (KCC)",
        provider: "NABARD / RBI",
        benefit: "Easy access to short-term credit with low interest",
        eligibility: "Cultivators, tenant farmers, and oral lessees.",
        description: "Provides adequate and timely credit support from the banking system under a single window with flexible and simplified procedure.",
        category: "Credit",
        status: "Active"
    }
];

const schemeLinks = {
    "PM-Kisan Samman Nidhi": "https://pmkisan.gov.in/",
    "Pradhan Mantri Fasal Bima Yojana (PMFBY)": "https://pmfby.gov.in/",
    "Soil Health Card Scheme": "https://soilhealth.dac.gov.in/",
    "Kisan Credit Card (KCC)": "https://www.myscheme.gov.in/schemes/kcc",
    "eNAM Market Portal": "https://www.enam.gov.in/web/"
};

const GovtSchemes = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Income Support', 'Insurance', 'Soil Health', 'Credit'];

    const filteredSchemes = schemes.filter(scheme => {
        const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-darkSlate font-['Outfit'] mb-2 flex items-center gap-3">
                    <Landmark className="text-blue-600" size={32} /> {t('schemesTitle')}
                </h1>
                <p className="text-slate-500 font-medium max-w-2xl">
                    {t('schemesDesc')}
                </p>
            </header>

            {/* Search & Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="md:col-span-3 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('searchSchemes')}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Filter className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium appearance-none"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'All' ? t('allCategories') : cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Schemes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSchemes.map((scheme, idx) => (
                    <motion.div
                        key={scheme.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                                <Bookmark size={20} />
                            </button>
                        </div>

                        <div className="flex items-start gap-5 mb-6">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Landmark size={28} />
                            </div>
                            <div>
                                <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md uppercase tracking-wider mb-2">
                                    {scheme.category}
                                </span>
                                <h3 className="text-xl font-bold text-darkSlate font-['Outfit'] group-hover:text-blue-600 transition-colors">
                                    {scheme.name}
                                </h3>
                                <p className="text-xs text-slate-400 font-bold">{scheme.provider}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                    <span className="text-xs font-bold text-slate-500">{t('keyBenefit')}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-700">{scheme.benefit}</p>
                            </div>
                            <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
                                <div className="flex items-center gap-2 mb-1">
                                    <HelpCircle size={16} className="text-blue-500" />
                                    <span className="text-xs font-bold text-blue-500">{t('eligibility')}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 line-clamp-2">{scheme.eligibility}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{t('activeStatus') || 'Active'}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => window.open(schemeLinks[scheme.name] || 'https://www.india.gov.in/my-government/schemes', '_blank')}
                                    className="flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors"
                                >
                                    {t('viewDetails') || 'Details'} <ExternalLink size={16} />
                                </button>
                                <button 
                                    onClick={() => window.open(schemeLinks[scheme.name] || 'https://www.india.gov.in/my-government/schemes', '_blank')}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                    {t('applyNow') || 'Apply Now'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredSchemes.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400">{t('noSchemes')}</h3>
                    <p className="text-slate-500 font-medium">{t('adjustSearch')}</p>
                </div>
            )}
        </div>
    );
};

export default GovtSchemes;
