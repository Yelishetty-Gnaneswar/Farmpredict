import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Leaf, Mail, Phone, MapPin, ArrowRight, Globe, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#1F2937] pt-24 pb-12 overflow-hidden relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#16A34A]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#38BDF8]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-[#16A34A] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#16A34A]/20">
                                <Leaf size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-white font-['Outfit'] tracking-tighter">Farm <span className="text-[#16A34A]">Predict</span></h2>
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed mb-10 max-w-sm">
                            Transforming agriculture through artificial intelligence and real-time field data. Empowering millions of farmers to grow more with less.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Facebook, Instagram, Youtube, Github].map((Icon, idx) => (
                                <button key={idx} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#16A34A] hover:text-white transition-all hover:-translate-y-1">
                                    <Icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Groups */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Platform</h4>
                        <ul className="space-y-4">
                            {['Crop Recommendation', 'Yield Prediction', 'Soil Health', 'Market Insights'].map(item => (
                                <li key={item}>
                                    <Link to="#" className="text-slate-400 font-bold hover:text-[#16A34A] transition-colors text-sm">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="lg:col-span-2">
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Resources</h4>
                        <ul className="space-y-4">
                            {['Documentation', 'Community', 'Govt Schemes', 'Support'].map(item => (
                                <li key={item}>
                                    <Link to="#" className="text-slate-400 font-bold hover:text-[#16A34A] transition-colors text-sm">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div className="lg:col-span-4">
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Stay Updated</h4>
                        <p className="text-slate-400 text-sm mb-6 font-medium">Get the latest agricultural insights and platform updates.</p>
                        <div className="relative mb-8">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition-all font-medium"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-[#16A34A] text-white px-4 rounded-xl font-bold flex items-center gap-2 hover:bg-[#15803d] transition-all">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                            <Globe size={18} className="text-[#16A34A]" /> English (Global)
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm font-medium">
                        © {new Date().getFullYear()} Farm Predict AI. All rights reserved.
                    </p>
                    <div className="flex gap-8">
                        <Link to="#" className="text-slate-500 text-sm font-bold hover:text-[#16A34A] transition-colors">Privacy Policy</Link>
                        <Link to="#" className="text-slate-500 text-sm font-bold hover:text-[#16A34A] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
