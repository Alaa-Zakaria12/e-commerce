import ProductSkeleton from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <section className="bg-stone-50 min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Page Title Skeleton */}
        <div className="h-8 w-48 bg-gray-200 rounded mb-8 animate-pulse border-l-4 border-gray-300 pl-4"></div>

        {/* Product Grid Skeleton (Matches the main products layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Render 8 skeleton cards to fill the viewport */}
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
          
        </div>

      </div>
    </section>
  );
}