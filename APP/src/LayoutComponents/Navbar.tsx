import React from 'react';
import type { Customer } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

interface NavbarProps {
    isManageMode: boolean;
    onToggleAdmin: () => void;
    loggedInCustomer: Customer | null;
    onOpenAuth: () => void;
    onLogout: () => void;
    onOpenCart: () => void;
    cartItemCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ 
    isManageMode, onToggleAdmin, loggedInCustomer, onOpenAuth, onLogout, onOpenCart, cartItemCount 
}) => {
    return (
        <nav className="w-full flex justify-between items-center py-6">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-200">H</div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Hengstore</h1>
            </div>
            
            {/* Navigation Actions */}
            <div className="flex gap-4 items-center">
                <button 
                    onClick={onToggleAdmin}
                    className={`px-5 py-2 text-sm font-bold transition-colors ${isManageMode ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                    {isManageMode ? "Return to Store" : "Admin Login"}
                </button>

                {!isManageMode && (
                    <>
                        {loggedInCustomer ? (
                            <div className="flex items-center gap-3 pr-4 border-r border-slate-300">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Logged in as</p>
                                    <p className="text-sm font-bold text-slate-800">{loggedInCustomer.name}</p>
                                </div>
                                <button onClick={onLogout} className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button onClick={onOpenAuth} className="px-5 py-2 text-sm font-bold bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                                Customer Login
                            </button>
                        )}

                        {/* --- CART BUTTON WITH UPDATED TIMING --- */}
                        <motion.button 
                            id="cart-icon-target"
                            key={cartItemCount} 
                            initial={{ scale: 1 }}
                            animate={cartItemCount > 0 ? { 
                                scale: [1, 1.4, 1],
                                rotate: [0, -15, 15, 0] // Impact wiggle
                            } : {}} 
                            transition={{ 
                                duration: 0.4, 
                                delay: 1.15, // Matches the 1.2s arrival of the FlyingItem
                                ease: "easeOut"
                            }}
                            onClick={onOpenCart} 
                            className="relative p-3 bg-white rounded-full shadow-sm border border-slate-200 hover:shadow-md transition-all flex items-center justify-center ml-2"
                        >
                            <span className="text-xl">🛒</span>
                            <AnimatePresence>
                                {cartItemCount > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ delay: 1.15 }} // Badge appears exactly when item hits
                                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                                    >
                                        {cartItemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;