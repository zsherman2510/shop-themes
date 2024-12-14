import { NextRequest } from "next/server";
import { getProducts } from "@/app/admin/products/actions/get";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || undefined;
    const page = Number(searchParams.get("page")) || 1;

    const data = await getProducts({
      search,
      categoryId,
      page,
      limit: 10,
    });

    return Response.json(data);
  } catch (error) {
    console.error("Error in products API:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
} 