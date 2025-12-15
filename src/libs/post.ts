import instance from "@/app/functions/axiosInstance";
import { cleanParams } from "@/app/functions/cleanParams";
import { PostData } from "@/app/post/write/page";
import { PostRequestData } from "@/app/types/post";
import axios from "axios";

export async function GET_POSTS_LIST(data: PostRequestData) {
  try {
    const params = cleanParams({ ...data });
    console.log(params);
    const res = await instance.get(`/posts`, {
      params: {
        ...params,
      },
    });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("게시물 조회 에러:", err.response?.data);
    } else {
      console.error("알 수 없는 에러:", err);
    }
    throw err;
  }
}
export async function POST_POSTS(data: PostData) {
  try {
    const res = await instance.post(`/posts`, {
      ...data,
    });
    if (res.status === 201) {
      return alert("게시물이 등록되었습니다.");
    } else {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("게시물 등록 에러:", err.response?.data);
    } else {
      console.error("알 수 없는 에러:", err);
    }
    throw err;
  }
}
export async function PATCH_POSTS(data: PostData) {
  try {
    const res = await instance.patch(`/posts/${data?.id}`, {
      ...data,
    });
    if (res.status === 200) {
      return alert("게시물이 수정되었습니다.");
    } else {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("게시물 수정 에러:", err.response?.data);
    } else {
      console.error("알 수 없는 에러:", err);
    }
    throw err;
  }
}
export async function GET_POST_DETAIL(id: string) {
  try {
    const res = await instance.get(`/posts/${id}`);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`Error: ${res.status} - ${res.statusText}`);
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("게시물 조회 에러:", err.response?.data);
    } else {
      console.error("알 수 없는 에러:", err);
    }
    throw err;
  }
}
