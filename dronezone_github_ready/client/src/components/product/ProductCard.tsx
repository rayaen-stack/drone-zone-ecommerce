import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Rating from "../ui/rating";
import { useCart } from "../cart/CartContext";
import { formatCurrency, convertUsdToKes } from "@/lib/currency";

interface ProductCardProps {
  product: any;
  compact?: boolean;
}

const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: 0, // Will be set by server
      sessionId: "",
      productId: product.id,
      quantity: 1,
      product
    });
  };

  if (compact) {
    return (
      <Link 
        href={`/products/${product.slug}`} 
        className="product-card bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 block"
      >
        <div className="flex">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-24 h-24 object-cover"
          />
          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
            <Rating value={Number(product.rating)} reviews={product.numReviews} size={12} showCount={false} />
            <div className="text-error font-semibold text-sm">
              {formatCurrency(convertUsdToKes(product.price))}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="product-card bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200">
      <Link href={`/products/${product.slug}`}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-56 object-cover"
        />
        <div className="p-4">
          <div className="flex items-center mb-1">
            <Rating value={Number(product.rating)} reviews={product.numReviews} />
          </div>
          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
          <div className="mb-2">
            <span className="text-error font-bold text-xl">{formatCurrency(convertUsdToKes(product.price))}</span>
            {product.compareAtPrice && (
              <span className="text-gray-500 line-through text-sm ml-2">
                {formatCurrency(convertUsdToKes(product.compareAtPrice))}
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-success mb-3">
            <Check size={16} className="mr-1" />
            <span>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
          </div>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          <Button 
            className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold py-2 px-4 rounded"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </Button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
