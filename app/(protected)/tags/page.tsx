import { PageBreadcrumbs } from "@/components/app-shell";

const breadcrumbs = [
  { label: "Tags" },
];

export default function TagsPage() {
  return (
    <>
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold block sm:hidden">Tags</h1>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
}
