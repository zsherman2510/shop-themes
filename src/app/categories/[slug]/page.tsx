import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Replace with your actual database query
async function getCategory(slug: string) {
  // Temporary mock data
  const categories = {
    "shopify-themes": {
      name: "Shopify Themes",
      description:
        "Premium Shopify themes designed for modern e-commerce stores",
      image: "/category-themes.jpg",
      products: [
        {
          id: 1,
          name: "Modern Commerce Theme",
          price: "299.99",
          image: "/theme-1.jpg",
        },
        {
          id: 2,
          name: "Fashion Store Theme",
          price: "249.99",
          image: "/theme-2.jpg",
        },
        {
          id: 3,
          name: "Digital Products Theme",
          price: "199.99",
          image: "/theme-3.jpg",
        },
        {
          id: 4,
          name: "Luxury Brand Theme",
          price: "349.99",
          image: "/theme-4.jpg",
        },
      ],
    },
    "ui-kits": {
      name: "UI Kits",
      description:
        "Professional UI kits and design resources for web developers",
      image: "/category-ui-kits.jpg",
      products: [
        {
          id: 5,
          name: "E-commerce UI Kit",
          price: "89.99",
          image: "/ui-kit-1.jpg",
        },
        {
          id: 6,
          name: "Dashboard UI Kit",
          price: "79.99",
          image: "/ui-kit-2.jpg",
        },
      ],
    },
    "digital-assets": {
      name: "Digital Assets",
      description: "High-quality digital assets for your web projects",
      image: "/category-assets.jpg",
      products: [
        {
          id: 7,
          name: "Icon Pack Bundle",
          price: "49.99",
          image: "/icons-1.jpg",
        },
        {
          id: 8,
          name: "Social Media Templates",
          price: "39.99",
          image: "/templates-1.jpg",
        },
      ],
    },
  };

  return categories[slug as keyof typeof categories];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return {
      title: "Category Not Found - Digital Store",
    };
  }

  return {
    title: `${category.name} - Digital Store`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategory(params.slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="relative h-96">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-4 text-xl text-white">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {category.products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  ${product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
