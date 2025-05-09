import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  CreditCard
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Shop Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/consumer-drones" className="text-gray-300 hover:text-white">Consumer Drones</Link></li>
              <li><Link href="/category/professional-drones" className="text-gray-300 hover:text-white">Professional Drones</Link></li>
              <li><Link href="/category/racing-drones" className="text-gray-300 hover:text-white">Racing Drones</Link></li>
              <li><Link href="/category/accessories" className="text-gray-300 hover:text-white">Accessories</Link></li>
              <li><Link href="/category/spare-parts" className="text-gray-300 hover:text-white">Spare Parts</Link></li>
              <li><Link href="/category/refurbished" className="text-gray-300 hover:text-white">Refurbished</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white">FAQs</Link></li>
              <li><Link href="/shipping" className="text-gray-300 hover:text-white">Shipping Policy</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-white">Returns & Refunds</Link></li>
              <li><Link href="/track-order" className="text-gray-300 hover:text-white">Order Tracking</Link></li>
              <li><Link href="/warranty" className="text-gray-300 hover:text-white">Warranty Information</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">About DroneZone</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white">Our Story</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white">Drone Blog</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
              <li><Link href="/press" className="text-gray-300 hover:text-white">Press Releases</Link></li>
              <li><Link href="/affiliate" className="text-gray-300 hover:text-white">Affiliate Program</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 text-2xl mb-4">
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Twitter">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white" aria-label="YouTube">
                <Youtube size={24} />
              </a>
            </div>
            
            <h4 className="font-semibold mb-2">Payment Methods</h4>
            <div className="flex space-x-2">
              <CreditCard size={24} className="text-gray-300" />
              <CreditCard size={24} className="text-gray-300" />
              <CreditCard size={24} className="text-gray-300" />
              <CreditCard size={24} className="text-gray-300" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} DroneZone. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white text-sm">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
