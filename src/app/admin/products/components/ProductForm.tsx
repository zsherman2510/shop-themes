"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ProductResponse } from "../actions/get";
import { ProductType } from "@prisma/client";

interface ProductFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  defaultValues?: ProductResponse;
  isLoading?: boolean;
}

export default function ProductForm({
  onSubmit,
  defaultValues,
  isLoading,
}: ProductFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: defaultValues?.name || "Premium Shopify Theme",
      description:
        defaultValues?.description ||
        "A modern, highly customizable Shopify theme perfect for fashion and lifestyle brands. Features include advanced filtering, quick view, mega menu, and more.",
      sku: defaultValues?.sku || "THEME-001",
      price: defaultValues?.price || 79.99,
      categoryId: defaultValues?.category?.id || "",
      isActive: defaultValues?.isActive ?? true,
      type: ProductType.DIGITAL,
      previewUrl:
        defaultValues?.previewUrl || "https://premium-theme.myshopify.com",
      version: defaultValues?.version || "1.0.0",
      features:
        defaultValues?.features?.join(", ") ||
        "Mega Menu, Quick View, Ajax Cart, Advanced Filtering, Custom Sections, Mobile-First Design, SEO Optimized, Performance Focused",
      documentation:
        defaultValues?.documentation ||
        `# Installation Guide

1. Download the theme ZIP file
2. Go to your Shopify admin
3. Navigate to Online Store > Themes
4. Click "Upload theme"
5. Select the downloaded ZIP file

# Configuration

- Set up mega menu in Theme Settings
- Configure colors and typography
- Customize homepage sections
- Set up collection filters

Need help? Contact support@premiumtheme.com`,
    },
  });

  const handleFormSubmit = async (data: any) => {
    const formData = new FormData();

    // Append all form fields
    Object.keys(data).forEach((key) => {
      if (key === "features") {
        const features = data[key]
          .split(",")
          .map((f: string) => f.trim())
          .filter((f: string) => f);
        formData.append(key, JSON.stringify(features));
      } else {
        formData.append(key, data[key]);
      }
    });

    // Append file if selected
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-base-content/70"
    >
      {/* Basic Fields */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="input input-bordered w-full"
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">
              {errors.name.message}
            </span>
          </label>
        )}
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          {...register("description")}
          className="textarea textarea-bordered w-full"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">SKU</span>
          </label>
          <input
            type="text"
            {...register("sku", { required: "SKU is required" })}
            className="input input-bordered w-full"
          />
          {errors.sku && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.sku.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Price</span>
          </label>
          <input
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be greater than 0" },
            })}
            className="input input-bordered w-full"
          />
          {errors.price && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.price.message}
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Digital Product Fields */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Theme File (ZIP)</span>
        </label>
        <input
          type="file"
          accept=".zip"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setSelectedFile(file);
          }}
          className="file-input file-input-bordered w-full"
        />
        {selectedFile && (
          <label className="label">
            <span className="label-text-alt">
              Selected: {selectedFile.name}
            </span>
          </label>
        )}
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Preview URL</span>
        </label>
        <input
          type="url"
          {...register("previewUrl")}
          className="input input-bordered w-full"
          placeholder="https://demo-store.myshopify.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Version</span>
          </label>
          <input
            type="text"
            {...register("version")}
            className="input input-bordered w-full"
            placeholder="1.0.0"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select
            {...register("categoryId")}
            className="select select-bordered w-full"
          >
            <option value="">Select a category</option>
            {/* TODO: Add categories from API */}
          </select>
        </div>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Features (comma-separated)</span>
        </label>
        <input
          type="text"
          {...register("features")}
          className="input input-bordered w-full"
          placeholder="Mega Menu, Quick View, Ajax Cart"
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Documentation</span>
        </label>
        <textarea
          {...register("documentation")}
          className="textarea textarea-bordered w-full"
          rows={4}
          placeholder="Installation and usage instructions..."
        />
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Active</span>
          <input
            type="checkbox"
            {...register("isActive")}
            className="checkbox"
          />
        </label>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading
            ? "Loading..."
            : defaultValues
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}
