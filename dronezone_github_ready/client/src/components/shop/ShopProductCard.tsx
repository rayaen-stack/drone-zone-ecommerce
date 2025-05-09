import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  ShoppingCart, 
  Heart, 
  ArrowRight,
  ShoppingBag,
  Plus,
  Minus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Rating from "../ui/rating";
import { useCart } from "../cart/CartContext";
import { formatCurrency, convertUsdToKes } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";

interface ShopProductCardProps {
  product: any;
  showAddToCart?: boolean;
}

const ShopProductCard = ({ product, showAddToCart = true }: ShopProductCardProps) => {
  const { addToCart, cartItems } = useCart();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Check if product is already in cart
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
      description: `${product.name} x${quantity} added to your cart`,
    });
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

  return (
    <div 
      className="product-card relative bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick action buttons - only visible on hover */}
      <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <Button 
          size="icon" 
          variant="outline" 
          className="h-8 w-8 rounded-full bg-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toast({
              title: "Added to Wishlist",
              description: `${product.name} added to your wishlist`,
            });
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Discount Badge */}
      {product.compareAtPrice && (
        <Badge className="absolute top-2 left-2 bg-error">
          {Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice)) * 100)}% OFF
        </Badge>
      )}

      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-56 object-cover transform transition-transform duration-300 hover:scale-105"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-1">
            <Rating value={Number(product.rating)} reviews={product.numReviews} />
          </div>
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
          <div className="mb-2">
            <span className="text-error font-bold text-xl">{formatCurrency(convertUsdToKes(product.price))}</span>
            {product.compareAtPrice && (
              <span className="text-gray-500 line-through text-sm ml-2">
                {formatCurrency(convertUsdToKes(product.compareAtPrice))}
              </span>
            )}
          </div>
          <div className="flex items-center text-sm mb-3">
            {product.stock > 0 ? (
              <span className="text-success flex items-center">
                <Check size={16} className="mr-1" />
                In Stock
              </span>
            ) : (
              <span className="text-error">Out of Stock</span>
            )}
            
            {quantityInCart > 0 && (
              <span className="ml-auto text-sm text-gray-500">
                {quantityInCart} in cart
              </span>
            )}
          </div>

          {showAddToCart && (
            <>
              {/* Quantity selector - only visible on hover */}
              <div className={`flex items-center mb-3 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="mx-3 font-medium text-sm w-5 text-center">{quantity}</span>
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
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-secondary hover:bg-secondary/90 text-primary font-semibold py-2 px-4 rounded"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                
                <Button 
                  variant="outline"
                  className="bg-transparent border-primary text-primary hover:bg-primary hover:text-white px-3"
                  asChild
                >
                  <Link href={`/products/${product.slug}`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </>
          )}
          
          {!showAddToCart && (
            <Button 
              className="w-full mt-2 bg-primary hover:bg-primary/90 text-white"
              asChild
            >
              <Link href={`/products/${product.slug}`}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop Now
              </Link>
            </Button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ShopProductCard;