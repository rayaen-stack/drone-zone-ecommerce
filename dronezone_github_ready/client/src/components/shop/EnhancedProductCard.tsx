import { useState } from "react";
import { Link } from "wouter";
import { Heart, ArrowRight, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Rating from "../ui/rating";
import { formatCurrency, convertUsdToKes } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";
import AddToCartButton from "./AddToCartButton";

interface EnhancedProductCardProps {
  product: any;
  showAddToCart?: boolean;
}

const EnhancedProductCard = ({ product, showAddToCart = true }: EnhancedProductCardProps) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Added to Wishlist",
      description: `${product.name} added to your wishlist`,
    });
  };

  const discountPercent = product.compareAtPrice 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.compareAtPrice)) * 100) 
    : 0;

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
          onClick={handleAddToWishlist}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Discount Badge */}
      {discountPercent > 0 && (
        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
          {discountPercent}% OFF
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
          </div>

          {showAddToCart ? (
            <div className="flex gap-2">
              <AddToCartButton 
                product={product}
                variant="secondary"
                className="flex-1 text-primary font-semibold"
              />
              
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
          ) : (
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

export default EnhancedProductCard;