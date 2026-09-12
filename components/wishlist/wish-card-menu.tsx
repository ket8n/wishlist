"use client";

import { useState } from "react";
import Link from "next/link";
import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteWishDialog } from "@/components/wishlist/delete-wish-dialog";
import { StatusDialog } from "@/components/wishlist/status-change";
import type { WishView } from "@/lib/services/wishes";

export function WishCardMenu({ wish }: { wish: WishView }) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`More actions for ${wish.name}`}
            className="ml-auto text-ink-muted"
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/wish/${wish.id}`}>Open full page</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/wish/${wish.id}/edit`}>Edit wish</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setStatusOpen(true)}>Change status</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            Delete wish
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <StatusDialog wish={wish} open={statusOpen} onOpenChange={setStatusOpen} />
      <DeleteWishDialog
        wishId={wish.id}
        name={wish.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        withTrigger={false}
      />
    </>
  );
}
