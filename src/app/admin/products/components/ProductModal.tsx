"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ProductResponse } from "../actions/get";
import ProductForm from "./ProductForm";
import { useState } from "react";
import { Category } from "@/app/_actions/store/categories";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  product?: ProductResponse;
  isLoading?: boolean;
  categories: Category[];
}

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  isLoading,
  categories,
}: ProductModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleSubmit = async (data: FormData) => {
    setError(null);
    try {
      await onSubmit(data);
    } catch (error: any) {
      console.log("Modal error:", error);
      setError(
        typeof error === "string"
          ? error
          : "Failed to create product or file size exceeds 50MB limit"
      );
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 text-base-content/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-3xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-base-100 shadow-xl z-[51] overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-medium text-base-content">
                {product ? "Edit Product" : "Create Product"}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="btn btn-ghost btn-sm btn-circle text-base-content/70"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>
            </div>

            {error && (
              <div className="alert alert-error">
                <X className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <ProductForm
              key={isOpen ? 1 : 0} // Force form reset when modal opens/closes
              onSubmit={handleSubmit}
              defaultValues={product}
              isLoading={isLoading}
              categories={categories}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
