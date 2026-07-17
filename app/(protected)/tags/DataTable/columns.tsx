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
import {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";

export type Tag = {
    id: string
    name: string
}

interface ActionsMenuProps {
    tag: Tag;
    onRefresh: () => void;
}

function ActionsMenu({ tag, onRefresh }: ActionsMenuProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editedName, setEditedName] = useState(tag.name);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEdit = async () => {
        if (!editedName.trim()) {
            toast.warning('Please enter a tag name');
            return;
        }

        setIsEditing(true);
        try {
            const response = await fetch('/api/admin/tags', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: Number(tag.id),
                    name: editedName,
                }),
            });

            if (response.ok) {
                toast.success('Tag updated successfully!');
                setEditDialogOpen(false);
                onRefresh();
            } else {
                const error = await response.json();
                toast.error(`Failed to update tag: ${error.error}`);
            }
        } catch (error) {
            console.error('Error updating tag:', error);
            toast.error('An error occurred while updating the tag');
        } finally {
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch('/api/admin/tags', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: Number(tag.id),
                }),
            });

            if (response.ok) {
                toast.success('Tag deleted successfully!');
                setDeleteDialogOpen(false);
                onRefresh();
            } else {
                const error = await response.json();
                toast.error(`Failed to delete tag: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting tag:', error);
            toast.error('An error occurred while deleting the tag');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                            setEditedName(tag.name);
                            setEditDialogOpen(true);
                        }}>
                            Edit Tag
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                            Delete Tag
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Tag</DialogTitle>
                        <DialogDescription>
                            Update the name of this tag.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tag Name</Label>
                            <Input
                                id="name"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                placeholder="Enter tag name"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditDialogOpen(false)}
                            disabled={isEditing}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleEdit} disabled={isEditing}>
                            {isEditing ? <Spinner /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the tag "{tag.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? <Spinner /> : null}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export const createColumns = (onRefresh: () => void): ColumnDef<Tag>[] => [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return <ActionsMenu tag={row.original} onRefresh={onRefresh} />;
        },
    },
];