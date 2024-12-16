import Hero from "@/components/store/home/hero";
import Categories from "@/components/store/home/categories";
import FeaturedProducts from "@/components/store/home/featured-products";
import Newsletter from "@/components/store/home/newsletter";
import { getCategories } from "@/app/_actions/store/categories";
import { getFeaturedProducts } from "@/app/_actions/store/products";
import Navbar from "@/components/layout/navbar";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <Categories categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <Newsletter />
    </div>
  );
}
