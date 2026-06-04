import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

export const selectExpenseState = (state: RootState) => state.expenses;

export const selectExpenses = createSelector(
  selectExpenseState,
  (expenseState) => expenseState.expenses,
);

export const selectExpenseStatus = createSelector(
  selectExpenseState,
  (expenseState) => expenseState.status,
);
