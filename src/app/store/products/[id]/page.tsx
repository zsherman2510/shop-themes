import { getProduct } from "@/app/_actions/store/products";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
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
                    src={image}
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

          {product.features && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Features</h3>
                <div className="prose dark:prose-invert">
                  {product.features}
                </div>
              </div>
            </>
          )}

          <div className="space-y-4">
            <Button className="w-full" size="lg">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>

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
              <h3 className="font-semibold mb-2">What's included:</h3>
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
    </div>
  );
}
