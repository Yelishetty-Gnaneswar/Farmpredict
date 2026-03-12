import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, MapPin, Phone, Shield, Bell, Settings, LogOut, Camera, Save, Loader2, X, Check, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

import api from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, token, logout, updateUserData } = useAuth();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        farm_size: '',
        primary_crops: '',
        enable_weather_alerts: true,
        enable_irrigation_alerts: true,
        enable_market_alerts: true,
        enable_weekly_tips: true
    });
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.get('/profile');
                setUserData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    location: data.location || '',
                    farm_size: data.farm_size || '',
                    primary_crops: data.primary_crops || '',
                    enable_weather_alerts: data.enable_weather_alerts ?? true,
                    enable_irrigation_alerts: data.enable_irrigation_alerts ?? true,
                    enable_market_alerts: data.enable_market_alerts ?? true,
                    enable_weekly_tips: data.enable_weekly_tips ?? true
                });
            } catch (err) {
                // api service handles toast
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        }
    }, [token]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Include profile_image in the update
            const updatePayload = {
                ...userData,
                profile_image: previewPhoto || user?.profile_image 
            };
            
            const data = await api.put('/profile', updatePayload);
            updateUserData(data);
            
            toast.success('Profile updated successfully!', {
                icon: '✅',
                style: {
                    borderRadius: '16px',
                    background: '#16A34A',
                    color: '#fff',
                    fontWeight: 'bold'
                },
            });
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSaving(false);
        }
    };
    
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Photo = reader.result;
                setPreviewPhoto(base64Photo);
                // Immediately update context for preview everywhere
                updateUserData({ ...user, profile_image: base64Photo });
                toast.success("Photo uploaded successfully!");
                setShowPhotoOptions(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        setCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            toast.error("Could not access camera");
            setCameraActive(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            
            const base64Photo = canvasRef.current.toDataURL('image/png');
            setPreviewPhoto(base64Photo);
            updateUserData({ ...user, profile_image: base64Photo });

            const stream = videoRef.current.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
            
            setCameraActive(false);
            setShowPhotoOptions(false);
            toast.success("Photo captured!");
        }
    };

    if (loading) return (
        <div className="h-64 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#16A34A] animate-spin mb-4" />
            <p className="text-slate-500 font-bold">Loading Profile...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-[#1F2937] font-['Outfit'] mb-2">Profile</h1>
                <p className="text-slate-500 font-medium">Manage your account information and agricultural preferences.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Profile Header Card */}
                <div className="md:col-span-12 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#38BDF8]"></div>
                    <div className="px-8 pb-8 relative">
                        <div className="flex flex-col md:flex-row gap-6 items-end -translate-y-12">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl">
                                    <div className="w-full h-full rounded-[20px] bg-slate-100 flex items-center justify-center overflow-hidden relative">
                                        {cameraActive ? (
                                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                                        ) : (
                                            <img 
                                                src={previewPhoto || user?.profile_image || `https://i.pravatar.cc/150?u=${userData.email}`} 
                                                alt="profile" 
                                                className="w-full h-full object-cover" 
                                            />
                                        )}
                                        <canvas ref={canvasRef} className="hidden" />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                                    className="absolute bottom-2 right-2 p-2 bg-[#16A34A] text-white rounded-xl shadow-lg hover:bg-[#15803d] transition-colors z-20"
                                >
                                    <Camera size={16} />
                                </button>

                                <AnimatePresence>
                                    {showPhotoOptions && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute left-full ml-4 bottom-0 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 min-w-[180px] z-30"
                                        >
                                            <div className="flex flex-col gap-1">
                                                {cameraActive ? (
                                                    <button 
                                                        onClick={capturePhoto}
                                                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#F0FDF4] text-[#16A34A] rounded-xl transition-colors font-bold text-sm"
                                                    >
                                                        <Check size={16} /> Capture Now
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={startCamera}
                                                        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors font-bold text-sm"
                                                    >
                                                        <Camera size={16} /> Take Photo
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors font-bold text-sm"
                                                >
                                                    <Upload size={16} /> Upload Photo
                                                </button>
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef} 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                    onChange={handlePhotoUpload}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="translate-y-6 md:mb-6">
                                <h2 className="text-3xl font-black text-[#1F2937] font-['Outfit']">{userData.name}</h2>
                                <p className="text-slate-500 font-bold flex items-center gap-1.5">
                                    <Mail size={16} className="text-[#16A34A]" /> {userData.email}
                                </p>
                            </div>
                            <div className="md:ml-auto md:mb-6 flex gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-3 bg-[#1F2937] text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    Save Changes
                                </button>
                                <button
                                    onClick={logout}
                                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Details */}
                <div className="md:col-span-12 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-[#1F2937] font-['Outfit'] mb-8 flex items-center gap-2">
                        <Settings size={22} className="text-[#16A34A]" /> Account Settings
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={userData.phone}
                                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Farm Size</label>
                                <input
                                    type="text"
                                    value={userData.farm_size}
                                    placeholder="e.g., 2.5 Hectares"
                                    onChange={(e) => setUserData({ ...userData, farm_size: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={userData.location}
                                        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Primary Crops</label>
                                <input
                                    type="text"
                                    value={userData.primary_crops}
                                    placeholder="e.g., Wheat, Rice"
                                    onChange={(e) => setUserData({ ...userData, primary_crops: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#16A34A] transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Email Notification Preferences</label>
                                <div className="space-y-3">
                                    {[
                                        { id: 'enable_weather_alerts', label: 'Weather Alerts', desc: 'Daily morning weather updates' },
                                        { id: 'enable_irrigation_alerts', label: 'Irrigation Alerts', desc: 'Daily moisture & watering reminders' },
                                        { id: 'enable_market_alerts', label: 'Market Alerts', desc: 'Daily crop price trends' },
                                        { id: 'enable_weekly_tips', label: 'Weekly Tips', desc: 'Sunday farming insights & monitoring' }
                                    ].map(setting => (
                                        <div key={setting.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                            <div>
                                                <p className="font-bold text-sm text-[#1F2937]">{setting.label}</p>
                                                <p className="text-xs text-slate-500 font-medium">{setting.desc}</p>
                                            </div>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={userData[setting.id]}
                                                onClick={() => setUserData(prev => ({ ...prev, [setting.id]: !prev[setting.id] }))}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-offset-2 ${userData[setting.id] ? 'bg-[#16A34A]' : 'bg-slate-200'}`}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${userData[setting.id] ? 'translate-x-5' : 'translate-x-0'}`}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
