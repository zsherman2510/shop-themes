import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 py-32 md:flex-row md:items-center md:gap-16">
          <div className="flex-1 space-y-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Premium Shopify Themes & Digital Assets
            </h1>
            <p className="text-lg text-gray-600">
              Elevate your online store with our professionally crafted Shopify
              themes and digital assets. Built for performance, designed for
              conversion.
            </p>
            <div className="flex gap-4">
              <Link
                href="/categories/shopify-themes"
                className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Browse Themes
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
              >
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
    </section>
  );
}
