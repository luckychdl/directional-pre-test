import instance from "@/app/functions/axiosInstance";
import axios from "axios";

export async function GET_COFFEE_BRANDS() {
  try {
    const res = await instance.get(`/mock/top-coffee-brands`);
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

export async function GET_SNACK_BRANDS() {
  try {
    const res = await instance.get(`/mock/popular-snack-brands`);
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
export async function GET_MOOD_TREND() {
  try {
    const res = await instance.get(`/mock/weekly-mood-trend`);
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
export async function GET_WORKOUT_TREND() {
  try {
    const res = await instance.get(`/mock/weekly-workout-trend`);
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
export async function GET_COFFEE_CONSUMPTION() {
  try {
    const res = await instance.get(`/mock/coffee-consumption`);
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
export async function GET_SNACK_IMPACT() {
  try {
    const res = await instance.get(`/mock/snack-impact`);
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
