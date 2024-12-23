"use client";

import { useState } from "react";

interface CustomFileUploadProps {
  onFileChange: (file: File | null) => void;
  currentImage?: string; // Optional prop for displaying the current image
}

export default function CustomFileUpload({
  onFileChange,
  currentImage,
}: CustomFileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onFileChange(file);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onFileChange(null);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center ${
        dragging ? "border-blue-500" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-auto rounded-lg mb-2"
        />
      ) : (
        <p className="text-gray-500">
          Drag & drop an image here, or click to select
        </p>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="btn btn-primary mt-2 cursor-pointer"
      >
        Upload Image
      </label>
    </div>
  );
}
