import { getUsers } from "@/app/_actions/admin/users";
import UsersTable from "@/components/admin/dashboard/tables/UsersTable";
import { UserRole } from "@prisma/client";

type SearchParams = { [key: string]: string | string[] | undefined };

interface PageProps {
  searchParams: SearchParams;
}

export default async function UsersPage({ searchParams }: PageProps) {
  // Await and parse search params
  const params = await Promise.resolve(searchParams);

  // Parse search params safely
  const search = typeof params.search === "string" ? params.search : "";
  const role =
    typeof params.role === "string" ? (params.role as UserRole) : undefined;
  const page = typeof params.page === "string" ? Number(params.page) : 1;

  // Fetch data server-side
  const usersData = await getUsers({
    search,
    role,
    page,
    limit: 10,
  });

  // Filter out customers
  const filteredUsers = usersData.users.filter(
    (user) => user.role !== UserRole.CUSTOMER
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your team members and their permissions
        </p>
      </div>

      <UsersTable
        initialData={{
          users: filteredUsers,
          total: usersData.total,
          pages: usersData.pages,
        }}
        searchParams={{
          search,
          role,
          page: String(page),
        }}
      />
    </div>
  );
}
