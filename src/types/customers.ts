import { OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface CustomerWithDetails {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    orders: number;
  };
  orders: {
    id: string;
    total: Decimal;
    status: OrderStatus;
    createdAt: Date;
  }[];
}