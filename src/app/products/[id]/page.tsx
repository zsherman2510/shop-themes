import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

// Replace with your actual database query
async function getProduct(id: string) {
  // Temporary mock data
  const product = {
    id: 1,
    name: "Modern Commerce Theme",
    description:
      "A premium Shopify theme designed for modern e-commerce stores. Features include advanced product filtering, quick view modals, custom mega menu, and optimized mobile experience.",
    price: "299.99",
    image: "/theme-1.jpg",
    features: [
      "Responsive Design",
      "Advanced Product Filtering",
      "Custom Mega Menu",
      "Quick View Modals",
      "Performance Optimized",
      "SEO Best Practices",
    ],
    technicalDetails: [
      "Shopify 2.0 Compatible",
      "Built with Next.js",
      "Tailwind CSS Styling",
      "Free Updates",
      "6 Months Support",
    ],
  };

  return product;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProduct(params.id);

  return {
    title: `${product.name} - Digital Store`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-50">
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-50"
                >
                  <Image
                    src={product.image}
                    alt={`Preview ${i}`}
                    width={200}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                {product.description}
              </p>
              <p className="mt-4 text-3xl font-bold text-gray-900">
                ${product.price}
              </p>
            </div>
            <button className="w-full rounded-lg bg-gray-900 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800">
              Purchase Now
            </button>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Key Features
                </h2>
                <ul className="mt-4 space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Technical Details
                </h2>
                <ul className="mt-4 space-y-3">
                  {product.technicalDetails.map((detail) => (
                    <li key={detail} className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
