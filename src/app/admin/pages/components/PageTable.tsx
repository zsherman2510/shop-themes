"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GetPagesResponse } from "@/types/pages";
import { PageStatus } from "@prisma/client";

interface PageTableProps {
  initialData: GetPagesResponse;
  searchParams: {
    search?: string;
    status?: string;
    page: string;
  };
}

export default function PageTable({
  initialData,
  searchParams,
}: PageTableProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(searchParams.search || "");
  const [statusValue, setStatusValue] = useState(searchParams.status || "");
  const currentPage = Number(searchParams.page) || 1;

  const createQueryString = (params: Record<string, string | undefined>) => {
    const newSearchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        newSearchParams.set(key, value);
      }
    });
    return newSearchParams.toString();
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const queryString = createQueryString({
      search: value || undefined,
      status: statusValue || undefined,
      page: "1",
    });
    router.push(`/admin/pages?${queryString}`);
  };

  const handleStatusChange = (value: string) => {
    setStatusValue(value);
    const queryString = createQueryString({
      search: searchValue || undefined,
      status: value || undefined,
      page: "1",
    });
    router.push(`/admin/pages?${queryString}`);
  };

  const handlePageChange = (page: number) => {
    const queryString = createQueryString({
      search: searchValue || undefined,
      status: statusValue || undefined,
      page: String(page),
    });
    router.push(`/admin/pages?${queryString}`);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search pages..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          />
          <select
            value={statusValue}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                Last Updated
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {initialData.pages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center">
                  No pages found
                </td>
              </tr>
            ) : (
              initialData.pages.map((page) => (
                <tr
                  key={page.id}
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{page.title}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{page.slug}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        page.status === PageStatus.PUBLISHED
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => router.push(`/admin/pages/${page.id}`)}
                      className="invisible rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 group-hover:visible dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {initialData.pages.length} of {initialData.total} pages
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === initialData.pageCount}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
