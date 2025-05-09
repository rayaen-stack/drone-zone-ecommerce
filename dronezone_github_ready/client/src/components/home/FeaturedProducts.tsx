import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ProductCard from "../product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProducts = () => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['/api/featured-products'],
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Drones</h2>
          <Link href="/products" className="text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
              <Skeleton className="w-full h-56 mb-4" />
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-6 w-4/5 mb-2" />
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-error">Failed to load featured products. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Drones</h2>
        <Link href="/products" className="text-blue-600 hover:underline">View all</Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
