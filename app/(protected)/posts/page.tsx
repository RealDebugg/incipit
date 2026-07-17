import Client from "@/app/(protected)/posts/client";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Posts"
};

export default function PostsPage() {
  return <Client/>;
}
