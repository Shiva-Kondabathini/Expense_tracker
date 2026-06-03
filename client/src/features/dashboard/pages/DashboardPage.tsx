import { useEffect, useMemo } from "react";
import Card from "@/shared/components/ui/Card";
import ExpensePieChart from "@/shared/components/charts/ExpensePieChart";
import MonthlyExpenseChart from "@/shared/components/charts/MonthlyExpenseChart";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectExpenses } from "@/features/expenses/selectors";
import { fetchExpenses } from "@/features/expenses/expensesSlice";
import type {
  Expense,
  ExpenseCategory,
} from "@/features/expenses/types/expense.types";
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

const categoryLabels: ExpenseCategory[] = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
];

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}`;

const getMonthLabel = (date: Date) =>
  `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const getPercentChange = (current: number, previous: number) => {
  if (!previous && current) return 100;
  if (!previous) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

const getChangeCopy = (change: number) => {
  if (!change) return "No change from last month";
  return `${change > 0 ? "+" : ""}${change}% vs last month`;
};

interface DashboardMetricProps {
  label: string;
  value: string;
  helper: string;
  tone?: "neutral" | "good" | "warning";
}

const DashboardMetric = ({
  label,
  value,
  helper,
  tone = "neutral",
}: DashboardMetricProps) => {
  const toneClass =
    tone === "good"
      ? "text-emerald-300"
      : tone === "warning"
        ? "text-amber-300"
        : "text-slate-300";

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className={`mt-3 text-sm ${toneClass}`}>{helper}</p>
    </div>
  );
};

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(selectExpenses);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const now = new Date();
  const currentMonthKey = getMonthKey(now);
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthKey = getMonthKey(previousMonthDate);
  const currentMonthName = getMonthLabel(now);
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();
  const elapsedDays = now.getDate();

  const validExpenses = useMemo(
    () =>
      expenses
        .map((expense) => ({
          expense,
          date: new Date(expense.date),
        }))
        .filter(({ date }) => !Number.isNaN(date.getTime())),
    [expenses],
  );

  const currentMonthExpenses = useMemo(
    () =>
      validExpenses
        .filter(({ date }) => getMonthKey(date) === currentMonthKey)
        .map(({ expense }) => expense),
    [currentMonthKey, validExpenses],
  );

  const previousMonthTotal = useMemo(
    () =>
      validExpenses
        .filter(({ date }) => getMonthKey(date) === previousMonthKey)
        .reduce((sum, { expense }) => sum + expense.amount, 0),
    [previousMonthKey, validExpenses],
  );

  const monthlyData = useMemo(() => {
    const monthWindow = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        key: getMonthKey(date),
        month: getMonthLabel(date),
        amount: 0,
      };
    });

    validExpenses.forEach(({ expense, date }) => {
      const item = monthWindow.find(
        (monthItem) => monthItem.key === getMonthKey(date),
      );

      if (item) {
        item.amount += expense.amount;
      }
    });

    return monthWindow.map(({ month, amount }) => ({ month, amount }));
  }, [now, validExpenses]);

  const currentMonthTotal = useMemo(
    () =>
      currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [currentMonthExpenses],
  );

  const monthChange = getPercentChange(currentMonthTotal, previousMonthTotal);
  const dailyAverage = Math.round(currentMonthTotal / Math.max(elapsedDays, 1));
  const projectedMonthTotal = dailyAverage * daysInMonth;

  const categoryData = useMemo(() => {
    const totals = categoryLabels.reduce<Record<string, number>>(
      (acc, category) => {
        acc[category] = 0;
        return acc;
      },
      {},
    );

    currentMonthExpenses.forEach((expense) => {
      totals[expense.category] =
        (totals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(totals)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [currentMonthExpenses]);

  const topCategory = categoryData[0];
  const topCategoryShare = topCategory
    ? Math.round((topCategory.value / Math.max(currentMonthTotal, 1)) * 100)
    : 0;

  const averageTransaction = currentMonthExpenses.length
    ? Math.round(currentMonthTotal / currentMonthExpenses.length)
    : 0;

  const largestExpense = useMemo(
    () =>
      currentMonthExpenses.reduce<Expense | null>(
        (largest, expense) =>
          !largest || expense.amount > largest.amount ? expense : largest,
        null,
      ),
    [currentMonthExpenses],
  );

  const recentExpenses = useMemo(
    () =>
      [...expenses]
        .filter((expense) => !Number.isNaN(new Date(expense.date).getTime()))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        .slice(0, 6),
    [expenses],
  );

  const insightCards = [
    {
      title: "Spending direction",
      body:
        previousMonthTotal === 0
          ? "This is your first comparable month, so trends will improve as you add more expenses."
          : monthChange > 0
            ? `You have spent ${formatCurrency(
                currentMonthTotal - previousMonthTotal,
              )} more than last month so far.`
            : `You are ${formatCurrency(
                previousMonthTotal - currentMonthTotal,
              )} below last month's spend.`,
    },
    {
      title: "Category focus",
      body: topCategory
        ? `${topCategory.name} is ${topCategoryShare}% of this month's spend.`
        : "No category data for this month yet.",
    },
    {
      title: "Largest purchase",
      body: largestExpense
        ? `${largestExpense.title} was your biggest item at ${formatCurrency(
            largestExpense.amount,
          )}.`
        : "No purchases recorded this month.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-300">{currentMonthName}</p>
          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Spending dashboard
          </h1>
        </div>
        <p className="max-w-xl text-sm text-slate-400">
          Track your current month, compare it with recent behavior, and spot
          the categories driving your cash outflow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetric
          label={`Total spent in ${currentMonthName}`}
          value={formatCurrency(currentMonthTotal)}
          helper={`${getChangeCopy(monthChange)} (${getMonthLabel(
            previousMonthDate,
          )})`}
          tone={monthChange > 0 ? "warning" : "good"}
        />
        <DashboardMetric
          label={`Projected spend by ${MONTHS[now.getMonth()]} ${daysInMonth}`}
          value={formatCurrency(projectedMonthTotal)}
          helper={`${formatCurrency(dailyAverage)} average per day so far`}
          tone={projectedMonthTotal > previousMonthTotal ? "warning" : "good"}
        />
        <DashboardMetric
          label={`Average expense in ${currentMonthName}`}
          value={formatCurrency(averageTransaction)}
          helper={`Based on ${currentMonthExpenses.length} recorded expenses`}
        />
        <DashboardMetric
          label={`Largest category in ${currentMonthName}`}
          value={topCategory?.name ?? "No spend"}
          helper={
            topCategory
              ? `${formatCurrency(topCategory.value)} (${topCategoryShare}% of this month)`
              : "Add expenses to see category mix"
          }
          tone={topCategoryShare >= 45 ? "warning" : "neutral"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MonthlyExpenseChart
            title="Expense trend for the last 6 months"
            description={`Monthly totals from ${monthlyData[0]?.month ?? "the selected period"} to ${
              monthlyData[monthlyData.length - 1]?.month ?? currentMonthName
            }. Bars show total money spent in each calendar month.`}
            emptyMessage="No expenses recorded in the last 6 months."
            data={monthlyData}
          />
        </div>
        <div className="xl:col-span-1">
          <ExpensePieChart
            title={`Category split for ${currentMonthName}`}
            description="Share of this month's spending grouped by expense category."
            emptyMessage={`No category spending recorded for ${currentMonthName}.`}
            data={categoryData}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Insights for {currentMonthName}
              </p>
              <h2 className="text-xl font-semibold text-white">
                What needs attention
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {insightCards.map((insight) => (
              <div
                key={insight.title}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <p className="text-sm font-medium text-white">
                  {insight.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {insight.body}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">{currentMonthName}</p>
              <h2 className="text-xl font-semibold text-white">
                Category totals and share
              </h2>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {categoryData.length} categories
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {categoryData.length ? (
              categoryData.map((category) => {
                const share = Math.round(
                  (category.value / Math.max(currentMonthTotal, 1)) * 100,
                );

                return (
                  <div key={category.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-white">
                        {category.name}
                      </span>
                      <span className="text-slate-400">
                        {formatCurrency(category.value)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400">
                No spending recorded for this month yet.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">All recorded expenses</p>
              <h2 className="text-xl font-semibold text-white">
                6 most recent transactions
              </h2>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {expenses.length} total
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {recentExpenses.length ? (
              recentExpenses.map((expense) => (
                <div
                  key={
                    expense.id ?? expense._id ?? `${expense.title}-${expense.date}`
                  }
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">
                      {expense.title}
                    </p>
                    <p className="text-sm text-slate-400">
                      {expense.category} - {formatDate(expense.date)}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-white">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                Add expenses to populate your activity feed.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
