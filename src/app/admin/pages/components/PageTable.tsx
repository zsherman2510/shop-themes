// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { GetPagesResponse } from "@/types/pages";
// import { PageStatus } from "@prisma/client";
// import PageModal from "./PageModal";
// import { Plus } from "lucide-react";

// interface PageTableProps {
//   initialData: GetPagesResponse;
//   searchParams: {
//     search?: string;
//     status?: string;
//     page: string;
//   };
// }

// export default function PageTable({
//   initialData,
//   searchParams,
// }: PageTableProps) {
//   const router = useRouter();
//   const [searchValue, setSearchValue] = useState(searchParams.search || "");
//   const [statusValue, setStatusValue] = useState(searchParams.status || "");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const currentPage = Number(searchParams.page) || 1;

//   const createQueryString = (params: Record<string, string | undefined>) => {
//     const newSearchParams = new URLSearchParams();
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined) {
//         newSearchParams.set(key, value);
//       }
//     });
//     return newSearchParams.toString();
//   };

//   const handleSearch = (value: string) => {
//     setSearchValue(value);
//     const queryString = createQueryString({
//       search: value || undefined,
//       status: statusValue || undefined,
//       page: "1",
//     });
//     router.push(`/admin/pages?${queryString}`);
//   };

//   const handleStatusChange = (value: string) => {
//     setStatusValue(value);
//     const queryString = createQueryString({
//       search: searchValue || undefined,
//       status: value || undefined,
//       page: "1",
//     });
//     router.push(`/admin/pages?${queryString}`);
//   };

//   const handlePageChange = (page: number) => {
//     const queryString = createQueryString({
//       search: searchValue || undefined,
//       status: statusValue || undefined,
//       page: String(page),
//     });
//     router.push(`/admin/pages?${queryString}`);
//   };

//   return (
//     <>
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => {
//             setIsModalOpen(true);
//           }}
//           className="btn btn-primary btn-sm gap-2"
//         >
//           <Plus className="h-4 w-4" />
//           Add Page
//         </button>
//       </div>
//       <div className="card bg-base-100">
//         <div className="p-4">
//           <div className="flex items-center justify-between gap-4">
//             <input
//               type="text"
//               placeholder="Search pages..."
//               value={searchValue}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="input input-bordered flex-1"
//             />
//             <select
//               value={statusValue}
//               onChange={(e) => handleStatusChange(e.target.value)}
//               className="select select-bordered"
//             >
//               <option value="">All Status</option>
//               <option value="published">Published</option>
//               <option value="draft">Draft</option>
//             </select>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th className="text-base-content/70">Title</th>
//                 <th className="text-base-content/70">Status</th>
//                 <th className="text-base-content/70">Last Updated</th>
//                 <th className="text-right text-base-content/70">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {initialData.pages.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="text-center text-base-content/70">
//                     No pages found
//                   </td>
//                 </tr>
//               ) : (
//                 initialData.pages.map((page) => (
//                   <tr key={page.id} className="hover">
//                     <td className="font-medium">{page.title}</td>
//                     <td>
//                       <div
//                         className={`badge ${
//                           page.status === PageStatus.PUBLISHED
//                             ? "badge-success"
//                             : "badge-warning"
//                         }`}
//                       >
//                         {page.status}
//                       </div>
//                     </td>
//                     <td className="text-base-content/70">
//                       {new Date(page.updatedAt).toLocaleDateString()}
//                     </td>
//                     <td className="text-right">
//                       <button
//                         onClick={() => router.push(`/admin/pages/${page.id}`)}
//                         className="btn btn-ghost btn-sm"
//                       >
//                         Edit
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex items-center justify-between border-t border-base-200 px-4 py-3">
//           <div className="text-sm text-base-content/70">
//             Showing {initialData.pages.length} of {initialData.total} pages
//           </div>
//           <div className="join">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="btn btn-ghost btn-sm join-item"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === initialData.pageCount}
//               className="btn btn-ghost btn-sm join-item"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//         <PageModal
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//             setError(null);
//           }}
//           isLoading={isLoading}
//         />
//       </div>
//     </>
//   );
// }
