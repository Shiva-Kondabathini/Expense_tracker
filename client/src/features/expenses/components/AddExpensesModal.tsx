import { useForm } from "react-hook-form";
import type { Expense, ExpenseCategory } from "../types/expense.types";

interface AddExpenseModalProps {
  onClose: () => void;
  onSubmit: (expense: Expense) => Promise<void>;

  expense?: Expense;
  isEditMode?: boolean;
}

interface ExpenseFormData {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

const categories: ExpenseCategory[] = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
];

const AddExpenseModal = ({
  onClose,
  onSubmit,
  expense,
  isEditMode,
}: AddExpenseModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormData>({
    defaultValues: expense
      ? {
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
        }
      : undefined,
  });
  const submitHandler = async (data: ExpenseFormData) => {
    await onSubmit({
      id: expense?.id ?? crypto.randomUUID(),
      ...data,
    });
    reset();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-6 text-2xl font-bold">
          {isEditMode ? "Edit Expense" : "Add Expense"}
        </h2>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <input
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Minimum 3 characters",
              },
            })}
            placeholder="Title"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
          <input
            type="number"
            {...register("amount", {
              required: "Amount is required",
              min: {
                value: 1,
                message: "Amount must be greater than 0",
              },
              valueAsNumber: true,
            })}
            placeholder="Amount"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
          <select
            {...register("category", {
              required: true,
            })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="date"
            {...register("date", {
              required: true,
            })}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-700 px-4 py-2"
            >
              Cancel
            </button>

            <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
