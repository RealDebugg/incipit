'use server';
import {put} from "@vercel/blob";

export default async function uploadFile(file: File) {
    try {
        const { url } = await put(file.name, file, { access: "public", allowOverwrite: true });
        return url;
    } catch (error) {
        console.error("Failed to upload file:", error);
        return "";
    }
}