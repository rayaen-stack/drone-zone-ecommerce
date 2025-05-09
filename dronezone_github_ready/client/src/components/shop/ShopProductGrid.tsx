import { Skeleton } from "@/components/ui/skeleton";
import EnhancedProductCard from "./EnhancedProductCard";

interface ShopProductGridProps {
  products: any[];
  isLoading: boolean;
  error: Error | null;
  columns?: number;
  showAddToCart?: boolean;
}

const ShopProductGrid = ({ 
  products, 
  isLoading, 
  error, 
  columns = 4,
  showAddToCart = true
}: ShopProductGridProps) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns} gap-6`}>
        {[...Array(columns * 2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-4">
            <Skeleton className="w-full h-56 mb-4" />
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-6 w-4/5 mb-2" />
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-error">Failed to load products. Please try again later.</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found. Try different filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns} gap-6`}>
      {products.map((product) => (
        <EnhancedProductCard 
          key={product.id} 
          product={product} 
          showAddToCart={showAddToCart}
        />
      ))}
    </div>
  );
};

export default ShopProductGrid;