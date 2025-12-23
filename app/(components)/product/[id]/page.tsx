import { FaStar, FaTruck, FaUndo } from "react-icons/fa";
import AddButton from "@/components/AddButton"; 

// Fetch specific product details by ID
async function getProductDetails(id: string) {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
    if (!res.ok) return null;
    const response = await res.json();
    return response.data;
  } catch (error) {
    return null;
  }
}

// Define props for dynamic route parameters
type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetails({ params }: Props) {
  // Await params to access the dynamic ID (Next.js 15 requirement)
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Fetch data
  const product = await getProductDetails(id);

  // Handle 404 / Not Found state
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold text-xl">
        Product not found. (ID received: {id})
      </div>
    );
  }

  return (
    <section className="bg-stone-50 min-h-screen py-12 flex items-center">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-stone-100">
          <div className="flex flex-col md:flex-row">
            
            {/* Left Column: Product Image */}
            <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center relative">
              <img 
                src={product.imageCover} 
                alt={product.title}
                className="max-w-full max-h-[500px] object-contain drop-shadow-xl" 
              />
            </div>

            {/* Right Column: Product Details */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              
              {/* Category Label */}
              <span className="text-red-700 font-bold uppercase tracking-widest text-sm mb-2">
                {product.category?.name}
              </span>

              {/* Product Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {product.title}
              </h1>

              {/* Ratings Section */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  <FaStar />
                  <span className="text-gray-900 font-bold ml-1">{product.ratingsAverage}</span>
                </div>
                <span className="text-gray-500 text-sm">({product.ratingsQuantity} reviews)</span>
              </div>

              {/* Price Section */}
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {product.price} <span className="text-lg font-medium text-gray-500">EGP</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Add to Cart Action */}
              <div className="flex gap-4 mb-8">
                <div className="flex-1">
                   <AddButton productId={product._id} />
                </div>
              </div>

              {/* Extra Info (Delivery & Returns) */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-stone-100 rounded-full"><FaTruck className="text-red-700" /></div>
                  <span className="text-sm font-medium">Free Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-stone-100 rounded-full"><FaUndo className="text-red-700" /></div>
                  <span className="text-sm font-medium">30 Days Return</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}