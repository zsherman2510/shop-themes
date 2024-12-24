import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus, ProductType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function formatDecimal(amount: number): Decimal {
  return new Decimal(amount.toFixed(2));
}

async function sendOrderConfirmationEmail(order: any, items: any[], customerEmail: string) {
  // TODO: Implement your email service here
  console.log("Sending order confirmation email to:", customerEmail, {
    orderNumber: order.orderNumber,
    items: items,
  });
}

async function handleDigitalProductDelivery(items: any[], customerEmail: string) {
  try {
    // Get all digital products from the order
    const productIds = items.map(item => item.id);
    const digitalProducts = await prisma.products.findMany({
      where: {
        id: { in: productIds },
        type: ProductType.DIGITAL,
      },
      select: {
        id: true,
        name: true,
        fileUrl: true,
        type: true,
      },
    });

    if (digitalProducts.length > 0) {
      // TODO: Implement your email service here
      console.log("Sending digital product delivery email to:", customerEmail, {
        products: digitalProducts.map(p => ({
          name: p.name,
          downloadUrl: p.fileUrl,
        })),
      });
    }
  } catch (error) {
    console.error("Error handling digital product delivery:", error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const stripeSignature = headersList.get("stripe-signature");

    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET");
      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 }
      );
    }

    if (!stripeSignature) {
      console.error("No stripe signature in request");
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        stripeSignature,
        webhookSecret
      );
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: "Webhook signature verification failed", details: err.message },
        { status: 400 }
      );
    }

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("Processing checkout.session.completed");
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Session:", JSON.stringify(session, null, 2));
        
        // Get the customer details
        const customer = session.customer_details;
        console.log("Customer details:", customer);
        
        if (!session.metadata?.items) {
          console.error("No items found in session metadata");
          throw new Error("No items found in session metadata");
        }

        // Get the items purchased from metadata
        const items = JSON.parse(session.metadata.items);
        console.log("Items from metadata:", items);
        
        // Generate a unique order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        try {
          // Create the order with the correct payment status based on session status
          const order = await prisma.orders.create({
            data: {
              orderNumber,
              total: formatDecimal(session.amount_total! / 100),
              status: session.payment_status === "paid" ? OrderStatus.PROCESSING : OrderStatus.PENDING,
              paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.PENDING,
              paymentIntent: session.payment_intent as string,
              guestEmail: customer?.email,
              guestName: customer?.name,
              items: {
                create: items.map((item: any) => ({
                  productId: item.id,
                  quantity: item.quantity,
                  price: formatDecimal(item.price),
                })),
              },
            },
          });

          console.log("Created order:", order);

          // If payment is already successful, handle digital delivery
          if (session.payment_status === "paid" && customer?.email) {
            await sendOrderConfirmationEmail(order, items, customer.email);
            await handleDigitalProductDelivery(items, customer.email);
          }

          return NextResponse.json({ success: true });
        } catch (error) {
          console.error("Error creating order:", error);
          throw error;
        }
      }

      case "payment_intent.succeeded": {
        console.log("Processing payment_intent.succeeded");
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status to paid and processing if not already
        const updatedOrder = await prisma.orders.updateMany({
          where: { 
            paymentIntent: paymentIntent.id,
            paymentStatus: { not: PaymentStatus.PAID } // Only update if not already paid
          },
          data: {
            paymentStatus: PaymentStatus.PAID,
            status: OrderStatus.PROCESSING,
          },
        });
        
        if (updatedOrder.count > 0) {
          console.log("Updated order payment status to paid:", paymentIntent.id);
          
          // Get the order details to send confirmation email
          const order = await prisma.orders.findFirst({
            where: { paymentIntent: paymentIntent.id },
            include: { items: true },
          });

          if (order && order.guestEmail) {
            await sendOrderConfirmationEmail(order, order.items, order.guestEmail);
            await handleDigitalProductDelivery(order.items, order.guestEmail);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        console.log("Processing payment_intent.payment_failed");
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status to failed and cancelled
        await prisma.orders.updateMany({
          where: { paymentIntent: paymentIntent.id },
          data: {
            paymentStatus: PaymentStatus.FAILED,
            status: OrderStatus.CANCELLED,
          },
        });

        console.log("Updated order status to failed:", paymentIntent.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { 
        error: "Webhook handler failed", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
