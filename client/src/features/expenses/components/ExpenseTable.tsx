import type { Expense } from "../types/expense.types";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const ExpenseTable = ({ expenses, onDelete, onEdit }: ExpenseTableProps) => {
  return (
    <div>
      {/* Desktop / tablet: table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-800">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>

              <th className="px-4 py-3 text-left">Category</th>

              <th className="px-4 py-3 text-left">Amount</th>

              <th className="px-4 py-3 text-left">Date</th>

              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  No expenses found.
                </td>
              </tr>
            ) : (
              expenses.map((expense, index) => {
                const expenseId = expense.id ?? expense._id;
                const rowKey = expenseId ?? `${index}`;

                return (
                  <tr key={rowKey} className="border-t border-slate-800">
                    <td className="px-4 py-3">{expense.title}</td>

                    <td className="px-4 py-3">{expense.category}</td>

                    <td className="px-4 py-3">₹{expense.amount}</td>

                    <td className="px-4 py-3">{expense.date}</td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(expense)}
                          className="rounded-lg bg-yellow-600 px-3 py-1 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            if (expenseId) {
                              onDelete(expenseId);
                            }
                          }}
                          className="rounded-lg bg-red-600 px-3 py-1 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden flex flex-col gap-4">
        {expenses.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
            No expenses found.
          </div>
        ) : (
          expenses.map((expense, index) => {
            const expenseId = expense.id ?? expense._id;
            const key = expenseId ?? `${index}`;

            return (
              <div
                key={key}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold">{expense.title}</div>
                    <div className="text-sm text-slate-400">
                      {expense.category}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      ₹{expense.amount}
                    </div>
                    <div className="text-sm text-slate-400">{expense.date}</div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="flex-1 rounded-lg bg-yellow-600 px-3 py-2 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      if (expenseId) onDelete(expenseId);
                    }}
                    className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExpenseTable;
