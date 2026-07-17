"use client"

import { PageBreadcrumbs } from "@/components/app-shell";
import {DataTable} from "@/app/(protected)/tags/DataTable/data-table";
import {createColumns, Tag} from "@/app/(protected)/tags/DataTable/columns";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {PaginationState} from "@tanstack/react-table";
import {Input} from "@/components/ui/input";
import {PlusIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {toast} from "sonner";

const breadcrumbs = [
  { label: "Tags" },
];

interface GetTagsResponse {
    data: Tag[];
    count: number;
}

export default function Client() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [tagName, setTagName] = useState<string>('');
    const [creating, setCreating] = useState(false);

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

    const handleCreateTag = async () => {
        if (!tagName.trim()) {
            toast.warning('Please enter a tag name');
            return;
        }

        setCreating(true);
        try {
            const response = await fetch('/api/admin/tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: tagName,
                }),
            });

            if (response.ok) {
                toast.success('Tag created successfully!');
                setTagName('');
                fetchTags(pagination.pageIndex + 1, pagination.pageSize);
            } else {
                const error = await response.json();
                toast.error(`Failed to create tag: ${error.error}`);
            }
        } catch (error) {
            console.error('Error creating tag:', error);
            toast.error('An error occurred while creating the tag');
        } finally {
            setCreating(false);
        }
    };

    const columns = useMemo(
        () => createColumns(() => fetchTags(pagination.pageIndex + 1, pagination.pageSize)),
        [fetchTags, pagination.pageIndex, pagination.pageSize]
    );

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
                    <>
                        <p>Create a new tag</p>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Tag Name"
                                className="h-9 rounded-md px-3 py-1"
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                            />
                            <Button
                                className="rounded-md px-4"
                                size="lg"
                                onClick={handleCreateTag}
                                disabled={creating}
                            >
                                {creating ? <Spinner/> : <PlusIcon/>}
                                Create Tag
                            </Button>
                        </div>
                        <Separator />
                        <DataTable columns={columns} data={tags} pageCount={pageCount} pagination={pagination} onPaginationChange={setPagination}/>
                    </>
                )}
            </div>
        </>
    );
}
