"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AuthSession({ children }: Props) {
  // next-auth v5 베타 버전의 타입 이슈 해결을 위한 타입 단언
  const Provider = SessionProvider as any;
  return <Provider>{children}</Provider>;
}
