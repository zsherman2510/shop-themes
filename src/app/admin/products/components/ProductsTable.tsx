"use client";

import { useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { ProductResponse } from "../actions/get";
import { createProduct, deleteProduct, updateProduct } from "../actions";
import ProductModal from "./ProductModal";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getProducts } from "../actions/get";
import { Category } from "@/app/_actions/store/categories";

interface ProductsTableProps {
  initialData: {
    products: ProductResponse[];
    total: number;
    pageCount: number;
  };
  searchParams: {
    search?: string;
    categoryId?: string;
    page: string;
  };
  categories: Category[];
}

export default function ProductsTable({
  initialData,
  searchParams,
  categories,
}: ProductsTableProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<
    ProductResponse | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(initialData);

  const handleCreateProduct = async (formData: any) => {
    try {
      setIsLoading(true);
      const result = await createProduct(formData);

      if (!result.success) {
        console.log("Server error:", result.error);
        throw result.error;
      }

      const updatedData = await getProducts({
        search: searchParams.search,
        categoryId: searchParams.categoryId,
        page: Number(searchParams.page),
        limit: 10,
      });
      setData(updatedData);
      setIsModalOpen(false);
      toast.success("Product created successfully");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (formData: any) => {
    if (!selectedProduct) return;
    try {
      setIsLoading(true);
      setError(null);
      console.log(formData, "formData");
      const result = await updateProduct(selectedProduct.id, formData);
      console.log(result, "result");
      if (!result.success) {
        console.log("Server error:", result.error);
        throw result.error;
      }
      const updatedData = await getProducts({
        search: searchParams.search,
        categoryId: searchParams.categoryId,
        page: Number(searchParams.page),
        limit: 10,
      });
      setData(updatedData);
      setIsModalOpen(false);
      toast.success("Product updated successfully");
    } catch (error: any) {
      console.error("Error updating product:", error);
      setError(error.message || "Failed to update product. Please try again.");
      toast.error(
        error.message || "Failed to update product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setError(null);
      await deleteProduct(id);
      const updatedData = await getProducts({
        search: searchParams.search,
        categoryId: searchParams.categoryId,
        page: Number(searchParams.page),
        limit: 10,
      });
      setData(updatedData);
    } catch (error: any) {
      console.error("Error deleting product:", error);
      setError(error.message || "Failed to delete product. Please try again.");
    }
  };

  const openEditModal = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setSelectedProduct(undefined);
            setIsModalOpen(true);
          }}
          className="btn btn-primary btn-sm gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="card bg-base-100">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-base-content/70">Product Details</th>
                <th className="text-base-content/70">SKU</th>
                <th className="text-base-content/70">Category</th>
                <th className="text-base-content/70">Price</th>
                <th className="text-base-content/70">Inventory</th>
                <th className="text-base-content/70">Status</th>
                <th className="text-base-content/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-base-content/70">
                    No products found.
                  </td>
                </tr>
              ) : (
                data.products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover cursor-pointer"
                    onClick={() => router.push(`/admin/products/${product.id}`)}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
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
                          <div className="font-medium hover:text-primary">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="text-sm text-base-content/60">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-base-content/70">{product.sku}</td>
                    <td className="text-base-content/70">
                      {product.category?.name || "-"}
                    </td>
                    <td className="text-base-content/70">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="text-base-content/70">
                      {product.inventory}
                    </td>
                    <td>
                      <div className="badge badge-sm badge-ghost">
                        {product.isActive ? (
                          <span className="text-success">Active</span>
                        ) : (
                          <span className="text-warning">Inactive</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            openEditModal(product);
                          }}
                          className="btn btn-ghost btn-sm btn-square"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            handleDeleteProduct(product.id);
                          }}
                          className="btn btn-ghost btn-sm btn-square text-error"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(undefined);
          setError(null);
        }}
        onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct}
        categories={categories}
        product={selectedProduct}
        isLoading={isLoading}
      />
    </>
  );
}
