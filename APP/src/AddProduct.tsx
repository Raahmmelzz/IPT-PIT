import React, { useState } from 'react';
import { productAPI } from './api';

interface AddProductProps {
    onSuccess: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onSuccess }) => {
    const [form, setForm] = useState({ productname: '', price: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await productAPI.addProduct(form);
            setForm({ productname: '', price: '' });
            onSuccess();
            alert("Product added successfully!");
        } catch (err) {
            console.error("Error adding product:", err);
        }
    };

    return (
        <div className="mb-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Add New Product</h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input 
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 outline-none"
                    placeholder="Product Name" 
                    value={form.productname} 
                    onChange={e => setForm({...form, productname: e.target.value})} 
                    required 
                />
                <input 
                    className="w-full sm:w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 outline-none"
                    type="number" 
                    placeholder="Price" 
                    value={form.price} 
                    onChange={e => setForm({...form, price: e.target.value})} 
                    required 
                />
                <button type="submit" className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors">
                    Create
                </button>
            </form>
        </div>
    );
};

export default AddProduct;