import ProductCard from "@/components/ProductCard";

// Helper function to fetch products based on Category ID
async function getProductsByCategory(catId: string) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products?category=${catId}`, {
    cache: "no-store",
  });
  const response = await res.json();
  return response.data;
}

// Define props for dynamic routing
type Props = {
  params: Promise<{ categoryId: string }>;
};

export default async function CategoryProductsPage({ params }: Props) {
  // Await params to extract the specific category ID
  const { categoryId } = await params;
  
  // Fetch products associated with this category
  const products = await getProductsByCategory(categoryId);

  return (
    <section className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Page Header showing item count */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Category Products <span className="text-gray-500 text-lg">({products.length} items)</span>
        </h1>

        {/* Conditional Rendering: Product Grid or Empty State */}
        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        ) : (
            <div className="text-center py-20 text-gray-500 text-xl">
                No products found in this category.
            </div>
        )}

      </div>
    </section>
  );
}