import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart, Share2, Check, Info } from "lucide-react";
import Rating from "@/components/ui/rating";
import QuantitySelector from "@/components/ui/quantity-selector";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/components/cart/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  const { data, isLoading, error } = useQuery<{
    product: any;
    related: any[];
  }>({
    queryKey: [`/api/products/${slug}`],
  });

  const product = data?.product;
  const relatedProducts = data?.related || [];

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: 0, // Will be set by server
        sessionId: "",
        productId: product.id,
        quantity,
        product
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        id: 0, // Will be set by server
        sessionId: "",
        productId: product.id,
        quantity,
        product
      });
      // Use wouter's navigate function instead of window.location.href
      navigate("/checkout");
    }
  };

  const handleQuantityIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Parse product specifications if available
  const specifications = product?.specifications 
    ? JSON.parse(product.specifications) 
    : null;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Product Not Found</h2>
          <p className="text-red-600 mb-4">
            We couldn't find the product you're looking for. It may have been removed or the URL is incorrect.
          </p>
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} | DroneZone`}</title>
        <meta 
          name="description" 
          content={`${product.description.substring(0, 155)}...`}
        />
        <meta property="og:title" content={`${product.name} | DroneZone`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.imageUrl} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${product.category.slug}`}>
                {product.category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="sticky top-24">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full rounded-lg"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Rating & Reviews */}
            <div className="mb-4">
              <Rating 
                value={Number(product.rating)} 
                reviews={product.numReviews} 
              />
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <span className="text-error font-bold text-3xl">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-gray-500 line-through text-xl ml-2">
                  ${Number(product.compareAtPrice).toFixed(2)}
                </span>
              )}
              {product.compareAtPrice && (
                <span className="bg-error text-white px-2 py-1 text-sm rounded ml-2">
                  Save ${(Number(product.compareAtPrice) - Number(product.price)).toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Stock Status */}
            <div className="flex items-center text-sm mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center text-success">
                  <Check size={16} className="mr-1" />
                  <span>In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-error">
                  <Info size={16} className="mr-1" />
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
            
            {/* Add to Cart Section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Quantity</span>
                <QuantitySelector 
                  quantity={quantity}
                  onIncrease={handleQuantityIncrease}
                  onDecrease={handleQuantityDecrease}
                  max={product.stock}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button 
                  className="bg-secondary hover:bg-secondary/90 text-primary font-bold"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>
              
              <div className="flex justify-between mt-3">
                <Button variant="ghost" size="sm">
                  <Heart className="mr-1 h-4 w-4" />
                  Add to Wishlist
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-1 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
            
            {/* Specifications & Reviews Tabs */}
            <Tabs defaultValue="specifications">
              <TabsList className="w-full">
                <TabsTrigger value="specifications" className="flex-1">Specifications</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specifications" className="p-4 bg-gray-50 rounded-lg mt-2">
                {specifications ? (
                  <div className="space-y-4">
                    {Object.entries(specifications).map(([key, value]) => {
                      if (key === 'features' && Array.isArray(value)) {
                        return (
                          <div key={key} className="space-y-2">
                            <h3 className="font-semibold capitalize">{key}</h3>
                            <ul className="list-disc pl-5 space-y-1">
                              {(value as string[]).map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={key}>
                          <span className="font-semibold capitalize">{key}: </span>
                          <span>{value as string}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>No detailed specifications available for this product.</p>
                )}
              </TabsContent>
              
              <TabsContent value="reviews" className="p-4 bg-gray-50 rounded-lg mt-2">
                <div className="flex flex-col items-center mb-6">
                  <span className="text-5xl font-bold mb-2">{product.rating}</span>
                  <Rating value={Number(product.rating)} reviews={product.numReviews} />
                  <span className="text-gray-500 mt-1">Based on {product.numReviews} reviews</span>
                </div>
                
                <div className="space-y-4">
                  <p className="text-center text-gray-600">Customer reviews will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: any) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetailPage;
