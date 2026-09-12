"use client";

import { useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_LABEL, PRIORITY_LABEL, plural } from "@/lib/format";
import {
  SORT_OPTIONS,
  WISH_CATEGORIES,
  WISH_PRIORITIES,
  type SortOption,
  type WishFilters,
} from "@/lib/validation/wish";

const SORT_LABEL: Record<SortOption, string> = {
  updated: "Recently modified",
  created: "Recently added",
  oldest: "Oldest first",
  priority: "Priority",
};

const ANY = "ANY";

export function FilterBar({ filters, shown }: { filters: WishFilters; shown: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);

  const [text, setText] = useState(filters.q ?? "");
  const [lastUrlQ, setLastUrlQ] = useState(filters.q ?? "");
  // Adopt the URL value when it changes elsewhere (pills, clear filters).
  if ((filters.q ?? "") !== lastUrlQ) {
    setLastUrlQ(filters.q ?? "");
    setText(filters.q ?? "");
  }

  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function apply(patch: Partial<Record<string, string | undefined>>) {
    const merged: Record<string, string | undefined> = {
      q: filters.q,
      status: filters.status,
      priority: filters.priority,
      category: filters.category,
      sort: filters.sort,
      ...patch,
    };
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (!value || value === ANY) continue;
      if (key === "status" && value === "PENDING") continue;
      if (key === "sort" && value === "updated") continue;
      params.set(key, value);
    }
    const qs = params.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  function onSearch(value: string) {
    setText(value);
    setLastUrlQ(value);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => apply({ q: value || undefined }), 300);
  }

  const activeCount = [filters.priority, filters.category].filter(Boolean).length +
    (filters.sort !== "updated" ? 1 : 0);

  return (
    <div className="flex items-center gap-2.5 rounded-[11px] border bg-chrome p-2.5 shadow-search lg:gap-3">
      <Input
        value={text}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by name"
        aria-label="Search by name"
        className="h-11 flex-1 border-0 bg-transparent px-1.5 lg:h-9"
      />

      <div className="hidden items-center gap-2.5 md:flex">
        <span aria-hidden className="h-5 w-px bg-subtle" />
        <FilterSelect
          label="Priority"
          value={filters.priority ?? ANY}
          onChange={(v) => apply({ priority: v })}
          options={WISH_PRIORITIES.map((v) => ({ value: v, label: PRIORITY_LABEL[v] }))}
        />
        <FilterSelect
          label="Category"
          value={filters.category ?? ANY}
          onChange={(v) => apply({ category: v })}
          options={WISH_CATEGORIES.map((v) => ({ value: v, label: CATEGORY_LABEL[v] }))}
        />
        <span aria-hidden className="h-5 w-px bg-subtle" />
        <FilterSelect
          label="Sort"
          value={filters.sort}
          onChange={(v) => apply({ sort: v })}
          options={SORT_OPTIONS.map((v) => ({ value: v, label: SORT_LABEL[v] }))}
          includeAny={false}
        />
      </div>

      <Button
        type="button"
        variant="quiet"
        size="sm"
        className="md:hidden"
        onClick={() => setSheetOpen(true)}
      >
        Filters
        {activeCount > 0 && <span className="font-mono text-brand-fg">{activeCount}</span>}
      </Button>

      <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogContent
          showCloseButton={false}
          className="top-auto bottom-0 max-h-[85dvh] max-w-none translate-y-0 overflow-y-auto rounded-b-none rounded-t-[20px]"
        >
          <div className="p-[18px]">
            <DialogHeader className="flex-row items-center justify-between">
              <DialogTitle>Filters</DialogTitle>
              <button
                type="button"
                onClick={() => apply({ priority: undefined, category: undefined, sort: "updated" })}
                className="rounded-[6px] text-[12.5px] font-semibold text-brand-fg"
              >
                Reset
              </button>
            </DialogHeader>

            <div className="mt-5 flex flex-col gap-5">
              <SheetGroup
                label="Priority"
                value={filters.priority ?? ANY}
                onChange={(v) => apply({ priority: v })}
                options={WISH_PRIORITIES.map((v) => ({ value: v, label: PRIORITY_LABEL[v] }))}
              />
              <SheetGroup
                label="Category"
                value={filters.category ?? ANY}
                onChange={(v) => apply({ category: v })}
                options={WISH_CATEGORIES.map((v) => ({ value: v, label: CATEGORY_LABEL[v] }))}
              />
              <SheetGroup
                label="Sort"
                value={filters.sort}
                onChange={(v) => apply({ sort: v })}
                options={SORT_OPTIONS.map((v) => ({ value: v, label: SORT_LABEL[v] }))}
                includeAny={false}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="primary" className="w-full" onClick={() => setSheetOpen(false)}>
              Show {shown} {plural(shown, "wish", "wishes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  includeAny = true,
}: {
  label: string;
  value: string;
  onChange: (value: string | undefined) => void;
  options: { value: string; label: string }[];
  includeAny?: boolean;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v === ANY ? undefined : v)}>
      <SelectTrigger size="sm" aria-label={label} className="border-btn-quiet-border bg-btn-quiet">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {includeAny && <SelectItem value={ANY}>{label}: any</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SheetGroup({
  label,
  value,
  onChange,
  options,
  includeAny = true,
}: {
  label: string;
  value: string;
  onChange: (value: string | undefined) => void;
  options: { value: string; label: string }[];
  includeAny?: boolean;
}) {
  const all = includeAny ? [{ value: ANY, label: "Any" }, ...options] : options;
  return (
    <fieldset>
      <Label asChild>
        <legend className="mb-2.5">{label}</legend>
      </Label>
      <div className="flex flex-wrap gap-2">
        {all.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value === ANY ? undefined : option.value)}
            aria-pressed={value === option.value}
            className={
              value === option.value
                ? "inline-flex min-h-11 items-center rounded-full bg-pill-active px-3.5 text-[12.5px] font-semibold text-pill-active-fg"
                : "inline-flex min-h-11 items-center rounded-full border border-border px-3.5 text-[12.5px] text-ink-secondary"
            }
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ClearFiltersButton() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Button variant="quiet" onClick={() => router.replace(pathname, { scroll: false })}>
      Clear filters
    </Button>
  );
}
