import { EstimateItem } from "../types";

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
};

export const calculateEstimateTotal = (items: EstimateItem[]): number => {
  return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
