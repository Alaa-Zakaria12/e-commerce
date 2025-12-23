import ProductCard from "@/components/ProductCard";

// Helper function to fetch products filtered by a specific brand ID
async function getProductsByBrand(brandId: string) {
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products?brand=${brandId}`, {
    cache: "no-store", // Ensure fresh data is fetched on every request
  });
  const response = await res.json();
  return response.data;
}

type Props = {
  params: Promise<{ brandId: string }>;
};

export default async function BrandProductsPage({ params }: Props) {
  // Resolve the dynamic route parameters
  const { brandId } = await params;
  
  // Fetch the products for this brand
  const products = await getProductsByBrand(brandId);

  return (
    <section className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Page Header showing item count */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Brand Products <span className="text-gray-500 text-lg">({products.length} items)</span>
        </h1>

        {/* Render Product Grid or Empty State */}
        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
        ) : (
            <div className="text-center py-20 text-gray-500 text-xl">
                No products found for this brand.
            </div>
        )}

      </div>
    </section>
  );
}