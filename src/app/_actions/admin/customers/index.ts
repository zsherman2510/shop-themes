"use server";

import { PrismaClient, Prisma, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCustomers(params: {
  search?: string;
  hasOrders?: boolean;
  page?: number;
  limit?: number;
}) {
  try {
    const { search, hasOrders, page = 1, limit = 10 } = params || {};
    const skip = (page - 1) * limit;

    // Build the where clause
    const where: Prisma.UserWhereInput = {
      // Base condition for customers only
      role: UserRole.CUSTOMER,
    };

    // Add hasOrders filter if specified
    if (hasOrders !== undefined) {
      where.orders = hasOrders 
        ? { some: {} }  // At least one order
        : { none: {} }; // No orders
    }

    // Add search conditions if present
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.user.count({
      where,
    });

    // Get customers with pagination and their latest order
    const customers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // Only get the latest order
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Transform the data to match the expected format

    return {
      customers,
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error in getCustomers:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch customers: ${error.message}`);
    }
    throw new Error("Failed to fetch customers");
  }
}

export async function getCustomerDetails(customerId: string) {
  try {
    const customer = await prisma.user.findUnique({
      where: {
        id: customerId,
        role: UserRole.CUSTOMER,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
            items: {
              select: {
                quantity: true,
                price: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        addresses: true,
        _count: {
          select: {
            orders: true,
          }
        }
      }
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  } catch (error) {
    console.error("Error in getCustomerDetails:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch customer details: ${error.message}`);
    }
    throw new Error("Failed to fetch customer details");
  }
}