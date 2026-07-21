"use client";

import { PageBreadcrumbs } from "@/components/app-shell";
import { useParams } from "next/navigation";

/*TODO:
   - Publish button & Save Draft button
   - Author is automatic from current auth0 user.
   - Description editor: shadCN text field
   - Content editor: Blocknote editor
   - Title editor: shadCN text field
   - Date: shadCN date picker https://ui.shadcn.com/docs/components/base/date-picker
   - Tags field: popover with search (fetch all from tags api) and Badges (the tags). List of tags (badges) with x's to remove tags.
   - Image uploader: Vercel Blob Storage + https://www.shadcnblocks.com/component/file-upload/file-upload-special-3
   */

export default function Client() {
    const slug = useParams()?.slug;
    const slugLabel =
        typeof slug === "string" && slug.trim().length > 0
            ? slug
            : "Missing post";

    const breadcrumb = slugLabel == "new" ? "New Post" : "Edit: " + slugLabel

    const breadcrumbs = [
        { label: "Posts", href: "/posts" },
        { label: breadcrumb },
    ];

    return (
        <>
            <PageBreadcrumbs breadcrumbs={breadcrumbs} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold block sm:hidden">{breadcrumb}</h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
        </>
    );
}