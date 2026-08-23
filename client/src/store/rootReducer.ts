import { combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  type PersistConfig,
  type WebStorage,
} from "redux-persist";

import authReducer from "@/features/auth/authSlice";
import expenseReducer from "@/features/expenses/expensesSlice";
import uiReducer from "@/features/ui/uiSlice";

const storage: WebStorage = {
  getItem: (key: string) => {
    return Promise.resolve(localStorage.getItem(key));
  },

  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const authPersistConfig: PersistConfig<ReturnType<typeof authReducer>> = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

// const expensePersistConfig: PersistConfig<ReturnType<typeof expenseReducer>> = {
//   key: "expenses",
//   storage,
//   whitelist: ["expenses"],
// };

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),

  expenses: expenseReducer,

  ui: uiReducer,
});

export default rootReducer;
