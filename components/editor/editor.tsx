"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";

/*TODO: Use Vercel Blob Storage*/
async function uploadFile(file: File) {
    const body = new FormData();
    body.append("file", file);

    const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: body,
    });
    return (await ret.json()).data.url.replace(
        "tmpfiles.org/",
        "tmpfiles.org/dl/",
    );
}


// Our <Editor> component we can reuse later
export default function Editor() {
    // Creates a new editor instance.
    const editor = useCreateBlockNote({
        uploadFile
    });

    // Renders the editor instance using a React component.
    return <BlockNoteView editor={editor} />;
}