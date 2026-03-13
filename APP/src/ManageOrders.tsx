import React, { useState, useEffect } from 'react';
import type { Order, Customer, Product } from './types';
import { orderAPI, customerAPI, productAPI } from './api';
import { Invoice } from './LayoutComponents/Invoice'; 

const ManageOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [viewingInvoice, setViewingInvoice] = useState<{group: Order[], invoiceNumber: number} | null>(null);

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
        } catch (err) { console.error("Error loading order data:", err); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    const getCustomerName = (id: number) => {
        const customer = customers.find(c => c.customerid === id);
        return customer ? customer.name : `Unknown ID: ${id}`;
    };

    const getProduct = (id: number) => products.find(p => p.productid === id);

    const getGroupedOrders = () => {
        const groups: Order[][] = [];
        
        // Sort oldest first, so the earliest order is always #1
        const sortedOrders = [...orders].sort((a, b) => (a.orderid || 0) - (b.orderid || 0));

        sortedOrders.forEach(order => {
            const existingGroup = groups.find(group => {
                if (group[0].customerid !== order.customerid || group[0].is_paid !== order.is_paid) return false;
                if (group[0].date && order.date) {
                    const timeDiff = Math.abs(new Date(group[0].date).getTime() - new Date(order.date).getTime());
                    return timeDiff <= 2000; 
                }
                return false;
            });

            if (existingGroup) existingGroup.push(order);
            else groups.push([order]);
        });
        
        return groups;
    };

    const handleDeleteGroup = async (group: Order[]) => {
        if (confirm(`Are you sure you want to delete this order?`)) {
            try {
                await Promise.all(group.map(o => orderAPI.deleteOrder(o.orderid!)));
                loadData(); 
            } catch (err) { alert("Failed to delete the order."); }
        }
    };

    if (isLoading) return <div className="text-center py-10 text-slate-500 font-bold">Loading order data...</div>;

    const groupedCheckouts = getGroupedOrders();

    // RENDER INVOICE MODAL
    if (viewingInvoice && viewingInvoice.group.length > 0) {
        const invoiceItems = viewingInvoice.group.map(o => {
            const product = getProduct(o.productid);
            return {
                name: product?.productname || "Unknown Item",
                quantity: o.quantity,
                price: Number(o.price) / o.quantity
            };
        });
        
        const total = viewingInvoice.group.reduce((sum, o) => sum + Number(o.price), 0);
        const subtotal = total / 1.12;

        return (
            <div className="fixed inset-0 z-[70] bg-slate-50 flex justify-center items-start pt-10 p-4 overflow-y-auto">
                <div className="w-full max-w-2xl relative">
                    <Invoice 
                        items={invoiceItems}
                        customerName={getCustomerName(viewingInvoice.group[0].customerid)}
                        subtotal={subtotal}
                        invoiceNumber={viewingInvoice.invoiceNumber}
                        paymentMethod={viewingInvoice.group[0].payment_method || 'Online'}
                        onReset={() => setViewingInvoice(null)}
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
                            <th className="py-3 px-6 font-bold">Order Ref #</th>
                            <th className="py-3 px-6 font-bold">Customer Name</th>
                            <th className="py-3 px-6 font-bold">Items Purchased</th>
                            <th className="py-3 px-6 font-bold text-center">Qty</th>
                            <th className="py-3 px-6 font-bold">Total Price</th>
                            <th className="py-3 px-6 font-bold text-center">Status</th>
                            <th className="py-3 px-6 font-bold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700 text-sm font-light">
                        {groupedCheckouts.map((group, index) => {
                            // THIS IS THE MAGIC LINE: It creates a visual 1, 2, 3 sequence
                            const sequentialNumber = index + 1; 
                            
                            const firstOrder = group[0];
                            const totalQty = group.reduce((sum, o) => sum + o.quantity, 0);
                            const totalPrice = group.reduce((sum, o) => sum + Number(o.price), 0);
                            
                            const firstProductName = getProduct(firstOrder.productid)?.productname || "Unknown Item";
                            const productDisplay = group.length > 1 ? `${firstProductName} (+${group.length - 1} items)` : firstProductName;

                            return (
                                <tr key={firstOrder.orderid} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    {/* Displays #1, #2, #3 instead of the database ID */}
                                    <td className="py-4 px-6 font-semibold">{sequentialNumber}</td>
                                    <td className="py-4 px-6 font-semibold">{getCustomerName(firstOrder.customerid)}</td>
                                    <td className="py-4 px-6 text-slate-600 font-medium">{productDisplay}</td>
                                    <td className="py-4 px-6 text-center font-bold bg-slate-50/50">{totalQty}</td>
                                    <td className="py-4 px-6 font-black text-indigo-600">₱{totalPrice.toFixed(2)}</td>
                                    
                                    <td className="py-4 px-6 text-center">
                                        {firstOrder.is_paid ? (
                                            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200">PAID</span>
                                        ) : (
                                            <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-200">PENDING</span>
                                        )}
                                    </td>

                                    <td className="py-4 px-6 text-center space-x-2 whitespace-nowrap">
                                        {firstOrder.is_paid && (
                                            <button 
                                                onClick={() => setViewingInvoice({ group, invoiceNumber: sequentialNumber })}
                                                className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-900 transition-colors text-xs shadow-sm"
                                            >
                                                View Invoice
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteGroup(group)} 
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors font-bold text-xs border border-transparent hover:border-red-100"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {orders.length === 0 && <div className="w-full text-center py-12 text-slate-400 font-medium">No orders have been placed yet.</div>}
            </div>
        </div>
    );
};

export default ManageOrders;