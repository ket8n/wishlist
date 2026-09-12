"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { createWishAction } from "@/lib/actions/wishes";
import { CATEGORY_LABEL, PRIORITY_LABEL } from "@/lib/format";
import { cn } from "@/lib/utils";
import { WISH_CATEGORIES, WISH_PRIORITIES } from "@/lib/validation/wish";

type Category = (typeof WISH_CATEGORIES)[number];
type Priority = (typeof WISH_PRIORITIES)[number];

export function QuickCreateButton({
  variant = "secondary",
  className,
  children,
}: {
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} className={className} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-sm:top-auto max-sm:bottom-0 max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-[20px] sm:max-w-[580px]"
        >
          {open && <QuickCreateBody onDone={() => setOpen(false)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

function QuickCreateBody({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("OTHER");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [image, setImage] = useState("");
  const [note, setNote] = useState("");
  const [shown, setShown] = useState<Record<"price" | "image" | "note", boolean>>({
    price: false,
    image: false,
    note: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pending, startTransition] = useTransition();

  function reveal(key: "price" | "image" | "note") {
    setShown({ ...shown, [key]: true });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const result = await createWishAction({
        name,
        description,
        category,
        priority,
        estimatedPrice,
        images: image.trim() ? [image] : [],
        note,
        status: "PENDING",
      });

      if (!result.ok) {
        setError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }
      onDone();
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit}>
      <div className="p-[18px]">
        <DialogHeader>
          <DialogTitle className="eyebrow text-ink-muted">
            What have you been thinking about?
          </DialogTitle>
        </DialogHeader>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          required
          autoFocus
          aria-label="Name"
          aria-invalid={Boolean(fieldErrors.name)}
          className="mt-2.5 h-12 px-0 text-[18px] font-semibold text-ink lg:h-12 lg:text-[19px] border-0 bg-transparent"
          placeholder="A name is enough to start"
        />
        <FieldError errors={fieldErrors.name} />
        <p className="mt-1 text-[12px] text-ink-faint">Required, everything else can wait.</p>

        <div className="mt-5">
          <p className="eyebrow text-ink-muted">Why, in a line (optional)</p>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            aria-label="Description"
            className="mt-2"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="quick-category" className="mb-2">
              Category
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger id="quick-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WISH_CATEGORIES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {CATEGORY_LABEL[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <fieldset>
            <legend className="mb-2 text-[12.5px] leading-none font-medium text-ink-secondary">
              Priority
            </legend>
            <ToggleGroup
              type="single"
              spacing={0}
              value={priority}
              onValueChange={(v) => v && setPriority(v as Priority)}
              className="w-full rounded-[9px] border border-subtle bg-sunken p-[3px]"
            >
              {WISH_PRIORITIES.map((value) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="h-11 flex-1 rounded-[7px]! border border-transparent text-[12.5px] text-ink-muted hover:bg-transparent hover:text-ink data-[state=on]:border-border data-[state=on]:bg-card data-[state=on]:text-ink data-[state=on]:shadow-card lg:h-8"
                >
                  {PRIORITY_LABEL[value]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </fieldset>
        </div>

        <div
          className={cn(
            "mt-4 grid gap-2",
            shown.price || shown.image || shown.note ? "grid-cols-1" : "grid-cols-2 sm:flex",
          )}
        >
          {shown.price ? (
            <div>
              <Label htmlFor="quick-price" className="mb-2">
                Estimated price
              </Label>
              <Input
                id="quick-price"
                inputMode="decimal"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                aria-invalid={Boolean(fieldErrors.estimatedPrice)}
                className="font-mono"
              />
              <FieldError errors={fieldErrors.estimatedPrice} />
            </div>
          ) : (
            <Chip onClick={() => reveal("price")}>Estimated price</Chip>
          )}

          {shown.image ? (
            <div>
              <Label htmlFor="quick-image" className="mb-2">
                Image URL
              </Label>
              <Input
                id="quick-image"
                inputMode="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                aria-invalid={Boolean(fieldErrors["images.0"])}
                placeholder="https://"
              />
              <FieldError errors={fieldErrors["images.0"]} />
            </div>
          ) : (
            <Chip onClick={() => reveal("image")}>Image URL</Chip>
          )}

          {shown.note ? (
            <div className="rounded-[10px] border border-note-border bg-note p-3">
              <Label htmlFor="quick-note" className="text-note-label">
                Your note
              </Label>
              <Textarea
                id="quick-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={2000}
                className="voice mt-2 border-note-border bg-transparent text-[16px] text-note-text"
              />
              <FieldError errors={fieldErrors.note} />
            </div>
          ) : (
            <Chip onClick={() => reveal("note")}>Note</Chip>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-3 text-[12.5px] text-rejected">
            {error}
          </p>
        )}

        <p className="voice mt-5 text-[14px] text-ink-muted">
          Six seconds now, the rest whenever you like.
        </p>
      </div>

      <DialogFooter className="sm:justify-between">
        <Link
          href="/wish/new"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-[6px] text-[12.5px] font-medium text-ink-muted hover:text-ink sm:min-h-0"
        >
          Open full create page
          <ArrowUpRight className="size-3.5" />
        </Link>
        <div className="flex items-center gap-2.5">
          <Button type="button" variant="secondary" onClick={onDone} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? "Adding..." : "Add wish"}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

function Chip({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <Button type="button" variant="chip" size="sm" onClick={onClick}>
      <Plus />
      {children}
    </Button>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-[12px] leading-[1.4] text-rejected">{errors[0]}</p>;
}
