import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Carousel data
  const slides = [
    {
      image: "https://pixabay.com/get/g284c6588c8fb710bb26481d7b83411ad5125f3f05667eac41338cc515fb6d75f3c8dc0741cf276f4ae658e4420c9c6304103dd1cc2e2ad9e22ae49572687b361_1280.jpg",
      title: "Discover the Ultimate Drone Experience",
      description: "Professional aerial photography with our latest 8K camera drones.",
      link: "/category/professional-drones"
    },
    {
      image: "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?q=80&w=1632&auto=format&fit=crop",
      title: "Racing Drones at Their Finest",
      description: "Experience lightning-fast speeds and precision control with our racing drones.",
      link: "/category/racing-drones"
    },
    {
      image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&h=800",
      title: "Capture Moments Like Never Before",
      description: "Explore our range of consumer drones perfect for beginners and enthusiasts.",
      link: "/category/consumer-drones"
    }
  ];
  
  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);
  
  return (
    <section className="relative bg-neutral">
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        {/* Carousel slides */}
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white max-w-md p-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{slide.title}</h1>
              <p className="text-lg mb-4">{slide.description}</p>
              <Button 
                className="bg-secondary hover:bg-secondary/90 text-primary font-bold"
                asChild
              >
                <Link href={slide.link}>Shop Now</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Carousel indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button 
            key={index}
            className={`h-2 ${
              index === currentSlide ? "w-10 bg-white opacity-100" : "w-2 bg-white opacity-50"
            } rounded-full transition-all duration-300`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
