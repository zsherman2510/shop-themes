import { getAdminProduct } from "@/app/admin/products/actions/get";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash, Download, Eye, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface AdminProductPageProps {
  params: {
    id: string;
  };
}

export default async function AdminProductPage({
  params,
}: AdminProductPageProps) {
  const product = await getAdminProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">SKU: {product.sku}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/products/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status and Quick Info */}
      <div className="flex gap-4">
        <Badge variant={product.isActive ? "default" : "secondary"}>
          {product.isActive ? "Active" : "Inactive"}
        </Badge>
        <Badge variant="outline">{product.category?.name}</Badge>
        <Badge variant="outline">{product.type}</Badge>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          {/* Images */}
          <Card>
            <CardHeader className="font-semibold">Images</CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader className="font-semibold">Basic Information</CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">${product.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="font-medium">{product.version}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader className="font-semibold">Description</CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{product.description}</p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader className="font-semibold">Features</CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {product.features}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          {/* Download Links */}
          <Card>
            <CardHeader className="font-semibold">Files</CardHeader>
            <CardContent className="space-y-4">
              {product.fileUrl && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <span>Theme Package</span>
                  </div>
                  <Button variant="outline" asChild>
                    <a
                      href={product.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              )}
              {product.previewUrl && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    <span>Preview</span>
                  </div>
                  <Button variant="outline" asChild>
                    <a
                      href={product.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-4">
          {/* Documentation */}
          <Card>
            <CardHeader className="font-semibold">Documentation</CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {product.documentation}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
