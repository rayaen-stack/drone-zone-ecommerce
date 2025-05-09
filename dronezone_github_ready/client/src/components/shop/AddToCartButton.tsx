import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "../cart/CartContext"; 
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  product: any;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const AddToCartButton = ({
  product,
  variant = "default",
  size = "default",
  className = ""
}: AddToCartButtonProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);
  const { addToCart, cartItems } = useCart();
  const { toast } = useToast();

  // Check if product already in cart
  const productInCart = cartItems.find(item => item.productId === product.id);
  const quantityInCart = productInCart ? productInCart.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: 0, // Will be set by server
      sessionId: "",
      productId: product.id,
      quantity: quantity,
      product
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} (${quantity}) added to your cart`,
    });

    // Reset quantity and hide selector after adding
    setQuantity(1);
    setShowQuantity(false);
  };

  const increaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < product.stock) {
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  };

  const decreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  if (product.stock <= 0) {
    return (
      <Button 
        variant="outline" 
        size={size}
        className={`bg-gray-100 text-gray-400 cursor-not-allowed ${className}`}
        disabled
      >
        Out of Stock
      </Button>
    );
  }

  // Buy Now function - adds to cart and redirects to checkout
  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add to cart first
    addToCart({
      id: 0, // Will be set by server
      sessionId: "",
      productId: product.id,
      quantity: quantity,
      product
    });

    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  return (
    <div className="relative" 
      onMouseEnter={() => setShowQuantity(true)}
      onMouseLeave={() => setShowQuantity(false)}
    >
      {showQuantity && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white shadow-md rounded-md p-2 z-10 flex items-center justify-between">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="mx-2 font-medium">{quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={increaseQuantity}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div className="flex flex-col gap-2 w-full">
        <Button 
          variant={variant}
          size={size}
          className={`${className} ${quantityInCart > 0 ? 'bg-green-600 hover:bg-green-700' : ''}`}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {quantityInCart > 0 ? `Add More (${quantityInCart} in cart)` : "Add to Cart"}
        </Button>
        
        <Button
          variant="default"
          size={size}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
          onClick={handleBuyNow}
        >
          Buy Now 💳
        </Button>
      </div>
    </div>
  );
};

export default AddToCartButton;