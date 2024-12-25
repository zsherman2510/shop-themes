"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export async function subscribeToNewsletter(data: z.infer<typeof newsletterSchema>) {
  try {
    const validatedData = newsletterSchema.parse(data);

    // Check if customer already exists
    let customer = await prisma.customers.findUnique({
      where: { email: validatedData.email },
    });

    if (customer) {
      // Update existing customer if not already subscribed
      if (!customer.isSubscribed) {
        customer = await prisma.customers.update({
          where: { email: validatedData.email },
          data: { isSubscribed: true },
        });
      }
    } else {
      // Create new customer
      customer = await prisma.customers.create({
        data: {
          email: validatedData.email,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          isSubscribed: true,
        },
      });
    }

    // Send welcome email
    await sendEmail({
      to: validatedData.email,
      subject: "Welcome to Our Newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #16a34a;">Welcome to Our Newsletter!</h1>
          <p>Hi ${validatedData.firstName || 'there'},</p>
          <p>Thank you for subscribing to our newsletter! We're excited to keep you updated with our latest themes, features, and web development tips.</p>
          <p>You'll be the first to know about:</p>
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 10px;">✓ New theme releases</li>
            <li style="margin-bottom: 10px;">✓ Special offers and discounts</li>
            <li style="margin-bottom: 10px;">✓ Web development tips and tricks</li>
            <li style="margin-bottom: 10px;">✓ Industry news and trends</li>
          </ul>
          <p>Best regards,<br>Shop Themes Team</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    throw error;
  }
} 