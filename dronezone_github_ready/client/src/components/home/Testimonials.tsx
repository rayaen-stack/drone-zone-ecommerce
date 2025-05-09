import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import Rating from "../ui/rating";

const Testimonials = () => {
  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ['/api/testimonials'],
  });

  if (isLoading) {
    return (
      <section className="bg-neutral py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <Skeleton className="h-4 w-28 mb-3" />
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-neutral py-10">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-error">Failed to load testimonials. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-neutral py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials?.map((testimonial: any) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex text-yellow-400 mb-3">
                <Rating value={testimonial.rating} showCount={false} />
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
              <div className="flex items-center">
                {testimonial.avatar ? (
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.customerName} 
                    className="h-10 w-10 rounded-full mr-3 object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">{testimonial.customerName}</h4>
                  {testimonial.isVerified && (
                    <p className="text-sm text-gray-600">Verified Buyer</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
