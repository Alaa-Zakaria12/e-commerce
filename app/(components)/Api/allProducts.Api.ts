export async function getAllProducts() {
   const response = await fetch('https://ecommerce.routemisr.com/api/v1/products');
    const {data}:any = await response.json();
    return data;
}
