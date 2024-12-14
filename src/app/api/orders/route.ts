import { NextRequest } from "next/server";
import { getOrders } from "@/app/admin/orders/actions/get";
import { OrderStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;
    const page = Number(searchParams.get("page")) || 1;

    const data = await getOrders({
      search,
      status: status as OrderStatus | undefined,
      page,
      limit: 10,
    });

    return Response.json(data);
  } catch (error) {
    console.error("Error in orders API:", error);
    return Response.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
} 