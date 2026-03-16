import React, { useState } from 'react';
import type { Product } from './types';
import { productAPI } from './api';
import AddProduct from './AddProduct';

interface Props {
    products: Product[];
    refresh: () => void;
}

const ManageProducts: React.FC<Props> = ({ products, refresh }) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ productname: '', price: '' });

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure?")) {
            await productAPI.deleteProduct(id);
            refresh();
        }
    };

    const handleSave = async (id: number) => {
        await productAPI.updateProduct(id, editForm);
        setEditingId(null);
        refresh();
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
            <AddProduct onSuccess={refresh} />

            <h3 className="text-xl font-bold mb-6 text-slate-800">Current Inventory</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 font-bold">ID</th>
                            <th className="py-3 px-6 font-bold">Name</th>
                            <th className="py-3 px-6 font-bold">Price</th>
                            <th className="py-3 px-6 font-bold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700 text-sm font-light">
                        {products.map(p => (
                            <tr key={p.productid} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 font-medium">{p.productid}</td>
                                <td className="py-4 px-6">
                                    {editingId === p.productid ? (
                                        <input 
                                            className="px-2 py-1 border rounded w-full"
                                            value={editForm.productname} 
                                            onChange={e => setEditForm({...editForm, productname: e.target.value})} 
                                        />
                                    ) : p.productname}
                                </td>
                                <td className="py-4 px-6">
                                    {editingId === p.productid ? (
                                        <input 
                                            className="px-2 py-1 border rounded w-32"
                                            type="number"
                                            value={editForm.price} 
                                            onChange={e => setEditForm({...editForm, price: e.target.value})} 
                                        />
                                    ) : `$${p.price}`}
                                </td>
                                <td className="py-4 px-6 text-center flex justify-center gap-2">
                                    {editingId === p.productid ? (
                                        <>
                                            <button onClick={() => handleSave(p.productid)} className="bg-green-500 text-white px-3 py-1 rounded-lg font-bold">Save</button>
                                            <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded-lg font-bold">Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => {
                                                setEditingId(p.productid);
                                                setEditForm({ productname: p.productname, price: p.price });
                                            }} className="bg-blue-500 text-white px-4 py-1 rounded-lg font-bold hover:bg-blue-600">Edit</button>
                                            <button onClick={() => handleDelete(p.productid)} className="bg-red-500 text-white px-4 py-1 rounded-lg font-bold hover:bg-red-600">Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;