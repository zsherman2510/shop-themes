import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/auth/next-auth";

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type ReviewWithCustomer = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  customer: {
    firstName: string | null;
    lastName: string | null;
  } | null;
};

export async function createReview(data: z.infer<typeof reviewSchema>) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const validatedData = reviewSchema.parse(data);

    // Get customer by email
    const customer = await prisma.customers.findUnique({
      where: { email: session.user.email },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    // Check if customer has already reviewed this product
    const existingReview = await prisma.reviews.findFirst({
      where: {
        productId: validatedData.productId,
        customerId: customer.id,
      },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }

    // Create the review
    const review = await prisma.reviews.create({
      data: {
        productId: validatedData.productId,
        customerId: customer.id,
        rating: validatedData.rating,
        comment: validatedData.comment,
        status: "PENDING", // Reviews need approval before being displayed
      },
    });

    return review;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

export async function getProductReviews(productId: string): Promise<ReviewWithCustomer[]> {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const reviews = await prisma.reviews.findMany({
      where: {
        productId,
        status: "APPROVED", // Only return approved reviews
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
} 