"use client";

import { useForm } from "react-hook-form";
import { PageDetails } from "@/types/pages";
import { PageStatus } from "@prisma/client";
import { updatePage } from "../actions/update";
import { useRouter } from "next/navigation";

interface PageFormProps {
  defaultValues?: PageDetails;
  isLoading?: boolean;
}

export default function PageForm({ defaultValues, isLoading }: PageFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: defaultValues?.title || "",
      content: defaultValues?.content || {
        hero: {
          title: "",
          description: "",
          cta: "",
          image: "",
        },
        featuredProducts: {
          title: "",
          products: [],
        },
        categories: {
          title: "",
          categories: [],
        },
        newsletter: {
          title: "",
          description: "",
        },
      },
      status: defaultValues?.status || PageStatus.DRAFT,
    },
  });

  const inputClassName = (hasError: boolean) =>
    `w-full rounded-lg border ${
      hasError ? "border-red-500" : "border-gray-200"
    } px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100`;

  const onSubmit = async (data: any) => {
    try {
      if (!defaultValues?.id) return;
      await updatePage({
        id: defaultValues.id,
        ...data,
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating page:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          {defaultValues ? "Edit Page" : "Create Page"}
        </h2>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {isLoading
            ? "Saving..."
            : defaultValues
              ? "Save Changes"
              : "Create Page"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <input
                type="text"
                {...register("content.hero.title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
                className={inputClassName(!!errors.content?.hero?.title)}
              />
              {errors.content?.hero?.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.content.hero.title.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                {...register("content.hero.description")}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">CTA Text</label>
              <input
                type="text"
                {...register("content.hero.cta")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Image URL
              </label>
              <input
                type="text"
                {...register("content.hero.image")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">
            Featured Products Section
          </h3>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Section Title
            </label>
            <input
              type="text"
              {...register("content.featuredProducts.title")}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Categories Section</h3>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Section Title
            </label>
            <input
              type="text"
              {...register("content.categories.title")}
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
            />
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Newsletter Section</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <input
                type="text"
                {...register("content.newsletter.title")}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                {...register("content.newsletter.description")}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Page Status */}
        <div>
          <label className="mb-2 block text-sm font-medium">Status</label>
          <select
            {...register("status")}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          >
            <option value={PageStatus.DRAFT}>Draft</option>
            <option value={PageStatus.PUBLISHED}>Published</option>
          </select>
        </div>
      </div>
    </form>
  );
}
