"use client";

import { useForm } from "react-hook-form";
import {
  PageDetails,
  PageSection,
  SectionType,
  HeroSection,
  FeaturedProductsSection,
  CategoriesSection,
  BannerSection,
} from "@/types/pages";
import { useRouter } from "next/navigation";
import { createPage } from "../actions/create";
import { updatePage } from "../actions/update";
import { PageStatus } from "@prisma/client";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  HeroEditor,
  BannerEditor,
  FeaturedProductsEditor,
  CategoriesEditor,
} from "./section-editors";

interface PageFormData {
  title: string;
  status: PageStatus;
  metaTitle?: string;
  metaDescription?: string;
  sections: PageSection[];
}

interface PageFormProps {
  defaultValues?: PageDetails;
  isLoading?: boolean;
}

const AVAILABLE_SECTIONS: { type: SectionType; label: string }[] = [
  { type: "hero", label: "Hero Section" },
  { type: "featuredProducts", label: "Featured Products" },
  { type: "categories", label: "Categories Grid" },
  { type: "banner", label: "Banner" },
  // Add more section types as needed
];

export default function PageForm({ defaultValues, isLoading }: PageFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<PageSection[]>(
    defaultValues?.sections || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PageFormData>({
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          status: defaultValues.status,
          metaTitle: defaultValues.metaTitle,
          metaDescription: defaultValues.metaDescription,
          sections: defaultValues.sections,
        }
      : {
          title: "",
          status: PageStatus.DRAFT,
          sections: [],
        },
  });

  const getDefaultContentForType = (type: SectionType) => {
    switch (type) {
      case "hero":
        return {
          title: "",
          description: "",
          ctaText: "",
          ctaLink: "",
        };
      case "featuredProducts":
        return {
          title: "",
          productIds: [],
          displayCount: 4,
        };
      case "categories":
        return {
          title: "",
          categoryIds: [],
          layout: "grid" as const,
        };
      case "banner":
        return {
          title: "",
          subtitle: "",
          image: "",
          link: "",
        };
      default:
        return {};
    }
  };

  const createNewSection = (type: SectionType, order: number): PageSection => {
    const baseSection = {
      id: Math.random().toString(36).substr(2, 9),
      isActive: true,
      order,
    };

    switch (type) {
      case "hero":
        return {
          ...baseSection,
          type: "hero",
          content: getDefaultContentForType("hero"),
        } as HeroSection;
      case "featuredProducts":
        return {
          ...baseSection,
          type: "featuredProducts",
          content: getDefaultContentForType("featuredProducts"),
        } as FeaturedProductsSection;
      case "categories":
        return {
          ...baseSection,
          type: "categories",
          content: getDefaultContentForType("categories"),
        } as CategoriesSection;
      case "banner":
        return {
          ...baseSection,
          type: "banner",
          content: getDefaultContentForType("banner"),
        } as BannerSection;
      default:
        throw new Error(`Unsupported section type: ${type}`);
    }
  };

  const addSection = (type: SectionType) => {
    const newSection = createNewSection(type, sections.length);
    setSections([...sections, newSection]);
  };

  const updateSection = (index: number, updatedSection: PageSection) => {
    const newSections = [...sections];
    newSections[index] = updatedSection;
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [
      newSections[index],
      newSections[index - 1],
    ];
    setSections(newSections);
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [
      newSections[index + 1],
      newSections[index],
    ];
    setSections(newSections);
  };

  const renderSectionEditor = (section: PageSection, index: number) => {
    const commonProps = {
      section,
      onChange: (updatedSection: PageSection) =>
        updateSection(index, updatedSection),
      onDelete: () => removeSection(index),
      onMoveUp: () => moveSectionUp(index),
      onMoveDown: () => moveSectionDown(index),
      isFirst: index === 0,
      isLast: index === sections.length - 1,
    };

    switch (section.type) {
      case "hero":
        return <HeroEditor key={section.id} {...commonProps} />;
      case "featuredProducts":
        return <FeaturedProductsEditor key={section.id} {...commonProps} />;
      case "categories":
        return <CategoriesEditor key={section.id} {...commonProps} />;
      case "banner":
        return <BannerEditor key={section.id} {...commonProps} />;
      default:
        return null;
    }
  };

  const onSubmit = async (data: PageFormData) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("status", data.status);
      if (data.metaTitle) formData.append("metaTitle", data.metaTitle);
      if (data.metaDescription)
        formData.append("metaDescription", data.metaDescription);
      formData.append("sections", JSON.stringify(sections));

      const response = defaultValues
        ? await updatePage(formData, defaultValues.id)
        : await createPage(formData);

      if (response.success) {
        router.refresh();
        router.push("/admin/pages");
      } else {
        setError(response.error || "Failed to save page");
      }
    } catch (err) {
      console.error("Error saving page:", err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className={`input input-bordered w-full ${
              errors.title ? "input-error" : ""
            }`}
            placeholder="Enter page title"
          />
          {errors.title && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.title.message}
              </span>
            </label>
          )}
        </div>

        <div className="form-control">
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

        <div className="form-control">
          <label className="label">
            <span className="label-text">Meta Title</span>
          </label>
          <input
            type="text"
            {...register("metaTitle")}
            className="input input-bordered w-full"
            placeholder="Enter meta title"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Meta Description</span>
          </label>
          <textarea
            {...register("metaDescription")}
            className="textarea textarea-bordered w-full"
            placeholder="Enter meta description"
            rows={3}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Page Sections</h3>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-primary btn-sm gap-2">
                <Plus className="h-4 w-4" />
                Add Section
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                {AVAILABLE_SECTIONS.map((section) => (
                  <li key={section.type}>
                    <button
                      type="button"
                      onClick={() => addSection(section.type)}
                      className="w-full text-left"
                    >
                      {section.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={section.id} className="card bg-base-200">
                <div className="card-body">
                  {renderSectionEditor(section, index)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-ghost"
        >
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading
            ? "Saving..."
            : defaultValues
              ? "Save Changes"
              : "Create Page"}
        </button>
      </div>
    </form>
  );
}
