import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "../cart/CartContext";

const DealOfTheDay = () => {
  // Hardcoded deal of the day - in a real app, this would come from an API
  const dealProduct = {
    id: 5,
    name: "DJI Air 2S Fly More Combo",
    description: "Complete drone kit with extra batteries, ND filters, and carrying case.",
    originalPrice: 1299.99,
    salePrice: 999.99,
    savings: 300,
    imageUrl: "https://pixabay.com/get/g6c0bb21844a7eec59bba3bd440bf745d2203238e60f82dfb15d6ca1dff05f55783b67c2cc521692cf02b7ba720b6e4c725c1e60125a7403991c48d4137cd46e8_1280.jpg"
  };

  // Countdown timer state
  const [countdown, setCountdown] = useState({
    hours: 12,
    minutes: 45,
    seconds: 32
  });

  const { addToCart } = useCart();

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        // Reset when countdown reaches zero
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBuyNow = () => {
    addToCart({
      id: 0, // This will be replaced by the server
      sessionId: "",
      productId: dealProduct.id,
      quantity: 1,
      product: {
        ...dealProduct,
        price: dealProduct.salePrice.toString(),
        slug: "dji-air-2s-fly-more-combo"
      }
    });
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-white text-3xl font-bold mb-2">Deal of the Day</h2>
            <div className="bg-white text-error inline-block px-3 py-1 rounded-full font-bold text-lg mb-4">
              Save ${dealProduct.savings}
            </div>
            <h3 className="text-white text-2xl font-bold mb-2">{dealProduct.name}</h3>
            <p className="text-white/90 mb-4">{dealProduct.description}</p>
            <div className="mb-4">
              <span className="text-white font-bold text-3xl">${dealProduct.salePrice.toFixed(2)}</span>
              <span className="text-white/80 line-through text-xl ml-2">${dealProduct.originalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                <span className="block text-white text-xl font-bold">{countdown.hours.toString().padStart(2, '0')}</span>
                <span className="text-white/90 text-sm">Hours</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                <span className="block text-white text-xl font-bold">{countdown.minutes.toString().padStart(2, '0')}</span>
                <span className="text-white/90 text-sm">Minutes</span>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2 text-center">
                <span className="block text-white text-xl font-bold">{countdown.seconds.toString().padStart(2, '0')}</span>
                <span className="text-white/90 text-sm">Seconds</span>
              </div>
            </div>
            <Button 
              className="bg-secondary hover:bg-yellow-500 text-primary font-bold py-3 w-full md:w-auto"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
          <div className="md:w-1/2 flex items-center justify-center p-6">
            <img 
              src={dealProduct.imageUrl} 
              alt={dealProduct.name} 
              className="w-full max-w-lg h-auto rounded-lg shadow-lg" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;
