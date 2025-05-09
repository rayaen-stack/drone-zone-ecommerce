import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import SimpleHeader from "./components/layout/SimpleHeader";
import Footer from "./components/layout/Footer";
import ChatBot from "./components/chat/ChatBot";
import Home from "./pages/Home";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import DealsPage from "./pages/DealsPage";
import CustomerServicePage from "./pages/CustomerServicePage";
import AccountPage from "./pages/AccountPage";
import AuthPage from "./pages/auth-page";
import ShopPage from "./pages/ShopPage";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/products" component={ProductListPage} />
      <Route path="/products/:slug" component={ProductDetailPage} />
      <Route path="/category/:slug" component={ProductListPage} />
      <Route path="/cart" component={CartPage} />
      <ProtectedRoute path="/checkout" component={CheckoutPage} />
      <ProtectedRoute path="/order-confirmation/:orderId" component={OrderConfirmationPage} />
      <ProtectedRoute path="/order-history" component={OrderHistoryPage} />
      <Route path="/deals" component={DealsPage} />
      <Route path="/customer-service" component={CustomerServicePage} />
      <ProtectedRoute path="/account" component={AccountPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <SimpleHeader />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
