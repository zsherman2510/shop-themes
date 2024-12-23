"use client";

interface TextBlockProps {
  title: string;
  text: string;
  alignment?: "left" | "center" | "right";
  backgroundColor?: string;
  textColor?: string;
}

export default function TextBlock({
  title,
  text,
  alignment = "left",
  backgroundColor = "transparent",
  textColor = "inherit",
}: TextBlockProps) {
  return (
    <section className="py-16 px-4" style={{ backgroundColor }}>
      <div className="container mx-auto max-w-4xl">
        <div className={`text-${alignment}`} style={{ color: textColor }}>
          <h2 className="text-3xl font-bold mb-6">{title}</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </div>
    </section>
  );
}
