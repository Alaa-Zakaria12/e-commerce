import MainSlider from "@/components/MainSlider";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "./(components)/Api/allProducts.Api"; 

export default async function Home() {
  // Fetch all products from the API
  const allProducts = await getAllProducts();

  // --- Featured Products Logic ---
  // 1. Create a shallow copy of the array and shuffle it randomly
  // This ensures the user sees different recommendations on every refresh
  const shuffledProducts = allProducts 
    ? [...allProducts].sort(() => 0.5 - Math.random()) 
    : [];
  
  // 2. Slice the first 8 items from the shuffled list
  const featuredProducts = shuffledProducts.slice(0, 8);

  return (
    <main className="bg-stone-50 min-h-screen">
      
      {/* Hero Slider Section */}
      <MainSlider />

      {/* Recommended Products Section */}
      <section className="container mx-auto px-4 mt-8 mb-20">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 border-l-4 border-red-700 pl-3">
              Recommended for You
            </h2>
            <a href="/product" className="text-red-700 font-semibold hover:underline text-sm">
              See All Products
            </a>
        </div>
        
        {/* Products Grid */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
               <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
             No products available at the moment.
          </div>
        )}
      </section>

    </main>
  );
}