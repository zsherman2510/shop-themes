import { getProduct } from "@/app/_actions/store/products";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import Image from "next/image";
import AddToCartButton from "@/app/store/products/components/AddToCartButton";
// import ProductReviews from "../components/ProductReviews";

type tParams = Promise<{ id: string }>;

interface ProductPageProps {
  params: tParams;
}

const placeholderImage = "https://placehold.co/600x400";

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
            <img
              src={product?.images[0] || placeholderImage}
              alt={product.name}
              width={600}
              height={400}
              className="h-full w-full object-cover object-center"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((image, i) => (
                <div
                  key={i}
                  className="aspect-square relative rounded-lg overflow-hidden bg-muted"
                >
                  <Image
                    src={image || placeholderImage}
                    alt={`${product.name} ${i + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{product.category?.name}</Badge>
              <Badge variant="outline">Version {product.version}</Badge>
            </div>
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            <p className="text-2xl font-bold mt-2">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          <Separator />

          <div className="prose dark:prose-invert">
            <p>{product.description}</p>
          </div>

          {product.features && product.features.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.isArray(product.features)
                    ? product.features.map((feature, index) => {
                        // Clean up the feature text by removing brackets, quotes, and extra whitespace
                        const cleanFeature = feature
                          .replace(/[\[\]"]/g, "") // Remove brackets and quotes
                          .trim(); // Remove extra whitespace

                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg"
                          >
                            <span className="text-green-500 shrink-0">
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </span>
                            <span className="text-sm font-medium">
                              {cleanFeature}
                            </span>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </>
          )}

          <div className="space-y-4">
            <AddToCartButton product={product} />

            {product.previewUrl && (
              <Button variant="outline" className="w-full" asChild>
                <a
                  href={product.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Live Preview
                </a>
              </Button>
            )}

            {/* Optional: Add purchase benefits */}
            <Card className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">What&apos;s included:</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Full source code</li>
                <li>✓ Lifetime updates</li>
                <li>✓ Technical support</li>
                <li>✓ Documentation access</li>
              </ul>
            </Card>
          </div>

          {product.requirements && (
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Requirements</h3>
              <div className="prose dark:prose-invert text-sm">
                {product.requirements as string}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {/* <div className="mt-16">
        <ProductReviews productId={product.id} />
      </div> */}
    </div>
  );
}
