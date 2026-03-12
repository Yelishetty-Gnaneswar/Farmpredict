import { motion } from 'framer-motion';
import { BarChart3, LineChart, PieChart, Activity, CheckCircle2, ArrowRight } from 'lucide-react';

const DataPreviewSection = () => {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 order-2 lg:order-1"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-500/10 rounded-[48px] blur-2xl"></div>
              <div className="relative bg-white p-4 rounded-[40px] shadow-2xl border border-white">
                <img 
                  src="file:///C:/Users/Gnaneswar/.gemini/antigravity/brain/a22cf073-ef5e-4fae-8774-9dbd3e3811af/ai_crop_prediction_ui_preview_1773342046736.png" 
                  alt="AI Prediction Preview" 
                  className="w-full h-auto rounded-[32px] shadow-sm"
                />
                
                {/* Floating stats card */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-10 -right-10 bg-slate-900 p-8 rounded-[32px] shadow-2xl w-72 text-white hidden md:block"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                      <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Real-time sync</p>
                      <h5 className="text-xl font-black font-['Outfit']">98.2% Accurate</h5>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Soil Moisture</span>
                      <span className="text-emerald-400 font-bold">Optimal</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[85%] rounded-full"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 order-1 lg:order-2"
          >
            <h2 className="text-emerald-500 font-black uppercase tracking-[0.2em] text-sm mb-4">Precision Intelligence</h2>
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 font-['Outfit'] mb-8 tracking-tight leading-[0.9]">
              Visualizing the <br /> <span className="text-emerald-500">Invisible</span> Details.
            </h3>
            
            <p className="text-slate-500 font-medium text-lg mb-10 leading-relaxed">
              Our advanced analytics engine processes thousands of environmental signals to give you a clear, visual breakdown of your farm's health.
            </p>

            <div className="space-y-6">
              {[
                { title: "Dynamic Yield Heatmaps", icon: BarChart3 },
                { title: "Localized Disease Trajectories", icon: LineChart },
                { title: "Soil Nutrient Distribution AI", icon: PieChart }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 p-4 rounded-3xl bg-white border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-lg shadow-sm group">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-tight">{item.title}</h4>
                    <p className="text-xs text-slate-400 font-bold">Updated every 15 minutes</p>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 size={24} className="text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-12 flex items-center gap-3 text-emerald-600 font-black text-lg uppercase tracking-widest hover:gap-5 transition-all">
              Explore Analytics <ArrowRight size={24} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DataPreviewSection;
