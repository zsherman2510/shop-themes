import { getUser } from "../actions/get";
import UserForm from "../components/UserForm";
import { notFound } from "next/navigation";

type tParams = Promise<{ id: string }>;

interface PageProps {
  params: tParams;
}

export default async function EditUserPage({ params }: PageProps) {
  try {
    const { id } = await params;
    const user = await getUser(id);

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Edit user details and permissions
          </p>
        </div>

        <UserForm defaultValues={user} />
      </div>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
