import { getUsers } from "./actions/get";
import UserTable from "./components/UserTable";

// Type for search params
type SearchParams = { [key: string]: string | string[] | undefined };

// Page props interface
interface PageProps {
  searchParams: SearchParams;
}

export default async function UsersPage({ searchParams }: PageProps) {
  // Parse search params safely
  const params = await Promise.resolve(searchParams);
  const search = typeof params.search === "string" ? params.search : "";
  const role = typeof params.role === "string" ? params.role : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  // Fetch data server-side
  const usersData = await getUsers({
    search,
    role,
    page,
    limit: 10,
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your store users
        </p>
      </div>

      <UserTable
        initialData={usersData}
        searchParams={{
          search,
          role,
          page: String(page),
        }}
      />
    </div>
  );
}
