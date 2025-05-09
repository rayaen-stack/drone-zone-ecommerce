import { useEffect } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ChevronRight, CreditCard } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { formatCurrency, convertUsdToKes } from "@/lib/currency";
import CartItem from "@/components/cart/CartItem";

const CartPage = () => {
  const { cartItems, isLoading, cartTotal } = useCart();

  // Calculate order summary in Kenyan Shillings
  const subtotalKES = convertUsdToKes(cartTotal);
  const shippingKES = 0; // Free shipping
  const taxKES = Math.round(subtotalKES * 0.16 * 100) / 100; // Assuming 16% VAT in Kenya
  const totalKES = subtotalKES + shippingKES + taxKES;

  // Close cart drawer if open when navigating to this page
  useEffect(() => {
    const cartDrawer = document.getElementById("cart-drawer");
    if (cartDrawer && cartDrawer.classList.contains("open")) {
      cartDrawer.classList.remove("open");
      document.body.style.overflow = "";
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Your Shopping Cart | DroneZone</title>
        <meta 
          name="description" 
          content="Review the items in your shopping cart and proceed to checkout. Free shipping on orders over $100."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <ShoppingCart size={64} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any drones to your cart yet.
            </p>
            <Button asChild className="bg-secondary hover:bg-secondary/90 text-primary font-bold">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map(item => (
                      <CartItem key={item.id} item={item} inPage={true} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(subtotalKES)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{formatCurrency(shippingKES)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">VAT (16%)</span>
                      <span>{formatCurrency(taxKES)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(totalKES)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3">
                  <div className="p-3 bg-green-50 border border-green-100 rounded-lg mb-2">
                    <h3 className="text-center font-bold text-lg mb-2">Ready to Complete Your Purchase?</h3>
                    <Button 
                      asChild 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold pulse-animation" 
                      size="lg"
                    >
                      <Link href="/checkout">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Make Payment ({formatCurrency(totalKES)})
                      </Link>
                    </Button>
                    <p className="text-sm text-center mt-2">
                      Secure checkout with multiple payment options
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-between mb-3">
                    <div className="text-center flex-1">
                      <div className="bg-gray-100 p-2 rounded-full mx-auto w-12 h-12 flex items-center justify-center mb-1">
                        <img src="/visa.svg" alt="Credit Card" className="w-6 h-6" />
                      </div>
                      <span className="text-xs">Card</span>
                    </div>
                    <div className="text-center flex-1">
                      <div className="bg-gray-100 p-2 rounded-full mx-auto w-12 h-12 flex items-center justify-center mb-1">
                        <img src="/mpesa.svg" alt="M-Pesa" className="w-6 h-6" />
                      </div>
                      <span className="text-xs">M-Pesa</span>
                    </div>
                    <div className="text-center flex-1">
                      <div className="bg-gray-100 p-2 rounded-full mx-auto w-12 h-12 flex items-center justify-center mb-1">
                        <img src="/bank.svg" alt="Bank Transfer" className="w-6 h-6" />
                      </div>
                      <span className="text-xs">Bank</span>
                    </div>
                    <div className="text-center flex-1">
                      <div className="bg-gray-100 p-2 rounded-full mx-auto w-12 h-12 flex items-center justify-center mb-1">
                        <img src="/paypal.svg" alt="PayPal" className="w-6 h-6" />
                      </div>
                      <span className="text-xs">PayPal</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center mb-2">Secure payment with 128-bit encryption</p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/products">
                      Continue Shopping
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
