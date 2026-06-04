import { memo, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import Card from "@/shared/components/ui/Card";
import { formatCurrency } from "@/shared/utils/currency";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  payload,
}: any) => {
  if (percent < 0.08) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.62;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
    >
      {`${payload.name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface ExpensePieChartProps {
  title?: string;
  description?: string;
  emptyMessage?: string;
  data: {
    name: string;
    value: number;
  }[];
}

const ExpensePieChart = ({
  data,
  title = "Expense Categories",
  description,
  emptyMessage = "No category spending yet",
}: ExpensePieChartProps) => {
  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data],
  );

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

      <div className="h-80">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={84}
                label={renderCustomLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  formatCurrency(value as number),
                  "Amount",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-950 text-sm text-slate-400">
            {emptyMessage}
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-2 md:hidden">
        {data.map((entry, index) => (
          <div
            key={entry.name}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-200"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{entry.name}</span>
            </div>
            <div className="text-right">
              <div>{formatCurrency(entry.value)}</div>
              <div className="text-xs text-slate-400">
                {((entry.value / Math.max(total, 1)) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default memo(ExpensePieChart);
