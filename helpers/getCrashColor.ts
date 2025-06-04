export const getCrashColor = (value: number) => {
  if (value < 200) return "var(--color-crash-low)";
  if (value < 300) return "var(--color-crash-medium)";
  if (value < 500) return "var(--color-crash-high)";

  return "var(--color-crash-extreme)";
};
