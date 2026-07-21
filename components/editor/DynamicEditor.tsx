"use client";

import dynamic from "next/dynamic";
import type { EditorRef } from "./editor";
import type { ComponentType } from "react";

interface EditorProps {
    initialContent?: string;
}

export const Editor = dynamic(() => import("./editor"), {
    ssr: false
}) as ComponentType<EditorProps & { ref?: React.Ref<EditorRef> }>;