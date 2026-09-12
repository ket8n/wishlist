"use client";

import Link from "next/link";
import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WishCardMenu({ wishId, name }: { wishId: string; name: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`More actions for ${name}`}
          className="ml-auto text-ink-muted"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/wish/${wishId}`}>Open full page</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/wish/${wishId}/edit`}>Edit wish</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
