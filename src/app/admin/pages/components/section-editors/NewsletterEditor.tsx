"use client";

import { PageSection } from "@/types/pages";

interface SectionEditorProps {
  section: PageSection;
  onChange: (updates: Partial<PageSection>) => void;
}

export default function NewsletterEditor({
  section,
  onChange,
}: SectionEditorProps) {
  if (section.type !== "newsletter") return null;

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          type="text"
          value={section.content.title}
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
          <span className="label-text">Description</span>
        </label>
        <textarea
          value={section.content.description}
          onChange={(e) =>
            onChange({
              content: { ...section.content, description: e.target.value },
            })
          }
          className="textarea textarea-bordered"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Button Text</span>
          </label>
          <input
            type="text"
            value={section.content.buttonText || ""}
            onChange={(e) =>
              onChange({
                content: { ...section.content, buttonText: e.target.value },
              })
            }
            className="input input-bordered"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Placeholder</span>
          </label>
          <input
            type="text"
            value={section.content.placeholder || ""}
            onChange={(e) =>
              onChange({
                content: { ...section.content, placeholder: e.target.value },
              })
            }
            className="input input-bordered"
          />
        </div>
      </div>
    </div>
  );
}
