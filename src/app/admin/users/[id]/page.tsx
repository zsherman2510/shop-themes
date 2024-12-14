import { getUser } from "../actions/get";
import UserForm from "../components/UserForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditUserPage({ params }: PageProps) {
  try {
    const user = await getUser(params.id);

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
