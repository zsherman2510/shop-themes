import Navbar from "@/components/layout/navbar";
import Hero from "@/components/home/hero";
import Categories from "@/components/home/categories";
import FeaturedProducts from "@/components/home/featured-products";
import Newsletter from "@/components/home/newsletter";

// Temporary data (replace with actual data from your database)
const categories = [
  { name: "Women", slug: "women", image: "/category-women.jpg" },
  { name: "Men", slug: "men", image: "/category-men.jpg" },
  {
    name: "Accessories",
    slug: "accessories",
    image: "/category-accessories.jpg",
  },
];

const products = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: "29.99",
    image: "/product-1.jpg",
  },
  { id: 2, name: "Denim Jacket", price: "89.99", image: "/product-2.jpg" },
  { id: 3, name: "Leather Sneakers", price: "129.99", image: "/product-3.jpg" },
  { id: 4, name: "Cotton Sweater", price: "59.99", image: "/product-4.jpg" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories categories={categories} />
      <FeaturedProducts products={products} />
      <Newsletter />
    </div>
  );
}
