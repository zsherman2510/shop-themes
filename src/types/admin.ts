import { UserRole, UserStatus } from "@prisma/client";

export const TEAM_PERMISSIONS = {
  MANAGE_PRODUCTS: "manage_products",
  MANAGE_ORDERS: "manage_orders",
  MANAGE_CUSTOMERS: "manage_customers",
  MANAGE_CONTENT: "manage_content",
} as const;

export type TeamPermission = keyof typeof TEAM_PERMISSIONS;

export type AdminUserResponse = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  status: UserStatus;
  permissions: string[];
  createdAt: Date;
};
