import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.forgotPassword(email);
            setSubmitted(true);
            toast.success('Reset link sent to your email');
        } catch (err) {
            // Error handled by api service
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-lightGray relative overflow-hidden flex items-center justify-center p-4">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <Link to="/login" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors mb-6 group">
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                    Back to Login
                </Link>

                <div className="glass-card p-8">
                    {!submitted ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-darkSlate mb-2 font-['Outfit']">Forgot Password?</h2>
                                <p className="text-slate-500 font-medium">No worries, we'll send you reset instructions.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder-slate-400"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all transform active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Sending...' : <>Send Reset Link <Send size={20} /></>}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Send size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-darkSlate mb-4">Check your email</h2>
                            <p className="text-slate-500 font-medium mb-8">
                                We have sent a password recovery link to <span className="text-slate-900 font-bold">{email}</span>
                            </p>
                            <button 
                                onClick={() => setSubmitted(false)}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Didn't receive the email? Click to retry
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
