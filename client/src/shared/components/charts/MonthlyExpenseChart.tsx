import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import Card from "@/shared/components/ui/Card";
import { formatCurrency } from "@/shared/utils/currency";

const renderMonthTick =
  (isCompact: boolean) =>
  (props: any) => {
    const { x, y, payload } = props;
    const [month, year] = String(payload.value).split(" ");

    return (
      <text
        x={x}
        y={y + 15}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize={isCompact ? 11 : 12}
      >
        {month}
        {year && !isCompact && (
          <tspan x={x} dy="1.2em">
            {year}
          </tspan>
        )}
      </text>
    );
  };

interface MonthlyExpenseChartProps {
  title?: string;
  description?: string;
  emptyMessage?: string;
  data: {
    month: string;
    amount: number;
  }[];
}

const MonthlyExpenseChart = ({
  data,
  title = "Monthly Expenses",
  description,
  emptyMessage = "No monthly spending to chart yet",
}: MonthlyExpenseChartProps) => {
  const hasSpend = data.some((item) => item.amount > 0);
  const [chartWidth, setChartWidth] = useState(0);
  const isLongSeries = data.length > 8;
  const isCompact = chartWidth > 0 && chartWidth < 560;
  const xAxisInterval = isCompact && !isLongSeries && data.length > 6 ? 1 : 0;
  const showBarLabels = !isCompact && !isLongSeries;

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm leading-6 text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div className="h-80 overflow-x-auto overflow-y-hidden pb-2">
        {hasSpend ? (
          <div
            className="h-full"
            style={{
              minWidth: isLongSeries ? `${data.length * 68}px` : "100%",
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
              onResize={(width) => setChartWidth(width)}
            >
              <BarChart
                data={data}
                margin={{
                  top: showBarLabels ? 24 : 12,
                  right: isCompact ? 4 : 16,
                  bottom: 8,
                  left: 0,
                }}
              >
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={renderMonthTick(isCompact)}
                  interval={xAxisInterval}
                  height={isCompact ? 42 : 60}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={12}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value as number)}
                  axisLine={false}
                  tickLine={false}
                  width={isCompact ? 58 : 88}
                />
                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value as number),
                    "Amount",
                  ]}
                />

                <Bar
                  dataKey="amount"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={42}
                  label={
                    showBarLabels
                      ? {
                          position: "top",
                          formatter: (value: any) =>
                            value ? formatCurrency(value as number) : "",
                          fill: "#cbd5e1",
                          fontSize: 12,
                        }
                      : false
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950 text-sm text-slate-400">
            {emptyMessage}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MonthlyExpenseChart;
