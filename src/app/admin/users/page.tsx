import { UserRole } from "@prisma/client";
import { getUsers } from "./actions/get";
import UserTable from "./components/UserTable";

// Type for search params
type SearchParams = Promise<{
  search: string;
  role: string;
  page: string;
}>;

// Page props interface
interface PageProps {
  searchParams: SearchParams;
}

export default async function UsersPage({ searchParams }: PageProps) {
  // Await and parse search params
  const { search, role, page } = await searchParams;

  // Fetch data server-side
  const usersData = await getUsers({
    search,
    role: role as UserRole | undefined,
    page: Number(page),
    limit: 10,
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-base-content">
          Users
        </h1>
        <p className="text-sm text-base-content/70">Manage your store users</p>
      </div>

      <UserTable
        initialData={usersData}
        searchParams={{
          search,
          role: role as UserRole | undefined,
          page: String(page),
        }}
      />
    </div>
  );
}
