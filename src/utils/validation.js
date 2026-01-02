export const validateProduct = (product) => {
  const errors = {};

  if (!product.name.trim()) {
    errors.name = "Product name is required";
  } else if (product.name.trim().length < 3) {
    errors.name = "Product name must be at least 3 characters";
  } else if (product.name.trim().length > 100) {
    errors.name = "Product name cannot exceed 100 characters";
  }

  if (product.price === "" || product.price === null) {
    errors.price = "Price is required";
  } else if (isNaN(product.price) || Number(product.price) < 0) {
    errors.price = "Price must be a valid positive number";
  }

  if (!product.category) {
    errors.category = "Category is required";
  }

  if (
    product.stock !== "" &&
    (isNaN(product.stock) || Number(product.stock) < 0)
  ) {
    errors.stock = "Stock must be a valid non-negative number";
  }

  if (product.description && product.description.length > 500) {
    errors.description = "Description cannot exceed 500 characters";
  }

  return errors;
};

export const validateCategoryName = (name, existingCategories) => {
  const trimmed = name.trim();
  if (!trimmed) return "Category name is required";
  if (trimmed.length < 2) return "Category must be at least 2 characters";
  if (trimmed.length > 30) return "Category cannot exceed 30 characters";
  if (
    existingCategories.some(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    )
  ) {
    return "Category already exists";
  }
  return "";
};
