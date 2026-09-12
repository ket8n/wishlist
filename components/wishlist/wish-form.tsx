"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { createWishAction, saveWishAction } from "@/lib/actions/wishes";
import { CATEGORY_LABEL, PRIORITY_LABEL, STATUS_LABEL } from "@/lib/format";
import type { WishView } from "@/lib/services/wishes";
import {
  WISH_CATEGORIES,
  WISH_PRIORITIES,
  WISH_STATUSES,
  type WishStatusValue,
} from "@/lib/validation/wish";

type Category = (typeof WISH_CATEGORIES)[number];
type Priority = (typeof WISH_PRIORITIES)[number];
type LinkRow = { label: string; url: string };
type FieldErrors = Record<string, string[]>;

export type WishDraft = {
  name?: string;
  description?: string;
  category?: Category;
  priority?: Priority;
  estimatedPrice?: string;
  images?: string[];
  note?: string;
};

export function WishForm({ wish, draft }: { wish?: WishView; draft?: WishDraft }) {
  const router = useRouter();
  const isEdit = Boolean(wish);

  const [name, setName] = useState(wish?.name ?? draft?.name ?? "");
  const [description, setDescription] = useState(wish?.description ?? draft?.description ?? "");
  const [category, setCategory] = useState<Category>(wish?.category ?? draft?.category ?? "OTHER");
  const [priority, setPriority] = useState<Priority>(wish?.priority ?? draft?.priority ?? "MEDIUM");
  const [status, setStatus] = useState<WishStatusValue>(wish?.status ?? "PENDING");
  const [estimatedPrice, setEstimatedPrice] = useState(
    wish?.estimatedPrice ?? draft?.estimatedPrice ?? "",
  );
  const [currency, setCurrency] = useState(wish?.currency ?? "INR");
  const [images, setImages] = useState<string[]>(wish?.images ?? draft?.images ?? []);
  const [links, setLinks] = useState<LinkRow[]>(
    wish?.links.map(({ label, url }) => ({ label, url })) ?? [],
  );
  const [note, setNote] = useState(wish?.note ?? draft?.note ?? "");

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const fields = {
      name,
      description,
      category,
      priority,
      estimatedPrice,
      currency,
      images: images.filter((url) => url.trim()),
      links: links.filter((link) => link.label.trim() || link.url.trim()),
      note,
    };

    startTransition(async () => {
      if (wish) {
        const result = await saveWishAction({ ...fields, id: wish.id, status });
        if (!result.ok) return fail(result);
        done(`/wish/${wish.id}`);
      } else {
        const result = await createWishAction({ ...fields, status });
        if (!result.ok) return fail(result);
        done(`/wish/${result.data.id}`);
      }
    });

    function fail(result: { error: string; fieldErrors?: FieldErrors }) {
      setError(result.error);
      setFieldErrors(result.fieldErrors ?? {});
    }

    function done(href: string) {
      setError(null);
      setFieldErrors({});
      router.push(href);
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="pb-24">
      <div className="flex flex-col gap-6">
        <Section title="Basics">
          <Field label="Name" htmlFor="name" errors={fieldErrors.name}>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              required
              aria-invalid={Boolean(fieldErrors.name)}
              placeholder="What have you been thinking about?"
            />
          </Field>
          <Field label="Description" htmlFor="description" errors={fieldErrors.description}>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              placeholder="Why, in a line or two (optional)"
            />
          </Field>
        </Section>

        <Section title="Classification">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" htmlFor="category">
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger id="category" className="w-full">
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
            </Field>
            <Field label="Status" htmlFor="status">
              <Select value={status} onValueChange={(v) => setStatus(v as WishStatusValue)}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WISH_STATUSES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {STATUS_LABEL[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
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
              className="w-full max-w-[320px] rounded-[9px] border border-subtle bg-sunken p-[3px]"
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
        </Section>

        <Section title="Money">
          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <Field label="Estimated price" htmlFor="price" errors={fieldErrors.estimatedPrice}>
              <Input
                id="price"
                inputMode="decimal"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                aria-invalid={Boolean(fieldErrors.estimatedPrice)}
                placeholder="Optional"
                className="font-mono"
              />
            </Field>
            <Field label="Currency" htmlFor="currency" errors={fieldErrors.currency}>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                maxLength={3}
                aria-invalid={Boolean(fieldErrors.currency)}
                className="font-mono uppercase"
              />
            </Field>
          </div>
        </Section>

        <Section title="Links">
          {links.map((link, index) => (
            <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <div className="sm:w-[180px]">
                <Input
                  value={link.label}
                  onChange={(e) => setLinks(replaceAt(links, index, { ...link, label: e.target.value }))}
                  placeholder="Label"
                  aria-label={`Link ${index + 1} label`}
                  aria-invalid={Boolean(fieldErrors[`links.${index}.label`])}
                />
                <FieldError errors={fieldErrors[`links.${index}.label`]} />
              </div>
              <div className="flex-1">
                <Input
                  value={link.url}
                  onChange={(e) => setLinks(replaceAt(links, index, { ...link, url: e.target.value }))}
                  placeholder="https://"
                  inputMode="url"
                  aria-label={`Link ${index + 1} URL`}
                  aria-invalid={Boolean(fieldErrors[`links.${index}.url`])}
                />
                <FieldError errors={fieldErrors[`links.${index}.url`]} />
              </div>
              <RemoveButton
                label={`Remove link ${index + 1}`}
                onClick={() => setLinks(links.filter((_, i) => i !== index))}
              />
            </div>
          ))}
          <AddButton
            label="Add link"
            disabled={links.length >= 10}
            onClick={() => setLinks([...links, { label: "", url: "" }])}
          />
        </Section>

        <Section title="Images">
          {images.map((url, index) => (
            <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-start">
              <ImageThumb url={url} />
              <div className="flex-1">
                <Input
                  value={url}
                  onChange={(e) => setImages(replaceAt(images, index, e.target.value))}
                  placeholder="https://"
                  inputMode="url"
                  aria-label={`Image ${index + 1} URL`}
                  aria-invalid={Boolean(fieldErrors[`images.${index}`])}
                />
                <FieldError errors={fieldErrors[`images.${index}`]} />
              </div>
              <RemoveButton
                label={`Remove image ${index + 1}`}
                onClick={() => setImages(images.filter((_, i) => i !== index))}
              />
            </div>
          ))}
          <AddButton
            label="Add image URL"
            disabled={images.length >= 10}
            onClick={() => setImages([...images, ""])}
          />
        </Section>

        <Section title="Your note">
          <div className="rounded-[10px] border border-note-border bg-note p-3.5">
            <Label htmlFor="note" className="text-note-label">
              Why? you&apos;ll want to read this back later.
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={2000}
              className="voice mt-2.5 border-note-border bg-transparent text-[16px] text-note-text"
            />
            <FieldError errors={fieldErrors.note} />
          </div>
        </Section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-bar px-5 py-3 lg:sticky lg:mt-8 lg:-mx-10 lg:px-10 lg:pb-4">
        <div className="flex items-center gap-3">
          {error && (
            <p role="alert" className="min-w-0 flex-1 truncate text-[12.5px] text-rejected">
              {error}
            </p>
          )}
          <div className="ml-auto flex items-center gap-2.5">
            <Button asChild variant="secondary">
              <Link href={wish ? `/wish/${wish.id}` : "/dashboard"}>Cancel</Link>
            </Button>
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save wish" : "Add wish"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function replaceAt<T>(list: T[], index: number, value: T) {
  return list.map((item, i) => (i === index ? value : item));
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-subtle pt-6 first:border-t-0 first:pt-0">
      <h2 className="eyebrow text-ink-muted">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  errors,
  children,
}: {
  label: string;
  htmlFor: string;
  errors?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <FieldError errors={errors} />
    </div>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-[12px] leading-[1.4] text-rejected">{errors[0]}</p>;
}

function AddButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button type="button" variant="chip" size="sm" onClick={onClick} disabled={disabled} className="self-start">
      <Plus />
      {label}
    </Button>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={onClick}
      className="shrink-0 text-ink-muted"
    >
      <X />
    </Button>
  );
}

function ImageThumb({ url }: { url: string }) {
  const [failed, setFailed] = useState(false);
  const show = url.trim() && !failed;
  return (
    <div className="size-11 shrink-0 overflow-hidden rounded-[8px] border bg-media">
      {show && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary user URLs
        <img
          src={url}
          alt=""
          key={url}
          onError={() => setFailed(true)}
          onLoad={() => setFailed(false)}
          className="size-full object-cover"
        />
      )}
    </div>
  );
}
