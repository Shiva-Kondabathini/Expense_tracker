import type { Expense } from "../types/expense.types";

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const ExpenseTable = ({ expenses, onDelete, onEdit }: ExpenseTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
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
  );
};

export default ExpenseTable;
