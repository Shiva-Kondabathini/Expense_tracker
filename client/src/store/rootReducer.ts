import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authSlice";
import expenseReducer from "@/features/expenses/expensesSlice";
import uiReducer from "@/features/ui/uiSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  expenses: expenseReducer,
  ui: uiReducer,
});
