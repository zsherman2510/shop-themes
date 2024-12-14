import { getPage } from "../actions/get";
import PageForm from "../components/PageForm";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditPagePage({ params }: PageProps) {
  try {
    const searchParams = await Promise.resolve(params);
    const page = await getPage(searchParams.id);

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{page.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Edit page content and settings
          </p>
        </div>

        <PageForm defaultValues={page} />
      </div>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
