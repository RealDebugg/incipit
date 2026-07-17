import { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
    title: "Tags"
};

export default function TagsPage() {
    return <Client />;
}
