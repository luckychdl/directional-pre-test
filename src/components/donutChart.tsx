"use client";

import { GET_MOOD_TREND, GET_SNACK_BRANDS } from "@/libs/chart";
import { useQueries } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import styles from "../styles/components.module.scss";

type MoodKey = "happy" | "tired" | "stressed";
const MOODS: { key: MoodKey; label: string }[] = [
  { key: "happy", label: "Happy" },
  { key: "tired", label: "Tired" },
  { key: "stressed", label: "Stressed" },
];

type MoodRow = {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
};

type SnackRow = {
  name: string;
  share: number;
};
const SNACK_COLOR_PALETTE = [
  "#4F46E5", // indigo
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#06B6D4", // cyan
  "#A855F7", // purple
  "#EC4899", // pink
];
export default function DonutChart() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  // (선택) 색상 변경 요구사항 대응용
  const [moodColor, setMoodColor] = useState<Record<MoodKey, string>>({
    happy: "#4F46E5",
    tired: "#F59E0B",
    stressed: "#EF4444",
  });
  const [snackColors, setSnackColors] = useState<Record<string, string>>({});

  const results = useQueries({
    queries: [
      {
        queryKey: ["moodTrend"],
        queryFn: GET_MOOD_TREND,
        enabled: !type || type === "도넛차트",
      },
      {
        queryKey: ["snackBrand"],
        queryFn: GET_SNACK_BRANDS,
        enabled: !type || type === "도넛차트",
      },
    ],
  });

  const moodData = (results[0].data ?? []) as MoodRow[];
  const snackData = (results[1].data ?? []) as SnackRow[];
  useEffect(() => {
    if (!snackData.length) return;

    setSnackColors((prev) => {
      const next = { ...prev };

      snackData.forEach((s, index) => {
        if (!next[s.name]) {
          next[s.name] =
            SNACK_COLOR_PALETTE[index % SNACK_COLOR_PALETTE.length];
        }
      });

      return next;
    });
  }, [snackData]);
  // ✅ 무드는 주간 데이터를 “합산”해서 도넛 데이터로 변환
  const moodPieData = useMemo(() => {
    const sums: Record<MoodKey, number> = { happy: 0, tired: 0, stressed: 0 };

    for (const row of moodData) {
      sums.happy += row.happy ?? 0;
      sums.tired += row.tired ?? 0;
      sums.stressed += row.stressed ?? 0;
    }

    return MOODS.map((m) => ({
      name: m.label,
      value: sums[m.key],
      itemStyle: { color: moodColor[m.key] },
    }));
  }, [moodData, moodColor]);

  const snackPieData = useMemo(() => {
    return snackData.map((d) => ({
      name: d.name,
      value: d.share,
      itemStyle: { color: snackColors[d.name] },
    }));
  }, [snackData, snackColors]);

  const moodOption = useMemo(() => {
    return {
      tooltip: { trigger: "item" },
      legend: { top: 0 }, // ✅ 범례 표시 + 클릭 토글 기본 제공
      series: [
        {
          name: "Mood",
          type: "pie",
          radius: ["55%", "75%"], // ✅ 도넛
          avoidLabelOverlap: true,
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
          data: moodPieData,
        },
      ],
    };
  }, [moodPieData]);

  const snackOption = useMemo(() => {
    return {
      tooltip: { trigger: "item" },
      legend: { top: 0 },
      series: [
        {
          name: "Snack",
          type: "pie",
          radius: ["55%", "75%"],
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 14, fontWeight: "bold" } },
          data: snackPieData,
        },
      ],
    };
  }, [snackPieData]);

  return (
    <div className={styles.donut_wrap}>
      {/* (선택) 색상 변경 UI - 무드 */}

      <div className={styles.chart_grid}>
        <div>
          <div className={styles.controls}>
            {MOODS.map((m) => (
              <label key={m.key} className={styles.colorRow}>
                <span>{m.label}</span>
                <input
                  type="color"
                  value={moodColor[m.key]}
                  onChange={(e) =>
                    setMoodColor((prev) => ({
                      ...prev,
                      [m.key]: e.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>
          <div className={styles.chart_card}>
            <h3>Weekly Mood (Total)</h3>
            <ReactECharts
              option={moodOption}
              style={{ height: 320, width: "100%" }}
            />
          </div>
        </div>
        <div>
          <div className={styles.controls}>
            {snackData.map((s) => (
              <label key={s.name} className={styles.colorRow}>
                <span>{s.name}</span>
                <input
                  type="color"
                  value={snackColors[s.name] ?? "#10B981"}
                  onChange={(e) =>
                    setSnackColors((prev) => ({
                      ...prev,
                      [s.name]: e.target.value,
                    }))
                  }
                  aria-label={`${s.name} 색상 변경`}
                />
              </label>
            ))}
          </div>
          <div className={styles.chart_card}>
            <h3>Popular Snack Brands</h3>
            <ReactECharts
              option={snackOption}
              style={{ height: 320, width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
