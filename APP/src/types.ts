// src/types.ts

export interface Customer {
    customerid?: number; 
    name: string;
    username: string; // <-- This is the missing piece!
    email: string;
    number: string;
    password?: string; // Optional so we don't accidentally display it everywhere
}

export interface Product {
    imageurl: string;
    productid?: number;
    productname: string;
    price: string | number; // APIs often return DecimalField as a string
}

export interface Order {
    orderid?: number; 
    customerid: number; 
    productid: number;  
    date?: string;
    quantity: number;
    price: string | number; 
    is_paid?: boolean; // <-- NEW FIELD
}