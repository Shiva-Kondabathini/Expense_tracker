import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Legend } from "recharts";
import Card from "@/shared/components/ui/Card";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

interface ExpensePieChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const ExpensePieChart = ({ data }: ExpensePieChartProps) => {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-semibold">Expense Categories</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Legend />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(value) => [`₹${value as number}`, "Amount"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ExpensePieChart;
