import { useState } from "react";
import { Helmet } from "react-helmet";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MoveLeft, PhoneCall, Mail, MessageSquare, Truck, RefreshCw, PiggyBank } from "lucide-react";
import { Link } from "wouter";
import ChatBot from "@/components/chat/ChatBot";

const CustomerServicePage = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send this to your API
    toast({
      title: "Support request submitted",
      description: "We've received your message and will get back to you soon.",
    });
    // Reset form
    setName("");
    setEmail("");
    setOrderNumber("");
    setMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Customer Service - DroneZone</title>
        <meta name="description" content="Get help with your orders, returns, technical support and more at DroneZone's customer service center." />
      </Helmet>

      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <MoveLeft className="mr-2 h-4 w-4" />
          Back to Shopping
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">Customer Service</h1>
      <p className="text-gray-600 mb-8">How can we help you today?</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <PhoneCall className="mr-2 h-5 w-5 text-blue-600" />
              Call Us
            </CardTitle>
            <CardDescription>Talk to our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-lg">+254 762 318 429</p>
            <p className="text-sm text-gray-500">Monday - Friday: 8am - 8pm EAT</p>
            <p className="text-sm text-gray-500">Saturday - Sunday: 9am - 6pm EAT</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5 text-blue-600" />
              Email Support
            </CardTitle>
            <CardDescription>Send us an email anytime</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-lg">support@dronezone.com</p>
            <p className="text-sm text-gray-500">We aim to respond within 24 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
              Live Chat
            </CardTitle>
            <CardDescription>Chat with our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => setShowChat(true)}
            >
              Start Live Chat
            </Button>
            <p className="text-sm text-gray-500 mt-2">Available from 8am - 11pm EAT</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="orderNumber" className="block mb-2 font-medium">
                Order Number (if applicable)
              </label>
              <Input
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. DZ12345678"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block mb-2 font-medium">
                How can we help you?
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail..."
                rows={5}
                required
              />
            </div>
            
            <Button type="submit" className="w-full md:w-auto">
              Submit Request
            </Button>
          </form>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                How do I track my order?
              </AccordionTrigger>
              <AccordionContent>
                You can track your order by logging into your account and viewing your order history. 
                Alternatively, you can use the tracking number provided in your shipping confirmation email.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                What is your return policy?
              </AccordionTrigger>
              <AccordionContent>
                We offer a 30-day return policy for most items. Products must be returned in their original 
                packaging and in the same condition they were received. Please note that some items, like 
                opened software or custom-configured drones, may not be eligible for return.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Do you offer international shipping?
              </AccordionTrigger>
              <AccordionContent>
                Yes, we ship to most countries worldwide. International shipping rates and delivery times 
                vary depending on the destination. Please note that customers are responsible for any 
                customs duties or import taxes that may apply.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                How do I register my drone?
              </AccordionTrigger>
              <AccordionContent>
                In the United States, drones weighing more than 0.55 pounds (250 grams) must be registered 
                with the FAA. You can register your drone on the FAA website. For other countries, please 
                check local regulations regarding drone registration and operation.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                Do you offer warranty on your products?
              </AccordionTrigger>
              <AccordionContent>
                Yes, all our drones come with the manufacturer's warranty, which typically ranges from 
                1 to 2 years depending on the model. We also offer extended warranty plans for additional 
                protection. You can find specific warranty information on each product page.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6">Our Policies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold mb-2">Shipping Policy</h3>
            <p className="text-gray-600">Free shipping on orders over $100. Standard shipping takes 3-5 business days.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <RefreshCw className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold mb-2">Return & Refund</h3>
            <p className="text-gray-600">Easy 30-day returns. Full refund on unused items returned in original packaging.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <PiggyBank className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold mb-2">Price Match</h3>
            <p className="text-gray-600">We match competitors' prices. Contact us within 14 days of purchase.</p>
          </div>
        </div>
      </div>
      {showChat && <ChatBot initialOpen={true} />}
    </div>
  );
};

export default CustomerServicePage;