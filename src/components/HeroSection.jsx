import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle2, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-[#F0FDF4]">
      {/* Background with Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#16A34A] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#38BDF8] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6 bg-[#16A34A]/10 border border-[#16A34A]/20 w-fit px-4 py-1.5 rounded-full">
              <Zap size={14} className="text-[#16A34A] fill-[#16A34A]" />
              <span className="text-[#16A34A] text-xs font-black uppercase tracking-widest">Next-Gen Agriculture</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-[#1F2937] font-['Outfit'] leading-[1.1] mb-6 tracking-tight">
              Smart Farming <br />
              <span className="text-[#16A34A] relative">
                Powered by AI
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9C118.5 3 239.5 3 355 9" stroke="#FACC15" strokeWidth="6" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 font-medium mb-10 max-w-xl leading-relaxed">
              Unlock the full potential of your land with AI-driven insights. Predict the best crops, analyze soil health, and monitor weather patterns in real-time to maximize your harvest efficiency.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(22, 163, 74, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-[#16A34A] text-white font-black rounded-2xl flex items-center gap-3 shadow-lg shadow-[#16A34A]/20 hover:bg-[#15803d] transition-all text-lg"
              >
                Get Started <ArrowRight size={20} />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-[#1F2937] font-bold rounded-2xl flex items-center gap-3 border border-slate-200 hover:border-[#16A34A] hover:bg-[#F0FDF4] transition-all text-lg shadow-sm"
              >
                Explore Features
              </motion.button>
            </div>

            <div className="mt-16 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=farm${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-[#FACC15] border-2 border-white flex items-center justify-center text-[10px] font-black text-[#1F2937]">
                  +2.5K
                </div>
              </div>
              <p className="text-slate-500 text-sm font-semibold">
                Joined by <span className="text-[#1F2937] font-bold">2,500+ professionals</span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="file:///C:/Users/Gnaneswar/.gemini/antigravity/brain/a22cf073-ef5e-4fae-8774-9dbd3e3811af/agriculture_technology_features_1773341976835.png" 
                alt="AI Agriculture" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#16A34A]/20 to-transparent"></div>
            </div>

            {/* Floatings Cards */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 z-20 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#F0FDF4] rounded-2xl flex items-center justify-center text-[#16A34A]">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yield Increase</p>
                  <p className="text-2xl font-black text-[#1F2937]">+32%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 z-20 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E0F2FE] rounded-2xl flex items-center justify-center text-[#0EA5E9]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Precision</p>
                  <p className="text-2xl font-black text-[#1F2937]">98.5%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
