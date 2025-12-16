"use client";

import { GET_MOOD_TREND, GET_WORKOUT_TREND } from "@/libs/chart";
import { useQueries } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import EChartsReact from "echarts-for-react";
import styles from "../styles/components.module.scss";

type MoodKey = "happy" | "tired" | "stressed";
type WorkoutKey = "running" | "cycling" | "stretching";

type MoodRow = {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
};

type WorkoutRow = {
  week: string;
  running: number;
  cycling: number;
  stretching: number;
};

const MOODS: { key: MoodKey; label: string }[] = [
  { key: "happy", label: "Happy" },
  { key: "tired", label: "Tired" },
  { key: "stressed", label: "Stressed" },
];

const WORKOUTS: { key: WorkoutKey; label: string }[] = [
  { key: "running", label: "Running" },
  { key: "cycling", label: "Cycling" },
  { key: "stretching", label: "Stretching" },
];

function toPercentRows<T extends { week: string }>(
  rows: T[],
  keys: (keyof T)[]
) {
  return rows.map((row) => {
    const sum = keys.reduce((acc, k) => acc + (Number(row[k]) || 0), 0);
    const next: Record<string, number | string> = { week: row.week };

    keys.forEach((k) => {
      const value = Number(row[k]) || 0;
      next[String(k)] = sum === 0 ? 0 : +((value / sum) * 100).toFixed(1);
    });

    return next as { week: string } & Record<string, number>;
  });
}

export default function StackBarChart() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  // ✅ 색상 변경 (요구사항 대응)
  const [moodColors, setMoodColors] = useState<Record<MoodKey, string>>({
    happy: "#4F46E5",
    tired: "#F59E0B",
    stressed: "#EF4444",
  });

  const [workoutColors, setWorkoutColors] = useState<
    Record<WorkoutKey, string>
  >({
    running: "#22C55E",
    cycling: "#06B6D4",
    stretching: "#A855F7",
  });

  const results = useQueries({
    queries: [
      {
        queryKey: ["moodTrend"],
        queryFn: GET_MOOD_TREND,
        enabled: !type || type === "스택형바",
      },
      {
        queryKey: ["workOut"],
        queryFn: GET_WORKOUT_TREND,
        enabled: !type || type === "스택형바",
      },
    ],
  });

  const moodRaw = (results[0].data ?? []) as MoodRow[];
  const workoutRaw = (results[1].data ?? []) as WorkoutRow[];

  // ✅ % 변환
  const moodPercent = useMemo(
    () => toPercentRows(moodRaw, ["happy", "tired", "stressed"]),
    [moodRaw]
  );

  const workoutPercent = useMemo(
    () => toPercentRows(workoutRaw, ["running", "cycling", "stretching"]),
    [workoutRaw]
  );

  const moodOption = useMemo(() => {
    return {
      tooltip: {
        trigger: "axis",
        valueFormatter: (v: number) => `${v}%`,
      },
      legend: { top: 0 },
      grid: { left: 50, right: 20, top: 40, bottom: 40 },
      xAxis: {
        type: "category",
        data: moodPercent.map((d) => d.week),
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: { formatter: "{value}%" },
      },
      series: MOODS.map((m) => ({
        name: m.label,
        type: "bar",
        stack: "mood", // ✅ 누적
        barWidth: "50%",
        data: moodPercent.map((d) => d[m.key]),
        itemStyle: { color: moodColors[m.key] },
        emphasis: { focus: "series" },
      })),
    };
  }, [moodPercent, moodColors]);

  const workoutOption = useMemo(() => {
    return {
      tooltip: {
        trigger: "axis",
        valueFormatter: (v: number) => `${v}%`,
      },
      legend: { top: 0 },
      grid: { left: 50, right: 20, top: 40, bottom: 40 },
      xAxis: {
        type: "category",
        data: workoutPercent.map((d) => d.week),
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: { formatter: "{value}%" },
      },
      series: WORKOUTS.map((w) => ({
        name: w.label,
        type: "bar",
        stack: "workout",
        barWidth: "50%",
        data: workoutPercent.map((d) => d[w.key]),
        itemStyle: { color: workoutColors[w.key] },
        emphasis: { focus: "series" },
      })),
    };
  }, [workoutPercent, workoutColors]);

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  if (isLoading) return <div>로딩중...</div>;
  if (isError) return <div>데이터 로딩 실패</div>;

  return (
    <div className={styles.bar_chart}>
      {/* ✅ 무드 색상 변경 */}
      <div className={styles.controls}>
        {MOODS.map((m) => (
          <label key={m.key} className={styles.colorRow}>
            <span>{m.label}</span>
            <input
              type="color"
              value={moodColors[m.key]}
              onChange={(e) =>
                setMoodColors((prev) => ({ ...prev, [m.key]: e.target.value }))
              }
            />
          </label>
        ))}
      </div>

      <div className={styles.chart}>
        <h3>Weekly Mood Trend (Stacked %)</h3>
        <EChartsReact
          option={moodOption}
          style={{ height: 320, width: "100%" }}
          notMerge
        />
      </div>

      {/* ✅ 운동 색상 변경 */}
      <div className={styles.controls}>
        {WORKOUTS.map((w) => (
          <label key={w.key} className={styles.colorRow}>
            <span>{w.label}</span>
            <input
              type="color"
              value={workoutColors[w.key]}
              onChange={(e) =>
                setWorkoutColors((prev) => ({
                  ...prev,
                  [w.key]: e.target.value,
                }))
              }
            />
          </label>
        ))}
      </div>

      <div className={styles.chart}>
        <h3>Weekly Workout Trend (Stacked %)</h3>
        <EChartsReact
          option={workoutOption}
          style={{ height: 320, width: "100%" }}
          notMerge
        />
      </div>
    </div>
  );
}
