import ExpenseTable from "../components/ExpenseTable";
import toast from "react-hot-toast";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import ExpenseFilters from "../components/ExpensesFilters";
import AddExpenseModal from "../components/AddExpensesModal";

import type { Expense } from "../types/expense.types";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "../expensesSlice";
import { selectExpenses } from "../selectors";

import {
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
  const dispatch = useAppDispatch();
  const expenses = useAppSelector(selectExpenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleDeleteExpense = useCallback(async () => {
    if (!selectedExpenseId) return;

    try {
      await deleteExpenseApi(selectedExpenseId);

      dispatch(deleteExpense(selectedExpenseId));
      toast.success("Expense deleted successfully");
      setSelectedExpenseId(null);
    } catch {
      toast.error("Failed to delete expense");
    }
  }, [dispatch, selectedExpenseId]);

  const handleEditExpense = useCallback((expense: Expense) => {
    setEditingExpense(expense);
  }, []);

  const handleSaveExpense = useCallback(async (expense: Expense) => {
    try {
      if (editingExpense) {
        const response = await updateExpenseApi(expense.id!, expense);

        dispatch(updateExpense({ ...response.expense, id: response.expense._id }));
        toast.success("Expense updated successfully");
      } else {
        const response = await createExpense(expense);

        dispatch(addExpense({ ...response.expense, id: response.expense._id }));
        toast.success("Expense added successfully");
      }

      setEditingExpense(null);
      setIsModalOpen(false);
    } catch {
      toast.error("Failed to save expense");
      throw new Error("Failed to save expense");
    }
  }, [dispatch, editingExpense]);

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

  const filteredExpenses = useMemo(() => {
    const search = deferredSearchTerm.trim().toLowerCase();

    return expenses.filter((expense) => {
      const matchesSearch =
        !search || expense.title.toLowerCase().includes(search);

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
  }, [
    deferredSearchTerm,
    expenses,
    selectedCategory,
    selectedMonth,
    selectedYear,
  ]);
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
