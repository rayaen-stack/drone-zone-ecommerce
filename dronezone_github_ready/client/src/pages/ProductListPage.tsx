import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Helmet } from "react-helmet";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight,
  Filter,
  SlidersHorizontal
} from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import { useMobile } from "@/hooks/use-mobile";

const ProductListPage = () => {
  const [location] = useLocation();
  const search = useSearch();
  const isMobile = useMobile();
  
  // Get category slug from URL if present
  const categorySlug = location.includes('/category/') 
    ? location.split('/category/')[1] 
    : 'all';
  
  // Parse query parameters
  const params = new URLSearchParams(search);
  const queryParam = params.get('query') || '';
  const pageParam = params.get('page') || '1';
  const sortParam = params.get('sort') || 'featured';
  
  // State for filters
  const [currentPage, setCurrentPage] = useState(parseInt(pageParam));
  const [sort, setSort] = useState(sortParam);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug, sort, priceRange]);

  // Fetch category if needed
  const { data: categoryData } = useQuery({
    queryKey: ['/api/categories', categorySlug],
    enabled: categorySlug !== 'all'
  });

  // Fetch all categories for filter
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Fetch products with filters
  const { data, isLoading, error } = useQuery({
    queryKey: [
      '/api/products', 
      {
        categorySlug,
        minPrice: priceRange[0] > 0 ? priceRange[0].toString() : undefined,
        maxPrice: priceRange[1] < 2000 ? priceRange[1].toString() : undefined,
        sort,
        query: queryParam,
        page: currentPage.toString()
      }
    ],
  });

  const products = data?.products || [];
  const pagination = data?.pagination || { total: 0, page: 1, pageSize: 12, totalPages: 1 };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleMobileFiltersToggle = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  // Get the page title
  const getPageTitle = () => {
    if (queryParam) {
      return `Search Results for "${queryParam}" | DroneZone`;
    }
    if (categorySlug !== 'all' && categoryData) {
      return `${categoryData.name} | DroneZone`;
    }
    return "All Drones & Accessories | DroneZone";
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta 
          name="description" 
          content={queryParam 
            ? `Browse search results for ${queryParam}. Find the best drones and accessories at DroneZone.`
            : categorySlug !== 'all' && categoryData
              ? `Shop our selection of ${categoryData.name}. Free shipping on orders over $100.`
              : "Browse our complete collection of drones and accessories. Find the perfect drone for your needs."
          } 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {queryParam 
              ? `Search Results for "${queryParam}"`
              : categorySlug !== 'all' && categoryData 
                ? categoryData.name 
                : "All Products"}
          </h1>
          {categorySlug !== 'all' && categoryData?.description && (
            <p className="text-gray-600">{categoryData.description}</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold text-lg mb-4">Filters</h2>
              
              <Accordion type="single" collapsible defaultValue="category">
                <AccordionItem value="category">
                  <AccordionTrigger>Category</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="all-categories" 
                          checked={categorySlug === 'all'} 
                          onCheckedChange={() => window.location.href = '/products'}
                        />
                        <Label htmlFor="all-categories">All Categories</Label>
                      </div>
                      {categories?.map((category: any) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category.id}`}
                            checked={categorySlug === category.slug}
                            onCheckedChange={() => window.location.href = `/category/${category.slug}`}
                          />
                          <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[0, 2000]}
                        max={2000}
                        step={10}
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                      />
                      <div className="flex items-center justify-between">
                        <div className="w-20">
                          <Input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            min={0}
                            max={priceRange[1]}
                          />
                        </div>
                        <span>to</span>
                        <div className="w-20">
                          <Input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            min={priceRange[0]}
                            max={2000}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="ratings">
                  <AccordionTrigger>Customer Ratings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <Checkbox id={`rating-${rating}`} />
                          <Label htmlFor={`rating-${rating}`}>
                            {rating}+ Stars
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button className="w-full mt-4" variant="outline">
                Clear All Filters
              </Button>
            </div>
          </div>

          {/* Mobile Filters Button */}
          <div className="md:hidden mb-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={handleMobileFiltersToggle}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters & Sort
            </Button>
          </div>

          {/* Mobile Filters Panel */}
          {mobileFiltersOpen && (
            <div className="md:hidden fixed inset-0 bg-white z-50 overflow-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Filters & Sort</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleMobileFiltersToggle}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <Separator className="my-2" />
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Sort By</h3>
                <Select value={sort} onValueChange={(value) => setSort(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="rating">Customer Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Accordion type="single" collapsible defaultValue="category">
                <AccordionItem value="category">
                  <AccordionTrigger>Category</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="mobile-all-categories" 
                          checked={categorySlug === 'all'} 
                          onCheckedChange={() => window.location.href = '/products'}
                        />
                        <Label htmlFor="mobile-all-categories">All Categories</Label>
                      </div>
                      {categories?.map((category: any) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-category-${category.id}`}
                            checked={categorySlug === category.slug}
                            onCheckedChange={() => window.location.href = `/category/${category.slug}`}
                          />
                          <Label htmlFor={`mobile-category-${category.id}`}>{category.name}</Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[0, 2000]}
                        max={2000}
                        step={10}
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                      />
                      <div className="flex items-center justify-between">
                        <div className="w-20">
                          <Input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            min={0}
                            max={priceRange[1]}
                          />
                        </div>
                        <span>to</span>
                        <div className="w-20">
                          <Input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            min={priceRange[0]}
                            max={2000}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-6 space-y-2">
                <Button 
                  className="w-full" 
                  onClick={handleMobileFiltersToggle}
                >
                  Apply Filters
                </Button>
                <Button variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Sorting & Results Count - Desktop */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <p className="text-gray-500">
                Showing {products.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0}-
                {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} products
              </p>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Sort by:</span>
                <Select value={sort} onValueChange={(value) => setSort(value)}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="rating">Customer Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Product Grid */}
            <ProductGrid 
              products={products} 
              isLoading={isLoading} 
              error={error as Error}
              columns={isMobile ? 2 : 3}
            />
            
            {/* Pagination */}
            {!isLoading && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    
                    // Show first, last, current, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="icon"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    
                    // Show ellipsis for skipped pages
                    if (
                      pageNum === 2 ||
                      pageNum === pagination.totalPages - 1
                    ) {
                      return <span key={pageNum}>...</span>;
                    }
                    
                    return null;
                  })}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListPage;
