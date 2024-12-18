import { getPages, initializeHomePage } from "./actions/get";
import PageTable from "./components/PageTable";

// Type for search params
type SearchParams = { [key: string]: string | string[] | undefined };

// Page props interface
interface PageProps {
  searchParams: SearchParams;
}

export default async function PagesPage({ searchParams }: PageProps) {
  // Initialize home page if it doesn't exist
  await initializeHomePage();

  const params = await Promise.resolve(searchParams);
  // Parse search params safely
  const search = typeof params.search === "string" ? params.search : "";
  const status = typeof params.status === "string" ? params.status : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  // Fetch data server-side
  const pagesData = await getPages({
    search,
    status,
    page,
    limit: 10,
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-base-content">
          Pages
        </h1>
        <p className="text-sm text-base-content/70">Manage your store pages</p>
      </div>

      <PageTable
        initialData={pagesData}
        searchParams={{
          search,
          status,
          page: String(page),
        }}
      />
    </div>
  );
}
