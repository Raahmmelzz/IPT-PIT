import React from 'react';

interface InvoiceProps {
  items: { name: string; quantity: number; price: number }[];
  customerName?: string;
  subtotal: number;
  onReset: () => void;
  invoiceNumber?: string | number; 
  paymentMethod?: string; 
}

export const Invoice: React.FC<InvoiceProps> = ({ items, customerName, subtotal, onReset, invoiceNumber, paymentMethod }) => {
  const vat = subtotal * 0.12;
  const total = subtotal + vat;
  const displayInvoiceNumber = invoiceNumber || Math.floor(Math.random() * 900000) + 100000;
  const date = new Date().toLocaleDateString();

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl relative w-full">
      <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">INVOICE</h1>
          <p className="text-slate-500 mt-1 font-mono font-medium">#{displayInvoiceNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To</p>
          <p className="text-lg font-bold text-slate-800">{customerName || "Valued Customer"}</p>
          <p className="text-slate-500 font-medium">{date}</p>
        </div>
      </div>

      <table className="w-full mb-8 text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-y border-slate-200">
            <th className="py-3 px-4 font-bold text-slate-600">Item</th>
            <th className="py-3 px-4 text-center font-bold text-slate-600">Qty</th>
            <th className="py-3 px-4 text-right font-bold text-slate-600">Price</th>
            <th className="py-3 px-4 text-right font-bold text-slate-600">Total</th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {items.map((item, index) => (
            <tr key={index} className="border-b border-slate-100">
              <td className="py-4 px-4 font-bold text-slate-800">{item.name}</td>
              <td className="py-4 px-4 text-center font-medium">{item.quantity}</td>
              <td className="py-4 px-4 text-right font-medium">₱{item.price.toFixed(2)}</td>
              <td className="py-4 px-4 text-right font-bold text-indigo-600">₱{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-8">
        <div className="w-1/2 min-w-[250px]">
          <div className="flex justify-between py-2 text-slate-600 font-medium">
            <span>Subtotal:</span>
            <span>₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-slate-600 font-medium">
            <span>VAT (12%):</span>
            <span>₱{vat.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-slate-600 font-medium">
            <span>Payment Method:</span>
            <span className="font-bold text-slate-800">{paymentMethod || 'Online'}</span>
          </div>
          <div className="flex justify-between py-3 border-t-2 border-slate-800 mt-2 font-black text-2xl text-slate-800">
            <span>Total Paid:</span>
            <span>₱{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 mb-8 flex items-center justify-center gap-2 text-emerald-700 font-black bg-emerald-50 py-4 rounded-xl border border-emerald-200">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        PAYMENT SUCCESSFUL
      </div>
      
      <div className="flex gap-4 print:hidden pt-4 border-t border-slate-100">
         <button onClick={onReset} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-colors">
           Close
         </button>
         <button onClick={() => window.print()} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
           Download Invoice (PDF)
         </button>
      </div>
    </div>
  );
};