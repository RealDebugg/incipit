import Client from "@/app/(protected)/posts/[slug]/client";
import {Metadata} from "next";

/*TODO: Post title*/
export const metadata: Metadata = {
    title: "Placeholder Title"
};

export default function SlugPage() {
  return <Client/>;
}