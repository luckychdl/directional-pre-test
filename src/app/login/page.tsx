"use client";
import styles from "@/styles/login.module.scss";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!loginData.email) return alert("이메일을 입력해주세요.");
    else if (!loginData.password) return alert("패스워드를 입력해주세요.");
    const res = await signIn("credentials", {
      email: loginData.email,
      password: loginData.password,
      redirect: false,
    });

    if (res?.ok) {
      router.replace("/post/list"); // ⭐ 로그인 후 무조건 /post
    } else {
      alert("로그인 실패");
    }
  };
  return (
    <div className={styles.login_container}>
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={loginData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={loginData.password}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}
