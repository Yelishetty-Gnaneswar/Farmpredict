import { motion } from 'framer-motion';
import { ExternalLink, Landmark, Globe, FileCheck, ShieldCheck, HeartPulse } from 'lucide-react';

const schemas = [
  {
    title: "PM-KISAN",
    desc: "Income support of ₹6,000 per year in three installments to all land-holding farmer families.",
    link: "https://pmkisan.gov.in/",
    icon: Landmark
  },
  {
    title: "Soil Health Card",
    desc: "Understanding nutrient status of your soil along with recommendation on appropriate dosage of fertilizers.",
    link: "https://soilhealth.dac.gov.in/",
    icon: FileCheck
  },
  {
    title: "PM Fasal Bima Yojana",
    desc: "Financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
    link: "https://pmfby.gov.in/",
    icon: ShieldCheck
  }
];

const GovIntegrationSection = () => {
    return (
        <section className="py-24 bg-white overflow-hidden relative">
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="bg-[#F0FDF4] rounded-[3rem] p-12 lg:p-20 overflow-hidden relative border border-[#16A34A]/10">
                    
                    {/* Animated background glow */}
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute top-0 right-0 w-96 h-96 bg-[#16A34A] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
                    />

                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-[#16A34A] font-black uppercase tracking-[0.2em] text-sm mb-6">Unified Governance</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-[#1F2937] font-['Outfit'] mb-8 tracking-tight leading-[1.1]">
                            Official <span className="text-[#16A34A]">Government Support</span> Integration.
                        </h3>
                        <p className="text-slate-600 font-medium text-lg leading-relaxed">
                            Farm Predict seamlessly connects you with major national agricultural schemes to ensure you never miss out on financial or technical support.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {schemas.map((schema, idx) => (
                            <motion.div 
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 bg-[#F0FDF4] rounded-2xl flex items-center justify-center text-[#16A34A] mb-6">
                                    <schema.icon size={28} />
                                </div>
                                <h4 className="text-2xl font-black text-[#1F2937] font-['Outfit'] mb-4 tracking-tight">{schema.title}</h4>
                                <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
                                    {schema.desc}
                                </p>
                                <a 
                                    href={schema.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto w-full py-4 bg-white border border-slate-200 text-[#1F2937] font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-[#16A34A] hover:text-white hover:border-[#16A34A] transition-all group"
                                >
                                    Apply Now 
                                    <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GovIntegrationSection;
