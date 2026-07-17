"use client"

import { PageBreadcrumbs } from "@/components/app-shell";
import {DataTable} from "@/app/(protected)/tags/data-table";
import {columns, Tag} from "@/app/(protected)/tags/columns";

const breadcrumbs = [
  { label: "Tags" },
];

const tags: Tag[] = [
    {
        id: "1",
        name: "Tag 1",
    },
    {
        id: "2",
        name: "Tag 2",
    },
    {
        id: "2",
        name: "Tag 2",
    },
    {
        id: "2",
        name: "Tag 2",
    },
    {
        id: "2",
        name: "Tag 2",
    },{
        id: "1",
        name: "Tag 1",
    },
    {
        id: "2",
        name: "Tag 2",
    },
    {
        id: "2",
        name: "Tag 2",
    },
    {
        id: "2",
        name: "Tag 2",
    },
    {
        id: "2",
        name: "Tag 2",
    }
]

export default function TagsPage() {
  return (
      <>
          <PageBreadcrumbs breadcrumbs={breadcrumbs} />
          <div className="flex flex-1 flex-col gap-4 p-4">
              <h1 className="text-2xl font-bold block sm:hidden">Tags</h1>
              <DataTable columns={columns} data={tags} pageCount={tags.length}/> {/*TODO: Return page amount from API*/}
          </div>
      </>
  );
}
