import ProductCard from "@/components/ProductCard";

// Fetch products from API with a limit to increase displayed items
async function getProducts() {
  const res = await fetch("https://ecommerce.routemisr.com/api/v1/products?limit=50", {
    cache: "no-store", // Ensure fresh data on every request
  });
  const response = await res.json();
  return response.data;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <section className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Page Header */}
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">All Products</h1>
            <p className="text-gray-500">Check out our latest collection</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}