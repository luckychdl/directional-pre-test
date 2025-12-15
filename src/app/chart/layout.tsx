import Sidebar from "../../components/sidebar";
import styles from "../../styles/layout.module.scss";
export default function ChartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.container}>{children}</div>
    </div>
  );
}
