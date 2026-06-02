import { useEffect, useMemo } from "react";
import StatCard from "@/shared/components/ui/StatCard";
import Card from "@/shared/components/ui/Card";
import ExpensePieChart from "@/shared/components/charts/ExpensePieChart";
import MonthlyExpenseChart from "@/shared/components/charts/MonthlyExpenseChart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectExpenses } from "@/features/expenses/selectors";
import { fetchExpenses } from "@/features/expenses/expensesSlice";
import type { ExpenseCategory } from "@/features/expenses/types/expense.types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const categoryLabels: ExpenseCategory[] = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
];

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(selectExpenses);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const categoryData = useMemo(() => {
    const totals = categoryLabels.reduce<Record<string, number>>(
      (acc, category) => {
        acc[category] = 0;
        return acc;
      },
      {},
    );

    expenses.forEach((expense) => {
      totals[expense.category] =
        (totals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(totals)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const window = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        month: MONTHS[date.getMonth()],
        year: date.getFullYear(),
        amount: 0,
      };
    });

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (Number.isNaN(date.getTime())) return;

      const item = window.find(
        (monthItem) =>
          monthItem.month === MONTHS[date.getMonth()] &&
          monthItem.year === date.getFullYear(),
      );

      if (item) {
        item.amount += expense.amount;
      }
    });

    return window.map(({ month, amount }) => ({ month, amount }));
  }, [expenses]);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  const averageExpense = useMemo(
    () => (expenses.length ? Math.round(totalExpenses / expenses.length) : 0),
    [totalExpenses, expenses.length],
  );

  const topCategory = categoryData[0]?.name || "N/A";
  const topCategoryValue = categoryData[0]?.value || 0;

  const currentMonth = new Date().toLocaleString("default", { month: "short" });
  const currentMonthTotal =
    monthlyData.find((item) => item.month === currentMonth)?.amount ?? 0;
  const lastMonthTotal = monthlyData[monthlyData.length - 2]?.amount ?? 0;
  const monthChange = lastMonthTotal
    ? Math.round(((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100)
    : 0;

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Overview of your latest spending and categories
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={`This ${currentMonth}`}
          value={`₹${currentMonthTotal.toLocaleString()}`}
          change={`${monthChange >= 0 ? "+" : ""}${monthChange}% from last month`}
        />

        <StatCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString()}`}
          change={`${expenses.length} transactions`}
        />

        <StatCard
          title="Avg. Expense"
          value={`₹${averageExpense.toLocaleString()}`}
          change="Per transaction"
        />

        <StatCard
          title="Top Category"
          value={topCategory}
          change={`₹${topCategoryValue.toLocaleString()}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <ExpensePieChart data={categoryData} />
        </div>
        <div className="xl:col-span-2">
          <MonthlyExpenseChart data={monthlyData} />
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Recent Transactions</p>
            <h2 className="text-xl font-semibold text-white">
              Latest activity
            </h2>
          </div>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
            {expenses.length} total
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {recentExpenses.length ? (
            recentExpenses.map((expense) => (
              <div
                key={expense.id ?? expense._id ?? expense.title + expense.date}
                className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-950 p-4"
              >
                <div>
                  <p className="font-medium text-white">{expense.title}</p>
                  <p className="text-sm text-slate-400">{expense.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    ₹{expense.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              No recent transactions available.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
