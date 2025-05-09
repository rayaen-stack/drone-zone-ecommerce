import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import ProductGrid from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, convertUsdToKes } from "@/lib/currency";

const DealsPage = () => {
  const { data: products = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/featured-products'],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Today's Deals - DroneZone</title>
        <meta name="description" content="Check out today's best deals on drones and accessories. Limited-time offers with special discounts." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-2">Today's Deals</h1>
      <p className="text-gray-600 mb-8">Limited-time offers. Get them before they're gone!</p>
      
      {/* Deal of the day */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-12">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <div className="inline-block bg-yellow-400 text-black font-bold px-3 py-1 rounded-full mb-4">
                DEAL OF THE DAY
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">30% OFF DJI Mini 3 Pro Bundle</h2>
              <p className="mb-6 text-white/80">Get our most popular drone with accessories at a special price. Includes extra batteries, propellers, and a carrying case.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white hover:bg-gray-100 text-primary">
                  Shop Now
                </Button>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold line-through opacity-70">{formatCurrency(convertUsdToKes(799))}</div>
                  <div className="text-3xl font-bold">{formatCurrency(convertUsdToKes(559))}</div>
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-center font-bold mb-2">Deal ends in:</div>
                <div className="flex justify-center gap-2 text-center">
                  <div className="bg-white/30 p-2 rounded w-16">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs">Hours</div>
                  </div>
                  <div className="bg-white/30 p-2 rounded w-16">
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-xs">Minutes</div>
                  </div>
                  <div className="bg-white/30 p-2 rounded w-16">
                    <div className="text-2xl font-bold">20</div>
                    <div className="text-xs">Seconds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mb-6">Featured Deals</h2>
      <ProductGrid 
        products={Array.isArray(products) ? products : []}
        isLoading={isLoading}
        error={error as Error}
        columns={3}
      />
    </div>
  );
};

export default DealsPage;