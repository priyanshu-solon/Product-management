import React from "react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0 product-card">
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title fw-semibold mb-0">{product.name}</h5>
            <span className="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle rounded-pill">
              {product.category}
            </span>
          </div>

          <h4 className="text-primary fw-bold mb-2">
            ₹{product.price.toLocaleString("en-IN")}
          </h4>

          <div className="mb-2 small text-muted">
            Stock:{" "}
            <span className="fw-semibold">
              {product.stock !== undefined ? product.stock : 0} units
            </span>
          </div>

          {product.description && (
            <p className="card-text text-muted small flex-grow-1">
              {product.description}
            </p>
          )}

          <div className="mt-3 d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm w-50"
              onClick={() => onEdit(product)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm w-50"
              onClick={() => onDelete(product.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
