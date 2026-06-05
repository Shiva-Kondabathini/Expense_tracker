import { useEffect, useMemo, useState } from "react";
import StatCard from "@/shared/components/ui/StatCard";
import Card from "@/shared/components/ui/Card";
import ExpensePieChart from "@/shared/components/charts/ExpensePieChart";
import MonthlyExpenseChart from "@/shared/components/charts/MonthlyExpenseChart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectExpenses } from "@/features/expenses/selectors";
import { fetchExpenses } from "@/features/expenses/expensesSlice";
import { formatCurrency } from "@/shared/utils/currency";

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

type MonthReport = {
  month: string;
  amount: number;
  key: string;
  year: number;
  monthIndex: number;
};

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
      new Set(
        expenses
          .map((expense) => new Date(expense.date))
          .filter((date) => !Number.isNaN(date.getTime()))
          .map((date) => date.toDateString()),
      ).size,
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

  const monthReports = useMemo(() => {
    const grouped = expenses.reduce<Record<string, MonthReport>>(
      (acc, expense) => {
        const date = new Date(expense.date);
        if (Number.isNaN(date.getTime())) return acc;

        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!acc[key]) {
          acc[key] = {
            month: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
            amount: 0,
            key,
            year: date.getFullYear(),
            monthIndex: date.getMonth(),
          };
        }

        acc[key].amount += expense.amount;
        return acc;
      },
      {},
    );

    return Object.values(grouped).sort((a, b) => {
      if (a.year === b.year) return a.monthIndex - b.monthIndex;
      return a.year - b.year;
    });
  }, [expenses]);

  const availableYears = useMemo(
    () =>
      Array.from(new Set(monthReports.map((item) => item.year)))
        .sort((a, b) => b - a)
        .map((year) => year.toString()),
    [monthReports],
  );

  const monthsByYear = useMemo(
    () =>
      monthReports.reduce<Record<string, MonthReport[]>>((acc, item) => {
        const yearKey = item.year.toString();
        if (!acc[yearKey]) acc[yearKey] = [];
        acc[yearKey].push(item);
        return acc;
      }, {}),
    [monthReports],
  );

  const effectiveSelectedYear = selectedYear || availableYears[0] || "";
  const monthOptions = monthsByYear[effectiveSelectedYear] || [];
  const effectiveSelectedMonthKey =
    selectedMonthKey || monthOptions[monthOptions.length - 1]?.key || "";
  const effectiveMonthLabel =
    monthOptions.find((item) => item.key === effectiveSelectedMonthKey)
      ?.month ?? "selected month";

  const yearlyChartData = useMemo(() => {
    const year = Number(effectiveSelectedYear);
    if (!year || !availableYears.includes(effectiveSelectedYear)) return [];

    const baseline = Array.from({ length: 12 }, (_, index) => ({
      month: `${MONTHS[index]} ${year}`,
      amount: 0,
      key: `${year}-${index}`,
      year,
      monthIndex: index,
    }));

    const monthMap = new Map<number, MonthReport>(
      monthOptions.map((item) => [item.monthIndex, item]),
    );

    return baseline.map((item) => monthMap.get(item.monthIndex) ?? item);
  }, [availableYears, effectiveSelectedYear, monthOptions]);

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
    const lastMonth = monthReports[monthReports.length - 2]?.amount ?? 0;
    const currentMonth = monthReports[monthReports.length - 1]?.amount ?? 0;

    if (!lastMonth) return 0;
    return Math.round(((currentMonth - lastMonth) / lastMonth) * 100);
  }, [monthReports]);

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
          title="Total spend across all expenses"
          value={formatCurrency(totalExpenses)}
          change={`${transactionCount} transactions in your account`}
        />
        <StatCard
          title="Average spend per active day"
          value={formatCurrency(averageDailySpend)}
          change={`Calculated from ${uniqueSpendDays} days with expenses`}
        />
        <StatCard
          title="Latest monthly change"
          value={`${monthlyChange >= 0 ? "+" : ""}${monthlyChange}%`}
          change="Most recent month vs the month before it"
        />
        <StatCard
          title="Average amount per expense"
          value={formatCurrency(averageExpense)}
          change="Total spend divided by all transactions"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Filter monthly analysis by year and month
            </p>
            <h2 className="text-xl font-semibold text-white">
              Selected reporting period
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex flex-col text-sm text-slate-300">
              <span className="mb-2 text-slate-400">Year</span>
              <select
                value={effectiveSelectedYear}
                onChange={(event) => {
                  setSelectedYear(event.target.value);
                  setSelectedMonthKey(
                    monthsByYear[event.target.value]?.[
                      monthsByYear[event.target.value].length - 1
                    ]?.key || "",
                  );
                }}
                className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white outline-none"
              >
                {availableYears.map((year) => (
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
                {monthOptions.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.month}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Detailed report for selected month
            </p>
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
            title={`Total spend in ${effectiveMonthLabel}`}
            value={formatCurrency(selectedMonthTotal)}
            change="Sum of all expenses in this month"
          />
          <StatCard
            title={`Transactions in ${effectiveMonthLabel}`}
            value={selectedMonthTransactions.toString()}
            change="Number of expenses recorded"
          />
          <StatCard
            title={`Average expense in ${effectiveMonthLabel}`}
            value={formatCurrency(selectedMonthAvg)}
            change="Month total divided by transactions"
          />
          <StatCard
            title={`Largest expense in ${effectiveMonthLabel}`}
            value={formatCurrency(selectedMonthLargest.amount)}
            change={selectedMonthLargest.title}
          />
        </div>

        <div className="mt-6">
          <ExpensePieChart
            title={`Category split for ${effectiveMonthLabel}`}
            description="Shows how the selected month's total spend is distributed across categories."
            emptyMessage={`No category spending recorded for ${effectiveMonthLabel}.`}
            data={selectedMonthCategoryData}
          />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="xl:col-span-2">
          <MonthlyExpenseChart
            title={`Monthly spending trend for ${effectiveSelectedYear || "selected year"}`}
            description="Each bar represents the total amount spent in one calendar month for the selected year."
            emptyMessage={`No monthly spending recorded for ${effectiveSelectedYear || "this year"}.`}
            data={yearlyChartData}
          />
        </div>

        <div className="xl:col-span-1 space-y-6">
          <ExpensePieChart
            title="Category split across all expenses"
            description="Shows each category's share of your total recorded spending history."
            emptyMessage="No category spending available yet."
            data={categoryData}
          />
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Full history by category
            </p>
            <h2 className="text-xl font-semibold text-white">
              Totals, counts, averages, and share of spend
            </h2>
          </div>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
            {categoryPerformance.length} categories
          </span>
        </div>

        <div className="mt-6 hidden overflow-hidden rounded-lg border border-slate-800 bg-slate-950 md:block">
          <div className="grid grid-cols-12 gap-4 border-b border-slate-800 px-4 py-3 text-sm uppercase tracking-wide text-slate-500">
            <div className="col-span-5">Category</div>
            <div className="col-span-2 text-right">Total spend</div>
            <div className="col-span-2 text-right">Transactions</div>
            <div className="col-span-2 text-right">Avg. spend</div>
            <div className="col-span-1 text-right">Share</div>
          </div>
          {categoryPerformance.map((category) => (
            <div
              key={category.name}
              className="grid grid-cols-12 gap-4 px-4 py-4 text-sm text-slate-200"
            >
              <div className="col-span-5">{category.name}</div>
              <div className="col-span-2 text-right">
                {formatCurrency(category.total)}
              </div>
              <div className="col-span-2 text-right">{category.count}</div>
              <div className="col-span-2 text-right">
                {formatCurrency(category.average)}
              </div>
              <div className="col-span-1 text-right">
                {(category.share * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 md:hidden">
          {categoryPerformance.length ? (
            categoryPerformance.map((category) => (
              <div
                key={category.name}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">{category.name}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {(category.share * 100).toFixed(1)}% of all spending
                    </p>
                  </div>
                  <p className="shrink-0 text-right font-semibold text-white">
                    {formatCurrency(category.total)}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-900 p-3">
                    <p className="text-slate-500">Transactions</p>
                    <p className="mt-1 font-medium text-slate-200">
                      {category.count}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-3">
                    <p className="text-slate-500">Avg. spend</p>
                    <p className="mt-1 font-medium text-slate-200">
                      {formatCurrency(category.average)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-slate-800 bg-slate-950 p-6 text-center text-sm text-slate-400">
              No category performance data available yet.
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-400">
            Biggest transaction across all expenses
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {biggestTransaction.title}
          </p>
          <p className="text-sm text-slate-500">
            {formatCurrency(biggestTransaction.amount)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-400">
            Highest spending category across all expenses
          </p>
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
