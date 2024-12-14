"use client";

import { useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { ProductResponse } from "../actions/get";
import { createProduct, deleteProduct, updateProduct } from "../actions";
import ProductModal from "./ProductModal";
import Image from "next/image";

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
}

export default function ProductsTable({
  initialData,
  searchParams,
}: ProductsTableProps) {
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
      setError(null);
      await createProduct(formData);
      const updatedData = await fetch(
        `/api/products?${new URLSearchParams(searchParams)}`
      ).then((res) => res.json());
      setData(updatedData);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating product:", error);
      setError(error.message || "Failed to create product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (formData: any) => {
    if (!selectedProduct) return;
    try {
      setIsLoading(true);
      setError(null);
      await updateProduct(selectedProduct.id, formData);
      const updatedData = await fetch(
        `/api/products?${new URLSearchParams(searchParams)}`
      ).then((res) => res.json());
      setData(updatedData);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error updating product:", error);
      setError(error.message || "Failed to update product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setError(null);
      await deleteProduct(id);
      const updatedData = await fetch(
        `/api/products?${new URLSearchParams(searchParams)}`
      ).then((res) => res.json());
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
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/50 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Product Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {data.products.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                data.products.map((product) => (
                  <tr
                    key={product.id}
                    className="block lg:table-row hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="flex justify-between px-4 py-3 lg:table-cell">
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="flex justify-between px-4 py-3 lg:table-cell">
                      <span className="font-medium lg:hidden">SKU:</span>
                      <div className="text-sm text-right lg:text-left">
                        {product.sku}
                      </div>
                    </td>
                    <td className="flex justify-between px-4 py-3 lg:table-cell">
                      <span className="font-medium lg:hidden">Category:</span>
                      <div className="text-sm text-right lg:text-left">
                        {product.category?.name || "-"}
                      </div>
                    </td>
                    <td className="flex justify-between px-4 py-3 lg:table-cell">
                      <span className="font-medium lg:hidden">Price:</span>
                      <div className="text-sm text-right lg:text-left">
                        ${product.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="flex justify-between px-4 py-3 lg:table-cell">
                      <span className="font-medium lg:hidden">Inventory:</span>
                      <div className="text-sm text-right lg:text-left">
                        {product.inventory}
                      </div>
                    </td>
                    <td className="flex justify-between px-4 py-3 lg:table-cell">
                      <span className="font-medium lg:hidden">Status:</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          product.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 lg:text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
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
        product={selectedProduct}
        isLoading={isLoading}
      />
    </>
  );
}
