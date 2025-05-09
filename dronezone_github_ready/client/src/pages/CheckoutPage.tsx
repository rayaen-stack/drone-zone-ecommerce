import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { apiRequest } from "@/lib/queryClient";
import { useCart } from "@/components/cart/CartContext";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, convertUsdToKes } from "@/lib/currency";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CreditCard, LockOpen, Smartphone, Landmark, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { MpesaPaymentModal } from "@/components/payment/MpesaPaymentModal";

// Form schema
const checkoutSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  paymentMethod: z.enum(["card", "mpesa", "bank", "paypal"], {
    required_error: "Please select a payment method.",
  }),
  // Only validate card details if payment method is "card"
  cardNumber: z.string().min(16, {
    message: "Card number must be at least 16 digits.",
  }).optional(),
  cardName: z.string().min(2, {
    message: "Name on card must be at least 2 characters.",
  }).optional(),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, {
    message: "Expiry must be in MM/YY format.",
  }).optional(),
  cvv: z.string().min(3, {
    message: "CVV must be at least 3 digits.",
  }).optional(),
  // M-Pesa fields
  mpesaNumber: z.string().min(10, {
    message: "Please enter a valid M-Pesa number.",
  }).optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const [, navigate] = useLocation();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);

  // Calculate order summary in Kenyan Shillings
  const subtotalKES = convertUsdToKes(cartTotal);
  const shippingKES = 0; // Free shipping
  const taxKES = Math.round(subtotalKES * 0.16 * 100) / 100; // Assuming 16% VAT in Kenya
  const totalKES = subtotalKES + shippingKES + taxKES;

  // Form definition
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      paymentMethod: "card",
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
      mpesaNumber: "",
    },
  });
  
  // Watch payment method to conditionally show fields
  const paymentMethod = form.watch("paymentMethod");

  // Check if cart is empty and redirect if needed
  // Using useEffect to avoid state updates during render
  useEffect(() => {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add some products to your cart before checkout.",
        variant: "destructive"
      });
      navigate("/products");
    }
  }, [cartItems.length, navigate, toast]);

  const onSubmit = async (values: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add some products to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }

    // Validate the phone number for M-Pesa payments
    if (values.paymentMethod === 'mpesa') {
      // Validate M-Pesa number is provided
      if (!values.mpesaNumber || values.mpesaNumber.length < 10) {
        toast({
          title: "Invalid M-Pesa Number",
          description: "Please provide a valid M-Pesa phone number.",
          variant: "destructive"
        });
        return;
      }
      
      // Show the M-Pesa payment modal instead of immediately processing
      setMpesaModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the cart session ID
      const sessionId = localStorage.getItem("cartSessionId");
      
      if (!sessionId) {
        throw new Error("No cart session found");
      }

      // Prepare the payment data
      // Use type 'any' to allow additional properties without TypeScript errors
      let paymentInfo: any = {
        method: values.paymentMethod,
      };
      
      // Add method-specific payment details
      if (values.paymentMethod === 'card') {
        paymentInfo.cardDetails = {
          cardNumber: values.cardNumber,
          cardName: values.cardName,
          expiry: values.expiry,
          cvv: values.cvv,
        };
      } else if (values.paymentMethod === 'mpesa') {
        paymentInfo.mpesaDetails = {
          mpesaNumber: values.mpesaNumber,
          // For M-Pesa, we would include transaction ID if this was a real integration
          transactionCompleted: true,
        };
      }

      // Prepare the customer data
      const customerInfo = {
        name: values.name,
        email: values.email,
        address: values.address,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        phone: values.phone,
      };

      // Submit the order
      const response = await apiRequest("POST", "/api/checkout", {
        sessionId,
        customerInfo,
        paymentInfo,
        totalAmount: totalKES,
        currency: "KES",
      });

      const data = await response.json();

      // Show a success message
      toast({
        title: "Order placed successfully!",
        description: `Your order #${data.orderId} has been confirmed. Thank you for shopping with us.`,
        variant: "default",
      });

      // Clear the cart after successful order
      clearCart();
      
      // Redirect to confirmation page
      navigate(`/order-confirmation/${data.orderId}`);
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout | DroneZone</title>
        <meta 
          name="description" 
          content="Complete your purchase securely. Fast shipping and easy returns on all orders."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Payment Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-2 gap-4 pt-2"
                            >
                              <div>
                                <RadioGroupItem
                                  value="card"
                                  id="card"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="card"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <CreditCard className="mb-3 h-6 w-6" />
                                  <span className="text-center font-semibold">Credit Card</span>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem
                                  value="mpesa"
                                  id="mpesa"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="mpesa"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <Smartphone className="mb-3 h-6 w-6" />
                                  <span className="text-center font-semibold">M-Pesa</span>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem
                                  value="bank"
                                  id="bank"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="bank"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <Landmark className="mb-3 h-6 w-6" />
                                  <span className="text-center font-semibold">Bank Transfer</span>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem
                                  value="paypal"
                                  id="paypal"
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor="paypal"
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                  <Globe className="mb-3 h-6 w-6" />
                                  <span className="text-center font-semibold">PayPal</span>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Credit Card Fields - Only show when payment method is 'card' */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold">Credit Card Details</h3>
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input placeholder="1234 5678 9012 3456" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name on Card</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="expiry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="MM/YY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input placeholder="123" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* M-Pesa Fields - Only show when payment method is 'mpesa' */}
                    {paymentMethod === 'mpesa' && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold">M-Pesa Payment</h3>
                        <FormField
                          control={form.control}
                          name="mpesaNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>M-Pesa Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="07XX XXX XXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="text-sm text-muted-foreground">
                          <p>When you complete checkout, you'll be prompted to enter your M-Pesa PIN to complete the payment.</p>
                        </div>
                      </div>
                    )}
                    
                    {/* M-Pesa Payment Modal */}
                    <MpesaPaymentModal
                      open={mpesaModalOpen}
                      onClose={() => setMpesaModalOpen(false)}
                      onComplete={async () => {
                        // Function to continue with order processing after M-Pesa payment
                        await form.handleSubmit(onSubmit)();
                      }}
                      phoneNumber={form.getValues("mpesaNumber") || ""}
                      amount={totalKES}
                      onPhoneNumberChange={(newPhoneNumber) => {
                        // Update the form field with the phone number from the modal
                        form.setValue("mpesaNumber", newPhoneNumber);
                      }}
                    />

                    {/* Bank Transfer Info - Only show when payment method is 'bank' */}
                    {paymentMethod === 'bank' && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold">Bank Transfer Information</h3>
                        <div className="rounded-md bg-muted p-4">
                          <p className="font-medium">Account Details:</p>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>Bank: KCB Bank Kenya</li>
                            <li>Account Name: DroneZone Ltd</li>
                            <li>Account Number: 1234567890</li>
                            <li>Branch: Nairobi Main</li>
                            <li>SWIFT/BIC: KCBLKENX</li>
                          </ul>
                          <p className="mt-3 text-sm text-muted-foreground">
                            Please use your Order ID as payment reference. Your order won't ship until the funds clear in our account.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PayPal Info - Only show when payment method is 'paypal' */}
                    {paymentMethod === 'paypal' && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold">PayPal Payment</h3>
                        <div className="text-sm text-muted-foreground">
                          <p>After clicking "Place Order", you will be redirected to PayPal to complete your purchase securely.</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center mt-4 text-sm text-gray-500">
                      <LockOpen className="h-4 w-4 mr-2" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : `Place Order - ${formatCurrency(totalKES)}`}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Cart Items */}
                <div className="space-y-4 mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <h4 className="font-semibold text-sm">{item.product.name}</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                          <span className="text-sm font-medium">
                            {formatCurrency(convertUsdToKes(Number(item.product.price) * item.quantity))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(subtotalKES)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatCurrency(shippingKES)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (16%)</span>
                    <span>{formatCurrency(taxKES)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(totalKES)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
