"use client"

import {ColumnDef} from "@tanstack/table-core";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MoreHorizontal} from "lucide-react";

export type Tag = {
    id: string
    name: string
}

export const columns: ColumnDef<Tag>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        id: "actions",
        header: "Actions",
        cell: () => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {/*TODO: Implement*/}
                            <DropdownMenuItem>Edit Tag</DropdownMenuItem>
                            <DropdownMenuItem>Delete Tag</DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]