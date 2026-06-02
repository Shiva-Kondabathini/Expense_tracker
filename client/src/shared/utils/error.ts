import axios, { AxiosError } from "axios";

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<unknown>;

    if (
      axiosError.response?.data &&
      typeof axiosError.response.data === "object"
    ) {
      const data = axiosError.response.data as Record<string, unknown>;
      if (typeof data.message === "string") {
        return data.message;
      }
    }

    return axiosError.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    const err = error as { message?: unknown };
    if (typeof err.message === "string") {
      return err.message;
    }
  }

  return fallback;
};
