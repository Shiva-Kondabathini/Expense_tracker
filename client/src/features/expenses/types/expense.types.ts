export interface Expense {
  _id?: string;
  id?: string;

  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export type ExpenseCategory =
  | "Food"
  | "Travel"
  | "Shopping"
  | "Bills"
  | "Health"
  | "Entertainment";
