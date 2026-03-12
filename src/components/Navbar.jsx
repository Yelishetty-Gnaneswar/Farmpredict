import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Menu, X, Globe, ArrowRight, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}>
            <nav className={`container mx-auto px-6 md:px-12`}>
                <div className={`flex items-center justify-between p-4 rounded-[32px] transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-2xl shadow-[#16A34A]/5 border border-white/50' : 'bg-transparent'}`}>
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#16A34A] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#16A34A]/20 group-hover:rotate-6 transition-transform">
                            <Leaf size={24} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black font-['Outfit'] tracking-tighter text-[#1F2937]">
                            Farm <span className="text-[#16A34A]">Predict</span>
                        </h1>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-10">
                        {['Features', 'Analytics', 'Govt Schemes', 'Support'].map((item) => (
                            <a 
                                key={item} 
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-[#16A34A] transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        {isAuthenticated ? (
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-3 pl-2 pr-6 py-2 bg-[#1F2937] text-white rounded-full font-bold hover:bg-slate-800 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center overflow-hidden">
                                     {user?.profile_image ? (
                                        <img src={user.profile_image} alt="profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={16} />
                                    )}
                                </div>
                                <span className="text-sm">Dashboard</span>
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="px-6 py-3 text-slate-600 font-black text-sm uppercase tracking-widest hover:text-[#16A34A] transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-8 py-3 bg-[#16A34A] text-white font-black rounded-2xl shadow-lg shadow-[#16A34A]/20 hover:bg-[#15803d] transition-all uppercase tracking-widest text-sm">
                                    Get Started
                                </Link>
                            </>
                        )}
                        <button className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-[#F0FDF4] hover:text-[#16A34A] transition-all">
                            <Globe size={20} />
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-3 bg-slate-100 text-slate-600 rounded-2xl transition-colors hover:bg-[#F0FDF4] hover:text-[#16A34A]"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-28 left-6 right-6 bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 z-40"
                    >
                        <div className="flex flex-col gap-6">
                            {['Features', 'Analytics', 'Govt Schemes', 'Support'].map((item) => (
                                <a 
                                    key={item} 
                                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-xl font-black text-[#1F2937] font-['Outfit'] flex items-center justify-between group"
                                >
                                    {item} <ArrowRight size={20} className="text-[#16A34A] opacity-0 group-hover:opacity-100 transition-all" />
                                </a>
                            ))}
                            <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                                <Link to="/login" className="w-full py-4 bg-slate-100 text-[#1F2937] font-black rounded-2xl text-center">Login</Link>
                                <Link to="/register" className="w-full py-4 bg-[#16A34A] text-white font-black rounded-2xl text-center">Get Started</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
