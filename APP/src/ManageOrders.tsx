import React, { useState, useEffect } from 'react';
import type { Order, Customer, Product } from './types';
import { orderAPI, customerAPI, productAPI } from './api';
import { Invoice } from './LayoutComponents/Invoice'; // Ensure this path is correct

const ManageOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // State to handle which invoice is currently being viewed
    const [viewingInvoiceForOrder, setViewingInvoiceForOrder] = useState<Order | null>(null);

    const loadData = async () => {
        try {
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
                loadData(); 
            } catch (err) {
                console.error("Error deleting order:", err);
                alert("Failed to delete order.");
            }
        }
    };

    const getCustomerName = (id: number) => {
        const customer = customers.find(c => c.customerid === id);
        return customer ? customer.name : `Unknown ID: ${id}`;
    };

    const getProduct = (id: number) => {
        return products.find(p => p.productid === id);
    };

    if (isLoading) {
        return <div className="text-center py-10 text-slate-500 font-bold">Loading order data...</div>;
    }

    // RENDER INVOICE MODAL
    if (viewingInvoiceForOrder) {
        const product = getProduct(viewingInvoiceForOrder.productid);
        const invoiceItems = [{
            name: product?.productname || "Unknown Item",
            quantity: viewingInvoiceForOrder.quantity,
            price: Number(viewingInvoiceForOrder.price) / viewingInvoiceForOrder.quantity // Calculate price per unit
        }];
        
        // Since we are looking at an already saved total price, we need to calculate the subtotal backwards
        const total = Number(viewingInvoiceForOrder.price);
        const subtotal = total / 1.12;

        return (
            <div className="fixed inset-0 z-[70] bg-slate-900/50 flex justify-center items-start pt-10 p-4 overflow-y-auto">
                <div className="w-full max-w-2xl relative">
                    <Invoice 
                        items={invoiceItems}
                        customerName={getCustomerName(viewingInvoiceForOrder.customerid)}
                        subtotal={subtotal}
                        onReset={() => setViewingInvoiceForOrder(null)}
                    />
                </div>
            </div>
        );
    }

    // RENDER MAIN ADMIN TABLE
    return (
        <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8">
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
                            <th className="py-3 px-6 font-bold text-center">Status</th>
                            <th className="py-3 px-6 font-bold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700 text-sm font-light">
                        {orders.map(o => (
                            <tr key={o.orderid} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 font-medium">#{o.orderid}</td>
                                <td className="py-4 px-6">{getCustomerName(o.customerid)}</td>
                                <td className="py-4 px-6">{getProduct(o.productid)?.productname}</td>
                                <td className="py-4 px-6 text-center font-bold">{o.quantity}</td>
                                <td className="py-4 px-6 font-bold text-green-600">₱{o.price}</td>
                                
                                {/* Status Column */}
                                <td className="py-4 px-6 text-center">
                                    {o.is_paid ? (
                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded">PAID</span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded">PENDING</span>
                                    )}
                                </td>

                                {/* Actions Column */}
                                <td className="py-4 px-6 text-center space-x-2 whitespace-nowrap">
                                    {o.is_paid && (
                                        <button 
                                            onClick={() => setViewingInvoiceForOrder(o)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded font-bold hover:bg-blue-600 transition-colors text-xs"
                                        >
                                            View Invoice
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(o.orderid!)} 
                                        className="bg-red-500 text-white px-3 py-1 rounded font-bold hover:bg-red-600 transition-colors text-xs"
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
                        No orders have been placed yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;