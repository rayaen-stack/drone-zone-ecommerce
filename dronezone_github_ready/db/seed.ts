import { db } from "./index";
import * as schema from "@shared/schema";
import { faker } from "@faker-js/faker";

async function seed() {
  try {
    console.log("🌱 Seeding database...");
    
    // Check if categories already exist
    const existingCategories = await db.query.categories.findMany();
    
    if (existingCategories.length === 0) {
      // Categories data
      const categories = [
        {
          name: "Consumer Drones",
          description: "Easy to fly drones for beginners and casual users",
          slug: "consumer-drones",
          imageUrl: "https://images.unsplash.com/photo-1506947411487-a56738267384?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
        },
        {
          name: "Professional Drones",
          description: "High-end filming equipment for professional use",
          slug: "professional-drones",
          imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
        },
        {
          name: "Racing Drones",
          description: "Built for speed and agility",
          slug: "racing-drones",
          imageUrl: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
        },
        {
          name: "Accessories",
          description: "Enhance your drone experience with accessories",
          slug: "accessories",
          imageUrl: "https://images.unsplash.com/photo-1598620617148-c9e8ddee6711?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
        }
      ];

      console.log("👉 Adding categories...");
      await db.insert(schema.categories).values(categories);
    }

    // Get categories for reference
    const categoryMap = await db.query.categories.findMany().then(cats => 
      cats.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.id }), {} as Record<string, number>)
    );

    // Check if products already exist
    const existingProducts = await db.query.products.findMany();
    
    if (existingProducts.length === 0) {
      // Products data
      const products = [
        // Consumer Drones
        {
          name: "DJI Mini 3",
          description: "Ultralight 249g drone with 4K HDR video and 38-minute flight time",
          specifications: JSON.stringify({
            weight: "249g",
            camera: "4K HDR Video",
            flightTime: "38 minutes",
            range: "10km",
            features: ["QuickShots", "Panorama", "Return-to-Home"]
          }),
          price: "469.99",
          compareAtPrice: "559.99",
          imageUrl: "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350",
          rating: "4.7",
          numReviews: 214,
          stock: 45,
          categoryId: categoryMap["Consumer Drones"],
          featured: true,
          slug: "dji-mini-3"
        },
        {
          name: "DJI Mavic 3 Pro",
          description: "Hasselblad camera with 5.1K video and 46-minute flight time",
          specifications: JSON.stringify({
            weight: "895g",
            camera: "Hasselblad 5.1K Video",
            flightTime: "46 minutes",
            range: "15km",
            features: ["Omnidirectional Obstacle Sensing", "Advanced Return-to-Home", "MasterShots"]
          }),
          price: "1599.99",
          compareAtPrice: "1799.99",
          imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350",
          rating: "4.5",
          numReviews: 128,
          stock: 20,
          categoryId: categoryMap["Consumer Drones"],
          featured: true,
          slug: "dji-mavic-3-pro"
        },
        
        // Professional Drones
        {
          name: "Autel EVO Lite+",
          description: "1-inch sensor with 6K video recording and 40-minute flight time",
          specifications: JSON.stringify({
            weight: "835g",
            camera: "1-inch CMOS, 6K Video",
            flightTime: "40 minutes",
            range: "12km",
            features: ["Dynamic Track 2.1", "Time-lapse", "HDR Imaging"]
          }),
          price: "1249.99",
          compareAtPrice: "1399.99",
          imageUrl: "https://images.pexels.com/photos/442589/pexels-photo-442589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          rating: "5.0",
          numReviews: 42,
          stock: 15,
          categoryId: categoryMap["Professional Drones"],
          featured: true,
          slug: "autel-evo-lite-plus"
        },
        {
          name: "XDynamics Evolve 2",
          description: "Professional drone with dual-operator control and 8K camera",
          specifications: JSON.stringify({
            weight: "1.15kg",
            camera: "8K Video, Micro Four Thirds",
            flightTime: "35 minutes",
            range: "10km",
            features: ["Dual Operator Control", "Interchangeable Lens System", "High Precision GPS"]
          }),
          price: "899.99",
          compareAtPrice: null,
          imageUrl: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350",
          rating: "4.0",
          numReviews: 86,
          stock: 12,
          categoryId: categoryMap["Professional Drones"],
          featured: true,
          slug: "xdynamics-evolve-2"
        },
        
        // Racing Drones
        {
          name: "DJI FPV Combo",
          description: "Immersive flight experience with goggles and high speed capability",
          specifications: JSON.stringify({
            weight: "795g",
            camera: "4K Super-Wide FOV",
            flightTime: "20 minutes",
            speed: "140km/h",
            features: ["HD Low-Latency Transmission", "Emergency Brake", "Motion Controller Compatible"]
          }),
          price: "799.99",
          compareAtPrice: "999.99",
          imageUrl: "https://images.pexels.com/photos/1087180/pexels-photo-1087180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          rating: "4.8",
          numReviews: 135,
          stock: 25,
          categoryId: categoryMap["Racing Drones"],
          featured: false,
          slug: "dji-fpv-combo"
        },
        {
          name: "iFlight Nazgul Evoque F5",
          description: "Professional FPV racing drone with digital HD system",
          specifications: JSON.stringify({
            weight: "630g",
            camera: "DJI O3 Air Unit",
            flightTime: "7 minutes",
            speed: "160km/h",
            features: ["Carbon Fiber Frame", "F7 Flight Controller", "Digital HD Video Transmission"]
          }),
          price: "439.99",
          compareAtPrice: null,
          imageUrl: "https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          rating: "4.6",
          numReviews: 57,
          stock: 18,
          categoryId: categoryMap["Racing Drones"],
          featured: false,
          slug: "iflight-nazgul-evoque-f5"
        },
        
        // Two more drones
        {
          name: "Holy Stone HS720E",
          description: "Budget-friendly 4K drone with EIS stabilization",
          specifications: JSON.stringify({
            weight: "495g",
            camera: "4K EIS",
            flightTime: "23 minutes",
            range: "3km",
            features: ["GPS Follow Me", "Waypoints", "Return Home"]
          }),
          price: "329.99",
          compareAtPrice: "399.99",
          imageUrl: "https://images.pexels.com/photos/1601217/pexels-photo-1601217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          rating: "4.2",
          numReviews: 187,
          stock: 30,
          categoryId: categoryMap["Consumer Drones"],
          featured: false,
          slug: "holy-stone-hs720e"
        },
        {
          name: "Skydio 2+",
          description: "Advanced obstacle avoidance with autonomous tracking",
          specifications: JSON.stringify({
            weight: "800g",
            camera: "4K HDR 60fps",
            flightTime: "27 minutes",
            range: "6.5km",
            features: ["Autonomous Tracking", "360° Obstacle Avoidance", "Keyframe"]
          }),
          price: "999.99",
          compareAtPrice: "1049.99",
          imageUrl: "https://images.pexels.com/photos/8044178/pexels-photo-8044178.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          rating: "4.9",
          numReviews: 93,
          stock: 10,
          categoryId: categoryMap["Professional Drones"],
          featured: false,
          slug: "skydio-2-plus"
        },

        // Accessories
        {
          name: "DJI Intelligent Flight Battery",
          description: "Official replacement battery for DJI drones",
          specifications: JSON.stringify({
            capacity: "3850mAh",
            voltage: "11.55V",
            compatibility: ["Mavic 3", "Mavic 3 Pro"],
            chargingTime: "90 minutes"
          }),
          price: "129.99",
          compareAtPrice: null,
          imageUrl: "https://images.unsplash.com/photo-1585503418537-88331351ad99?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          rating: "4.5",
          numReviews: 89,
          stock: 50,
          categoryId: categoryMap["Accessories"],
          featured: false,
          slug: "dji-intelligent-flight-battery"
        },
        {
          name: "Hard Shell Carrying Case",
          description: "Protective case for drone and accessories storage",
          specifications: JSON.stringify({
            material: "Polypropylene",
            waterproof: true,
            dimensions: "16\" x 13\" x 7\"",
            compatibility: "Universal"
          }),
          price: "89.99",
          compareAtPrice: "119.99",
          imageUrl: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          rating: "4.0",
          numReviews: 42,
          stock: 35,
          categoryId: categoryMap["Accessories"],
          featured: false,
          slug: "hard-shell-carrying-case"
        },
        {
          name: "Replacement Propellers Set",
          description: "Spare propellers for your drone",
          specifications: JSON.stringify({
            material: "Composite Plastic",
            quantity: "4 pairs",
            compatibility: ["DJI Mini 3", "DJI Mini 3 Pro"],
            installation: "Quick-Release"
          }),
          price: "29.99",
          compareAtPrice: null,
          imageUrl: "https://images.pexels.com/photos/1087181/pexels-photo-1087181.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          rating: "5.0",
          numReviews: 17,
          stock: 100,
          categoryId: categoryMap["Accessories"],
          featured: false,
          slug: "replacement-propellers-set"
        },
        {
          name: "Smart Controller with Screen",
          description: "Advanced controller with built-in display",
          specifications: JSON.stringify({
            screenSize: "5.5 inches",
            brightness: "1000 nits",
            batteryLife: "4 hours",
            connectivity: "OcuSync 3.0",
            compatibility: ["Mavic 3", "Air 2S"]
          }),
          price: "349.99",
          compareAtPrice: "399.99",
          imageUrl: "https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          rating: "3.5",
          numReviews: 32,
          stock: 15,
          categoryId: categoryMap["Accessories"],
          featured: false,
          slug: "smart-controller-with-screen"
        }
      ];

      console.log("👉 Adding products...");
      await db.insert(schema.products).values(products);
    }

    // Check if blog posts already exist
    const existingBlogPosts = await db.query.blogPosts.findMany();
    
    if (existingBlogPosts.length === 0) {
      // Blog posts
      const blogPosts = [
        {
          title: "Top 10 Tips for Better Aerial Photography",
          slug: "top-10-tips-aerial-photography",
          category: "Tutorial",
          summary: "Learn how to capture stunning aerial photos with these proven techniques from professional drone photographers.",
          content: "Full article content here with detailed photography techniques...",
          imageUrl: "https://images.unsplash.com/photo-1531693251400-38df35776dc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350"
        },
        {
          title: "New Drone Regulations You Need to Know in 2023",
          slug: "drone-regulations-2023",
          category: "News",
          summary: "Stay compliant with the latest FAA regulations for recreational and commercial drone pilots.",
          content: "Full article about the latest regulations and compliance requirements...",
          imageUrl: "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350"
        },
        {
          title: "DJI Mini 3 Pro: Is It Worth the Upgrade?",
          slug: "dji-mini-3-pro-review",
          category: "Review",
          summary: "Our in-depth review of the latest compact drone from DJI with comparison to previous models.",
          content: "Full review content comparing features, camera quality, and flight performance...",
          imageUrl: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350"
        }
      ];

      console.log("👉 Adding blog posts...");
      await db.insert(schema.blogPosts).values(blogPosts);
    }

    // Check if testimonials already exist
    const existingTestimonials = await db.query.testimonials.findMany();
    
    if (existingTestimonials.length === 0) {
      // Testimonials
      const testimonials = [
        {
          customerName: "Michael T.",
          avatar: null,
          rating: 5,
          content: "My DJI Mavic 3 Pro arrived faster than expected and the quality is incredible. The camera footage is cinema-quality and the battery life is as advertised. Couldn't be happier!",
          isVerified: true
        },
        {
          customerName: "Sarah K.",
          avatar: null,
          rating: 5,
          content: "The customer service team was fantastic when I needed help setting up my new drone. They guided me through the process and made sure I was comfortable before my first flight.",
          isVerified: true
        },
        {
          customerName: "James R.",
          avatar: null,
          rating: 4,
          content: "I've purchased three drones from DroneZone now and each experience has been seamless. Fast shipping, great prices, and the product selection is unmatched. Will continue to shop here.",
          isVerified: true
        }
      ];

      console.log("👉 Adding testimonials...");
      await db.insert(schema.testimonials).values(testimonials);
    }

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  }
}

seed();
