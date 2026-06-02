import type { RootState } from "@/store/store";

export const selectExpenses = (state: RootState) => state.expenses.expenses;
