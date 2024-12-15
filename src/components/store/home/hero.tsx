import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-base-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hero min-h-[600px]">
          <div className="hero-content flex-col gap-8 py-16 md:flex-row md:gap-16">
            <div className="flex-1 space-y-8">
              <h1 className="text-4xl font-bold text-base-content sm:text-6xl">
                Premium Shopify Themes & Digital Assets
              </h1>
              <p className="text-lg text-base-content/70">
                Elevate your online store with our professionally crafted
                Shopify themes and digital assets. Built for performance,
                designed for conversion.
              </p>
              <div className="flex gap-4">
                <Link href="/store/categories" className="btn btn-primary">
                  Browse Themes
                </Link>
                <Link href="/store/products" className="btn btn-outline">
                  View All Products
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src="/hero-themes.jpg"
                  alt="Shopify Themes Preview"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
