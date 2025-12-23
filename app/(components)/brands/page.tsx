import Link from "next/link";

// Fetch all available brands from the API
async function getBrands() {
  const res = await fetch("https://ecommerce.routemisr.com/api/v1/brands", {
    cache: "no-store", // Disable caching to ensure the brand list is always up-to-date
  });
  const response = await res.json();
  return response.data;
}

export default async function BrandsPage() {
  // Retrieve the list of brands
  const brands = await getBrands();

  return (
    <section className="min-h-screen bg-stone-50 py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Premium Brands</h1>
            <p className="text-gray-500">Top brands available at Target</p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {brands.map((brand: any) => (
            <Link 
                key={brand._id} 
                href={`/brands/${brand._id}`} // Link to the dynamic brand details page
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center group"
            >
              {/* Brand Logo */}
              <div className="w-full h-32 mb-4 overflow-hidden">
                <img 
                    src={brand.image} 
                    alt={brand.name} 
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300" 
                />
              </div>
              
              {/* Brand Name */}
              <h3 className="text-gray-800 font-bold text-lg group-hover:text-red-700 transition-colors">
                {brand.name}
              </h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}