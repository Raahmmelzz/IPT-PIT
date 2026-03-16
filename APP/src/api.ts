// src/api.ts
import axios from 'axios';
import type { Product, Customer, Order } from './types';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', 
});

export const productAPI = {
    getProducts: () => api.get<Product[]>('products/'), 
    addProduct: (data: Omit<Product, 'productid'>) => api.post<Product>('products/', data),
    updateProduct: (id: number, data: Partial<Product>) => api.put<Product>(`products/${id}/`, data),
    deleteProduct: (id: number) => api.delete(`products/${id}/`),
};

export const customerAPI = {
    getCustomers: () => api.get<Customer[]>('customers/'),
    getCustomer: (id: number) => api.get<Customer>(`customers/${id}/`),
    
    // --- THIS IS THE LINE TO FIX ---
    // Change 'email' to 'username' here:
    loginCustomer: (credentials: {username: string, password: string}) => 
        api.post<Customer>('customers/login/', credentials),
        
    addCustomer: (data: Omit<Customer, 'customerid'>) => api.post<Customer>('customers/', data),
    updateCustomer: (id: number, data: Partial<Customer>) => api.put<Customer>(`customers/${id}/`, data),
    deleteCustomer: (id: number) => api.delete(`customers/${id}/`),
};

export const orderAPI = {
    getOrders: () => api.get<Order[]>('orders/'),
    addOrder: (data: Omit<Order, 'orderid'>) => api.post<Order>('orders/', data),
    updateOrder: (id: number, data: Partial<Order>) => api.put<Order>(`orders/${id}/`, data),
    deleteOrder: (id: number) => api.delete(`orders/${id}/`),
};