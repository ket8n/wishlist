"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteWishAction } from "@/lib/actions/wishes";

export function DeleteWishDialog({
  wishId,
  name,
  open,
  onOpenChange,
  withTrigger = true,
}: {
  wishId: string;
  name: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  withTrigger?: boolean;
}) {
  const router = useRouter();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isOpen = open ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  function remove() {
    startTransition(async () => {
      const result = await deleteWishAction(wishId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {withTrigger && (
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-rejected">
            Delete
          </Button>
        </DialogTrigger>
      )}
      <DialogContent showCloseButton={false}>
        <div className="p-[18px]">
          <DialogHeader>
            <DialogTitle>Delete this wish?</DialogTitle>
            <DialogDescription>
              &ldquo;{name}&rdquo; and its note will be permanently removed. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <p role="alert" className="mt-3 text-[12.5px] text-rejected">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={remove} disabled={pending}>
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
