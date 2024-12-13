import { Decimal } from "@prisma/client/runtime/library";

export interface ProductWithCategory {
  id: string;
  name: string;
  description: string | null;
  price: Decimal;
  sku: string;
  inventory: number;
  isActive: boolean;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
  } | null;
}
