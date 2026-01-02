import React, { useEffect, useState } from "react";
import { validateProduct, validateCategoryName } from "../utils/validation";

const ProductForm = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  categories,
  onAddCategory,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        price: editingProduct.price,
        stock:
          editingProduct.stock === 0 || editingProduct.stock
            ? editingProduct.stock
            : "",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
      });
    }
    setErrors({});
    setIsAddingCategory(false);
    setNewCategory("");
    setCategoryError("");
  }, [editingProduct, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateProduct(formData);
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    } else {
      setErrors(newErrors);
    }
  };

  const handleAddCategoryClick = () => {
    setIsAddingCategory(true);
    setCategoryError("");
  };

  const handleSaveCategory = () => {
    const err = validateCategoryName(newCategory, categories);
    if (err) {
      setCategoryError(err);
      return;
    }
    const trimmed = newCategory.trim();
    onAddCategory(trimmed);
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setNewCategory("");
    setIsAddingCategory(false);
    setCategoryError("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block custom-modal-backdrop">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-semibold">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-medium">
                  Product Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <div className="invalid-feedback d-block">
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">
                  Price (₹) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  className={`form-control ${
                    errors.price ? "is-invalid" : ""
                  }`}
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                />
                {errors.price && (
                  <div className="invalid-feedback d-block">
                    {errors.price}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">
                  Category <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-2">
                  <select
                    name="category"
                    className={`form-select ${
                      errors.category ? "is-invalid" : ""
                    }`}
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleAddCategoryClick}
                  >
                    + New
                  </button>
                </div>
                {errors.category && (
                  <div className="invalid-feedback d-block">
                    {errors.category}
                  </div>
                )}

                {isAddingCategory && (
                  <div className="mt-2 p-2 rounded bg-light border">
                    <small className="text-muted d-block mb-1">
                      Add a new category
                    </small>
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className={`form-control ${
                          categoryError ? "is-invalid" : ""
                        }`}
                        placeholder="New category name"
                        value={newCategory}
                        onChange={(e) => {
                          setNewCategory(e.target.value);
                          setCategoryError("");
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleSaveCategory}
                      >
                        Save
                      </button>
                    </div>
                    {categoryError && (
                      <div className="invalid-feedback d-block">
                        {categoryError}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">
                  Stock (Optional)
                </label>
                <input
                  type="number"
                  name="stock"
                  className={`form-control ${
                    errors.stock ? "is-invalid" : ""
                  }`}
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                  min="0"
                />
                {errors.stock && (
                  <div className="invalid-feedback d-block">
                    {errors.stock}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  className={`form-control ${
                    errors.description ? "is-invalid" : ""
                  }`}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description (max 500 characters)"
                  rows={3}
                />
                {errors.description && (
                  <div className="invalid-feedback d-block">
                    {errors.description}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
