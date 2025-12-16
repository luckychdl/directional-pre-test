"use client";

import { useQueries } from "@tanstack/react-query";
import styles from "../styles/components.module.scss";
import React, { useEffect, useMemo, useState } from "react";
import EChartsReact from "echarts-for-react";
import { GET_MOOD_TREND, GET_SNACK_BRANDS } from "@/libs/chart";
import { useSearchParams } from "next/navigation";

type MoodKey = "happy" | "tired" | "stressed";
type MoodRow = { week: string; happy: number; tired: number; stressed: number };
type SnackRow = { name: string; share: number };

const MOODS: { key: MoodKey; label: string }[] = [
  { key: "happy", label: "Happy" },
  { key: "tired", label: "Tired" },
  { key: "stressed", label: "Stressed" },
];

const SNACK_COLOR_PALETTE = [
  "#4F46E5",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#A855F7",
  "#EC4899",
];

export default function BarChart() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  // ✅ 무드 색상
  const [seriesColor, setSeriesColor] = useState<Record<MoodKey, string>>({
    happy: "#4F46E5",
    tired: "#F59E0B",
    stressed: "#EF4444",
  });

  // ✅ 스낵 색상(브랜드별)
  const [snackColors, setSnackColors] = useState<Record<string, string>>({});

  const results = useQueries({
    queries: [
      {
        queryKey: ["moodTrend"],
        queryFn: GET_MOOD_TREND,
        enabled: !type || type === "바차트",
      },
      {
        queryKey: ["snackBrand"],
        queryFn: GET_SNACK_BRANDS,
        enabled: !type || type === "바차트",
      },
    ],
  });

  const moodData = (results[0].data ?? []) as MoodRow[];
  const snackData = (results[1].data ?? []) as SnackRow[];

  // ✅ 스낵 초기색상: 브랜드마다 다르게 자동 배정
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

  const moodOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: { top: 0 },
      grid: { left: 40, right: 20, top: 40, bottom: 40 },
      xAxis: { type: "category", data: moodData.map((d) => d.week) },
      yAxis: { type: "value" },
      series: MOODS.map((m) => ({
        name: m.label,
        type: "bar",
        data: moodData.map((d) => d[m.key]),
        itemStyle: { color: seriesColor[m.key] },
      })),
    }),
    [moodData, seriesColor]
  );

  const snackOption = useMemo(() => {
    const brands = snackData.map((d) => d.name);

    return {
      tooltip: { trigger: "axis" },
      legend: { top: 0 }, // ✅ 이제 브랜드별로 토글됨
      grid: { left: 40, right: 20, top: 40, bottom: 40 },
      xAxis: {
        type: "category",
        data: ["Share"], // ✅ 카테고리 1개로 두고
      },
      yAxis: { type: "value" },
      series: snackData.map((d) => ({
        name: d.name, // ✅ 브랜드명이 series 이름
        type: "bar",
        data: [d.share], // ✅ 1개 값만 넣음
        itemStyle: { color: snackColors[d.name] },
      })),
    };
  }, [snackData, snackColors]);

  return (
    <div className={styles.bar_chart}>
      {/* ✅ 무드 색상 변경 UI */}
      <div className={styles.controls}>
        {MOODS.map((m) => (
          <label key={m.key} className={styles.colorRow}>
            <span>{m.label}</span>
            <input
              type="color"
              value={seriesColor[m.key]}
              onChange={(e) =>
                setSeriesColor((prev) => ({ ...prev, [m.key]: e.target.value }))
              }
            />
          </label>
        ))}
      </div>

      <div className={styles.chart}>
        <h4>Weekly Mood Trend</h4>
        <EChartsReact option={moodOption} style={{ height: 320 }} notMerge />
      </div>

      {/* ✅ 스낵 색상 변경 UI */}
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
            />
          </label>
        ))}
      </div>

      <div className={styles.chart}>
        <h4>Popular Snack Brands</h4>
        <EChartsReact option={snackOption} style={{ height: 320 }} notMerge />
      </div>
    </div>
  );
}
