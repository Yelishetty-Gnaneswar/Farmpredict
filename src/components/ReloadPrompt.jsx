import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

function ReloadPrompt() {
    // vite-plugin-pwa exposes a hook via a virtual module; in dev mode it may be undefined
    let registerData = null;
    if (typeof useRegisterSW === 'function') {
        try {
            registerData = useRegisterSW({
                onRegistered(r) {
                    console.log('SW Registered');
                },
                onRegisterError(error) {
                    console.log('SW registration error', error);
                },
            });
        } catch (e) {
            // hook threw (likely because the virtual module isn't ready in dev); ignore
            console.log('useRegisterSW failed, disabling reload prompt:', e.message);
        }
    }

    if (!registerData || !registerData.offlineReady || !registerData.needUpdate) {
        // service worker hook not properly initialized or missing data (likely dev mode)
        return null;
    }

    const {
        offlineReady: [offlineReady, setOfflineReady],
        needUpdate: [needUpdate, setNeedUpdate],
        updateServiceWorker,
    } = registerData;

    const close = () => {
        setOfflineReady(false);
        setNeedUpdate(false);
    };

    if (!offlineReady && !needUpdate) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-5 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <RefreshCw className={`${needUpdate ? 'animate-spin-slow' : ''}`} size={24} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-900 leading-tight">
                            {offlineReady ? 'App Ready Offline' : 'Update Available'}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1 font-medium italic">
                            {offlineReady
                                ? 'Farm Predict is now ready to use without internet!'
                                : 'A new version of Farm Predict is available. Update now?'}
                        </p>
                        <div className="flex gap-3 mt-4">
                            {needUpdate && (
                                <button
                                    onClick={() => updateServiceWorker(true)}
                                    className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                                >
                                    Update Now
                                </button>
                            )}
                            <button
                                onClick={close}
                                className="px-5 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all"
                            >
                                {needUpdate ? 'Later' : 'Close'}
                            </button>
                        </div>
                    </div>
                    <button onClick={close} className="text-slate-400 hover:text-slate-600 self-start">
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReloadPrompt;
