"use client";

import { useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import { Categories } from "@prisma/client";
import {
  createCategory,
  deleteCategory,
  getCategoriesForAdmin,
  updateCategory,
} from "../actions/categories";
import CategoryModal from "./CategoryModal";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Category } from "@/app/_actions/store/categories";

interface CategoryWithCount extends Category {
  _count: {
    products: number;
  };
}

interface CategoriesTableProps {
  initialData: {
    categories: CategoryWithCount[];
    total: number;
    pageCount: number;
  };
  searchParams: {
    search?: string;
    page: string;
  };
}

export default function CategoriesTable({
  initialData,
  searchParams,
}: CategoriesTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryWithCount | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(initialData);

  const refreshData = async () => {
    const response = await getCategoriesForAdmin();
    setData(response);
  };

  const handleCreateCategory = async (formData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await createCategory(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      await refreshData();
      setIsModalOpen(false);
      toast.success("Category created successfully");
    } catch (error: any) {
      console.error("Error creating category:", error);
      setError(error.message || "Failed to create category. Please try again.");
      toast.error("Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async (formData: any) => {
    if (!selectedCategory) return;
    try {
      setIsLoading(true);
      setError(null);
      const result = await updateCategory(selectedCategory.id, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      await refreshData();
      setIsModalOpen(false);
      toast.success("Category updated successfully");
    } catch (error: any) {
      console.error("Error updating category:", error);
      setError(error.message || "Failed to update category. Please try again.");
      toast.error("Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      setError(null);
      const result = await deleteCategory(id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      await refreshData();
      toast.success("Category deleted successfully");
    } catch (error: any) {
      console.error("Error deleting category:", error);
      setError(error.message || "Failed to delete category. Please try again.");
      toast.error("Failed to delete category");
    }
  };

  const openEditModal = (category: CategoryWithCount) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setSelectedCategory(undefined);
            setIsModalOpen(true);
          }}
          className="btn btn-primary btn-sm gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Category
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
                <th className="text-base-content/70">Category Details</th>
                <th className="text-base-content/70">Slug</th>
                <th className="text-base-content/70">Products</th>
                <th className="text-base-content/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-base-content/70">
                    No categories found.
                  </td>
                </tr>
              ) : (
                data.categories.map((category) => (
                  <tr key={category.id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        {category.image && (
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10">
                              <Image
                                src={category.image}
                                alt={category.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-base-content/60">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-base-content/70">{category.slug}</td>
                    <td className="text-base-content/70">
                      {category._count?.products || 0}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="btn btn-ghost btn-sm btn-square"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(undefined);
        }}
        onSubmit={async (formData) => {
          if (selectedCategory) {
            await handleUpdateCategory(formData);
          } else {
            await handleCreateCategory(formData);
          }
        }}
        category={selectedCategory}
        isLoading={isLoading}
      />
    </>
  );
}
