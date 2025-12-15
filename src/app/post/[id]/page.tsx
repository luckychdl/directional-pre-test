"use client";

import { GET_POST_DETAIL } from "@/libs/post";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PostData } from "../write/page";
import {
  MdRadioButtonChecked,
  MdRadioButtonUnchecked,
  MdClose,
} from "react-icons/md";
import styles from "../../../styles/posts.module.scss";
export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [postData, setPostData] = useState<PostData>({
    title: "",
    body: "",
    category: "NOTICE",
    tags: [],
  });
  const [isModify, setIsModify] = useState<boolean>(false);
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
  const { data } = useQuery({
    queryKey: ["postDetail", id],
    queryFn: () => GET_POST_DETAIL(id),
    enabled: !!id,
  });
  console.log(data);
  useEffect(() => {
    setPostData({
      ...data,
    });
  }, [data]);
  console.log(postData, "pso");
  return (
    <div className={styles.post_write_container}>
      <div className={styles.post_write_inner}>
        <div>
          <div className={styles.title}>
            <h4>제목</h4>
            {isModify ? (
              <input
                type="text"
                maxLength={80}
                value={postData?.title}
                name="title"
                onChange={handlePostData}
                placeholder={"제목"}
              />
            ) : (
              <span>{postData?.title}</span>
            )}
          </div>
          <div>
            <h4>카테고리</h4>
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
            <h4>태그</h4>

            <div className={styles.tags_box}>
              <div className={styles.tags_input_row}>
                <input
                  type="text"
                  disabled={!isModify}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="태그 입력 후 Enter 또는 , 로 추가 (최대 5개, 24자 이내)"
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
          <div className={styles.text_area}>
            <h4>본문</h4>
            <textarea
              name="body"
              maxLength={2000}
              value={postData?.body}
              onChange={handlePostData}
              disabled={!isModify}
            />
            <p>{postData?.body?.length}/2000</p>
          </div>
        </div>
        <button onClick={() => setIsModify(true)}>수정</button>
      </div>
    </div>
  );
}
