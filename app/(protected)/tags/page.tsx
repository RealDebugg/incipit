"use client"

import { PageBreadcrumbs } from "@/components/app-shell";
import {DataTable} from "@/app/(protected)/tags/data-table";
import {columns, Tag} from "@/app/(protected)/tags/columns";
import {useCallback, useEffect, useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {PaginationState} from "@tanstack/react-table";

const breadcrumbs = [
  { label: "Tags" },
];

interface GetTagsResponse {
    data: Tag[];
    count: number;
}

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const fetchTags = useCallback((page: number, limit: number) => {
        setLoading(true);
        fetch(`/api/admin/tags?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            if (res.ok) {
                const dashResponse: GetTagsResponse = await res.json();
                if (dashResponse) {
                    setTags(dashResponse.data);
                    setPageCount(Math.ceil(dashResponse.count / limit));
                }
            }
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching tags:', error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        fetchTags(pagination.pageIndex + 1, pagination.pageSize);
    }, [pagination, fetchTags]);

    return (
        <>
            <PageBreadcrumbs breadcrumbs={breadcrumbs} />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold block sm:hidden">Tags</h1>
                {loading ? (
                    <div className={"flex flex-1 items-center justify-center"}>
                        <Spinner className="size-8"/>
                    </div>
                ) : (
                    <DataTable columns={columns} data={tags} pageCount={pageCount} pagination={pagination} onPaginationChange={setPagination}/>
                )}
            </div>
        </>
    );
}
