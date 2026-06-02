import { useEffect, useMemo, useState } from "react";
import StatCard from "@/shared/components/ui/StatCard";
import Card from "@/shared/components/ui/Card";
import ExpensePieChart from "@/shared/components/charts/ExpensePieChart";
import MonthlyExpenseChart from "@/shared/components/charts/MonthlyExpenseChart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectExpenses } from "@/features/expenses/selectors";
import { fetchExpenses } from "@/features/expenses/expensesSlice";

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

const AnalyticsPage = () => {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(selectExpenses);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonthKey, setSelectedMonthKey] = useState("");

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  const transactionCount = expenses.length;

  const uniqueSpendDays = useMemo(
    () =>
      new Set(expenses.map((expense) => new Date(expense.date).toDateString()))
        .size,
    [expenses],
  );

  const averageExpense = useMemo(
    () => (transactionCount ? Math.round(totalExpenses / transactionCount) : 0),
    [totalExpenses, transactionCount],
  );

  const averageDailySpend = useMemo(
    () => (uniqueSpendDays ? Math.round(totalExpenses / uniqueSpendDays) : 0),
    [totalExpenses, uniqueSpendDays],
  );

  const categoryData = useMemo(() => {
    const totals = expenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const categoryPerformance = useMemo(() => {
    const stats = expenses.reduce<
      Record<string, { total: number; count: number }>
    >((acc, expense) => {
      const existing = acc[expense.category] ?? { total: 0, count: 0 };
      existing.total += expense.amount;
      existing.count += 1;
      acc[expense.category] = existing;
      return acc;
    }, {});

    return Object.entries(stats)
      .map(([name, { total, count }]) => ({
        name,
        total,
        count,
        average: Math.round(total / count),
        share: total / Math.max(totalExpenses, 1),
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenses, totalExpenses]);

  const monthlyData = useMemo(() => {
    const now = new Date();
    const window = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        month: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
        amount: 0,
        key: `${date.getFullYear()}-${date.getMonth()}`,
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
      };
    });

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (Number.isNaN(date.getTime())) return;

      const item = window.find(
        (monthItem) =>
          monthItem.key === `${date.getFullYear()}-${date.getMonth()}`,
      );

      if (item) {
        item.amount += expense.amount;
      }
    });

    return window.map(({ month, amount, key, year, monthIndex }) => ({
      month,
      amount,
      key,
      year,
      monthIndex,
    }));
  }, [expenses]);

  const monthReports = useMemo(
    () =>
      monthlyData.map((item, index) => {
        const previousAmount = monthlyData[index - 1]?.amount ?? 0;
        const change = previousAmount
          ? Math.round(((item.amount - previousAmount) / previousAmount) * 100)
          : 0;

        return {
          ...item,
          change,
          share: totalExpenses ? (item.amount / totalExpenses) * 100 : 0,
        };
      }),
    [monthlyData, totalExpenses],
  );

  const defaultMonthData = monthReports[monthReports.length - 1];
  const effectiveSelectedYear =
    selectedYear || defaultMonthData?.year.toString() || "";
  const effectiveSelectedMonthKey =
    selectedMonthKey || defaultMonthData?.key || "";

  const selectedMonthData = useMemo(
    () => monthReports.find((item) => item.key === effectiveSelectedMonthKey),
    [monthReports, effectiveSelectedMonthKey],
  );

  const selectedMonthExpenses = useMemo(
    () =>
      expenses.filter((expense) => {
        const date = new Date(expense.date);
        if (Number.isNaN(date.getTime())) return false;
        return (
          `${date.getFullYear()}-${date.getMonth()}` ===
          effectiveSelectedMonthKey
        );
      }),
    [expenses, effectiveSelectedMonthKey],
  );

  const selectedMonthCategoryData = useMemo(() => {
    const totals = selectedMonthExpenses.reduce<Record<string, number>>(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {},
    );

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [selectedMonthExpenses]);

  const selectedMonthTotal = useMemo(
    () =>
      selectedMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [selectedMonthExpenses],
  );

  const selectedMonthTransactions = selectedMonthExpenses.length;

  const selectedMonthAvg = useMemo(
    () =>
      selectedMonthTransactions
        ? Math.round(selectedMonthTotal / selectedMonthTransactions)
        : 0,
    [selectedMonthTotal, selectedMonthTransactions],
  );

  const selectedMonthLargest = useMemo(
    () =>
      selectedMonthExpenses.reduce(
        (max, expense) => (expense.amount > max.amount ? expense : max),
        { amount: 0, title: "N/A", category: "N/A", date: "" },
      ),
    [selectedMonthExpenses],
  );

  const monthlyChange = useMemo(() => {
    const lastMonth = monthlyData[monthlyData.length - 2]?.amount ?? 0;
    const currentMonth = monthlyData[monthlyData.length - 1]?.amount ?? 0;

    if (!lastMonth) return 0;
    return Math.round(((currentMonth - lastMonth) / lastMonth) * 100);
  }, [monthlyData]);

  const highestCategory = categoryPerformance[0];
  const biggestCategory = highestCategory
    ? `${highestCategory.name} (${(highestCategory.share * 100).toFixed(1)}%)`
    : "N/A";
  const biggestTransaction = useMemo(
    () =>
      expenses.reduce(
        (max, expense) => (expense.amount > max.amount ? expense : max),
        { amount: 0, title: "N/A", category: "N/A", date: "" },
      ),
    [expenses],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Analytics</h1>
          <p className="text-sm text-slate-400">
            See spending trends, category performance, and day-level insights.
          </p>
        </div>
        <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
          {transactionCount} expenses analyzed
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Spend"
          value={`₹${totalExpenses.toLocaleString()}`}
          change={`${transactionCount} transactions`}
        />
        <StatCard
          title="Avg. Daily Spend"
          value={`₹${averageDailySpend.toLocaleString()}`}
          change={`${uniqueSpendDays} active days`}
        />
        <StatCard
          title="Monthly Change"
          value={`${monthlyChange >= 0 ? "+" : ""}${monthlyChange}%`}
          change="vs previous month"
        />
        <StatCard
          title="Avg. Transaction"
          value={`₹${averageExpense.toLocaleString()}`}
          change="Per expense"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Monthly reports</p>
            <h2 className="text-xl font-semibold text-white">
              Month-wise spending
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex flex-col text-sm text-slate-300">
              <span className="mb-2 text-slate-400">Year</span>
              <select
                value={effectiveSelectedYear}
                onChange={(event) => {
                  setSelectedYear(event.target.value);
                  const firstMatch = monthReports.find(
                    (item) => item.year.toString() === event.target.value,
                  );
                  if (firstMatch) {
                    setSelectedMonthKey(firstMatch.key);
                  }
                }}
                className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white outline-none"
              >
                {Array.from(
                  new Set(monthReports.map((item) => item.year.toString())),
                )
                  .sort((a, b) => Number(b) - Number(a))
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </label>
            <label className="flex flex-col text-sm text-slate-300">
              <span className="mb-2 text-slate-400">Month</span>
              <select
                value={effectiveSelectedMonthKey}
                onChange={(event) => setSelectedMonthKey(event.target.value)}
                className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white outline-none"
              >
                {monthReports
                  .filter(
                    (item) => item.year.toString() === effectiveSelectedYear,
                  )
                  .map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.month}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        </div>

        {/* <div className="grid gap-4 lg:grid-cols-3">
          {monthReports.map((month) => (
            <Card key={month.month}>
              <p className="text-sm text-slate-400">{month.month}</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                ₹{month.amount.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">
                {month.change >= 0 ? "+" : ""}
                {month.change}% from prior month
              </p>
              <p className="text-sm text-slate-500">
                {month.share.toFixed(1)}% of total spend
              </p>
            </Card>
          ))}
        </div> */}
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Selected month</p>
            <h2 className="text-xl font-semibold text-white">
              {selectedMonthData?.month ?? "No month selected"}
            </h2>
          </div>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
            {selectedMonthTransactions} expenses
          </span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <StatCard
            title="Month total"
            value={`₹${selectedMonthTotal.toLocaleString()}`}
            change="Total spend"
          />
          <StatCard
            title="Transactions"
            value={selectedMonthTransactions.toString()}
            change="Expense count"
          />
          <StatCard
            title="Avg. expense"
            value={`₹${selectedMonthAvg.toLocaleString()}`}
            change="Per transaction"
          />
          <StatCard
            title="Largest"
            value={`₹${selectedMonthLargest.amount.toLocaleString()}`}
            change="Biggest expense"
          />
        </div>

        <div className="mt-6">
          <p className="text-sm text-slate-400">
            Selected month category split
          </p>
          <div className="mt-6">
            <ExpensePieChart data={selectedMonthCategoryData} />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="xl:col-span-2">
          <MonthlyExpenseChart data={monthlyData} />
        </div>

        <div className="xl:col-span-1 space-y-6">
          <ExpensePieChart data={categoryData} />
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">Category performance</p>
            <h2 className="text-xl font-semibold text-white">
              Expense breakdown
            </h2>
          </div>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
            {categoryPerformance.length} categories
          </span>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
          <div className="grid grid-cols-12 gap-4 border-b border-slate-800 px-4 py-3 text-sm uppercase tracking-wide text-slate-500">
            <div className="col-span-5">Category</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-2 text-right">Count</div>
            <div className="col-span-2 text-right">Average</div>
            <div className="col-span-1 text-right">Share</div>
          </div>
          {categoryPerformance.map((category) => (
            <div
              key={category.name}
              className="grid grid-cols-12 gap-4 px-4 py-4 text-sm text-slate-200"
            >
              <div className="col-span-5">{category.name}</div>
              <div className="col-span-2 text-right">
                ₹{category.total.toLocaleString()}
              </div>
              <div className="col-span-2 text-right">{category.count}</div>
              <div className="col-span-2 text-right">
                ₹{category.average.toLocaleString()}
              </div>
              <div className="col-span-1 text-right">
                {(category.share * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-400">Biggest transaction</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {biggestTransaction.title}
          </p>
          <p className="text-sm text-slate-500">
            ₹{biggestTransaction.amount.toLocaleString()}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">Top category</p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {biggestCategory}
          </p>
          <p className="text-sm text-slate-500">
            {highestCategory?.count ?? 0} expenses
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
