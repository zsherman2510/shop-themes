"use client";

import { PageSection } from "@/types/pages";

interface SectionEditorProps {
  section: PageSection;
  onChange: (updates: Partial<PageSection>) => void;
}

export default function TextBlockEditor({
  section,
  onChange,
}: SectionEditorProps) {
  if (section.type !== "textBlock") return null;

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title (Optional)</span>
        </label>
        <input
          type="text"
          value={section.content.title || ""}
          onChange={(e) =>
            onChange({
              content: { ...section.content, title: e.target.value },
            })
          }
          className="input input-bordered"
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Content</span>
        </label>
        <textarea
          value={section.content.text}
          onChange={(e) =>
            onChange({
              content: { ...section.content, text: e.target.value },
            })
          }
          className="textarea textarea-bordered min-h-[200px]"
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Alignment</span>
        </label>
        <select
          value={section.content.alignment || "left"}
          onChange={(e) =>
            onChange({
              content: {
                ...section.content,
                alignment: e.target.value as "left" | "center" | "right",
              },
            })
          }
          className="select select-bordered"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );
}
