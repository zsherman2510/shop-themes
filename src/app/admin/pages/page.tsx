import { getPages, initializeHomePage } from "./actions/get";
import PageTable from "./components/PageTable";
import { Metadata } from "next";

// Type for search params
type SearchParams = Promise<{
  search: string;
  status: string;
  page: string;
}>;

// Page props interface
interface PageProps {
  searchParams: SearchParams;
}

// Metadata
export const metadata: Metadata = {
  title: "Pages | Admin Dashboard",
  description: "Manage your store pages",
};

export default async function PagesPage({ searchParams }: PageProps) {
  // Initialize home page if it doesn't exist
  await initializeHomePage();

  // Await and parse search params
  const { search, status, page } = await searchParams;

  // Fetch data server-side
  const pagesData = await getPages({
    search,
    status,
    page: Number(page),
    limit: 10,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-base-content">
          Pages
        </h1>
        <p className="text-sm text-base-content/70">
          Manage your store pages and content
        </p>
      </div>

      <div className="bg-base-100 rounded-lg shadow">
        <PageTable
          initialData={pagesData}
          searchParams={{
            search,
            status,
            page: String(page),
          }}
        />
      </div>
    </div>
  );
}
