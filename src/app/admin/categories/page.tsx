import { getCategoriesForAdmin } from "./actions/categories";
import CategoriesTable from "./components/CategoriesTable";

export default async function CategoriesPage() {
  const data = await getCategoriesForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Manage product categories
        </p>
      </div>

      <CategoriesTable initialData={data} />
    </div>
  );
}
