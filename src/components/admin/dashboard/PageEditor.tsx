"use client";

import { updatePage } from "@/app/_actions/admin/pages";
import { PageDetails, PageContent } from "@/types/pages";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PageEditorProps {
  page: PageDetails;
}

export default function PageEditor({ page }: PageEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<PageContent>(page.content);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePage(page.id, {
        content,
      });
      router.refresh();
    } catch (error) {
      console.error("Error saving page:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Edit Home Page</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Hero Section */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <input
                type="text"
                value={content.hero.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                value={content.hero.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, description: e.target.value },
                  })
                }
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">CTA Text</label>
              <input
                type="text"
                value={content.hero.cta}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, cta: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Image URL
              </label>
              <input
                type="text"
                value={content.hero.image}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, image: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">
            Featured Products Section
          </h3>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Section Title
            </label>
            <input
              type="text"
              value={content.featuredProducts.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  featuredProducts: {
                    ...content.featuredProducts,
                    title: e.target.value,
                  },
                })
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Categories Section</h3>
          <div>
            <label className="mb-2 block text-sm font-medium">
              Section Title
            </label>
            <input
              type="text"
              value={content.categories.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  categories: {
                    ...content.categories,
                    title: e.target.value,
                  },
                })
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
            />
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="mb-4 text-base font-medium">Newsletter Section</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <input
                type="text"
                value={content.newsletter.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    newsletter: {
                      ...content.newsletter,
                      title: e.target.value,
                    },
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>
              <textarea
                value={content.newsletter.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    newsletter: {
                      ...content.newsletter,
                      description: e.target.value,
                    },
                  })
                }
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-100 dark:focus:ring-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
