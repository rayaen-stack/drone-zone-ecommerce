import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - in a real app, this would submit to an API endpoint
    setTimeout(() => {
      toast({
        title: "Subscription Successful!",
        description: "Thank you for joining our newsletter.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="bg-primary py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Join Our Drone Community</h2>
        <p className="text-white/80 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter for the latest product releases, exclusive deals, and expert flying tips.
        </p>
        
        <form 
          className="flex flex-col md:flex-row max-w-lg mx-auto gap-3"
          onSubmit={handleSubmit}
        >
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 py-3 px-4 rounded-lg focus:outline-none"
          />
          <Button 
            type="submit"
            className="bg-secondary hover:bg-yellow-500 text-primary font-bold py-3 px-6 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        
        <p className="text-white/60 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
