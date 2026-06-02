import { api } from "@/shared/services/api";

export const getExpenses = async () => {
  const response = await api.get("/expenses");

  return response.data;
};

export const createExpense = async (payload: unknown) => {
  const response = await api.post("/expenses", payload);

  return response.data;
};

export const deleteExpense = async (id: string) => {
  const response = await api.delete(`/expenses/${id}`);

  return response.data;
};

export const updateExpense = async (id: string, payload: unknown) => {
  const response = await api.put(`/expenses/${id}`, payload);

  return response.data;
};
