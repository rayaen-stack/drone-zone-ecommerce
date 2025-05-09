import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { nanoid } from "nanoid";

interface CartItem {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  product: any;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isLoading: false,
  cartOpen: false,
  setCartOpen: () => {},
  cartTotal: 0
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { toast } = useToast();

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  // Initialize cart session
  useEffect(() => {
    const initSession = async () => {
      const storedSessionId = localStorage.getItem("cartSessionId");
      
      if (storedSessionId) {
        setSessionId(storedSessionId);
        fetchCart(storedSessionId);
      } else {
        await createNewSession();
      }
    };
    
    initSession();
  }, []);

  // Create a new cart session
  const createNewSession = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/cart/session");
      const data = await response.json();
      
      setSessionId(data.sessionId);
      localStorage.setItem("cartSessionId", data.sessionId);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to create cart session:", error);
      // Fallback to client-side session ID
      const fallbackId = nanoid(16);
      setSessionId(fallbackId);
      localStorage.setItem("cartSessionId", fallbackId);
      setIsLoading(false);
    }
  };

  // Fetch cart items
  const fetchCart = async (sid: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("GET", `/api/cart/${sid}`);
      const data = await response.json();
      console.log("Cart items fetched:", data);
      setCartItems(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (item: CartItem) => {
    try {
      setIsLoading(true);
      
      // Ensure we have a session ID
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        // Create a new session if needed
        await createNewSession();
        currentSessionId = sessionId;
        
        // If still no session ID, use fallback
        if (!currentSessionId) {
          const fallbackId = nanoid(16);
          setSessionId(fallbackId);
          localStorage.setItem("cartSessionId", fallbackId);
          currentSessionId = fallbackId;
        }
      }
      
      const cartItem = {
        sessionId: currentSessionId,
        productId: item.productId,
        quantity: item.quantity
      };
      
      console.log("Adding to cart with session:", currentSessionId);
      const response = await apiRequest("POST", "/api/cart", cartItem);
      const updatedCart = await response.json();
      
      setCartItems(updatedCart);
      setCartOpen(true);
      
      toast({
        title: "Item added to cart",
        description: `${item.product.name} has been added to your cart.`
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Failed to add item",
        description: "There was an error adding this item to your cart.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: number) => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest("DELETE", `/api/cart/${itemId}`);
      const updatedCart = await response.json();
      
      setCartItems(updatedCart);
      
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart."
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Failed to remove item",
        description: "There was an error removing this item from your cart.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest("PUT", `/api/cart/${itemId}`, { quantity });
      const updatedItem = await response.json();
      
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? updatedItem : item
        )
      );
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Failed to update cart",
        description: "There was an error updating your cart.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
        cartOpen,
        setCartOpen,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
