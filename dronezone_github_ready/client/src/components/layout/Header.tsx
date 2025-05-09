import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  ChevronDown,
  MapPin 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../cart/CartContext";
import CartDrawer from "../cart/CartDrawer";
import { useMobile } from "@/hooks/use-mobile";

// Define the Category type
type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

const Header = () => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { cartItems, cartOpen, setCartOpen } = useCart();
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("all");
  
  // Use refs for uncontrolled inputs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories for navigation
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchValue = isMobile 
      ? mobileSearchInputRef.current?.value 
      : searchInputRef.current?.value;
      
    if (searchValue && searchValue.trim()) {
      navigate(`/products?query=${encodeURIComponent(searchValue)}&category=${searchCategory}`);
    } else {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive"
      });
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header>
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold">DroneZone</Link>
              <div className="hidden lg:flex items-center space-x-1">
                <MapPin size={18} />
                <div className="text-sm">
                  <div className="text-gray-300">Deliver to</div>
                  <div className="font-semibold">New York 10001</div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-3xl mx-4">
              <form onSubmit={handleSearch} className="w-full flex">
                <div className="relative w-full flex">
                  <Select 
                    defaultValue="all" 
                    onValueChange={(val) => setSearchCategory(val)}
                  >
                    <SelectTrigger className="w-28 rounded-l-md rounded-r-none bg-gray-100 text-gray-700 border-r border-gray-300 focus:ring-0 text-xs md:text-sm">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent align="start" className="w-48">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    ref={searchInputRef}
                    placeholder="Search for drones..."
                    className="rounded-none flex-1 border-y border-r-0 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button 
                    type="submit" 
                    className="h-full bg-secondary hover:bg-secondary/90 text-primary rounded-l-none rounded-r-md px-4"
                  >
                    <Search size={18} />
                  </Button>
                </div>
              </form>
            </div>

            {/* Account & Lists */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="hidden md:block">
                <div className="text-xs">Hello, Sign in</div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="font-semibold flex items-center">
                    Account & Lists <ChevronDown size={14} className="ml-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link href="/login" className="w-full">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/register" className="w-full">Create Account</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="hidden md:block">
                <div className="text-xs">Returns</div>
                <Link href="/order-history" className="font-semibold">& Orders</Link>
              </div>
              <button 
                className="relative" 
                onClick={() => setCartOpen(true)}
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="flex flex-col space-y-2">
              <Select 
                defaultValue="all" 
                onValueChange={(val) => setSearchCategory(val)}
              >
                <SelectTrigger className="bg-gray-100 text-gray-700 border border-gray-300 focus:ring-0">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex">
                <Input
                  type="text"
                  ref={mobileSearchInputRef}
                  placeholder="Search for drones..."
                  className="rounded-r-none"
                />
                <Button 
                  type="submit" 
                  className="bg-secondary hover:bg-secondary/90 text-primary rounded-l-none"
                >
                  <Search size={18} />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-accent">
          <div className="container mx-auto px-4">
            <ul className="flex items-center space-x-6 text-sm py-2 overflow-x-auto whitespace-nowrap">
              <li><Link href="/products" className="hover:text-secondary">All Categories</Link></li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/category/${category.slug}`} 
                    className="hover:text-secondary"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li><Link href="/deals" className="hover:text-secondary">Today's Deals</Link></li>
              <li><Link href="/customer-service" className="hover:text-secondary">Customer Service</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute z-50 w-full">
          <div className="p-4">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Account</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-blue-600">Sign In</Link></li>
                <li><Link href="/register" className="text-blue-600">Create Account</Link></li>
                <li><Link href="/order-history" className="text-blue-600">Order History</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Shop By Category</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link 
                      href={`/category/${category.slug}`} 
                      className="text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      <CartDrawer />
    </header>
  );
};

export default Header;