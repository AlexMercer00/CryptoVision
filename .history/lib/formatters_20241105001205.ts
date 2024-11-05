export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatMarketCap = (marketCap: number) => {
  if (marketCap >= 1e12) {
    return (marketCap / 1e12).toFixed(2) + "T";
  }
  if (marketCap >= 1e9) {
    return (marketCap / 1e9).toFixed(2) + "B";
  }
  if (marketCap >= 1e6) {
    return (marketCap / 1e6).toFixed(2) + "M";
  }
  return marketCap.toString();
};