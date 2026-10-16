export function getCurrentMonth() {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;
}

export function isValidMonth(value: string | null): value is string {
  if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    return false;
  }

  const [year, month] = value.split("-").map(Number);

  return year >= 1900 && month >= 1 && month <= 12;
}

export function formatAmount(amount: number) {
  return `৳${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: string) {
  const [year, month, day] = date.slice(0, 10).split("-");

  return `${day}/${month}/${year}`;
}

export function formatMonthLabel(month: string) {
  return new Date(`${month}-01T12:00:00+06:00`).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    },
  );
}