import React from 'react';
import type { PaymentMethod } from '../CheckoutPage';

interface Props {
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
    amountPaid: string;
    setAmountPaid: (val: string) => void;
    total: number;
    change: number;
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: string; desc: string }[] = [
    { value: 'cash',    label: 'Cash',          icon: '💵', desc: 'Pay with physical cash' },
    { value: 'card',    label: 'Credit / Debit', icon: '💳', desc: 'Visa, Mastercard, etc.' },
    { value: 'ewallet', label: 'E-Wallet',       icon: '📱', desc: 'GCash, Maya, etc.' },
    { value: 'bank',    label: 'Bank Transfer',  icon: '🏦', desc: 'Online banking' },
];

const CheckoutPayment: React.FC<Props> = ({
    paymentMethod, setPaymentMethod, amountPaid, setAmountPaid, total, change
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Payment Method Selection */}
            <div className="flex-1">
                <h3 className="text-lg font-black text-slate-800 mb-4">Payment Method</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {PAYMENT_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setPaymentMethod(opt.value)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                paymentMethod === opt.value
                                    ? 'border-indigo-600 bg-indigo-50 shadow-md shadow-indigo-100'
                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <div className="text-2xl mb-2">{opt.icon}</div>
                            <p className={`font-black text-sm ${paymentMethod === opt.value ? 'text-indigo-700' : 'text-slate-800'}`}>
                                {opt.label}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                            {paymentMethod === opt.value && (
                                <div className="mt-2 text-xs font-black text-indigo-600">✓ Selected</div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Cash input */}
                {paymentMethod === 'cash' && (
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Amount Tendered
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500">₱</span>
                            <input
                                type="number"
                                value={amountPaid}
                                onChange={e => setAmountPaid(e.target.value)}
                                placeholder={total.toFixed(2)}
                                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-3 font-black text-slate-800 text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        {/* Quick amount buttons */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {[Math.ceil(total / 100) * 100, Math.ceil(total / 500) * 500, Math.ceil(total / 1000) * 1000].map(amt => (
                                <button
                                    key={amt}
                                    onClick={() => setAmountPaid(String(amt))}
                                    className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                                >
                                    ₱{amt.toLocaleString()}
                                </button>
                            ))}
                        </div>

                        {Number(amountPaid) >= total && amountPaid && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex justify-between items-center">
                                <span className="text-sm font-bold text-green-700">Change</span>
                                <span className="text-xl font-black text-green-700">₱{change.toFixed(2)}</span>
                            </div>
                        )}
                        {Number(amountPaid) < total && amountPaid && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
                                <p className="text-sm font-bold text-red-600">Insufficient amount. Short by ₱{(total - Number(amountPaid)).toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                )}

                {paymentMethod !== 'cash' && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 text-center">
                        <div className="text-4xl mb-2">
                            {paymentMethod === 'card' ? '💳' : paymentMethod === 'ewallet' ? '📱' : '🏦'}
                        </div>
                        <p className="font-black text-indigo-800 mb-1">
                            {paymentMethod === 'card' ? 'Card Payment' : paymentMethod === 'ewallet' ? 'E-Wallet Payment' : 'Bank Transfer'}
                        </p>
                        <p className="text-sm text-indigo-600">
                            {paymentMethod === 'card' 
                                ? 'Amount will be charged to your card upon confirmation.'
                                : paymentMethod === 'ewallet' 
                                ? 'A payment request will be sent to your e-wallet.'
                                : 'Transfer details will be sent to your email.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Right: Summary */}
            <div className="lg:w-64 flex-shrink-0">
                <h3 className="text-lg font-black text-slate-800 mb-4">Final Total</h3>
                <div className="bg-indigo-900 text-white rounded-2xl p-6">
                    <p className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-1">Amount Due</p>
                    <p className="text-4xl font-black mb-6">₱{total.toFixed(2)}</p>
                    
                    <div className="space-y-2 text-sm border-t border-indigo-700 pt-4">
                        <div className="flex justify-between text-indigo-300">
                            <span>Method</span>
                            <span className="font-bold text-white capitalize">{paymentMethod === 'ewallet' ? 'E-Wallet' : paymentMethod === 'bank' ? 'Bank Transfer' : paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</span>
                        </div>
                        <div className="flex justify-between text-indigo-300">
                            <span>Status</span>
                            <span className="font-bold text-amber-400">Pending</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-xs font-black text-amber-700 uppercase tracking-wider mb-1">⚠️ Before you confirm</p>
                    <p className="text-xs text-amber-800">Review all items and payment details before placing your order. Orders cannot be modified after confirmation.</p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPayment;
