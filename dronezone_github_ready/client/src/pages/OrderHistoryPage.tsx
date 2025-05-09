import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, Package, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const OrderHistoryPage = () => {
  const [email, setEmail] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Fetch customer orders when search is submitted
  const { data: orders, isLoading, error } = useQuery({
    queryKey: [`/api/customers/${email}/orders`],
    enabled: searchSubmitted && email.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSearchSubmitted(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-green-700 text-white";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Order History | DroneZone</title>
        <meta 
          name="description" 
          content="Track your orders and view your order history. Check the status of recent orders and get shipping updates."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Find Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Find Orders
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : searchSubmitted && !orders ? (
          <div className="bg-red-50 p-6 rounded-lg text-center">
            <p className="text-red-600 mb-4">
              No orders found for this email address. Please check the email and try again.
            </p>
          </div>
        ) : searchSubmitted && orders && orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">
              <ShoppingBag size={64} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any orders associated with {email}.
            </p>
            <Button asChild className="bg-secondary hover:bg-secondary/90 text-primary font-bold">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : searchSubmitted && orders?.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>${Number(order.total).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} font-normal capitalize`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Order #{order.id} Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Order Date:</span>
                                <span>{formatDate(order.createdAt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <Badge className={`${getStatusColor(order.status)} font-normal capitalize`}>
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-semibold">${Number(order.total).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Shipping Address:</span>
                                <span>{order.shippingAddress}</span>
                              </div>

                              <Separator className="my-4" />

                              <h3 className="font-semibold mb-3">Order Items</h3>
                              <div className="space-y-4">
                                {order.items.map((item: any) => (
                                  <div key={item.id} className="flex">
                                    <div className="w-16 h-16 flex-shrink-0">
                                      <img 
                                        src={item.product.imageUrl} 
                                        alt={item.product.name} 
                                        className="w-full h-full object-cover rounded"
                                      />
                                    </div>
                                    <div className="ml-3 flex-1">
                                      <div className="font-semibold">{item.product.name}</div>
                                      <div className="flex justify-between mt-1">
                                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                        <span className="font-medium">${Number(item.price).toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="flex justify-between pt-4 border-t">
                                <span className="font-semibold">Order Total:</span>
                                <span className="font-semibold">${Number(order.total).toFixed(2)}</span>
                              </div>

                              <div className="flex items-center mt-4 text-blue-600">
                                <Package className="h-5 w-5 mr-2" />
                                <span>
                                  {order.status === "shipped" || order.status === "delivered" 
                                    ? "Tracking information will be sent to your email." 
                                    : "Your order is being processed."}
                                </span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </>
  );
};

export default OrderHistoryPage;
