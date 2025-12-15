"use client";
import Link from "next/link";
import styles from "../styles/components.module.scss";
import { usePathname } from "next/navigation";
export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className={styles.sidebar}>
      <Link href={`/post/list`}>
        <p className={pathname.startsWith("/post") ? styles.current : ""}>
          POST
        </p>
      </Link>
      <Link href={`/chart`}>
        <p className={pathname.startsWith("/chart") ? styles.current : ""}>
          CHART
        </p>
      </Link>
    </div>
  );
}
