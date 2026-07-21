"use client";

import { PageBreadcrumbs, PageHeaderActions } from "@/components/app-shell";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Editor } from "@/components/editor/DynamicEditor";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { X, CalendarIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";
import type { EditorRef } from "@/components/editor/editor";
import "@blocknote/core/fonts/inter.css";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
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

interface Tag {
    id: number;
    name: string;
}

interface Post {
    id: number;
    author: string;
    title: string;
    content: string;
    description: string | null;
    coverPhotoBlob: string | null;
    tags: Tag[];
    status: number;
    date: string;
}

export default function Client() {
    const slug = useParams()?.slug;
    const router = useRouter();
    const editorRef = useRef<EditorRef>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [postId, setPostId] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date>();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [tagSearchOpen, setTagSearchOpen] = useState(false);
    const [tagSearch, setTagSearch] = useState("");
    const [author, setAuthor] = useState("");
    const [postContent, setPostContent] = useState<string | null>(null);
    const [futureDateDialogOpen, setFutureDateDialogOpen] = useState(false);
    const [pendingPublishDate, setPendingPublishDate] = useState<Date | null>(null);

    const slugLabel =
        typeof slug === "string" && slug.trim().length > 0
            ? slug
            : "Missing post";

    const isNewPost = slugLabel === "new";
    const breadcrumb = isNewPost ? "New Post" : "Edit: " + slugLabel;

    const breadcrumbs = [
        { label: "Posts", href: "/posts" },
        { label: breadcrumb },
    ];

    // Fetch user info
    useEffect(() => {
        fetch('/api/admin/user')
            .then(res => res.json())
            .then(data => {
                if (data?.name) {
                    setAuthor(data.name);
                }
            })
            .catch(err => console.error('Error fetching user:', err));
    }, []);

    // Fetch tags
    useEffect(() => {
        fetch('/api/admin/tags')
            .then(res => res.json())
            .then(data => {
                if (data?.data) {
                    setAvailableTags(data.data);
                }
            })
            .catch(err => console.error('Error fetching tags:', err));
    }, []);

    // Fetch post data if editing
    useEffect(() => {
        if (!isNewPost && slug) {
            const postIdNum = parseInt(slug as string);
            if (isNaN(postIdNum)) {
                toast.error("Invalid post ID");
                setLoading(false);
                return;
            }

            fetch(`/api/admin/posts/post?id=${postIdNum}`)
                .then(res => res.json())
                .then(data => {
                    if (data?.res) {
                        const post: Post = data.res;
                        setPostId(post.id);
                        setTitle(post.title);
                        setDescription(post.description || "");
                        setSelectedTags(post.tags || []);
                        setPostContent(post.content);
                        if (post.date) {
                            const parsedDate = new Date(post.date);
                            if (!isNaN(parsedDate.getTime())) {
                                setDate(parsedDate);
                            }
                        }
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching post:', err);
                    toast.error('Failed to load post');
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [isNewPost, slug]);


    const handlePublishClick = () => {
        // Check if date is in the future when publishing
        if (date && date > new Date()) {
            setPendingPublishDate(date);
            setFutureDateDialogOpen(true);
        } else {
            handleSave(1);
        }
    };

    const handleSave = async (status: number) => {
        if (!title.trim()) {
            toast.warning('Please enter a title');
            return;
        }

        if (!editorRef.current) {
            toast.warning('Editor not ready');
            return;
        }

        if (!author) {
            toast.error('Author information not available');
            return;
        }

        setSaving(true);
        try {
            const editor = editorRef.current.getEditor();
            const blocks = editor.document;
            const htmlContent = await editor.blocksToHTMLLossy(blocks);

            const payload = {
                ...(postId && { id: postId }),
                author,
                title,
                content: htmlContent,
                description: description || null,
                coverPhotoBlob: null, // TODO: Implement image upload
                tags: selectedTags.map(t => t.id),
                status,
                ...(date && { date: date.toISOString() }),
            };

            const method = isNewPost ? 'POST' : 'PUT';
            const response = await fetch('/api/admin/posts/post', {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(status === 1 ? 'Post published successfully!' : 'Draft saved successfully!');

                if (isNewPost && result.id) {
                    router.push(`/posts/${result.id}`);
                }
            } else {
                const error = await response.json();
                toast.error(`Failed to save: ${error.error}`);
            }
        } catch (error) {
            console.error('Error saving post:', error);
            toast.error('An error occurred while saving');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveTag = (tagId: number) => {
        setSelectedTags(selectedTags.filter(t => t.id !== tagId));
    };

    const handleAddTag = (tag: Tag) => {
        if (!selectedTags.find(t => t.id === tag.id)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setTagSearchOpen(false);
        setTagSearch("");
    };

    const filteredTags = availableTags.filter(tag =>
        tag.name.toLowerCase().includes(tagSearch.toLowerCase()) &&
        !selectedTags.find(t => t.id === tag.id)
    );

    if (loading) {
        return (
            <>
                <PageBreadcrumbs breadcrumbs={breadcrumbs} />
                <div className="flex flex-1 items-center justify-center">
                    <Spinner className="size-8" />
                </div>
            </>
        );
    }

    /*TODO: Mobile friendly UI*/
    return (
        <>
            <PageBreadcrumbs breadcrumbs={breadcrumbs} />
            <PageHeaderActions>
                <Button
                    onClick={() => handleSave(0)}
                    disabled={saving}
                    variant="outline"
                    size="sm"
                >
                    {saving ? <Spinner className="mr-1.5" /> : null}
                    Save Draft
                </Button>
                <Button
                    onClick={handlePublishClick}
                    disabled={saving}
                    size="sm"
                >
                    {saving ? <Spinner className="mr-1.5" /> : null}
                    Publish
                </Button>
            </PageHeaderActions>

            {/* Future Date Confirmation Dialog */}
            <AlertDialog open={futureDateDialogOpen} onOpenChange={setFutureDateDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Future Publish Date</AlertDialogTitle>
                        <AlertDialogDescription>
                            The publish date is set in the future, this means that the post will first be visible to viewers on the set date: <strong>{pendingPublishDate && format(pendingPublishDate, "PPP")}</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setFutureDateDialogOpen(false);
                                handleSave(1);
                            }}
                            disabled={saving}
                        >
                            {saving ? <Spinner className="mr-1.5" /> : null}
                            Publish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex flex-1 flex-row gap-4 p-4">
                <div className="flex-1 flex flex-col gap-4">
                    <Input
                        placeholder="Add a title"
                        className="rounded-md px-3 py-1 font-bold h-16"
                        style={{ fontSize: "2.5rem" }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <Input
                        id="description"
                        placeholder="Add an excerpt (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="rounded-md px-3 py-1 h-9"
                    />

                    <div className="border border-input flex-1 rounded-md min-h-[500px] bg-[#1f1f1f]">
                        <Editor ref={editorRef} initialContent={postContent || undefined} />
                    </div>
                </div>
                <div className="flex w-1/4 flex-none flex-col gap-4">
                    <h2 className="text-lg font-semibold">Metadata</h2>

                    {/* TODO: Implement image uploader with Vercel Blob Storage + https://www.shadcnblocks.com/component/file-upload/file-upload-special-3 */}
                    <div className="w-full border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-muted-foreground/40 transition-colors cursor-pointer">
                        <p className="text-sm text-muted-foreground">
                            Click to add cover image
                        </p>
                    </div>

                    <Card className="rounded-xl border justify-center p-6">
                        <Field>
                            <FieldLabel htmlFor="date-picker" className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                                Publish Date
                            </FieldLabel>
                            <Popover>
                                <PopoverTrigger
                                    render={
                                        <Button
                                            variant="outline"
                                            id="date-picker"
                                            className="w-full justify-start font-normal mt-2"
                                            size="sm"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    }
                                />
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        defaultMonth={date}
                                    />
                                </PopoverContent>
                            </Popover>
                        </Field>
                    </Card>

                    <Card className="rounded-xl border justify-center p-6">
                        <Field>
                            <FieldLabel htmlFor="tags" className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                                Tags
                            </FieldLabel>
                            <Popover open={tagSearchOpen} onOpenChange={setTagSearchOpen}>
                                <PopoverTrigger
                                    render={
                                        <Button variant="outline" size="sm" className="w-full justify-start mt-2">
                                            <SearchIcon className="mr-2 h-4 w-4" />
                                            Add tags
                                        </Button>
                                    }
                                />
                                <PopoverContent className="w-80 p-2" align="start">
                                    <Input
                                        placeholder="Search tags..."
                                        value={tagSearch}
                                        onChange={(e) => setTagSearch(e.target.value)}
                                        className="mb-2"
                                    />
                                    <div className="max-h-60 overflow-y-auto space-y-1">
                                        {filteredTags.length === 0 ? (
                                            <div className="text-sm text-muted-foreground p-2">
                                                No tags found
                                            </div>
                                        ) : (
                                            filteredTags.map(tag => (
                                                <div
                                                    key={tag.id}
                                                    className="px-2 py-1.5 text-sm cursor-pointer hover:bg-muted rounded-md"
                                                    onClick={() => handleAddTag(tag)}
                                                >
                                                    {tag.name}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                            {selectedTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                    {selectedTags.map(tag => (
                                        <Badge key={tag.id} variant="secondary" className="group gap-1 text-xs cursor-pointer" onClick={() => handleRemoveTag(tag.id)}>

                                            {tag.name}
                                            <X
                                                className="h-3 w-3 group-hover:text-destructive"
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </Field>
                    </Card>

                    <Card className="rounded-xl border justify-center p-6">
                        <Field>
                            <FieldLabel className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                                Author
                            </FieldLabel>
                            <p className="text-sm mt-2">{author || "Loading..."}</p>
                        </Field>
                    </Card>
                </div>
            </div>
        </>
    );
}
