import Link from "next/link";

// Fetch all available categories from the API
async function getCategories() {
  const res = await fetch("https://ecommerce.routemisr.com/api/v1/categories", {
    cache: "no-store", // Disable caching to ensure fresh data
  });
  const response = await res.json();
  return response.data;
}

export default async function CategoriesPage() {
  // Retrieve category list on the server side
  const categories = await getCategories();

  return (
    <section className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Page Header */}
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Shop by Category</h1>
            <p className="text-gray-500">Explore our wide range of collections</p>
        </div>

        {/* Categories Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat: any) => (
            <Link 
                key={cat._id} 
                href={`/categories/${cat._id}`} // Navigate to dynamic category products page
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer h-80 block"
            >
              {/* Category Image */}
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay with Category Name */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <div className="w-full">
                    <h3 className="text-white text-2xl font-bold mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {cat.name}
                    </h3>
                    <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        Discover Products →
                    </p>
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}