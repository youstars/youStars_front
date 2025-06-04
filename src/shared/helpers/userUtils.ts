export const getInitials = (fullName: string): string => {
  const [first, second] = fullName.trim().split(" ");
  return (first?.[0] || "") + (second?.[0] || "");
};
export const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "Не указано";
  try {
    return new Date(dateStr).toLocaleDateString("ru-RU");
  } catch {
    return "Неверная дата";
  }
};