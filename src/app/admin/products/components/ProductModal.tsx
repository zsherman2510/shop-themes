"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ProductResponse } from "../actions/get";
import ProductForm from "./ProductForm";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  product?: ProductResponse;
  isLoading?: boolean;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  isLoading,
}: ProductModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/25 dark:bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform space-y-4 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
            {product ? "Edit Product" : "Create Product"}
          </Dialog.Title>
          <ProductForm
            onSubmit={onSubmit}
            defaultValues={product}
            isLoading={isLoading}
          />
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
