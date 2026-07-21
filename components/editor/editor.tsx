"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { forwardRef, useEffect, useImperativeHandle } from "react";

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

interface EditorProps {
    initialContent?: string;
}

// Our <Editor> component we can reuse later
const Editor = forwardRef<EditorRef, EditorProps>(({ initialContent }, ref) => {
    // Creates a new editor instance
    const editor = useCreateBlockNote({
        uploadFile
    });

    useImperativeHandle(ref, () => ({
        getEditor: () => editor
    }));

    // Load HTML content when initialContent changes
    useEffect(() => {
        if (initialContent && editor) {
            const blocks = editor.tryParseHTMLToBlocks(initialContent);
            editor.replaceBlocks(editor.document, blocks);
        }
    }, [initialContent, editor]);

    // Renders the editor instance using a React component.
    return <BlockNoteView editor={editor} />;
});

Editor.displayName = "Editor";

export default Editor;