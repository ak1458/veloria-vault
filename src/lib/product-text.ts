function normalizeSpacing(value: string): string {
  return value.replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
}

function toDisplayText(value: string): string {
  return normalizeSpacing(value)
    .split(/(\s+|[-/&])/)
    .map((part) => {
      if (!/^[A-Za-z']+$/.test(part)) {
        return part;
      }

      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");
}

export function getDisplayProductName(name: string): string {
  return toDisplayText(name);
}

export function getDisplayCategoryName(name: string): string {
  return toDisplayText(name);
}

export function formatINR(value: number): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
