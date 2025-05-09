import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "../cart/CartContext";
import Rating from "../ui/rating";
import { Button } from "@/components/ui/button";

const Accessories = () => {
  const { data: accessories, isLoading, error } = useQuery({
    queryKey: ['/api/accessories'],
  });

  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: 0, // Will be set by server
      sessionId: "",
      productId: product.id,
      quantity: 1,
      product
    });
  };

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Top Accessories</h2>
          <Link href="/category/accessories" className="text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
              <Skeleton className="w-full h-48 mb-4" />
              <Skeleton className="h-5 w-4/5 mb-2" />
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-5 w-1/3 mb-3" />
              <Skeleton className="h-9 w-full" />
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
          <p className="text-error">Failed to load accessories. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Top Accessories</h2>
        <Link href="/category/accessories" className="text-blue-600 hover:underline">View all</Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {accessories?.map((accessory: any) => (
          <div key={accessory.id} className="product-card bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200">
            <Link href={`/products/${accessory.slug}`}>
              <img 
                src={accessory.imageUrl} 
                alt={accessory.name} 
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link href={`/products/${accessory.slug}`}>
                <h3 className="font-semibold text-lg mb-1">{accessory.name}</h3>
              </Link>
              <Rating 
                value={Number(accessory.rating)} 
                reviews={accessory.numReviews} 
                size={14}
              />
              <div className="mb-3">
                <span className="text-error font-bold text-lg">${Number(accessory.price).toFixed(2)}</span>
                {accessory.compareAtPrice && (
                  <span className="text-gray-500 line-through text-sm ml-2">
                    ${Number(accessory.compareAtPrice).toFixed(2)}
                  </span>
                )}
              </div>
              <Button 
                className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold"
                onClick={() => handleAddToCart(accessory)}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Accessories;
