import { getCategories } from "@/app/_actions/store/categories";
import { getFeaturedProducts } from "@/app/_actions/store/products";
import Hero from "@/components/store/home/hero";
import Categories from "@/components/store/home/categories";
import FeaturedProducts from "@/components/store/home/featured-products";
import Newsletter from "@/components/store/home/newsletter";
import Navbar from "@/components/layout/navbar";

export default async function HomePage() {
  const { categories } = await getCategories();
  const featuredProducts = await getFeaturedProducts();

  return (
    <main>
      <Navbar />
      <Hero />
      <Categories categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <Newsletter />
    </main>
  );
}
