const ProductSkeleton = () => {
  return (
    // Container mimicking ProductCard with pulse animation for loading state
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
      
      {/* Product Image Placeholder */}
      <div className="h-64 w-full bg-gray-200"></div>

      <div className="p-4 flex flex-col flex-grow space-y-3">
        
        {/* Category Label Placeholder */}
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>

        {/* Product Title Placeholder */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>

        {/* Description Lines Placeholder */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Price & Rating Section Placeholder */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          <div className="h-6 bg-gray-200 rounded w-20"></div> {/* Price */}
          <div className="h-4 bg-gray-200 rounded w-12"></div> {/* Rating */}
        </div>

        {/* Add to Cart Button Placeholder */}
        <div className="h-10 bg-gray-200 rounded-lg w-full mt-4"></div>

      </div>
    </div>
  );
};

export default ProductSkeleton;