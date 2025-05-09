import { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const AccountPage = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally authenticate with your API
    if (loginEmail && loginPassword) {
      setIsLoggedIn(true);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally register with your API
    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (registerName && registerEmail && registerPassword) {
      setIsLoggedIn(true);
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
    } else {
      toast({
        title: "Registration failed",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Helmet>
          <title>My Account - DroneZone</title>
          <meta name="description" content="Manage your DroneZone account, view orders, update profile information and track your purchases." />
        </Helmet>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <Button variant="outline" onClick={handleLogout}>Log Out</Button>
        </div>
        
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <Button asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value="John Doe"
                    placeholder="Full Name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value="john.doe@example.com"
                    placeholder="Email address" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    placeholder="Phone number"
                    value=""
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    placeholder="Enter to change password"
                    value=""
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    placeholder="New password"
                    value=""
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm new password"
                    value=""
                  />
                </div>
              </div>
              
              <Button type="submit">Update Profile</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="addresses" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Addresses</h2>
              <Button variant="outline">Add New Address</Button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No addresses saved</h3>
              <p className="text-gray-600">You haven't added any addresses yet.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Helmet>
        <title>Account - DroneZone</title>
        <meta name="description" content="Sign in to your DroneZone account or create a new account to manage orders and get personalized shopping experience." />
      </Helmet>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="max-w-md">
            <h1 className="text-3xl font-bold mb-2">Sign In</h1>
            <p className="text-gray-600 mb-8">Access your account to manage orders and get personalized recommendations.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your.email@example.com" 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="login-password" 
                  type="password" 
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password" 
                />
              </div>
              
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-600 mb-8">New to DroneZone? Create an account for a better shopping experience.</p>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <Input 
                  id="register-name" 
                  required
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Your full name" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input 
                  id="register-email" 
                  type="email" 
                  required
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="your.email@example.com" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input 
                  id="register-password" 
                  type="password" 
                  required
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Create a password" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirm Password</Label>
                <Input 
                  id="register-confirm-password" 
                  type="password" 
                  required
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder="Confirm your password" 
                />
              </div>
              
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
            
            <p className="text-sm text-gray-500 mt-4">
              By creating an account, you agree to DroneZone's 
              <Link href="#" className="text-blue-600 hover:text-blue-800"> Terms of Service </Link> 
              and 
              <Link href="#" className="text-blue-600 hover:text-blue-800"> Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;