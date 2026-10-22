const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2025-02" → "Feb 2025"
export const formatMonth = (value) => {
  if (!value) return "";
  const [year, month] = value.split("-").map(Number);
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
};

export const formatRange = (start, end) => {
  if (!start) return end ? formatMonth(end) : "Ongoing";
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
};

// "2026-10-22" → "22 Oct 2026"
export const formatDate = (value) => {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  return [day, MONTHS[month - 1], year].filter(Boolean).join(" ");
};
