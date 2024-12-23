import { SectionType } from "@/types/pages";

export function getDefaultContentForType(type: SectionType): any {
  switch (type) {
    case "hero":
      return {
        title: "Welcome",
        description: "Add your hero description here",
        ctaText: "Learn More",
        ctaLink: "/",
        image: "",
        overlayColor: "rgba(0,0,0,0.5)",
        textColor: "#ffffff",
      };
    case "featuredProducts":
      return {
        title: "Featured Products",
        productIds: [],
        displayCount: 4,
      };
    case "categories":
      return {
        title: "Shop by Category",
        categoryIds: [],
        layout: "grid" as const,
      };
    case "newsletter":
      return {
        title: "Subscribe to Our Newsletter",
        description: "Stay updated with our latest products and offers",
        buttonText: "Subscribe",
        placeholder: "Enter your email",
      };
    case "textBlock":
      return {
        title: "New Text Block",
        text: "Enter your content here",
        alignment: "left" as const,
      };
    case "productGrid":
      return {
        title: "Product Collection",
        productIds: [],
        columns: 4,
        showPrices: true,
      };
    case "banner":
      return {
        title: "Special Offer",
        subtitle: "Limited time only",
        image: "",
        link: "/",
        overlayColor: "rgba(0,0,0,0.3)",
        textColor: "#ffffff",
      };
    default:
      throw new Error(`Section type ${type} is not implemented yet`);
  }
} 