export function validateReportFilters(filters, today) {
  if (!filters.product_type || !filters.starting_date || !filters.end_date) {
    return "Choose a commodity and complete the date range.";
  }
  if (filters.starting_date > today || filters.end_date > today) {
    return "Report dates cannot be in the future.";
  }
  if (filters.end_date < filters.starting_date) {
    return "End date must be on or after the start date.";
  }
  return "";
}

export function flattenTransactions(transactions = []) {
  return transactions.flatMap((transaction) => (transaction.transaction_detail || []).map((detail, index) => ({
    key: `${transaction.id}-${detail.id ?? detail.product_id ?? index}`,
    transactionId: transaction.id,
    buyer: transaction.user?.name || "Unknown buyer",
    product: detail.product_name,
    kilograms: Number(detail.kg_purchased || 0),
    pricePerKilo: Number(detail.price_per_kilo || 0),
    total: Number(detail.kg_purchased || 0) * Number(detail.price_per_kilo || 0),
  })));
}

export function calculateReportSummary(rows = [], cropTotals = {}) {
  return {
    sales: rows.reduce((sum, row) => sum + row.total, 0),
    orders: new Set(rows.map((row) => row.transactionId)).size,
    soldKg: rows.reduce((sum, row) => sum + row.kilograms, 0),
    yieldKg: Number(cropTotals.yield_kg || 0),
  };
}

export function buildCropSeries(locations = []) {
  return [
    {
      type: "column",
      name: "Sold kg",
      showInLegend: true,
      color: "#d99a24",
      dataPoints: locations.map((item) => ({ label: item.location, y: Number(item.sold_kg || 0) })),
    },
    {
      type: "column",
      name: "Expected yield kg",
      showInLegend: true,
      color: "#168447",
      dataPoints: locations.map((item) => ({ label: item.location, y: Number(item.yield_kg || 0) })),
    },
  ];
}
