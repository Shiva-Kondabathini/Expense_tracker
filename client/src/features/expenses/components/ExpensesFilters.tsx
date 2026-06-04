import { memo } from "react";
import type { ExpenseCategory } from "../types/expense.types";

interface MonthOption {
  value: string;
  label: string;
}

interface ExpenseFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedYear: string;
  selectedMonth: string;
  years: string[];
  monthOptions: MonthOption[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onMonthChange: (value: string) => void;
}

const categories: ExpenseCategory[] = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
];

const ExpenseFilters = ({
  searchTerm,
  selectedCategory,
  selectedYear,
  selectedMonth,
  years,
  monthOptions,
  onSearchChange,
  onCategoryChange,
  onYearChange,
  onMonthChange,
}: ExpenseFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Search expenses..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 min-w-55 w-full md:w-auto rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
      />

      <select
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="w-full md:w-auto rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
      >
        <option value="">All years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className="w-full md:w-auto rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
      >
        <option value="">All months</option>
        {monthOptions.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full md:w-auto rounded-xl border border-slate-700 bg-slate-900 px-4 py-3"
      >
        <option value="">All Categories</option>

        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(ExpenseFilters);
