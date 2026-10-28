import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { type NextRequest, NextResponse } from "next/server";
import { MAX_UPLOAD_SIZE } from "@/lib/blob-config";
import { getAuthSession } from "@/lib/session";

export async function POST(request: NextRequest) {
    try {
        const session = await getAuthSession(request);
        const body = await request.json() as HandleUploadBody;
        const response = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async () => {
                if (!session?.user) {
                    throw new Error("Unauthorized");
                }

                return {
                    maximumSizeInBytes: MAX_UPLOAD_SIZE,
                    allowOverwrite: true,
                };
            },
        });

        return NextResponse.json(response);
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.error("Failed to authorize file upload:", error);
        return NextResponse.json({ error: "Failed to authorize file upload" }, { status: 400 });
    }
}