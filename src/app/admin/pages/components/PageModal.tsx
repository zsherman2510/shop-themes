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
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 transform space-y-4 rounded-lg bg-base-100 p-6 shadow-xl z-[51]">
          <Dialog.Title className="text-lg font-medium text-base-content">
            {page ? "Edit Page" : "Create Page"}
          </Dialog.Title>
          <PageForm defaultValues={page} isLoading={isLoading} />
          <Dialog.Close asChild>
            <button
              className="btn btn-ghost btn-sm btn-circle absolute right-4 top-4"
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
