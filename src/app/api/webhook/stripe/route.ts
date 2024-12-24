import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get the customer details
        const customer = session.customer_details;
        const customerId = session.customer as string | undefined;
        
        // Get the items purchased from metadata
        const items = JSON.parse(session.metadata?.items || "[]");
        
        // Generate a unique order number (you might want to use a more sophisticated method)
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Create the order in your database
        await prisma.orders.create({
          data: {
            orderNumber,
            total: session.amount_total! / 100, // Convert from cents to dollars
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            paymentIntent: session.payment_intent as string,
            // Handle both guest and logged-in customers
            ...(customerId
              ? { customerId }
              : {
                  guestEmail: customer?.email,
                  guestName: customer?.name,
                }),
            items: {
              create: items.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        });

        // You could send an order confirmation email here
        
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order payment status
        await prisma.orders.updateMany({
          where: { paymentIntent: paymentIntent.id },
          data: {
            paymentStatus: PaymentStatus.PAID,
            status: OrderStatus.PROCESSING,
          },
        });
        
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status
        await prisma.orders.updateMany({
          where: { paymentIntent: paymentIntent.id },
          data: {
            paymentStatus: PaymentStatus.FAILED,
            status: OrderStatus.CANCELLED,
          },
        });
        
        // You could send a payment failed notification email here
        
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
