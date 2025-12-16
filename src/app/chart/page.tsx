"use client";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/chart.module.scss";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import BarChart from "@/components/barChart";
import DonutChart from "@/components/donutChart";
import StackBarChart from "@/components/stackBarChart";
import StackAreaChart from "@/components/stackAreaChart";
import MultiLineChart from "@/components/multiLineChart";
export default function ChartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const CHART_OPTIONS = [
    { value: "바차트" as const, label: "바 차트" },
    { value: "도넛차트" as const, label: "도넛 차트" },
    { value: "스택형바" as const, label: "스택형 바 차트" },
    { value: "스택형면적" as const, label: "스택형 면적 차트" },
    { value: "멀티라인" as const, label: "멀티라인 차트" },
  ];
  return (
    <div className={styles.chart_page}>
      <div>
        <div className={styles.chart_container}>
          <div className={styles.category_group}>
            {CHART_OPTIONS.map((opt) => {
              const checked = type === opt.value;

              return (
                <button
                  key={opt.value}
                  type="button"
                  className={styles.category_item}
                  onClick={() => router.push(`/chart?type=${opt.value}`)}
                  aria-pressed={checked}
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
          <div className={styles.chart_group}>
            {type == "바차트" && <BarChart />}
            {type == "도넛차트" && <DonutChart />}
            {type == "스택형바" && <StackBarChart />}
            {type == "스택형면적" && <StackAreaChart />}
            {type == "멀티라인" && <MultiLineChart />}
          </div>
        </div>
      </div>
    </div>
  );
}
