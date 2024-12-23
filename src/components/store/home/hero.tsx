"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-base-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hero min-h-[600px]">
          <div className="hero-content text-center">
            <div className="max-w-3xl space-y-8">
              <h1 className="text-4xl font-bold text-base-content sm:text-6xl">
                Premium Shopify Themes & Digital Assets
              </h1>
              <p className="text-lg text-base-content/70">
                Elevate your online store with our professionally crafted
                Shopify themes and digital assets. Built for performance,
                designed for conversion.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/store/categories" className="btn btn-primary">
                  Browse Themes
                </Link>
                <Link href="/store/products" className="btn btn-outline">
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
