export function normalizeBarangayName(value = "") {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function validateBarangayName(value = "") {
  const name = normalizeBarangayName(value);
  return name.length < 5 || name.length > 25
    ? "Barangay name must contain 5 to 25 characters."
    : "";
}

export function getBarangayRowNumber(index, currentPage, perPage) {
  return (currentPage - 1) * perPage + index + 1;
}
