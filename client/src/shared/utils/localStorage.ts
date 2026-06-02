export const loadExpenses = () => {
  try {
    const expenses = localStorage.getItem("nakharch-expenses");

    return expenses ? JSON.parse(expenses) : null;
  } catch {
    return null;
  }
};

export const saveExpenses = (expenses: unknown) => {
  try {
    localStorage.setItem("nakharch-expenses", JSON.stringify(expenses));
  } catch (error) {
    console.error(error);
  }
};
