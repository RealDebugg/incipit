"use client"

import { PageBreadcrumbs } from "@/components/app-shell";
import {DataTable} from "@/app/(protected)/posts/DataTable/data-table";
import {createColumns, Post} from "@/app/(protected)/posts/DataTable/columns";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Spinner} from "@/components/ui/spinner";
import {PaginationState, SortingState} from "@tanstack/react-table";
import {PlusIcon} from "lucide-react";
import {LinkButton} from "@/components/ui/link-button";
import {Input} from "@/components/ui/input";

const breadcrumbs = [
    { label: "Posts" },
];

interface GetPostsResponse {
    res: Post[];
    count: number;
}

export default function Client() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [pageCount, setPageCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const fetchPosts = useCallback((page: number, limit: number, search: string, sortState: SortingState) => {
        setLoading(true);

        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search) {
            params.append('search', search);
        }

        if (sortState.length > 0) {
            params.append('sortBy', sortState[0].id);
            params.append('sortOrder', sortState[0].desc ? 'desc' : 'asc');
        }

        fetch(`/api/admin/posts?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (res) => {
            if (res.ok) {
                const response: GetPostsResponse = await res.json();
                if (response) {
                    setPosts(response.res);
                    setPageCount(response.count);
                }
            }
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching posts:', error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchPosts(pagination.pageIndex + 1, pagination.pageSize, searchQuery, sorting);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [pagination, searchQuery, sorting, fetchPosts]);

    const columns = useMemo(
        () => createColumns(() => fetchPosts(pagination.pageIndex + 1, pagination.pageSize, searchQuery, sorting)),
        [fetchPosts, pagination.pageIndex, pagination.pageSize, searchQuery, sorting]
    );

    return (
        <>
            <PageBreadcrumbs breadcrumbs={breadcrumbs}/>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold block sm:hidden">Posts</h1>
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search posts by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-sm h-9 rounded-md px-3 py-1"
                    />
                    <div className="ms-auto flex gap-2">
                        <LinkButton className="rounded-md px-4" size="lg" href={"/posts/new"}>
                            <PlusIcon/>
                            New Post
                        </LinkButton>
                    </div>
                </div>
                {loading ? (
                    <div className="flex flex-1 items-center justify-center">
                        <Spinner className="size-8"/>
                    </div>
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={posts}
                            pageCount={pageCount}
                            pagination={pagination}
                            onPaginationChange={setPagination}
                            sorting={sorting}
                            onSortingChange={setSorting}
                        />
                    </>
                )}
            </div>
        </>
    );
}
