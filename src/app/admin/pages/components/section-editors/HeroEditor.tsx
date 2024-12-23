"use client";

import { PageSection } from "@/types/pages";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

interface HeroEditorProps {
  section: PageSection;
  onChange: (section: PageSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function HeroEditor({
  section,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: HeroEditorProps) {
  if (section.type !== "hero") return null;

  const updateContent = (updates: Partial<typeof section.content>) => {
    onChange({
      ...section,
      content: { ...section.content, ...updates },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Hero Section</h4>
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
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={section.content.title}
            onChange={(e) => updateContent({ title: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Enter hero title"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={section.content.description}
            onChange={(e) => updateContent({ description: e.target.value })}
            className="textarea textarea-bordered w-full"
            placeholder="Enter hero description"
            rows={3}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">CTA Text</span>
          </label>
          <input
            type="text"
            value={section.content.ctaText || ""}
            onChange={(e) => updateContent({ ctaText: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Enter call-to-action text"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">CTA Link</span>
          </label>
          <input
            type="text"
            value={section.content.ctaLink || ""}
            onChange={(e) => updateContent({ ctaLink: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Enter call-to-action link"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Background Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  updateContent({ image: reader.result as string });
                };
                reader.readAsDataURL(file);
              }
            }}
            className="file-input file-input-bordered w-full"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Overlay Color</span>
          </label>
          <input
            type="color"
            value={section.content.overlayColor || "#000000"}
            onChange={(e) => updateContent({ overlayColor: e.target.value })}
            className="input input-bordered w-full h-12"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Text Color</span>
          </label>
          <input
            type="color"
            value={section.content.textColor || "#ffffff"}
            onChange={(e) => updateContent({ textColor: e.target.value })}
            className="input input-bordered w-full h-12"
          />
        </div>
      </div>
    </div>
  );
}
