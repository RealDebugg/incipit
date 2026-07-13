import { PageBreadcrumbs } from "@/components/app-shell";
import {PlusIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {LinkButton} from "@/components/ui/link-button";

const breadcrumbs = [
  { label: "Posts" },
];

export default function PostsPage() {
  return (
      <>
          <PageBreadcrumbs breadcrumbs={breadcrumbs}/>
          <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                      {/*TODO: Implement search*/}
                      <Input placeholder="Search posts" className="h-9 rounded-md px-3 py-1"/>
                  </div>
                  <div className="ms-auto flex gap-2">
                      <LinkButton className="rounded-md px-4" size="lg" href={"/posts/new"}>
                          <PlusIcon/>
                          New Post
                      </LinkButton>
                  </div>
              </div>

              {/*TODO: Fetch post list, include delete and unpublish quick actions*/}
              {/*TODO: Skeleton while loading*/}
              {/*TODO: If no posts, show an empty state (shadcnuikit.com)*/}
              {/*TODO: Datalist includes: cover photo, title, author, status, date, quick actions*/}
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  <div className="aspect-video rounded-xl bg-muted/50"/>
                  <div className="aspect-video rounded-xl bg-muted/50"/>
                  <div className="aspect-video rounded-xl bg-muted/50"/>
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
          </div>
      </>
  );
}
