"use client";

import { GET_COFFEE_CONSUMPTION, GET_SNACK_IMPACT } from "@/libs/chart";
import { useQueries } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import EChartsReact from "echarts-for-react";
import styles from "../styles/components.module.scss";

/** ===== API 응답 타입 ===== */
type CoffeeApi = {
  teams: Array<{
    team: string;
    series: Array<{
      cups: number;
      bugs: number;
      productivity: number;
    }>;
  }>;
};

type SnackApi = {
  departments: Array<{
    name: string;
    metrics: Array<{
      snacks: number;
      meetingsMissed: number;
      morale: number;
    }>;
  }>;
};

/** ===== 색상 팔레트 ===== */
const TEAM_PALETTE = [
  "#4F46E5",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#A855F7",
  "#EC4899",
];

function uniqueSorted(nums: number[]) {
  return Array.from(new Set(nums)).sort((a, b) => a - b);
}

function buildMap<T extends Record<string, number>>(
  list: T[],
  xKey: keyof T
): Map<number, T> {
  const m = new Map<number, T>();
  for (const item of list) m.set(Number(item[xKey]), item);
  return m;
}

export default function MultiLineChart() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const results = useQueries({
    queries: [
      {
        queryKey: ["coffeeConsumption"],
        queryFn: GET_COFFEE_CONSUMPTION,
        enabled: !type || type === "멀티라인",
      },
      {
        queryKey: ["snackImpact"],
        queryFn: GET_SNACK_IMPACT,
        enabled: !type || type === "멀티라인",
      },
    ],
  });

  const coffee = (results[0].data ?? null) as CoffeeApi | null;
  const snack = (results[1].data ?? null) as SnackApi | null;

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  /** ===== 커피 팀 / 스낵 부서 분리 ===== */
  const coffeeTeams = useMemo(
    () => coffee?.teams?.map((x) => x.team) ?? [],
    [coffee]
  );
  const snackDepts = useMemo(
    () => snack?.departments?.map((x) => x.name) ?? [],
    [snack]
  );

  /** ===== 색상 state 분리(핵심) ===== */
  const [coffeeColors, setCoffeeColors] = useState<Record<string, string>>({});
  const [snackColors, setSnackColors] = useState<Record<string, string>>({});

  /** ===== hover 그룹도 분리(더 안전) ===== */
  const [hoverCoffeeGroup, setHoverCoffeeGroup] = useState<string | null>(null);
  const [hoverSnackGroup, setHoverSnackGroup] = useState<string | null>(null);

  /** ===== 초기 색상 자동 배정 ===== */
  useEffect(() => {
    if (!coffeeTeams.length) return;
    setCoffeeColors((prev) => {
      const next = { ...prev };
      coffeeTeams.forEach((name, idx) => {
        if (!next[name]) next[name] = TEAM_PALETTE[idx % TEAM_PALETTE.length];
      });
      return next;
    });
  }, [coffeeTeams]);

  useEffect(() => {
    if (!snackDepts.length) return;
    setSnackColors((prev) => {
      const next = { ...prev };
      snackDepts.forEach((name, idx) => {
        if (!next[name]) next[name] = TEAM_PALETTE[idx % TEAM_PALETTE.length];
      });
      return next;
    });
  }, [snackDepts]);

  /** =========================
   * 커피 차트 옵션
   * X: cups
   * 좌Y: bugs
   * 우Y: productivity
   * ========================= */
  const coffeeOption = useMemo(() => {
    const teams = coffee?.teams ?? [];
    const xValues = uniqueSorted(
      teams.flatMap((t) => t.series.map((s) => s.cups))
    );

    const series = teams.flatMap((t) => {
      const color = coffeeColors[t.team] ?? "#999999";
      const map = buildMap(t.series, "cups");

      const bugsData = xValues.map((x) => map.get(x)?.bugs ?? null);
      const prodData = xValues.map((x) => map.get(x)?.productivity ?? null);

      return [
        {
          name: `${t.team} - Bugs`,
          type: "line",
          yAxisIndex: 0,
          showSymbol: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { type: "solid", width: 2 },
          itemStyle: { color },
          data: bugsData,
          emphasis: { focus: "series" },
        },
        {
          name: `${t.team} - Productivity`,
          type: "line",
          yAxisIndex: 1,
          showSymbol: true,
          symbol: "rect",
          symbolSize: 8,
          lineStyle: { type: "dashed", width: 2 },
          itemStyle: { color },
          data: prodData,
          emphasis: { focus: "series" },
        },
      ];
    });

    return {
      tooltip: {
        trigger: "axis",
        formatter: (params: any[]) => {
          const x = params?.[0]?.axisValue;
          const group =
            hoverCoffeeGroup ?? params?.[0]?.seriesName?.split(" - ")[0];

          const filtered = params.filter((p) =>
            String(p.seriesName).startsWith(`${group} - `)
          );

          const lines = filtered
            .map((p) => {
              const metric = String(p.seriesName).split(" - ")[1];
              return `${p.marker} ${metric}: ${p.data ?? "-"}`;
            })
            .join("<br/>");

          return `<b>${group}</b><br/>커피(잔/일): ${x}<br/>${lines}`;
        },
      },
      legend: { top: 0, type: "scroll" },
      grid: { left: 60, right: 60, top: 50, bottom: 40 },
      xAxis: { type: "category", name: "커피(잔/일)", data: xValues },
      yAxis: [
        { type: "value", name: "Bugs" },
        { type: "value", name: "Productivity" },
      ],
      series,
    };
  }, [coffee, coffeeColors, hoverCoffeeGroup]);

  /** =========================
   * 스낵 차트 옵션
   * X: snacks
   * 좌Y: meetingsMissed
   * 우Y: morale
   * ========================= */
  const snackOption = useMemo(() => {
    const deps = snack?.departments ?? [];
    const xValues = uniqueSorted(
      deps.flatMap((d) => d.metrics.map((m) => m.snacks))
    );

    const series = deps.flatMap((d) => {
      const color = snackColors[d.name] ?? "#999999";
      const map = buildMap(d.metrics, "snacks");

      const missData = xValues.map((x) => map.get(x)?.meetingsMissed ?? null);
      const moraleData = xValues.map((x) => map.get(x)?.morale ?? null);

      return [
        {
          name: `${d.name} - Meetings Missed`,
          type: "line",
          yAxisIndex: 0,
          showSymbol: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { type: "solid", width: 2 },
          itemStyle: { color },
          data: missData,
          emphasis: { focus: "series" },
        },
        {
          name: `${d.name} - Morale`,
          type: "line",
          yAxisIndex: 1,
          showSymbol: true,
          symbol: "rect",
          symbolSize: 8,
          lineStyle: { type: "dashed", width: 2 },
          itemStyle: { color },
          data: moraleData,
          emphasis: { focus: "series" },
        },
      ];
    });

    return {
      tooltip: {
        trigger: "axis",
        formatter: (params: any[]) => {
          const x = params?.[0]?.axisValue;
          const group =
            hoverSnackGroup ?? params?.[0]?.seriesName?.split(" - ")[0];

          const filtered = params.filter((p) =>
            String(p.seriesName).startsWith(`${group} - `)
          );

          const lines = filtered
            .map((p) => {
              const metric = String(p.seriesName).split(" - ")[1];
              return `${p.marker} ${metric}: ${p.data ?? "-"}`;
            })
            .join("<br/>");

          return `<b>${group}</b><br/>스낵 수: ${x}<br/>${lines}`;
        },
      },
      legend: { top: 0, type: "scroll" },
      grid: { left: 60, right: 60, top: 50, bottom: 40 },
      xAxis: { type: "category", name: "스낵 수", data: xValues },
      yAxis: [
        { type: "value", name: "Meetings Missed" },
        { type: "value", name: "Morale" },
      ],
      series,
    };
  }, [snack, snackColors, hoverSnackGroup]);

  /** ===== 이벤트: “호버된 팀만 툴팁” 정확하게 ===== */
  const onCoffeeEvents = useMemo(
    () => ({
      mouseover: (params: any) => {
        if (params?.seriesName) {
          setHoverCoffeeGroup(String(params.seriesName).split(" - ")[0]);
        }
      },
      globalout: () => setHoverCoffeeGroup(null),
    }),
    []
  );

  const onSnackEvents = useMemo(
    () => ({
      mouseover: (params: any) => {
        if (params?.seriesName) {
          setHoverSnackGroup(String(params.seriesName).split(" - ")[0]);
        }
      },
      globalout: () => setHoverSnackGroup(null),
    }),
    []
  );

  if (isLoading) return <div>로딩중...</div>;
  if (isError) return <div>데이터 로딩 실패</div>;

  return (
    <div className={styles.bar_chart}>
      {/* ✅ 커피 색상 변경 */}
      <div className={styles.controls}>
        {coffeeTeams.map((name) => (
          <label key={name} className={styles.colorRow}>
            <span>{name}</span>
            <input
              type="color"
              value={coffeeColors[name] ?? "#999999"}
              onChange={(e) =>
                setCoffeeColors((prev) => ({ ...prev, [name]: e.target.value }))
              }
              aria-label={`${name} 색상 변경`}
            />
          </label>
        ))}
      </div>

      <div className={styles.chart}>
        <h3>Coffee Consumption (Multi-line, Dual Y)</h3>
        <EChartsReact
          option={coffeeOption}
          style={{ height: 380, width: "100%" }}
          notMerge
          onEvents={onCoffeeEvents}
        />
      </div>

      {/* ✅ 스낵 색상 변경 */}
      <div className={styles.controls}>
        {snackDepts.map((name) => (
          <label key={name} className={styles.colorRow}>
            <span>{name}</span>
            <input
              type="color"
              value={snackColors[name] ?? "#999999"}
              onChange={(e) =>
                setSnackColors((prev) => ({ ...prev, [name]: e.target.value }))
              }
              aria-label={`${name} 색상 변경`}
            />
          </label>
        ))}
      </div>

      <div className={styles.chart}>
        <h3>Snack Impact (Multi-line, Dual Y)</h3>
        <EChartsReact
          option={snackOption}
          style={{ height: 380, width: "100%" }}
          notMerge
          onEvents={onSnackEvents}
        />
      </div>
    </div>
  );
}
