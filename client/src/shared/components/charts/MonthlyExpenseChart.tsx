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

interface MonthlyExpenseChartProps {
  data: {
    month: string;
    amount: number;
  }[];
}

const MonthlyExpenseChart = ({ data }: MonthlyExpenseChartProps) => {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-semibold">Monthly Expenses</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value as number}`, "Amount"]} />

            <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MonthlyExpenseChart;
