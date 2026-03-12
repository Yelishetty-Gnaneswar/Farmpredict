import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Home, Leaf, Cloud, Activity } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // TODO: clear session
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        FP
                    </div>
                    <span className="text-xl font-bold font-['Outfit'] text-darkSlate">Farm Predict</span>
                </div>
                <div className="p-4 flex-grow">
                    <nav className="space-y-2">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg font-semibold">
                            <Home size={20} /> Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
                            <Leaf size={20} /> Crop Suggestions
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
                            <Cloud size={20} /> Weather Info
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
                            <Activity size={20} /> Disease Logs
                        </a>
                    </nav>
                </div>
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors"
                    >
                        <LogOut size={20} /> Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8 ml-64">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-darkSlate font-['Outfit']">Welcome Dashboard</h1>
                    <p className="text-slate-500 font-medium">Hello there! Here's your farm's overview.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-slate-500 font-medium mb-1">Upcoming Weather</h3>
                        <p className="text-2xl font-bold text-darkSlate">Sunny, 28°C</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-slate-500 font-medium mb-1">Recommended Action</h3>
                        <p className="text-2xl font-bold text-darkSlate">Water Crops</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-slate-500 font-medium mb-1">Current Soil Moisture</h3>
                        <p className="text-2xl font-bold text-emerald-600">45% (Optimal)</p>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
