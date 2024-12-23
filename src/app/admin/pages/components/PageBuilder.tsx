"use client";

import { useState } from "react";
import {
  PageSection,
  SectionType,
  HeroSection,
  FeaturedProductsSection,
  CategoriesSection,
  NewsletterSection,
  TextBlockSection,
  ProductGridSection,
  BannerSection,
} from "@/types/pages";
import {
  HeroEditor,
  FeaturedProductsEditor,
  CategoriesEditor,
  NewsletterEditor,
  TextBlockEditor,
} from "./section-editors";
import { getDefaultContentForType } from "./utils/sectionUtils";

interface PageBuilderProps {
  sections: PageSection[];
  onChange: (sections: PageSection[]) => void;
}

// Helper function to create a new section with proper typing
function createSection(type: SectionType, order: number): PageSection {
  const base = {
    id: crypto.randomUUID(),
    isActive: true,
    order,
  };

  switch (type) {
    case "hero":
      return {
        ...base,
        type: "hero",
        content: getDefaultContentForType("hero"),
      } as HeroSection;
    case "featuredProducts":
      return {
        ...base,
        type: "featuredProducts",
        content: getDefaultContentForType("featuredProducts"),
      } as FeaturedProductsSection;
    case "categories":
      return {
        ...base,
        type: "categories",
        content: getDefaultContentForType("categories"),
      } as CategoriesSection;
    case "newsletter":
      return {
        ...base,
        type: "newsletter",
        content: getDefaultContentForType("newsletter"),
      } as NewsletterSection;
    case "textBlock":
      return {
        ...base,
        type: "textBlock",
        content: getDefaultContentForType("textBlock"),
      } as TextBlockSection;
    case "productGrid":
      return {
        ...base,
        type: "productGrid",
        content: getDefaultContentForType("productGrid"),
      } as ProductGridSection;
    case "banner":
      return {
        ...base,
        type: "banner",
        content: getDefaultContentForType("banner"),
      } as BannerSection;
    default:
      throw new Error(`Section type ${type} is not implemented yet`);
  }
}

export default function PageBuilder({ sections, onChange }: PageBuilderProps) {
  const [activeSections, setSections] = useState<PageSection[]>(sections);

  const addSection = (type: SectionType) => {
    const newSection = createSection(type, activeSections.length);
    const updatedSections = [...activeSections, newSection];
    setSections(updatedSections);
    onChange(updatedSections);
  };

  const updateSection = (sectionId: string, updates: Partial<PageSection>) => {
    const updatedSections = activeSections.map((section) => {
      if (section.id !== sectionId) return section;

      // Create updated section with proper typing
      const updatedSection = { ...section, ...updates };

      // Type guard to ensure correct content type
      switch (updatedSection.type) {
        case "hero":
          return updatedSection as HeroSection;
        case "featuredProducts":
          return updatedSection as FeaturedProductsSection;
        case "categories":
          return updatedSection as CategoriesSection;
        case "newsletter":
          return updatedSection as NewsletterSection;
        case "textBlock":
          return updatedSection as TextBlockSection;
        case "productGrid":
          return updatedSection as ProductGridSection;
        case "banner":
          return updatedSection as BannerSection;
        default:
          return section;
      }
    });

    setSections(updatedSections);
    onChange(updatedSections);
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = activeSections.filter(
      (section) => section.id !== sectionId
    );
    setSections(updatedSections);
    onChange(updatedSections);
  };

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const index = activeSections.findIndex(
      (section) => section.id === sectionId
    );
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === activeSections.length - 1) return;

    const newSections = [...activeSections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];

    setSections(newSections);
    onChange(newSections);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => addSection("hero")}
          className="btn btn-outline btn-sm"
        >
          Add Hero Section
        </button>
        <button
          onClick={() => addSection("featuredProducts")}
          className="btn btn-outline btn-sm"
        >
          Add Featured Products
        </button>
        <button
          onClick={() => addSection("categories")}
          className="btn btn-outline btn-sm"
        >
          Add Categories
        </button>
        <button
          onClick={() => addSection("newsletter")}
          className="btn btn-outline btn-sm"
        >
          Add Newsletter
        </button>
        <button
          onClick={() => addSection("textBlock")}
          className="btn btn-outline btn-sm"
        >
          Add Text Block
        </button>
        <button
          onClick={() => addSection("productGrid")}
          className="btn btn-outline btn-sm"
        >
          Add Product Grid
        </button>
        <button
          onClick={() => addSection("banner")}
          className="btn btn-outline btn-sm"
        >
          Add Banner
        </button>
      </div>

      <div className="space-y-4">
        {activeSections.map((section, index) => {
          const commonProps = {
            section,
            onChange: (updates: Partial<PageSection>) =>
              updateSection(section.id, updates),
            onDelete: () => removeSection(section.id),
            onMoveUp: () => moveSection(section.id, "up"),
            onMoveDown: () => moveSection(section.id, "down"),
            isFirst: index === 0,
            isLast: index === activeSections.length - 1,
          };

          return (
            <div key={section.id} className="card bg-base-200 p-4">
              {section.type === "hero" && <HeroEditor {...commonProps} />}
              {section.type === "featuredProducts" && (
                <FeaturedProductsEditor {...commonProps} />
              )}
              {section.type === "categories" && (
                <CategoriesEditor {...commonProps} />
              )}
              {section.type === "newsletter" && (
                <NewsletterEditor {...commonProps} />
              )}
              {section.type === "textBlock" && (
                <TextBlockEditor {...commonProps} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
