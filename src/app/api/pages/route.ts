import { NextRequest } from "next/server";
import { getPages } from "@/app/admin/pages/actions/get";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || undefined;
    const page = Number(searchParams.get("page")) || 1;

    const data = await getPages({
      search,
      status,
      page,
      limit: 10,
    });

    return Response.json(data);
  } catch (error) {
    console.error("Error in pages API:", error);
    return Response.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
} 