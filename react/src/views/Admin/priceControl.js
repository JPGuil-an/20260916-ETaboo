export function validatePriceRange(minimum, maximum) {
  if (minimum === "" || maximum === "") return "";
  if (Number(maximum) <= Number(minimum)) {
    return "Maximum price must be greater than minimum price.";
  }
  return "";
}
