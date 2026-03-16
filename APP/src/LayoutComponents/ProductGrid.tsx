// src/LayoutComponents/ProductGrid.tsx
import React from 'react';
import type { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion'; // NEW

interface Props {
    products: Product[];
    searchQuery: string;
    
    onSearchChange: (val: string) => void;
    onAddToCart: (p: Product, e: React.MouseEvent) => void;
}

const ProductGrid: React.FC<Props> = ({ products, searchQuery, onSearchChange, onAddToCart }) => {
    return (
        <main className="w-full py-16">
            {/* ... Search Bar stays the same ... */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                <AnimatePresence>
                    {products.map((p, index) => (
                        <motion.div 
                            key={p.productid}
                            layout // Automatically animates grid shifts
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col"
                        >
                            <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                                <img src={`https://picsum.photos/seed/${p.productid}/400/300`} alt={p.productname} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-slate-800 mb-1">{p.productname}</h3>
                                <p className="text-2xl font-black text-indigo-600 mt-auto mb-4">${p.price}</p>
                                
                                {/* ANIMATED BUTTON */}
                              <button 
    onClick={(e) => onAddToCart(p, e)} // <--- Make sure both 'p' and 'e' are here!
    className="w-full py-3 bg-slate-100 text-slate-800 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-colors"
>
    Add to Cart
</button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </main>
    );
};

export default ProductGrid;