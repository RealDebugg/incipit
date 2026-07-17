import Client from "@/app/(protected)/account/client";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Account"
};

export default function AccountPage() {
  return <Client />;
}
