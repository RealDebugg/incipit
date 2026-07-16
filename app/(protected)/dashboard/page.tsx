"use client";

import { PageBreadcrumbs } from "@/components/app-shell";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
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

interface UserResponse {
    name: string;
    email: string;
    picture: string;
}

export default function DashboardPage() {
    const [dashData, setDashData] = useState<DashDataResponse | null>(null);
    const [userName, setUserName] = useState<string>('User');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/admin/dashboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            fetch('/api/admin/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ]).then(async ([dashRes, userRes]) => {
            if (dashRes.ok) {
                const dashResponse: DashDataResponse = await dashRes.json();
                if (dashResponse) {
                    setDashData(dashResponse);
                }
            }
            if (userRes.ok) {
                const userResponse: UserResponse = await userRes.json();
                if (userResponse?.name) {
                    setUserName(userResponse.name);
                }
            }
            setLoading(false);
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
          { loading ? (
              <>
                  {/*Page is loading, https://ui.shadcn.com/docs/components/base/spinner*/}
              </>
          ) : (
              !dashData ? (
                  <>
                      {/*Page failed to load, https://shadcnuikit.com/dashboard/pages/empty-states/04*/}
                  </>
              ) : (
                  <>
                      {/*Page is loaded, show content below*/}
                  </>
              )
          ) }
          <Card className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min hidden sm:block content-center border">
              <CardHeader>
                  <CardTitle className="text-3xl font-semibold pb-6 px-6">
                      Hi, {userName} <span className="text-4xl">👋</span>
                  </CardTitle>
                  <CardContent className="px-6">
                      <div className="text-2xl">Welcome back to the dashboard. What's on your mind?</div>
                      <div className="text-muted-foreground">
                          If you'd like to save a thought, you can do so by creating a new quick draft below.
                      </div>
                  </CardContent>
              </CardHeader>
          </Card>
          <div className="flex flex-col sm:grid auto-rows-min gap-4 md:grid-cols-2">
              <div className="aspect-video rounded-xl gap-4 flex flex-col order-2 sm:order-1">
                  <Card className="rounded-xl border py-6 flex-1 justify-center">
                      <CardHeader className="gap-2 px-6">
                          {loading ?
                              <Spinner className="size-8"/> :
                              (!dashData ?
                                      <CardTitle className="text-2xl lg:text-3xl font-semibold">No data
                                          available</CardTitle> :
                                      <>
                                          <CardDescription>Total Posts</CardDescription>
                                          <CardTitle
                                              className="text-2xl lg:text-3xl font-semibold">{dashData?.postsCount}</CardTitle>
                                      </>
                              )
                          }
                      </CardHeader>
                  </Card>
                  <Card className="rounded-xl border py-6 flex-1 justify-center">
                      <CardHeader className="gap-2 px-6">
                          {loading ?
                              <Spinner className="size-8"/> :
                              (!dashData ?
                                      <CardTitle className="text-2xl lg:text-3xl font-semibold">No data
                                          available</CardTitle> :
                                      <>
                                          <CardDescription>Total Tags</CardDescription>
                                          <CardTitle
                                              className="text-2xl lg:text-3xl font-semibold">{dashData?.tagsCount}</CardTitle>
                                      </>
                              )
                          }
                      </CardHeader>
                  </Card>
                  <Card className="rounded-xl border py-6 flex-1 justify-center">
                      <CardHeader className="gap-2 px-6">
                          {loading ?
                              <Spinner className="size-8"/> :
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
              <Card className="aspect-video rounded-xl bg-muted/50 px-6 py-6 flex flex-col gap-4 order-1 sm:order-2 border">
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
              </Card>
          </div>
      </div>
    </>
  );
}
