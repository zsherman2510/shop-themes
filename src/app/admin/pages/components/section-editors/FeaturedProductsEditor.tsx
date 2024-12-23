"use client";

import { PageSection } from "@/types/pages";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

interface FeaturedProductsEditorProps {
  section: PageSection;
  onChange: (section: PageSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function FeaturedProductsEditor({
  section,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: FeaturedProductsEditorProps) {
  if (section.type !== "featuredProducts") return null;

  const updateContent = (updates: Partial<typeof section.content>) => {
    onChange({
      ...section,
      content: { ...section.content, ...updates },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Featured Products Section</h4>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="btn btn-ghost btn-sm btn-square"
            title="Move Up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="btn btn-ghost btn-sm btn-square"
            title="Move Down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="btn btn-ghost btn-sm btn-square text-error"
            title="Delete Section"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Section Title</span>
          </label>
          <input
            type="text"
            value={section.content.title || ""}
            onChange={(e) => updateContent({ title: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Enter section title"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Display Count</span>
          </label>
          <input
            type="number"
            value={section.content.displayCount || 4}
            onChange={(e) =>
              updateContent({ displayCount: parseInt(e.target.value) })
            }
            className="input input-bordered w-full"
            min={1}
            max={12}
          />
        </div>

        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Featured Products</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {section.content.productIds?.map((productId) => (
              <div key={productId} className="badge badge-primary gap-2">
                {productId}
                <button
                  type="button"
                  onClick={() =>
                    updateContent({
                      productIds: section.content.productIds.filter(
                        (id) => id !== productId
                      ),
                    })
                  }
                  className="btn btn-ghost btn-xs btn-square"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              // TODO: Implement product selector modal
              console.log("Open product selector");
            }}
            className="btn btn-outline btn-sm mt-2"
          >
            Select Products
          </button>
        </div>
      </div>
    </div>
  );
}
