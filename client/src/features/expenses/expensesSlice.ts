import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { mockExpenses } from "./mockData";
import type { Expense } from "./types/expense.types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getExpenses as fetchExpensesApi } from "./services/expenses.service";
import {
  clearExpenses,
  loadExpenses,
  saveExpenses,
} from "@/shared/utils/localStorage";
import type { RootState } from "@/store/store";
interface ExpenseState {
  expenses: Expense[];
  status: "idle" | "loading" | "failed";
  lastFetched: number | null;
}

const EXPENSE_CACHE_MS = 5 * 60 * 1000;

const normalizeExpense = (expense: Expense & { _id?: string }): Expense => ({
  ...expense,
  id: expense.id ?? expense._id,
});

const initialState: ExpenseState = {
  expenses: (loadExpenses() ?? mockExpenses).map(normalizeExpense),
  status: "idle",
  lastFetched: null,
};

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (_options: { force?: boolean } | undefined) => {
    const response = await fetchExpensesApi();

    return response.expenses.map(normalizeExpense);
  },
  {
    condition: (options, { getState }) => {
      if (options?.force) return true;

      const { expenses } = getState() as RootState;
      const hasFreshData =
        expenses.lastFetched &&
        Date.now() - expenses.lastFetched < EXPENSE_CACHE_MS;

      return expenses.status !== "loading" && !hasFreshData;
    },
  },
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.unshift(normalizeExpense(action.payload));
      saveExpenses(state.expenses);
    },

    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload,
      );

      saveExpenses(state.expenses);
    },
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.expenses.findIndex(
        (expense) => expense.id === action.payload.id,
      );

      if (index !== -1) {
        state.expenses[index] = normalizeExpense(action.payload);
      }
      saveExpenses(state.expenses);
    },
    resetExpenses: (state) => {
      state.expenses = [];
      state.status = "idle";
      state.lastFetched = null;
      clearExpenses();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenses = action.payload;
        state.status = "idle";
        state.lastFetched = Date.now();
        saveExpenses(state.expenses);
      })
      .addCase(fetchExpenses.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { addExpense, deleteExpense, resetExpenses, updateExpense } =
  expenseSlice.actions;
export default expenseSlice.reducer;
