import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import type { Product, Customer, Invoice as InvoiceType } from './types'; 
<<<<<<< HEAD
import { productAPI, customerAPI } from './api'; 
=======
import { productAPI, customerAPI, invoiceAPI } from './api'; 
>>>>>>> 7e2fc8879be1309ba35fd005ea4b9037186e0d56

// Layout Components
import Navbar from './LayoutComponents/Navbar';
import Hero from './LayoutComponents/Hero';
import ProductGrid from './LayoutComponents/ProductGrid';
import CartDrawer from './LayoutComponents/CartDrawer';
import AuthModal from './LayoutComponents/AuthModal';
import FlyingItem from './LayoutComponents/FlyingItem';
import AdminPanel from './LayoutComponents/AdminPanel'; 
import { PaymentTab } from './LayoutComponents/PaymentTab';
import { Invoice } from './LayoutComponents/Invoice';    
<<<<<<< HEAD
import CheckoutPage from './CheckoutPage';
=======
>>>>>>> 7e2fc8879be1309ba35fd005ea4b9037186e0d56

interface FlyingItemData { id: number; x: number; y: number; img: string; }

const Store: React.FC = () => {
    // --- Data & Mode State ---
    const [products, setProducts] = useState<Product[]>([]);
    const [isManageMode, setIsManageMode] = useState(false);
    const [adminTab, setAdminTab] = useState<'products' | 'customers' | 'invoices'>('products');
    
    // --- Shopping State ---
    const [cart, setCart] = useState<{product: Product; quantity: number}[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
<<<<<<< HEAD
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
=======
>>>>>>> 7e2fc8879be1309ba35fd005ea4b9037186e0d56
    const [searchQuery, setSearchQuery] = useState('');
    const [flyingItems, setFlyingItems] = useState<FlyingItemData[]>([]); 

    // --- Checkout Flow State ---
    const [checkoutState, setCheckoutState] = useState<'shopping' | 'payment' | 'invoice'>('shopping');
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState('GCash');
    
    // ✅ FIX 1: New state to hold the snapshot of the cart for the invoice
    const [invoiceSnapshot, setInvoiceSnapshot] = useState<{name: string; quantity: number; price: number}[]>([]);

    // --- Auth State ---
    const [loggedInCustomer, setLoggedInCustomer] = useState<Customer | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [isLoadingAuth, setIsLoadingAuth] = useState(false);

    // Form Inputs
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupData, setSignupData] = useState({ name: '', username: '', email: '', number: '', password: '' });

    const loadProducts = useCallback(async () => {
        try {
            const res = await productAPI.getProducts();
            setProducts(res.data);
        } catch (err) { console.error("Error loading products:", err); }
    }, []);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    const toggleAdminMode = () => {
        if (isManageMode) {
            setIsManageMode(false);
        } else {
            const password = prompt("Enter Admin Password:");
            if (password === "admin123") setIsManageMode(true);
        }
    };

    // --- Auth Handlers ---
    const handleLogin = async () => {
        if (!loginUsername || !loginPassword) return;
        setIsLoadingAuth(true);
        try {
            const res = await customerAPI.loginCustomer({ username: loginUsername, password: loginPassword });
            setLoggedInCustomer(res.data);
            setIsAuthModalOpen(false);
            setLoginUsername(''); setLoginPassword('');
        } catch (err) { alert("Invalid login."); }
        finally { setIsLoadingAuth(false); }
    };

    const handleSignup = async () => {
        if (!signupData.username || !signupData.password) return;
        setIsLoadingAuth(true);
        try {
            await customerAPI.addCustomer(signupData);
            setSignupData({ name: '', username: '', email: '', number: '', password: '' });
            setAuthMode('login');
            alert(`Account created! Please log in, ${signupData.name || signupData.username}.`);
        } catch (err) { alert("Signup failed."); }
        finally { setIsLoadingAuth(false); }
    };

    // --- Cart & Animation Logic ---
    const addToCart = (product: Product, e: React.MouseEvent) => {
        const newItem: FlyingItemData = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            img: product.image || `https://picsum.photos/seed/${product.productid}/100/100`
        };
        setFlyingItems(prev => [...prev, newItem]);

        setCart(prev => {
            const existing = prev.find(item => item.product.productid === product.productid);
            if (existing) {
                return prev.map(item => item.product.productid === product.productid ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    // --- CHECKOUT FLOW HANDLERS ---
    const handleInitiateCheckout = () => {
        if (!loggedInCustomer) { setIsAuthModalOpen(true); return; }
<<<<<<< HEAD
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
=======
        setIsCartOpen(false); 
        setCheckoutState('payment'); 
    };

    const handlePaymentSuccess = async (method: string) => {
        if (!loggedInCustomer || !loggedInCustomer.customerid) {
            alert("Please log in to checkout.");
            return;
        }

        const payloadItems = cart.map(item => ({
            product: item.product.productid!,
            quantity: item.quantity
        }));

        const invoicePayload: InvoiceType = {
            customer: loggedInCustomer.customerid,
            is_paid: true,
            payment_method: method,
            items: payloadItems 
        };

        try {
            await invoiceAPI.createInvoice(invoicePayload);
            
            // ✅ FIX 2: Take a snapshot of the cart data BEFORE clearing it
            const receiptItems = cart.map(item => ({
                name: item.product.productname,
                quantity: item.quantity,
                price: Number(item.product.price)
            }));
            
            // Save snapshot and payment method to state
            setInvoiceSnapshot(receiptItems);
            setCurrentPaymentMethod(method);

            setCheckoutState('invoice'); // Move to invoice screen
            setCart([]); // Clear cart safely
            
        } catch (err) {
            console.error("Checkout failed:", err);
            alert("Checkout failed. Please try again.");
        }
    };

    const handleCloseInvoice = () => {
        setCart([]); 
        setCheckoutState('shopping');
>>>>>>> 7e2fc8879be1309ba35fd005ea4b9037186e0d56
    };

    const cartTotal = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
    const filteredProducts = products.filter(p => p.productname.toLowerCase().includes(searchQuery.toLowerCase()));

    // ✅ FIX 3: Removed the old "invoiceItems" array mapping from here since we use state now.

    return (
        <div className="min-h-screen w-full bg-slate-50 flex justify-center overflow-x-hidden relative font-sans">
            <div className="w-full max-w-[1200px] px-5 flex flex-col items-center pb-20">
                <Navbar 
                    isManageMode={isManageMode} onToggleAdmin={toggleAdminMode} loggedInCustomer={loggedInCustomer}
                    onOpenAuth={() => setIsAuthModalOpen(true)} onLogout={() => setLoggedInCustomer(null)}
                    onOpenCart={() => setIsCartOpen(true)} cartItemCount={cartItemCount}
                />

                {!isManageMode ? (
                    <>
                        <Hero loggedInCustomer={loggedInCustomer} />
                        <ProductGrid products={filteredProducts} searchQuery={searchQuery} onSearchChange={setSearchQuery} onAddToCart={addToCart} />
                    </>
                ) : (
                    <AdminPanel 
                        adminTab={adminTab} 
                        setAdminTab={setAdminTab} 
                        products={products} 
                        loadProducts={loadProducts} 
                    />
                )}
            </div>

            {/* Flying Items Render */}
            {flyingItems.map(item => (
                <FlyingItem 
                    key={item.id} x={item.x} y={item.y} image={item.img}
                    onComplete={() => setFlyingItems(prev => prev.filter(i => i.id !== item.id))}
                />
            ))}

            {/* Cart Drawer Overlay */}
            <AnimatePresence>
                {isCartOpen && (
                    <CartDrawer 
                        cart={cart} onClose={() => setIsCartOpen(false)} onRemove={(id) => setCart(prev => prev.filter(i => i.product.productid !== id))}
                        total={cartTotal} loggedInCustomer={loggedInCustomer} 
                        onCheckout={handleInitiateCheckout} 
                        onOpenAuth={() => { setIsCartOpen(false); setIsAuthModalOpen(true); }}
                    />
                )}
            </AnimatePresence>

            {/* Payment Modal Overlay */}
            {checkoutState === 'payment' && (
                <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl relative w-full max-w-md">
                        <button 
                            onClick={() => { setCheckoutState('shopping'); setIsCartOpen(true); }} 
                            className="absolute top-4 left-4 text-slate-500 hover:text-slate-800 font-bold z-10"
                        >
                            &larr; Back to Cart
                        </button>
                        <div className="pt-8">
                            <PaymentTab subtotal={cartTotal} onPaymentSuccess={handlePaymentSuccess} />
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Modal Overlay */}
            {checkoutState === 'invoice' && (
                <div className="fixed inset-0 z-[60] bg-slate-50 flex justify-center items-start pt-10 p-4 overflow-y-auto">
                    <div className="w-full max-w-2xl relative">
                        <Invoice 
                            // ✅ FIX 4: Use the new invoiceSnapshot state here!
                            items={invoiceSnapshot}
                            customerName={loggedInCustomer?.name}
                            subtotal={invoiceSnapshot.reduce((total, item) => total + (item.price * item.quantity), 0)}
                            paymentMethod={currentPaymentMethod}
                            onReset={handleCloseInvoice}
                        />
                    </div>
                </div>
            )}

            {/* Auth Modal Overlay */}
            {isAuthModalOpen && (
                <AuthModal 
                    authMode={authMode} setAuthMode={setAuthMode} onClose={() => setIsAuthModalOpen(false)} isLoading={isLoadingAuth}
                    loginUsername={loginUsername} setLoginUsername={setLoginUsername} loginPassword={loginPassword} setLoginPassword={setLoginPassword} handleLogin={handleLogin}
                    signupData={signupData} setSignupData={setSignupData} handleSignup={handleSignup}
                />
            )}
<<<<<<< HEAD

            <AnimatePresence>
                {isCheckoutOpen && (
                    <CheckoutPage
                        cart={cart}
                        loggedInCustomer={loggedInCustomer}
                        onClose={() => setIsCheckoutOpen(false)}
                        onOrderComplete={() => { setCart([]); setIsCheckoutOpen(false); }}
                        onOpenAuth={() => { setIsCheckoutOpen(false); setIsAuthModalOpen(true); }}
                    />
                )}
            </AnimatePresence>
=======
>>>>>>> 7e2fc8879be1309ba35fd005ea4b9037186e0d56
        </div>
    );
};

export default Store;