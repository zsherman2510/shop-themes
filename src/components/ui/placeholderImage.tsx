import { ImageIcon } from "lucide-react";

interface PlaceholderImageProps {
  className?: string;
}

export default function PlaceholderImage({ className }: PlaceholderImageProps) {
  return (
    <div
      className={`flex items-center justify-center bg-base-200 ${className}`}
    >
      <ImageIcon className="h-8 w-8 text-base-content/30" />
    </div>
  );
}
