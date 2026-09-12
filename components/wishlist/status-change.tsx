"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { changeWishStatusAction } from "@/lib/actions/wishes";
import { STATUS_LABEL } from "@/lib/format";
import type { WishView } from "@/lib/services/wishes";
import { cn } from "@/lib/utils";
import { WISH_STATUSES, type WishStatusValue } from "@/lib/validation/wish";
import { isTerminal, primaryActionFor, statusDialogTitle } from "@/lib/wish-status";

const SWATCH: Record<WishStatusValue, string> = {
  PENDING: "bg-pending",
  BOUGHT: "bg-bought",
  COMPLETED: "bg-completed",
  REJECTED: "bg-rejected",
};

export function StatusDialog({
  wish,
  open,
  onOpenChange,
  initialTarget,
}: {
  wish: WishView;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTarget?: WishStatusValue;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        {/* Mounted per opening, so state starts from props without an effect. */}
        {open && (
          <StatusDialogBody
            key={initialTarget ?? "picker"}
            wish={wish}
            onOpenChange={onOpenChange}
            initialTarget={initialTarget}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatusDialogBody({
  wish,
  onOpenChange,
  initialTarget,
}: {
  wish: WishView;
  onOpenChange: (open: boolean) => void;
  initialTarget?: WishStatusValue;
}) {
  const router = useRouter();
  const [target, setTarget] = useState<WishStatusValue | null>(initialTarget ?? null);
  const [note, setNote] = useState(wish.note ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function apply(status: WishStatusValue, withNote: string | null) {
    startTransition(async () => {
      const result = await changeWishStatusAction({ id: wish.id, status, note: withNote });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onOpenChange(false);
      router.refresh();
    });
  }

  function pick(status: WishStatusValue) {
    if (status === wish.status) return onOpenChange(false);
    if (isTerminal(status)) return setTarget(status);
    apply(status, null);
  }

  return (
    <>
      <div className="p-[18px]">
        <DialogHeader>
          <DialogTitle>{target ? statusDialogTitle(target) : "Change status"}</DialogTitle>
          <DialogDescription>
            {target
              ? "Why? You'll want to read this back later. Optional."
              : "Where does this wish stand now?"}
          </DialogDescription>
        </DialogHeader>

        {target ? (
          <div className="mt-4 rounded-[10px] border border-note-border bg-note p-3.5">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={2000}
              autoFocus
              aria-label="Note"
              className="voice border-note-border bg-transparent text-[16px] text-note-text"
            />
          </div>
        ) : (
          <ul className="mt-4 flex flex-col gap-1">
            {WISH_STATUSES.map((status) => (
              <li key={status}>
                <button
                  type="button"
                  onClick={() => pick(status)}
                  disabled={pending}
                  className="flex h-11 w-full items-center gap-2.5 rounded-[7px] px-2.5 text-[13px] text-ink transition-colors duration-150 hover:bg-btn-quiet"
                >
                  <span aria-hidden className={cn("size-1.5 rounded-[1px]", SWATCH[status])} />
                  {STATUS_LABEL[status]}
                  {status === wish.status && (
                    <>
                      <CheckIcon className="ml-auto size-4 text-ink-muted" />
                      <span className="sr-only">(current)</span>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p role="alert" className="mt-3 text-[12.5px] text-rejected">
            {error}
          </p>
        )}
      </div>

      <DialogFooter>
        <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={pending}>
          Cancel
        </Button>
        {target && (
          <Button variant="primary" disabled={pending} onClick={() => apply(target, note)}>
            {pending ? "Saving..." : statusDialogTitle(target)}
          </Button>
        )}
      </DialogFooter>
    </>
  );
}

export function StatusActions({ wish }: { wish: WishView }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<WishStatusValue | undefined>();
  const primary = primaryActionFor(wish.category, wish.status);

  function openWith(next?: WishStatusValue) {
    setTarget(next);
    setOpen(true);
  }

  return (
    <>
      <Button variant="secondary" onClick={() => openWith(undefined)}>
        Change status
      </Button>
      <Button variant="primary" onClick={() => openWith(primary.status)}>
        {primary.label}
      </Button>
      <StatusDialog wish={wish} open={open} onOpenChange={setOpen} initialTarget={target} />
    </>
  );
}
