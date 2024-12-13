import { getPages, initializeHomePage } from "@/app/_actions/admin/pages";
import PagesTable from "@/components/admin/dashboard/tables/PagesTable";

type SearchParams = { [key: string]: string | string[] | undefined };

interface PageProps {
  searchParams: SearchParams;
}

export default async function PagesPage({ searchParams }: PageProps) {
  // Initialize home page if it doesn't exist
  await initializeHomePage();

  // Await and parse search params
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
        <h1 className="text-2xl font-bold tracking-tight">Pages</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your store pages
        </p>
      </div>

      <PagesTable
        initialData={pagesData}
        searchParams={{
          search,
          status,
          page: String(page),
          // limit: String(10),
        }}
      />
    </div>
  );
}
