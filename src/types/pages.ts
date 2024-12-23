import { PageStatus } from "@prisma/client";

// Type for pages table display
// src/types/pages.ts

export interface PageListItem {
  id: string;
  title: string;
  status: PageStatus;
  updatedAt: Date;
}

// Type for page content
export interface PageContent {
  hero?: {
    title?: string;
    description?: string;
    cta?: string;
    image?: string;
    show?: boolean;
  };
  featuredProducts?: {
    title?: string;
    products?: string[];
  };
  categories?: {
    title?: string;
    categories?: string[];
  };
  newsletter?: {
    title?: string;
    description?: string;
  };
}

// Type for page details
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