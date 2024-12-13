import { Page, PageStatus } from "@prisma/client";

// Type for pages table display
export interface PageListItem {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  updatedAt: Date;
}

// Type for page editor
export interface PageContent {
  hero: {
    title: string;
    description: string;
    cta: string;
    image: string;
  };
  featuredProducts: {
    title: string;
    products: string[];
  };
  categories: {
    title: string;
    categories: string[];
  };
  newsletter: {
    title: string;
    description: string;
  };
}

export interface PageDetails {
  id: string;
  title: string;
  content: PageContent;
  status: PageStatus;
}

// Response type for getPages
export interface GetPagesResponse {
  pages: PageListItem[];
  total: number;
  pageCount: number;
}