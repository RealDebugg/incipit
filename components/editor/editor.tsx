"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { forwardRef, useImperativeHandle } from "react";

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

export interface EditorRef {
    getEditor: () => ReturnType<typeof useCreateBlockNote>;
}

// Our <Editor> component we can reuse later
const Editor = forwardRef<EditorRef>((props, ref) => {
    // Creates a new editor instance.
    const editor = useCreateBlockNote({
        uploadFile
    });

    useImperativeHandle(ref, () => ({
        getEditor: () => editor
    }));

    // Renders the editor instance using a React component.
    return <BlockNoteView editor={editor} />;
});

Editor.displayName = "Editor";

export default Editor;