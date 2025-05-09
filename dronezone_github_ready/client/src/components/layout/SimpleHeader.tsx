import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  ChevronDown,
  MapPin,
  LogOut,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "../cart/CartContext";
import CartDrawer from "../cart/CartDrawer";
import { useMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";

// Define the Category type
type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

const SimpleHeader = () => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { cartItems, cartOpen, setCartOpen } = useCart();
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  // Fetch categories for navigation
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;
    const category = formData.get('category') as string;
    
    if (query && query.trim()) {
      navigate(`/products?query=${encodeURIComponent(query)}&category=${category || 'all'}`);
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
                  <select 
                    id="desktop-category-select"
                    name="category"
                    defaultValue="all"
                    className="search-select"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    id="desktop-search-input"
                    type="text"
                    name="query"
                    placeholder="Search for drones..."
                    className="search-input"
                    autoComplete="off"
                  />
                  
                  <button 
                    type="submit" 
                    className="search-button"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>
            </div>

            {/* Account & Lists */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="hidden md:block">
                {user ? (
                  <div>
                    <div className="text-xs">Hello, {user.username}</div>
                    <div className="font-semibold flex items-center">
                      <Link href="/account" className="flex items-center hover:text-secondary">
                        <User size={14} className="mr-1" /> Account
                      </Link>
                      <button 
                        onClick={() => logoutMutation.mutate()}
                        className="ml-3 flex items-center hover:text-secondary"
                        disabled={logoutMutation.isPending}
                      >
                        <LogOut size={14} className="mr-1" /> 
                        {logoutMutation.isPending ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-xs">Hello, Sign in</div>
                    <Link href="/auth" className="font-semibold flex items-center hover:text-secondary">
                      Account & Lists <ChevronDown size={14} className="ml-1" />
                    </Link>
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <div className="text-xs">Returns</div>
                <Link href={user ? "/order-history" : "/auth"} className="font-semibold hover:text-secondary">& Orders</Link>
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
              <select 
                id="mobile-category-select"
                name="category"
                defaultValue="all" 
                className="w-full rounded px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              
              <div className="flex">
                <input
                  id="mobile-search-input"
                  type="text"
                  name="query"
                  placeholder="Search for drones..."
                  className="flex-1 rounded-l-md rounded-r-none border border-r-0 px-3 py-2"
                  autoComplete="off"
                />
                
                <button 
                  type="submit" 
                  className="bg-secondary hover:bg-secondary/90 text-primary rounded-l-none rounded-r-md px-4"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-accent">
          <div className="container mx-auto px-4">
            <ul className="flex items-center space-x-6 text-sm py-2 overflow-x-auto whitespace-nowrap">
              <li><Link href="/shop" className="hover:text-secondary font-semibold">Shop</Link></li>
              <li><Link href="/products" className="hover:text-secondary">All Products</Link></li>
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
              {user ? (
                <ul className="space-y-2">
                  <li>
                    <div className="flex items-center text-blue-600">
                      <User size={16} className="mr-2" /> 
                      {user.username}
                    </div>
                  </li>
                  <li>
                    <Link 
                      href="/account" 
                      className="text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/order-history" 
                      className="text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Order History
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        logoutMutation.mutate();
                        setMobileMenuOpen(false);
                      }}
                      className="text-blue-600 flex items-center"
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut size={16} className="mr-2" />
                      {logoutMutation.isPending ? "Logging out..." : "Logout"}
                    </button>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/auth" 
                      className="text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/auth" 
                      className="text-blue-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </li>
                </ul>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Shop By Category</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/shop" 
                    className="text-blue-600 font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Shop Home
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/products" 
                    className="text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    All Products
                  </Link>
                </li>
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

export default SimpleHeader;