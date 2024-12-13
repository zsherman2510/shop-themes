import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero-image.jpg"
              alt="Hero image"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          </div>
          <div className="relative py-32 px-6 sm:py-40 sm:px-12">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              New Season
              <br />
              New Style
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-xl">
              Discover our latest collection of premium products, crafted with
              exceptional quality and contemporary style.
            </p>
            <Link
              href="/new-arrivals"
              className="inline-block bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Shop New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
