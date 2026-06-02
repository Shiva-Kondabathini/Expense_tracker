import ExpenseTable from "../components/ExpenseTable";
import toast from "react-hot-toast";

import { useEffect, useMemo, useState } from "react";
import ExpenseFilters from "../components/ExpensesFilters";
import AddExpenseModal from "../components/AddExpensesModal";

import type { Expense } from "../types/expense.types";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";

import {
  getExpenses,
  createExpense,
  updateExpense as updateExpenseApi,
  deleteExpense as deleteExpenseApi,
} from "../services/expenses.service";

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

const ExpensesPage = () => {
  const [apiExpenses, setApiExpenses] = useState<Expense[]>([]);
  const expenses = apiExpenses;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const loadExpenses = async () => {
    try {
      const response = await getExpenses();

      setApiExpenses(
        response.expenses.map((expense: Expense & { _id: string }) => ({
          ...expense,
          id: expense._id,
        })),
      );
    } catch {
      toast.error("Failed to load expenses");
    }
  };

  useEffect(() => {
    void (async () => {
      await loadExpenses();
    })();
  }, []);

  const handleDeleteExpense = async () => {
    if (!selectedExpenseId) return;

    try {
      await deleteExpenseApi(selectedExpenseId);

      toast.success("Expense deleted successfully");

      await loadExpenses();

      setSelectedExpenseId(null);
    } catch {
      toast.error("Failed to delete expense");
    }
  };
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };
  const handleSaveExpense = async (expense: Expense) => {
    try {
      if (editingExpense) {
        await updateExpenseApi(expense.id!, expense);

        toast.success("Expense updated successfully");
      } else {
        await createExpense(expense);

        toast.success("Expense added successfully");
      }

      await loadExpenses();

      setEditingExpense(null);
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save expense");
    }
  };

  const years = useMemo(
    () =>
      Array.from(
        new Set(
          expenses
            .map((expense) => {
              const date = new Date(expense.date);
              return Number.isNaN(date.getTime()) ? null : date.getFullYear();
            })
            .filter((year): year is number => year !== null),
        ),
      )
        .sort((a, b) => b - a)
        .map(String),
    [expenses],
  );

  const monthOptions = useMemo(() => {
    const months = new Set<number>();

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      if (Number.isNaN(date.getTime())) return;
      if (!selectedYear || date.getFullYear().toString() === selectedYear) {
        months.add(date.getMonth());
      }
    });

    return Array.from(months)
      .sort((a, b) => a - b)
      .map((month) => ({ value: month.toString(), label: MONTHS[month] }));
  }, [expenses, selectedYear]);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || expense.category === selectedCategory;

    const date = new Date(expense.date);
    const matchesYear =
      !selectedYear ||
      (!Number.isNaN(date.getTime()) &&
        date.getFullYear().toString() === selectedYear);
    const matchesMonth =
      !selectedMonth ||
      (!Number.isNaN(date.getTime()) &&
        date.getMonth().toString() === selectedMonth);

    return matchesSearch && matchesCategory && matchesYear && matchesMonth;
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Expenses</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-blue-600 px-4 py-2"
        >
          + Add Expense
        </button>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <ExpenseFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          years={years}
          monthOptions={monthOptions}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onYearChange={(value) => {
            setSelectedYear(value);
            setSelectedMonth("");
          }}
          onMonthChange={setSelectedMonth}
        />

        <div className="mt-6">
          <ExpenseTable
            expenses={filteredExpenses}
            onDelete={setSelectedExpenseId}
            onEdit={handleEditExpense}
          />
        </div>
      </div>

      {selectedExpenseId && (
        <ConfirmDialog
          title="Delete this expense?"
          onConfirm={handleDeleteExpense}
          onCancel={() => setSelectedExpenseId(null)}
        />
      )}
      {(isModalOpen || editingExpense) && (
        <AddExpenseModal
          expense={editingExpense ?? undefined}
          isEditMode={!!editingExpense}
          onClose={() => {
            setIsModalOpen(false);
            setEditingExpense(null);
          }}
          onSubmit={handleSaveExpense}
        />
      )}
    </div>
  );
};

export default ExpensesPage;
