import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { mockExpenses } from "./mockData";
import type { Expense } from "./types/expense.types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getExpenses as fetchExpensesApi } from "./services/expenses.service";
import { loadExpenses, saveExpenses } from "@/shared/utils/localStorage";
interface ExpenseState {
  expenses: Expense[];
  status: "idle" | "loading" | "failed";
}

const initialState: ExpenseState = {
  expenses: loadExpenses() ?? mockExpenses,
  status: "idle",
};

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    const response = await fetchExpensesApi();

    return response.expenses.map((expense: Expense & { _id: string }) => ({
      ...expense,
      id: expense._id,
    }));
  },
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.unshift(action.payload);
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
        state.expenses[index] = action.payload;
      }
      saveExpenses(state.expenses);
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
        saveExpenses(state.expenses);
      })
      .addCase(fetchExpenses.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { addExpense, deleteExpense, updateExpense } =
  expenseSlice.actions;
export default expenseSlice.reducer;
