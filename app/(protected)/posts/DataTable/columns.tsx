"use client"

import {ColumnDef} from "@tanstack/table-core";
import {ArrowUpDown} from "lucide-react";
import {Button} from "@/components/ui/button";
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";

export type Post = {
    id: number;
    date: string;
    title: string;
    author: string;
    coverPhotoBlob: string | null;
    description: string | null;
    status: number;
}

interface ActionsMenuProps {
    post: Post;
    onRefresh: () => void;
}

function ActionsMenu({ post, onRefresh }: ActionsMenuProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [unpublishDialogOpen, setUnpublishDialogOpen] = useState(false);
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUnpublishing, setIsUnpublishing] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/posts/post`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: post.id,
                }),
            });

            if (response.ok) {
                toast.success('Post deleted successfully!');
                setDeleteDialogOpen(false);
                onRefresh();
            } else {
                const error = await response.json();
                toast.error(`Failed to delete post: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('An error occurred while deleting the post');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusChange = async (newStatus: number, successMessage: string) => {
        const isPublishing = newStatus === 1;
        const setLoading = isPublishing ? setIsPublishing : setIsUnpublishing;
        const setDialogOpen = isPublishing ? setPublishDialogOpen : setUnpublishDialogOpen;

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/posts`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: post.id,
                    status: newStatus,
                }),
            });

            if (response.ok) {
                toast.success(successMessage);
                setDialogOpen(false);
                onRefresh();
            } else {
                const error = await response.json();
                toast.error(`Failed to update post: ${error.error}`);
            }
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error('An error occurred while updating the post');
        } finally {
            setLoading(false);
        }
    };

    const handleUnpublish = () => handleStatusChange(2, 'Post unpublished successfully!');
    const handlePublish = () => handleStatusChange(1, 'Post published successfully!');

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
                        <DropdownMenuItem onClick={() => window.location.href = `/posts/${post.id}`}>
                            Edit Post
                        </DropdownMenuItem>
                        {post.status === 1 ? (
                            <DropdownMenuItem onClick={() => setUnpublishDialogOpen(true)}>
                                Unpublish Post
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => setPublishDialogOpen(true)}>
                                Publish Post
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                            Delete Post
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Publish this post?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will make the post visible on your public site.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPublishing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePublish} disabled={isPublishing}>
                            {isPublishing ? <Spinner /> : null}
                            Publish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={unpublishDialogOpen} onOpenChange={setUnpublishDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Unpublish this post?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will hide the post from your public site. You can publish it again later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isUnpublishing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUnpublish} disabled={isUnpublishing}>
                            {isUnpublishing ? <Spinner /> : null}
                            Unpublish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the post "{post.title}".
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

function StatusBadge({ status }: { status: number }) {
    if (status === 1) {
        return <Badge variant="secondary">Published</Badge>;
    } else if (status === 0) {
        return <Badge variant="outline">Draft</Badge>;
    } else if (status === 2) {
        return <Badge variant="destructive">Unpublished</Badge>;
    }
    return <Badge>Unknown</Badge>;
}

export const createColumns = (onRefresh: () => void): ColumnDef<Post>[] => [
    {
        accessorKey: "title",
        header: "Post",
        cell: ({ row }) => {
            const coverPhoto = row.original.coverPhotoBlob;
            const [imageError, setImageError] = useState(false);

            // Validate if the URL is valid
            const isValidUrl = coverPhoto && (
                coverPhoto.startsWith('/') ||
                coverPhoto.startsWith('http://') ||
                coverPhoto.startsWith('https://')
            );

            return (
                <div className="flex items-center gap-3">
                    <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {isValidUrl && !imageError ? (
                            <Image
                                src={coverPhoto}
                                alt={row.original.title}
                                fill
                                className="object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                No image
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <button
                            onClick={() => window.location.href = `/posts/${row.original.id}`}
                            className="hover:underline text-left font-medium"
                        >
                            {row.original.title}
                        </button>
                        <span className="text-sm text-muted-foreground">{row.original.author}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <StatusBadge status={row.original.status} />;
        },
        enableSorting: true,
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="h-8 px-2"
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        enableSorting: true,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return <ActionsMenu post={row.original} onRefresh={onRefresh} />;
        },
    },
];
