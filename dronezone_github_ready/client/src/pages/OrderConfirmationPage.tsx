import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Truck, Package } from "lucide-react";
import { Order, OrderItem, Product, Customer, PaymentStatus } from "@shared/schema";

// Define the extended order interface to include payment information
interface FullOrderDetails {
  id: number;
  createdAt: string;
  customerId: number;
  status: string;
  shippingAddress: string;
  total: string;
  paymentMethod: string | null;
  paymentStatus: PaymentStatus | null;
  customer: Customer;
  items: (OrderItem & { product: Product })[];
}

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  
  useEffect(() => {
    // Clear cart session for a fresh start if needed
    // localStorage.removeItem("cartSessionId");
  }, []);
  
  // Fetch order details
  const { data: order, isLoading, error } = useQuery<FullOrderDetails>({
    queryKey: [`/api/orders/${orderId}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-3">Order Not Found</h2>
          <p className="text-red-600 mb-4">
            We couldn't find the order you're looking for. It may have been removed or the URL is incorrect.
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

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
        <title>Order Confirmation | DroneZone</title>
        <meta 
          name="description" 
          content="Your order has been successfully placed. Thank you for shopping with DroneZone!"
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
            <p className="text-gray-600">
              Your order has been placed successfully. We've sent a confirmation email to {order.customer.email}.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order #{order.id}</span>
                <span className="text-base font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                  {order.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">KSh {Number(order.total).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Address:</span>
                  <span>{order.shippingAddress}</span>
                </div>
                
                {/* Payment Information */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="capitalize">{order.paymentMethod || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`capitalize ${
                    order.paymentStatus === 'completed' ? 'text-green-600' : 
                    order.paymentStatus === 'pending' ? 'text-yellow-600' : 
                    order.paymentStatus === 'failed' ? 'text-red-600' : ''
                  }`}>
                    {order.paymentStatus || "Not specified"}
                  </span>
                </div>
              </div>

              {/* Bank Transfer Payment Details */}
              {order.paymentMethod === 'bank' && (
                <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h3 className="font-semibold mb-2 text-blue-800">Bank Transfer Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Bank:</span> Kenya Commercial Bank (KCB)</p>
                    <p><span className="font-medium">Account Number:</span> 1234567890</p>
                    <p><span className="font-medium">Account Name:</span> DroneZone Kenya Ltd</p>
                    <p><span className="font-medium">Branch:</span> Nairobi Main Branch</p>
                    <p><span className="font-medium">Reference:</span> <span className="font-mono bg-blue-100 px-2 py-1 rounded">ORDER-{order.id}</span></p>
                    <p className="text-blue-700 italic mt-2">Please include your order reference number with your payment.</p>
                  </div>
                </div>
              )}
              
              {/* M-Pesa Payment Details */}
              {order.paymentMethod === 'mpesa' && (
                <div className="mt-4 bg-green-50 p-4 rounded-md border border-green-200">
                  <h3 className="font-semibold mb-2 text-green-800">M-Pesa Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Paybill Number:</span> 123456</p>
                    <p><span className="font-medium">Account Number:</span> ORDER-{order.id}</p>
                    <p><span className="font-medium">Amount:</span> KSh {Number(order.total).toLocaleString()}</p>
                    <p className="text-green-700 italic mt-2">Please use ORDER-{order.id} as the account number when making your M-Pesa payment.</p>
                  </div>
                </div>
              )}

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
                      <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-blue-600">
                        {item.product.name}
                      </Link>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        <span className="font-medium">KSh {Number(item.price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Order Processing</h3>
                    <p className="text-gray-600">
                      We're preparing your order for shipment. This usually takes 1-2 business days.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Shipping</h3>
                    <p className="text-gray-600">
                      Once your order ships, you'll receive a tracking number via email.
                      Standard shipping takes 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/order-history">View Order History</Link>
              </Button>
              <Button asChild className="bg-secondary hover:bg-secondary/90 text-primary">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
