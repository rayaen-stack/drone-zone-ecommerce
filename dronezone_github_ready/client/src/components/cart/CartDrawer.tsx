import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useCart } from "./CartContext";
import CartItem from "./CartItem";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, convertUsdToKes } from "@/lib/currency";

const CartDrawer = () => {
  const { 
    cartItems, 
    cartOpen, 
    setCartOpen, 
    isLoading,
    cartTotal
  } = useCart();

  // Calculate totals
  const subtotal = cartTotal;
  const shipping = 0; // Free shipping
  const tax = Math.round(subtotal * 0.08 * 100) / 100; // Assuming 8% tax
  const total = subtotal + shipping + tax;
  
  // Convert to KES
  const subtotalKes = convertUsdToKes(subtotal);
  const shippingKes = convertUsdToKes(shipping);
  const taxKes = convertUsdToKes(tax);
  const totalKes = convertUsdToKes(total);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const drawer = document.getElementById('cart-drawer');
      if (drawer && !drawer.contains(event.target as Node) && cartOpen) {
        setCartOpen(false);
      }
    };

    // Prevent scrolling on body when cart is open
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [cartOpen, setCartOpen]);

  return (
    <aside 
      id="cart-drawer"
      className={`cart-overlay fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50 ${cartOpen ? 'open' : ''}`}
    >
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart ({cartItems.length})</h2>
          <button 
            onClick={() => setCartOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">Looks like you haven't added any drones to your cart yet.</p>
            <Button 
              className="bg-secondary hover:bg-yellow-500 text-primary font-bold"
              onClick={() => setCartOpen(false)}
              asChild
            >
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotalKes)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span className="font-semibold">{formatCurrency(shippingKes)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Estimated Tax</span>
                <span className="font-semibold">{formatCurrency(taxKes)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(totalKes)}</span>
              </div>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded mb-3 text-lg"
                asChild
                disabled={cartItems.length === 0}
              >
                <Link href="/checkout">
                  Make Payment 💳 ({formatCurrency(totalKes)})
                </Link>
              </Button>
              <Button 
                className="w-full bg-secondary hover:bg-yellow-500 text-primary font-bold py-3 px-4 rounded mb-3"
                asChild
                disabled={cartItems.length === 0}
              >
                <Link href="/cart">View Full Cart</Link>
              </Button>
              <Button 
                className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded"
                variant="outline"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default CartDrawer;
