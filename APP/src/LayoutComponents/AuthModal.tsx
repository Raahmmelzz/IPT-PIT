import React from 'react';
import { motion } from 'framer-motion';

interface AuthModalProps {
    authMode: 'login' | 'signup';
    setAuthMode: (mode: 'login' | 'signup') => void;
    onClose: () => void;
    isLoading: boolean;
    loginUsername: string;
    setLoginUsername: (val: string) => void;
    loginPassword: string;
    setLoginPassword: (val: string) => void;
    handleLogin: () => void;
    signupData: any;
    setSignupData: (data: any) => void;
    handleSignup: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
    authMode, setAuthMode, onClose, isLoading,
    loginUsername, setLoginUsername, loginPassword, setLoginPassword, handleLogin,
    signupData, setSignupData, handleSignup
}) => {
    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative"
            >
                <div className="flex mb-6 border-b border-slate-200">
                    <button onClick={() => setAuthMode('login')} className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${authMode === 'login' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Login</button>
                    <button onClick={() => setAuthMode('signup')} className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${authMode === 'signup' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Sign Up</button>
                </div>

                {authMode === 'login' ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Username</label>
                            <input type="text" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800" onKeyDown={(e) => e.key === 'Enter' && handleLogin()}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
                            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800" onKeyDown={(e) => e.key === 'Enter' && handleLogin()}/>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={handleLogin} disabled={isLoading} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50">{isLoading ? '...' : 'Login'}</button>
                            <button onClick={onClose} className="px-5 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[65vh] overflow-y-auto px-1 scrollbar-hide">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                            <input type="text" value={signupData.name} onChange={(e) => setSignupData({...signupData, name: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
                            <input type="text" value={signupData.username} onChange={(e) => setSignupData({...signupData, username: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                            <input type="email" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 font-bold" />
                        </div>
                        {/* --- PHONE NUMBER IS BACK --- */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                            <input type="text" value={signupData.number} onChange={(e) => setSignupData({...signupData, number: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                            <input type="password" value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} className="w-full border border-slate-300 rounded-xl px-4 py-2 font-bold" />
                        </div>
                        <div className="flex gap-3 mt-4 pt-2">
                            <button onClick={handleSignup} disabled={isLoading} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700">{isLoading ? '...' : 'Create Account'}</button>
                            <button onClick={onClose} className="px-5 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl">Cancel</button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AuthModal;