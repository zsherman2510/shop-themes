import { Decimal } from "@prisma/client/runtime/library";
import { OrderStatus } from "@prisma/client";
export interface OrderWithDetails {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customer: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
  total: Decimal;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  notes: string | null;
}