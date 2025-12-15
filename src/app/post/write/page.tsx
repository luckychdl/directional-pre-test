"use client";
import { useCallback, useEffect, useState } from "react";
import styles from "../../../styles/posts.module.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GET_POST_DETAIL, PATCH_POSTS, POST_POSTS } from "@/libs/post";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MdRadioButtonChecked,
  MdRadioButtonUnchecked,
  MdClose,
} from "react-icons/md";
export type PostData = {
  id?: string;
  userId?: string;
  title: string;
  body: string;
  category: "FREE" | "QNA" | "NOTICE" | null;
  tags?: string[];
};
export default function PostWrite() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const [postData, setPostData] = useState<PostData>({
    title: "",
    body: "",
    category: "NOTICE",
    tags: [],
  });
  const [isModify, setIsModify] = useState<boolean>(true);
  const CATEGORY_OPTIONS = [
    { value: "NOTICE" as const, label: "NOTICE" },
    { value: "QNA" as const, label: "QNA" },
    { value: "FREE" as const, label: "FREE" },
  ];
  const handlePostData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target; // ✅ name 기반으로 통일
      setPostData((prev) => ({ ...prev, [name]: value })); // ✅ prev로 안전 업데이트
    },
    []
  );
  const handleCategory = useCallback((category: PostData["category"]) => {
    setPostData((prev) => ({ ...prev, category }));
  }, []);
  const [tagInput, setTagInput] = useState("");

  const normalizeTag = (t: string) => t.trim();

  const addTags = useCallback((raw: string) => {
    const parts = raw
      .split(/[,\n]/g) // 콤마/엔터 분리
      .map(normalizeTag)
      .filter(Boolean);

    if (parts.length === 0) return;

    setPostData((prev) => {
      const current = prev.tags ?? [];
      const set = new Set(current.map((x) => x.toLowerCase())); // 중복 제거(대소문자 무시)

      const next = [...current];

      for (const tag of parts) {
        if (next.length >= 5) break; // 최대 5개
        if (tag.length > 24) continue; // 24자 초과는 무시(또는 alert 처리 가능)

        const key = tag.toLowerCase();
        if (set.has(key)) continue;

        set.add(key);
        next.push(tag);
      }

      return { ...prev, tags: next };
    });

    setTagInput("");
  }, []);

  const removeTag = useCallback((target: string) => {
    setPostData((prev) => ({
      ...prev,
      tags: (prev.tags ?? []).filter((t) => t !== target),
    }));
  }, []);
  const BANNED_WORDS = ["캄보디아", "프놈펜", "불법체류", "텔레그램"] as const;

  function findBannedWord(text: string) {
    const normalized = text.replace(/\s+/g, ""); // 공백 제거(선택)
    return BANNED_WORDS.find((w) => normalized.includes(w)) ?? null;
  }
  const postMutation = useMutation({
    mutationFn: (data: PostData) => POST_POSTS(data),
    onSuccess: () => router.back(),
    onError: () => alert("게시물 등록 에러"),
  });
  const queryClient = useQueryClient();
  const patchMutation = useMutation({
    mutationFn: (data: PostData) => PATCH_POSTS(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["postDetail"] }),
    onError: () => alert("게시물 수정 에러"),
  });
  const onSubmit = () => {
    if (!postData.title.trim()) return alert("제목을 입력해주세요.");
    if (!postData.body.trim()) return alert("본문을 입력해주세요.");
    if (!postData.category) return alert("카테고리를 선택해주세요.");
    const banned = findBannedWord(`${postData.title} ${postData.body}`);
    if (banned) {
      return alert(`등록 불가: 금칙어("${banned}")가 포함되어 있습니다.`);
    }
    if (id) {
      patchMutation.mutate(postData);
    } else {
      postMutation.mutate(postData);
    }
  };
  const { data } = useQuery({
    queryKey: ["postDetail", id],
    queryFn: () => GET_POST_DETAIL(id as string),
    enabled: !!id,
  });
  console.log(data);
  useEffect(() => {
    if (data && id) {
      setPostData({
        ...data,
      });
      setIsModify(false);
    }
  }, [data]);
  return (
    <div className={styles.post_write_container}>
      <div className={styles.post_write_inner}>
        <div>
          <div>
            <p>제목</p>
            <input
              type="text"
              maxLength={80}
              value={postData?.title}
              name="title"
              onChange={handlePostData}
              placeholder={"제목"}
              disabled={!isModify}
            />
          </div>
          <div>
            <p>카테고리</p>
            <div className={styles.category_group}>
              {CATEGORY_OPTIONS.map((opt) => {
                const checked = postData.category === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={styles.category_item}
                    onClick={() => handleCategory(opt.value)}
                    aria-pressed={checked}
                    disabled={!isModify}
                  >
                    {checked ? (
                      <MdRadioButtonChecked size={20} />
                    ) : (
                      <MdRadioButtonUnchecked size={20} />
                    )}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p>태그</p>

            <div className={styles.tags_box}>
              <div className={styles.tags_input_row}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="태그 입력 후 Enter 또는 , 로 추가 (최대 5개, 24자 이내)"
                  disabled={!isModify}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTags(tagInput);
                    }
                    if (e.key === ",") {
                      e.preventDefault();
                      addTags(tagInput);
                    }
                    if (
                      e.key === "Backspace" &&
                      !tagInput &&
                      (postData.tags?.length ?? 0) > 0
                    ) {
                      // 입력 비었을 때 backspace로 마지막 태그 삭제(선택 UX)
                      const last = postData.tags![postData.tags!.length - 1];
                      removeTag(last);
                    }
                  }}
                />
                <button
                  type="button"
                  className={styles.tag_add_button}
                  onClick={() => addTags(tagInput)}
                  disabled={
                    (postData.tags?.length ?? 0) >= 5 || !tagInput.trim()
                  }
                >
                  추가
                </button>
              </div>

              <div className={styles.tags_chips}>
                {(postData.tags ?? []).map((tag) => (
                  <span key={tag} className={styles.tag_chip}>
                    <span className={styles.tag_text}>{tag}</span>
                    <button
                      type="button"
                      className={styles.tag_remove}
                      onClick={() => removeTag(tag)}
                      aria-label={`태그 ${tag} 삭제`}
                      disabled={!isModify}
                    >
                      <MdClose size={16} />
                    </button>
                  </span>
                ))}
              </div>

              <div className={styles.tags_meta}>
                <span>{(postData.tags ?? []).length}/5</span>
                <span>·</span>
                <span>각 24자 이내</span>
                <span>·</span>
                <span>중복 자동 제거</span>
              </div>
            </div>
          </div>
          <div>
            <p>본문</p>
            <textarea
              name="body"
              maxLength={2000}
              value={postData?.body}
              onChange={handlePostData}
              disabled={!isModify}
            />
            <span>{postData?.body?.length}/2000</span>
          </div>
        </div>
        <button onClick={!isModify ? () => setIsModify(true) : onSubmit}>
          {!isModify || id ? "수정" : "등록"}
        </button>
      </div>
    </div>
  );
}
