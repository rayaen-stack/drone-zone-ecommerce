import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import ShopProductGrid from "../components/shop/ShopProductGrid";
import { useMobile } from "@/hooks/use-mobile";
import { 
  ChevronRight,
  Laptop,
  Camera,
  Battery,
  Cpu,
  Monitor,
  Package
} from "lucide-react";

const ShopPage = () => {
  const isMobile = useMobile();
  
  // Fetch featured products
  const { data: featuredProducts = [], isLoading: featuredLoading } = useQuery<any[]>({
    queryKey: ['/api/featured-products'],
  });
  
  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });

  // Get all products
  const { data, isLoading: productsLoading } = useQuery<{products: any[]}>({
    queryKey: ['/api/products'],
  });
  
  const products = data?.products || [];
  const isLoading = featuredLoading || categoriesLoading || productsLoading;

  // Get icon for category
  const getCategoryIcon = (slug: string) => {
    switch(slug) {
      case 'consumer-drones':
        return <Laptop className="h-8 w-8" />;
      case 'professional-drones':
        return <Camera className="h-8 w-8" />;
      case 'accessories':
        return <Battery className="h-8 w-8" />;
      case 'drone-kits':
        return <Package className="h-8 w-8" />;
      case 'parts':
        return <Cpu className="h-8 w-8" />;
      default:
        return <Monitor className="h-8 w-8" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Shop Drones & Accessories | DroneZone</title>
        <meta 
          name="description" 
          content="Shop our complete collection of drones, accessories, and parts. Free shipping on orders over KSh 10,000." 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <div className="relative rounded-lg overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-primary to-primary/80 h-[300px] md:h-[400px]">
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Discover Our Premium Drone Collection
                </h1>
                <p className="text-white/90 mb-8 text-lg">
                  High-performance drones for professional and recreational use. 
                  Free shipping on orders over KSh 10,000.
                </p>
                <Button 
                  asChild
                  className="bg-secondary hover:bg-secondary/90 text-primary px-8 py-3 font-bold text-lg"
                >
                  <Link href="#featured-products">
                    Shop Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Shop By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {!categoriesLoading && categories?.map((category: any) => (
              <Link 
                key={category.id} 
                href={`/category/${category.slug}`}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:scale-105"
              >
                <div className="bg-primary/10 p-4 rounded-full mb-3 text-primary">
                  {getCategoryIcon(category.slug)}
                </div>
                <h3 className="font-semibold">{category.name}</h3>
                <span className="text-sm text-gray-500 mt-1">Shop Now &rarr;</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div id="featured-products" className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/products?sort=featured" className="text-blue-600 hover:underline flex items-center">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <ShopProductGrid 
            products={featuredProducts || []} 
            isLoading={featuredLoading} 
            error={null}
            columns={isMobile ? 2 : 4}
          />
        </div>

        {/* New Arrivals */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Link href="/products?sort=newest" className="text-blue-600 hover:underline flex items-center">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <ShopProductGrid 
            products={products.slice(0, 8)} 
            isLoading={productsLoading} 
            error={null}
            columns={isMobile ? 2 : 4}
          />
        </div>
        
        {/* Shop By Deals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-blue-50 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Special Offers</h3>
              <p className="text-gray-700 mb-4">Save up to 30% on selected drones and accessories</p>
              <Button 
                asChild
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <Link href="/deals">
                  View Deals
                </Link>
              </Button>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Bundle & Save</h3>
              <p className="text-gray-700 mb-4">Get discounts when you purchase drones with accessories</p>
              <Button 
                asChild
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              >
                <Link href="/category/drone-kits">
                  Shop Bundles
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Accessories */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Essential Accessories</h2>
            <Link href="/category/accessories" className="text-blue-600 hover:underline flex items-center">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Get products with categoryId for accessories */}
          <ShopProductGrid 
            products={products.filter((product: any) => 
              product.categoryId === (categories?.find((c: any) => c.slug === 'accessories')?.id || 3)
            ).slice(0, 4)} 
            isLoading={productsLoading || categoriesLoading} 
            error={null}
            columns={isMobile ? 2 : 4}
          />
        </div>
      </div>
    </>
  );
};

export default ShopPage;