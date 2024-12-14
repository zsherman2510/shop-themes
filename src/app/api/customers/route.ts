import { NextRequest } from "next/server";
import { getCustomers } from "@/app/admin/customers/actions/get";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page")) || 1;

    const data = await getCustomers({
      search,
      page,
      limit: 10,
    });

    return Response.json(data);
  } catch (error) {
    console.error("Error in customers API:", error);
    return Response.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
} 