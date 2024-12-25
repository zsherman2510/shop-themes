import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus, ProductType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { sendOrderConfirmationEmail, sendDigitalProductDeliveryEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function formatDecimal(amount: number): Decimal {
  return new Decimal(amount.toFixed(2));
}

async function handleOrderConfirmation(order: any, items: any[], customerEmail: string, customerName?: string) {
  try {
    await sendOrderConfirmationEmail({
      customerEmail,
      customerName,
      orderNumber: order.orderNumber,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price)
      })),
      total: parseFloat(order.total.toString())
    });
    console.log("Order confirmation email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return false;
  }
}

async function handleDigitalProductDelivery(items: any[], customerEmail: string, orderNumber: string, customerName?: string) {
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
      await sendDigitalProductDeliveryEmail({
        customerEmail,
        customerName,
        orderNumber,
        products: digitalProducts.map(p => ({
          name: p.name,
          downloadUrl: p.fileUrl || ''
        }))
      });
      console.log("Digital product delivery email sent successfully");
      return true;
    }
    return true; // Return true if there are no digital products
  } catch (error) {
    console.error("Error handling digital product delivery:", error);
    return false;
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
          // Create or find customer
          let dbCustomer = null;
          if (customer?.email) {
            dbCustomer = await prisma.customers.findUnique({
              where: { email: customer.email }
            });
          }

          if (!dbCustomer && customer?.email) {
            dbCustomer = await prisma.customers.create({
              data: {
                email: customer.email,
                firstName: customer.name?.split(' ')[0] || null,
                lastName: customer.name?.split(' ').slice(1).join(' ') || null,
                isSubscribed: true,
              }
            });
            console.log("Created new customer:", dbCustomer);
          }

          // Create the order with the correct payment status based on session status
          const order = await prisma.orders.create({
            data: {
              orderNumber,
              total: formatDecimal(session.amount_total! / 100),
              status: session.payment_status === "paid" ? OrderStatus.PROCESSING : OrderStatus.PENDING,
              paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.PENDING,
              paymentIntent: session.payment_intent as string,
              customerId: dbCustomer?.id,
              guestEmail: !dbCustomer ? customer?.email : null,
              guestName: !dbCustomer ? customer?.name : null,
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

          // If payment is already successful, handle emails and delivery
          if (session.payment_status === "paid" && customer?.email) {
            const confirmationSent = await handleOrderConfirmation(
              order,
              items,
              customer.email,
              customer.name || undefined
            );
            
            const deliverySent = await handleDigitalProductDelivery(
              items,
              customer.email,
              orderNumber,
              customer.name || undefined
            );
            
            // Only update to DELIVERED if both emails were sent successfully
            if (confirmationSent && deliverySent) {
              await prisma.orders.update({
                where: { id: order.id },
                data: {
                  status: OrderStatus.DELIVERED,
                },
              });
              console.log("Updated order status to DELIVERED:", order.id);
            } else {
              await prisma.orders.update({
                where: { id: order.id },
                data: {
                  status: OrderStatus.PENDING,
                },
              });
            }
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
            paymentStatus: { not: PaymentStatus.PAID }
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
            include: { 
              items: {
                include: {
                  product: true
                }
              },
              customer: true 
            },
          });

          if (order) {
            const emailToUse = order.customer?.email || order.guestEmail;
            const nameToUse = order.customer?.firstName 
              ? `${order.customer.firstName} ${order.customer.lastName || ''}`
              : order.guestName || undefined;

            if (emailToUse) {
              const confirmationSent = await handleOrderConfirmation(
                order,
                order.items.map(item => ({
                  ...item,
                  name: item.product.name,
                  price: parseFloat(item.price.toString())
                })),
                emailToUse,
                nameToUse
              );

              const deliverySent = await handleDigitalProductDelivery(
                order.items.map(item => ({
                  ...item.product,
                  price: parseFloat(item.price.toString())
                })),
                emailToUse,
                order.orderNumber,
                nameToUse
              );
              
              // Only update to DELIVERED if both emails were sent successfully
              if (confirmationSent && deliverySent) {
                await prisma.orders.update({
                  where: { id: order.id },
                  data: {
                    status: OrderStatus.DELIVERED,
                  },
                });
                console.log("Updated order status to DELIVERED:", order.id);
              }
            }
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
