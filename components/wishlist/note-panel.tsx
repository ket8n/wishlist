import Link from "next/link";

import { formatDate } from "@/lib/format";

export function NotePanel({
  note,
  updatedAt,
  editHref,
}: {
  note: string;
  updatedAt: Date | null;
  editHref?: string;
}) {
  return (
    <section className="rounded-[10px] border border-note-border bg-note p-4">
      <div className="flex items-center gap-2">
        <h2 className="eyebrow text-note-label">Your note</h2>
        {updatedAt && (
          <>
            <span aria-hidden className="size-1 rounded-full bg-note-dot" />
            <span className="text-[11.5px] text-note-label">{formatDate(updatedAt)}</span>
          </>
        )}
        {editHref && (
          <Link
            href={editHref}
            className="ml-auto rounded-[4px] text-[12px] font-semibold text-note-label underline underline-offset-2 hover:text-note-text"
          >
            Edit
          </Link>
        )}
      </div>
      <p className="voice mt-2.5 text-[18px] leading-[1.5] text-note-text lg:text-[19px]">{note}</p>
    </section>
  );
}
