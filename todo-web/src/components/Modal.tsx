import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { taskSchema } from "@/schemas/taskSchema";
import type { ZodIssue } from "zod";

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  titleModal: string
}

function Modal({ open, onOpenChange, titleModal }: ModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<{ title?: string; description?: string }>({});

  const handleCreate = () => {
    const result = taskSchema.safeParse({ title, description });

    if (!result.success) {
      const fieldErrors: { title?: string; description?: string } = {};

      result.error.issues.forEach((issue: ZodIssue) => {
        const path = issue.path[0];
        if (path === "title") fieldErrors.title = issue.message;
        if (path === "description") fieldErrors.description = issue.message;
      });

      setError(fieldErrors);
      return;
    }

    setError({});
    // logic of creating task here
  };

  // Clean errors when modal is closed
  useEffect(() => {
    if (!open) {
      setError({});
      setTitle("");
      setDescription("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#121212] text-white rounded-lg w-[400px] p-6">
        <DialogHeader>
          <DialogTitle>{titleModal}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="title" className="text-sm text-gray-300">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter the task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#2C2C2C] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
          {error.title && <p className="text-red-500 text-sm">{error.title}</p>}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="description" className="text-sm text-gray-300">Description</label>
          <textarea
            id="description"
            placeholder="Enter the task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#2C2C2C] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
          />
          {error.description && <p className="text-red-500 text-sm">{error.description}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="secondary" size="sm">Cancel</Button>
          </DialogClose>
          <Button size="sm" onClick={handleCreate}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
