import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Product, Customer } from './types'; 
import { productAPI, orderAPI, customerAPI } from './api'; 

// Layout Components
import Navbar from './LayoutComponents/Navbar';
import Hero from './LayoutComponents/Hero';
import ProductGrid from './LayoutComponents/ProductGrid';
import CartDrawer from './LayoutComponents/CartDrawer';
import AuthModal from './LayoutComponents/AuthModal';
import FlyingItem from './LayoutComponents/FlyingItem';
import AdminPanel from './LayoutComponents/AdminPanel'; 
import { PaymentTab } from './LayoutComponents/PaymentTab'; // <-- NEW IMPORT
import { Invoice } from './LayoutComponents/Invoice';       // <-- NEW IMPORT

interface FlyingItemData { id: number; x: number; y: number; img: string; }

const Store: React.FC = () => {
    // --- Data & Mode State ---
    const [products, setProducts] = useState<Product[]>([]);
    const [isManageMode, setIsManageMode] = useState(false);
    const [adminTab, setAdminTab] = useState<'products' | 'customers' | 'orders'>('products');
    
    // --- Shopping State ---
    const [cart, setCart] = useState<{product: Product; quantity: number}[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [flyingItems, setFlyingItems] = useState<FlyingItemData[]>([]); 

    // --- Checkout Flow State (NEW) ---
    const [checkoutState, setCheckoutState] = useState<'shopping' | 'payment' | 'invoice'>('shopping');

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
            const res = await customerAPI.addCustomer(signupData);
            setLoggedInCustomer(res.data);
            setIsAuthModalOpen(false);
            setSignupData({ name: '', username: '', email: '', number: '', password: '' });
        } catch (err) { alert("Signup failed."); }
        finally { setIsLoadingAuth(false); }
    };

    // --- Cart & Animation Logic ---
    const addToCart = (product: Product, e: React.MouseEvent) => {
        const newItem: FlyingItemData = {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            img: product.imageurl || `https://picsum.photos/seed/${product.productid}/100/100`
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

    // --- NEW CHECKOUT FLOW HANDLERS ---
    
    // 1. User clicks "Place Order" in the cart
    const handleInitiateCheckout = () => {
        if (!loggedInCustomer) { setIsAuthModalOpen(true); return; }
        setIsCartOpen(false); // Close cart drawer
        setCheckoutState('payment'); // Open payment tab
    };

    // 2. User successfully pays via the Payment Tab
    const handlePaymentSuccess = async () => {
        try {
            await Promise.all(cart.map(item => orderAPI.addOrder({
                customerid: loggedInCustomer!.customerid!, 
                productid: item.product.productid!,
                quantity: item.quantity,
                price: Number(item.product.price) * item.quantity,
                is_paid: true // Tells the database it is paid
            })));
            setCheckoutState('invoice'); // Show the receipt
        } catch (err) { 
            alert("Failed to process order on the server."); 
            setCheckoutState('shopping');
        }
    };

    // 3. User closes the invoice
    const handleCloseInvoice = () => {
        setCart([]); // Empty the cart only after they close the receipt
        setCheckoutState('shopping');
    };

    const cartTotal = cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
    const filteredProducts = products.filter(p => p.productname.toLowerCase().includes(searchQuery.toLowerCase()));

    // Map cart items into the format the Invoice component expects
    const invoiceItems = cart.map(item => ({
        name: item.product.productname,
        quantity: item.quantity,
        price: Number(item.product.price)
    }));

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
                        onCheckout={handleInitiateCheckout} // <-- Updated to trigger payment flow
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
                <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex justify-center items-start pt-10 p-4 overflow-y-auto">
                    <div className="w-full max-w-2xl relative">
                        <Invoice 
                            items={invoiceItems}
                            customerName={loggedInCustomer?.name}
                            subtotal={cartTotal}
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
        </div>
    );
};

export default Store;