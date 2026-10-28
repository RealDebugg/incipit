"use client";

import { upload } from "@vercel/blob/client";
import { MAX_UPLOAD_SIZE } from "@/lib/blob-config";

export default async function uploadFile(file: File) {
    if (file.size > MAX_UPLOAD_SIZE) {
        throw new Error("Files must be 100 MiB or smaller.");
    }

    const { url } = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob/upload",
        multipart: true,
    });
    return url;
}