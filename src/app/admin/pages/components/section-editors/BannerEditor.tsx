"use client";

import { PageSection } from "@/types/pages";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

interface BannerEditorProps {
  section: PageSection;
  onChange: (section: PageSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function BannerEditor({
  section,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: BannerEditorProps) {
  if (section.type !== "banner") return null;

  const updateContent = (updates: Partial<typeof section.content>) => {
    onChange({
      ...section,
      content: { ...section.content, ...updates },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Banner Section</h4>
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
            value={section.content.title || ""}
            onChange={(e) => updateContent({ title: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Enter banner title"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Subtitle</span>
          </label>
          <input
            type="text"
            value={section.content.subtitle || ""}
            onChange={(e) => updateContent({ subtitle: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Enter banner subtitle"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Link</span>
          </label>
          <input
            type="text"
            value={section.content.link || ""}
            onChange={(e) => updateContent({ link: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Enter banner link"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Banner Image</span>
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
