"use client";
import { GET_POSTS_LIST } from "@/libs/post";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import styles from "../../../styles/posts.module.scss";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnSizingState,
  VisibilityState,
} from "@tanstack/react-table";
import { PostItems, PostsList } from "@/app/types/post";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useRouter } from "next/navigation";
export default function PostListPage() {
  const router = useRouter();
  const [postFilterData, setPostFilterData] = useState({
    order: null,
    category: null,
    sort: null,
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PostsList>({
    queryKey: ["postsList", postFilterData, searchKeyword],
    initialPageParam: undefined as string | undefined, // nextCursor
    queryFn: ({ pageParam }) =>
      GET_POSTS_LIST({
        limit: 10,
        order: postFilterData?.order ?? null,
        category: postFilterData?.category ?? null,
        sort: postFilterData?.sort ?? null,
        search: searchKeyword ?? null,
        nextCursor: pageParam, // ✅ 다음 페이지 커서 전달
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // ✅ 다음 커서
    retry: 0,
  });

  // ✅ 여러 페이지 items를 한 배열로 합치기
  const tableData: PostItems[] = useMemo(() => {
    return data?.pages.flatMap((p) => p.items) ?? [];
  }, [data]);
  // ✅ columns는 반드시 memo로 고정
  const columns = useMemo<ColumnDef<PostItems>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 80 },
      { accessorKey: "userId", header: "작성자", size: 120 },
      { accessorKey: "title", header: "게시글 제목", size: 220 },
      {
        accessorKey: "body",
        header: "게시글 본문",
        size: 320,
        cell: ({ getValue }) => (
          <span className={styles.cellMultiline}>{getValue<string>()}</span>
        ),
      },
      { accessorKey: "category", header: "카테고리", size: 120 },
      {
        accessorKey: "tags",
        header: "태그",
        size: 200,
        cell: ({ getValue }) => (getValue<string[]>() ?? []).join(", "),
      },
      { accessorKey: "createdAt", header: "시간", size: 160 },
    ],
    []
  );

  // ✅ 리사이즈 상태를 외부로 빼서 컨트롤(가장 안정적)
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
    columnResizeMode: "onChange",
    state: { columnSizing, columnVisibility },
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
  });
  const handleFilterData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPostFilterData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const onApplySearch = () => {
    setSearchKeyword(searchInput);
  };
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first.isIntersecting) return;

        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  return (
    <div className={styles.post_container}>
      <div className={styles.table_header}>
        <div className={styles.filter}>
          <select name="sort" id="sort" onChange={handleFilterData}>
            <option value="">선택</option>
            <option value="createdAt">작성일자</option>
            <option value="title">제목</option>
          </select>
          <select name="order" id="order" onChange={handleFilterData}>
            <option value="">선택</option>
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>

          <select name="category" id="category" onChange={handleFilterData}>
            <option value="">선택</option>
            <option value="NOTICE">NOTICE</option>
            <option value="QNA">QNA</option>
            <option value="FREE">FREE</option>
          </select>
        </div>
        <div className={styles.search}>
          <input
            type="text"
            name="search"
            value={searchInput}
            onChange={handleSearch}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
              if (e.key === "Enter") onApplySearch();
            }}
          />
          <button type="button" onClick={onApplySearch}>
            검색
          </button>
        </div>
      </div>

      <div className={styles.columnToggle}>
        <div>
          {table.getAllLeafColumns().map((column) => {
            const isVisible = column.getIsVisible();

            return (
              <button
                key={column.id}
                type="button"
                className={styles.columnToggleItem}
                onClick={() => column.toggleVisibility()}
              >
                {isVisible ? (
                  <MdCheckBox size={20} />
                ) : (
                  <MdCheckBoxOutlineBlank size={20} />
                )}
                <span>{String(column.columnDef.header)}</span>
              </button>
            );
          })}
        </div>
        <button>전체삭제</button>
        <button onClick={() => router.push(`/post/write`)}>게시글 작성</button>
      </div>
      <div className={styles.table_container}>
        <div className={styles.table_scroll}>
          <table>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th key={header.id} style={{ width: header.getSize() }}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={styles.resizeHandle}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      onClick={() => router.push(`/post/write?id=${row.id}`)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
