import { PageStatus } from "@prisma/client";

// Define all possible section types
export type SectionType = 
  | 'hero' 
  | 'featuredProducts' 
  | 'categories' 
  | 'newsletter'
  | 'textBlock'
  | 'productGrid'
  | 'banner'
  | 'productComparison'
  | 'relatedProducts'
  | 'recentlyViewed'
  | 'instagramFeed'
  | 'storeLocator'
  | 'testimonials'
  | 'contactForm'
  | 'customHtml'
  | 'categoryShowcase'
  | 'announcementBar'
  | 'collectionList'
  | 'promotionBanner'
  | 'reviews'
  | 'sizeChart'
  | 'video'
  | 'faq'
  | 'pricingTable'
  | 'teamMembers'
  | 'blogPosts';

// Base interface for all sections
export interface BaseSection {
  id: string;
  type: SectionType;
  isActive: boolean;
  order: number;
}

// Specific section interfaces
export interface HeroSection extends BaseSection {
  type: 'hero';
  content: {
    title: string;
    description: string;
    ctaText?: string;
    ctaLink?: string;
    image?: string;
    overlayColor?: string;
    textColor?: string;
  };
}

export interface FeaturedProductsSection extends BaseSection {
  type: 'featuredProducts';
  content: {
    title: string;
    productIds: string[];
    displayCount: number;
  };
}

export interface CategoriesSection extends BaseSection {
  type: 'categories';
  content: {
    title: string;
    categoryIds: string[];
    layout: 'grid' | 'carousel';
  };
}

export interface NewsletterSection extends BaseSection {
  type: 'newsletter';
  content: {
    title: string;
    description: string;
    buttonText?: string;
    placeholder?: string;
  };
}

export interface TextBlockSection extends BaseSection {
  type: 'textBlock';
  content: {
    title?: string;
    text: string;
    alignment?: 'left' | 'center' | 'right';
  };
}

export interface ProductGridSection extends BaseSection {
  type: 'productGrid';
  content: {
    title?: string;
    productIds: string[];
    columns: number;
    showPrices: boolean;
  };
}

export interface BannerSection extends BaseSection {
  type: 'banner';
  content: {
    title?: string;
    subtitle?: string;
    image: string;
    link?: string;
    overlayColor?: string;
    textColor?: string;
  };
}

// Add basic interfaces for the remaining section types
export interface GenericSection extends BaseSection {
  type: Exclude<
    SectionType,
    | 'hero'
    | 'featuredProducts'
    | 'categories'
    | 'newsletter'
    | 'textBlock'
    | 'productGrid'
    | 'banner'
  >;
  content: Record<string, any>;
}

// Union type of all section types
export type PageSection =
  | HeroSection
  | FeaturedProductsSection
  | CategoriesSection
  | NewsletterSection
  | TextBlockSection
  | ProductGridSection
  | BannerSection
  | GenericSection;

// Updated PageDetails interface
export interface PageDetails {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  sections: PageSection[];
  metaTitle?: string;
  metaDescription?: string;
}

// Type for pages table display
export interface PageListItem {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  updatedAt: Date;
}

// Response type for getPages
export interface GetPagesResponse {
  pages: PageListItem[];
  total: number;
  pageCount: number;
}