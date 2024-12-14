import { UserRole } from "@prisma/client";

export interface UserWithDetails {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
  _count: {
    orders: number;
  };
}