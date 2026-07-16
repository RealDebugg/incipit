"use client";

import { PageBreadcrumbs } from "@/components/app-shell";
import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {useEffect, useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {Input} from "@/components/ui/input";
import {SendHorizonalIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Editor} from "@/components/editor/DynamicEditor";

const breadcrumbs = [
  { label: "Dashboard" },
];

interface DashDataResponse {
    postsCount: number;
    tagsCount: number;
    latestPost: { title: string, date: string, id: number };
}
export default function DashboardPage() {
    const [dashData, setDashData] = useState<DashDataResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/dashboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            if (res.ok) {
                let response: DashDataResponse = await res.json();
                if (response) {
                    setDashData(response);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            }
        }).catch((error) => {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        });
    }, []);

    return (
    <>
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold block sm:hidden">Dashboard</h1>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min hidden sm:block" />
          <div className="flex flex-col sm:grid auto-rows-min gap-4 md:grid-cols-2">
              <div className="aspect-video rounded-xl gap-4 flex flex-col order-2 sm:order-1">
                  <Card className="rounded-xl border py-6 flex-1 justify-center">
                      <CardHeader className="gap-2 px-6">
                          {loading ?
                              <Spinner className="size-8" /> :
                              (!dashData ?
                                      <CardTitle className="text-2xl lg:text-3xl font-semibold">No data available</CardTitle>:
                                      <>
                                          <CardDescription>Total Posts</CardDescription>
                                          <CardTitle className="text-2xl lg:text-3xl font-semibold">{dashData?.postsCount}</CardTitle>
                                      </>
                              )
                          }
                      </CardHeader>
                  </Card>
                  <Card className="rounded-xl border py-6 flex-1 justify-center">
                      <CardHeader className="gap-2 px-6">
                          {loading ?
                              <Spinner className="size-8" /> :
                              (!dashData ?
                                      <CardTitle className="text-2xl lg:text-3xl font-semibold">No data available</CardTitle>:
                                      <>
                                          <CardDescription>Total Tags</CardDescription>
                                          <CardTitle className="text-2xl lg:text-3xl font-semibold">{dashData?.tagsCount}</CardTitle>
                                      </>
                              )
                          }
                      </CardHeader>
                  </Card>
                  <Card className="rounded-xl border py-6 flex-1 justify-center">
                      <CardHeader className="gap-2 px-6">
                          {loading ?
                              <Spinner className="size-8" /> :
                              (!dashData ?
                                      <CardTitle className="text-2xl lg:text-3xl font-semibold">No data available</CardTitle>:
                                      <>
                                          <CardDescription>Latest Post</CardDescription>
                                          <CardTitle className="text-2xl lg:text-3xl font-semibold">
                                              <Link href={`posts/${dashData?.latestPost.id}`} className="underline text-blue-500">{dashData?.latestPost.title}</Link>
                                          </CardTitle>
                                      </>
                              )
                          }
                      </CardHeader>
                  </Card>
              </div>
              <div className="aspect-video rounded-xl bg-muted/50 px-6 py-6 flex flex-col gap-4 order-1 sm:order-2">
                  {/*TODO: Implement saving*/}
                  <CardTitle>Quick Draft</CardTitle>
                  <Input placeholder="Title" className="h-9 rounded-md px-3 py-1"/>
                  <div className="border border-input rounded-md flex-1 bg-[#1f1f1f] sm:overflow-scroll">
                    <Editor/>
                  </div>
                  <Button className="rounded-md px-4 w-fit" size="lg">
                      <SendHorizonalIcon/>
                      Save Draft
                  </Button>
              </div>
          </div>
      </div>
    </>
  );
}
