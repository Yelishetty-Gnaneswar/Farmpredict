import { motion } from 'framer-motion';
import { Leaf, TestTube2, CloudSun, TrendingUp, ShieldAlert, LineChart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: Leaf,
    title: "Crop Recommendation",
    desc: "AI-driven analysis to recommend the perfect crops based on your soil profile and climate.",
    color: "#16A34A",
    delay: 0.1,
    path: "/predict"
  },
  {
    icon: TestTube2,
    title: "Soil Health Analysis",
    desc: "Understand your soil's nutrient composition with deep-learning based diagnostic tools.",
    color: "#22C55E",
    delay: 0.2,
    path: "/predict" // redirected to same for now or a dedicated one if exists
  },
  {
    icon: CloudSun,
    title: "Weather Insights",
    desc: "Hyper-local weather forecasting with specialized agricultural impact alerts.",
    color: "#38BDF8",
    delay: 0.3,
    path: "/weather-insights"
  },
  {
    icon: TrendingUp,
    title: "Yield Prediction",
    desc: "Predict your harvest quantity and quality using historical data and AI modeling.",
    color: "#FACC15",
    delay: 0.4,
    path: "/yield-prediction"
  },
  {
    icon: ShieldAlert,
    title: "Disease Detection",
    desc: "Scan crop photos to instantly identify pests and diseases before they spread.",
    color: "#EF4444",
    delay: 0.5,
    path: "/disease-detection"
  },
  {
    icon: LineChart,
    title: "Market Insights",
    desc: "Stay ahead with real-time mandi prices and demand forecasting for your produce.",
    color: "#6366F1",
    delay: 0.6,
    path: "/market-insights"
  }
];

const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F0FDF4] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E0F2FE] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-70"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[#16A34A] font-black uppercase tracking-[0.2em] text-sm mb-4">The AI Ecosystem</h2>
            <h3 className="text-4xl md:text-5xl font-black text-[#1F2937] font-['Outfit'] mb-6 tracking-tight">
              Powerful Tools for <span className="text-[#16A34A]">Precision Agriculture</span>.
            </h3>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
              Everything you need to optimize your farming lifecycle—from seed selection to market sale—integrated into one intelligent platform.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(feature.path)}
              className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-[#16A34A]/20 transition-all hover:shadow-2xl hover:shadow-[#16A34A]/5 cursor-pointer"
            >
              <div 
                className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg text-white"
                style={{ backgroundColor: feature.color, boxShadow: `0 10px 15px -3px ${feature.color}33` }}
              >
                <feature.icon size={28} />
              </div>
              <h4 className="text-2xl font-black text-[#1F2937] font-['Outfit'] mb-4 group-hover:text-[#16A34A] transition-colors tracking-tight">{feature.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                {feature.desc}
              </p>
              <button 
                className="flex items-center gap-2 text-slate-400 font-bold text-sm uppercase tracking-widest group-hover:text-[#16A34A] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(feature.path);
                }}
              >
                Learn More <ChevronRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
