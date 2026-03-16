// src/ManageOrders.tsx
import React, { useState, useEffect } from 'react';
import type { Order, Customer, Product } from './types';
import { orderAPI, customerAPI, productAPI } from './api';

const ManageOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        try {
            // Fetch all three endpoints at the same time to speed up loading
            const [ordersRes, customersRes, productsRes] = await Promise.all([
                orderAPI.getOrders(),
                customerAPI.getCustomers(),
                productAPI.getProducts()
            ]);
            
            setOrders(ordersRes.data);
            setCustomers(customersRes.data);
            setProducts(productsRes.data);
        } catch (err) {
            console.error("Error loading order data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this order record?")) {
            try {
                await orderAPI.deleteOrder(id);
                loadData(); // Refresh the list
            } catch (err) {
                console.error("Error deleting order:", err);
                alert("Failed to delete order.");
            }
        }
    };

    // Helper functions to convert flat IDs into readable names
    const getCustomerName = (id: number) => {
        const customer = customers.find(c => c.customerid === id);
        return customer ? customer.name : `Unknown ID: ${id}`;
    };

    const getProductName = (id: number) => {
        const product = products.find(p => p.productid === id);
        return product ? product.productname : `Unknown ID: ${id}`;
    };

    if (isLoading) {
        return <div className="text-center py-10 text-slate-500 font-bold">Loading order data...</div>;
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Order History</h3>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 font-bold">Order ID</th>
                            <th className="py-3 px-6 font-bold">Customer Name</th>
                            <th className="py-3 px-6 font-bold">Product Item</th>
                            <th className="py-3 px-6 font-bold text-center">Qty</th>
                            <th className="py-3 px-6 font-bold">Total Price</th>
                            <th className="py-3 px-6 font-bold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700 text-sm font-light">
                        {orders.map(o => (
                            <tr key={o.orderid} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 font-medium">#{o.orderid}</td>
                                <td className="py-4 px-6">{getCustomerName(o.customerid)}</td>
                                <td className="py-4 px-6">{getProductName(o.productid)}</td>
                                <td className="py-4 px-6 text-center font-bold">{o.quantity}</td>
                                <td className="py-4 px-6 font-bold text-green-600">${o.price}</td>
                                <td className="py-4 px-6 text-center">
                                    <button 
                                        onClick={() => handleDelete(o.orderid!)} 
                                        className="bg-red-500 text-white px-4 py-1 rounded-lg font-bold hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {orders.length === 0 && (
                    <div className="w-full text-center py-12 text-slate-500">
                        No orders have been placed yet. Go buy something!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;