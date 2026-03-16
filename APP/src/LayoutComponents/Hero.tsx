import React from 'react';
import type { Customer } from '../types';

interface Props {
    loggedInCustomer: Customer | null;
}

const Hero: React.FC<Props> = ({ loggedInCustomer }) => {
    return (
        <header className="w-full text-center py-20 mt-4 rounded-[2rem] bg-indigo-900 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <h2 className="text-5xl font-black mb-4 relative z-10">Quality Goods at a Single Click.</h2>
            <p className="text-xl text-indigo-200 relative z-10">
                {loggedInCustomer ? `Welcome back, ${loggedInCustomer.name}!` : "Explore our latest arrivals below."}
            </p>
        </header>
    );
};

export default Hero;