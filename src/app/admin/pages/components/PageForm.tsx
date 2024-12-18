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
        <h2 className="text-lg font-medium text-base-content">
          {defaultValues ? "Edit Page" : "Create Page"}
        </h2>
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading
            ? "Saving..."
            : defaultValues
              ? "Save Changes"
              : "Create Page"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base">Hero Section</h3>
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  {...register("content.hero.title", {
                    required: "Title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters",
                    },
                  })}
                  className={`input input-bordered w-full ${
                    errors.content?.hero?.title ? "input-error" : ""
                  }`}
                />
                {errors.content?.hero?.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.content.hero.title.message as string}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  {...register("content.hero.description")}
                  rows={3}
                  className="textarea textarea-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">CTA Text</span>
                </label>
                <input
                  type="text"
                  {...register("content.hero.cta")}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Image URL</span>
                </label>
                <input
                  type="text"
                  {...register("content.hero.image")}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base">Featured Products Section</h3>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Section Title</span>
              </label>
              <input
                type="text"
                {...register("content.featuredProducts.title")}
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base">Categories Section</h3>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Section Title</span>
              </label>
              <input
                type="text"
                {...register("content.categories.title")}
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="card bg-base-100">
          <div className="card-body">
            <h3 className="card-title text-base">Newsletter Section</h3>
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  {...register("content.newsletter.title")}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  {...register("content.newsletter.description")}
                  rows={3}
                  className="textarea textarea-bordered w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Page Status */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <select
            {...register("status")}
            className="select select-bordered w-full"
          >
            <option value={PageStatus.DRAFT}>Draft</option>
            <option value={PageStatus.PUBLISHED}>Published</option>
          </select>
        </div>
      </div>
    </form>
  );
}
