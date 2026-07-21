import Client from "@/app/(protected)/posts/[slug]/client";
import {Metadata} from "next";
import prisma from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    if (slug === "new") {
        return {
            title: "New Post"
        };
    }

    const postId = parseInt(slug);
    if (isNaN(postId)) {
        return {
            title: "Invalid Post"
        };
    }

    try {
        const post = await prisma.posts.findFirst({
            where: { id: postId },
            select: { title: true }
        });

        if (post?.title) {
            return {
                title: post.title
            };
        }
    } catch (error) {
        console.error("Error fetching post for metadata:", error);
    }

    return {
        title: "Edit Post"
    };
}

export default function SlugPage() {
  return <Client/>;
}