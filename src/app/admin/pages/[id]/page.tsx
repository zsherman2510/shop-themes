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
    const page = await getPage(params.id);

    // Check if the page was found
    if (!page) {
      notFound(); // Redirect to a 404 page if the page is not found
    }

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
    console.error("Error fetching page:", error);
    notFound(); // Redirect to a 404 page on error
  }
}
