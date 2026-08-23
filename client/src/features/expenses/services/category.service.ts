import { api } from "@/shared/services/api";

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};
