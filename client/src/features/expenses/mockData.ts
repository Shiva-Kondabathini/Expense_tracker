import type { Expense } from "./types/expense.types";

export const mockExpenses: Expense[] = [
  {
    id: "1",
    title: "Biryani",
    amount: 450,
    category: "Food",
    date: "2026-05-30",
  },
  {
    id: "2",
    title: "Petrol",
    amount: 1500,
    category: "Travel",
    date: "2026-05-29",
  },
  {
    id: "3",
    title: "Electricity Bill",
    amount: 2200,
    category: "Bills",
    date: "2026-05-28",
  },
  {
    id: "4",
    title: "Movie",
    amount: 600,
    category: "Entertainment",
    date: "2026-05-27",
  },
];
