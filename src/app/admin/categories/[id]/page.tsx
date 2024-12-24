import { getCategory } from "@/app/_actions/store/categories";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type tParams = Promise<{ id: string }>;

export default async function CategoryPage({ params }: { params: tParams }) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/categories">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-sm text-base-content/70">Category Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Image */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-lg">Category Image</h2>
            <div className="aspect-square relative rounded-lg overflow-hidden bg-base-200">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-base-content/50">
                  No image available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Information */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title text-lg">Category Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-base-content/70">
                  Name
                </label>
                <p className="mt-1">{category.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-base-content/70">
                  Slug
                </label>
                <p className="mt-1">{category.slug}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-base-content/70">
                  Description
                </label>
                <p className="mt-1">
                  {category.description || "No description"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-base-content/70">
                  Created At
                </label>
                <p className="mt-1">
                  {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-base-content/70">
                  Last Updated
                </label>
                <p className="mt-1">
                  {new Date(category.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products in Category */}
        <div className="card bg-base-100 shadow md:col-span-2">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title text-lg">Products in Category</h2>
              <Button asChild size="sm">
                <Link href={`/admin/products/new?category=${category.id}`}>
                  Add Product
                </Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {category.products && category.products.length > 0 ? (
                    category.products.map((product) => (
                      <tr key={product.id} className="hover">
                        <td>
                          <div className="flex items-center gap-3">
                            {product.images?.[0] && (
                              <div className="avatar">
                                <div className="mask mask-squircle w-10 h-10">
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-base-content/60">
                                {product.sku}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-base-content/70">
                          ${product.price.toFixed(2)}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              product.isActive
                                ? "badge-success"
                                : "badge-warning"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/products/${product.id}`}>
                              View
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center text-base-content/70"
                      >
                        No products in this category yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
