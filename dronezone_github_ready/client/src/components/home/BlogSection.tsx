import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const BlogSection = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['/api/blog-posts'],
  });

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Drone Pilot Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-6 w-4/5 my-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="text-center py-8">
          <p className="text-error">Failed to load blog posts. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Drone Pilot Blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts?.map((post: any) => (
          <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Link href={`/blog/${post.slug}`}>
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <span className="text-sm text-blue-600">{post.category}</span>
              <Link href={`/blog/${post.slug}`}>
                <h3 className="font-semibold text-lg my-2">{post.title}</h3>
              </Link>
              <p className="text-gray-600 text-sm mb-3">{post.summary}</p>
              <Link href={`/blog/${post.slug}`} className="text-blue-600 font-semibold hover:underline">
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
