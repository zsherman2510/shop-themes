"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { PageDetails } from "@/types/pages";
import PageForm from "./PageForm";

interface PageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page?: PageDetails;
  isLoading?: boolean;
}

export default function PageModal({
  isOpen,
  onClose,
  page,
  isLoading,
}: PageModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-3xl max-h-[90vh] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-base-100 shadow-xl z-[51] overflow-hidden">
          <div className="flex items-center justify-between border-b border-base-200 p-4">
            <Dialog.Title className="text-lg font-medium">
              {page ? "Edit Page" : "Create New Page"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <PageForm
              key={isOpen ? "open" : "closed"} // Force form reset when modal opens/closes
              defaultValues={page}
              isLoading={isLoading}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
