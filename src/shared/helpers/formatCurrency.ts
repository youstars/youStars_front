export const formatCurrency = (
    approved?: string | number | null,
    estimated?: string | number | null,
): string => {
    const raw = approved ?? estimated;           // приоритет approved
    if (raw == null) return "—";                 // нет данных
    if (String(raw).includes("-")) return `${String(raw)} ₽`; // уже “-”

    const num = Number(raw);
    if (Number.isNaN(num)) return String(raw);   // пришёл мусор


    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
    }).format(num);
};