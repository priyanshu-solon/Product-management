import React, { useEffect, useMemo, useState } from "react";
import useDebounce from "./hooks/useDebounce";
import ProductForm from "./components/ProductForm";
import ProductCard from "./components/ProductCard";
import Pagination from "./components/Pagination";

const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 5999,
    category: "Electronics",
    stock: 15,
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life",
  },
  {
    id: 2,
    name: "USB-C Cable",
    price: 499,
    category: "Accessories",
    stock: 50,
    description:
      "Durable USB-C charging cable, 2 meters, fast charging support",
  },
  {
    id: 3,
    name: "Portable Charger",
    price: 2499,
    category: "Electronics",
    stock: 25,
    description: "20000mAh portable power bank with dual USB ports",
  },
  {
    id: 4,
    name: "Phone Screen Protector",
    price: 299,
    category: "Accessories",
    stock: 100,
    description: "Tempered glass screen protector with anti-glare coating",
  },
  {
    id: 5,
    name: "Laptop Stand",
    price: 1999,
    category: "Office",
    stock: 18,
    description: "Adjustable aluminum laptop stand for ergonomic viewing",
  },
  {
    id: 6,
    name: "Mechanical Keyboard",
    price: 3499,
    category: "Electronics",
    stock: 12,
    description:
      "RGB backlit mechanical keyboard with customizable switches",
  },
  {
    id: 7,
    name: "Wireless Mouse",
    price: 1299,
    category: "Electronics",
    stock: 35,
    description: "Silent wireless mouse with 1200 DPI precision tracking",
  },
  {
    id: 8,
    name: "Phone Case",
    price: 599,
    category: "Accessories",
    stock: 80,
    description: "Protective phone case with shock absorption technology",
  },
  {
    id: 9,
    name: "Desk Lamp",
    price: 2199,
    category: "Office",
    stock: 22,
    description:
      "LED desk lamp with adjustable brightness and color temperature",
  },
  {
    id: 10,
    name: "External SSD",
    price: 4999,
    category: "Electronics",
    stock: 10,
    description: "1TB portable external SSD with 550MB/s transfer speed",
  },
];

const DEFAULT_CATEGORIES = [
  "Electronics",
  "Accessories",
  "Office",
  "Home",
  "Sports",
];

const ITEMS_PER_PAGE = 8;

const App = () => {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem("products");
      return stored ? JSON.parse(stored) : SAMPLE_PRODUCTS;
    } catch {
      return SAMPLE_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem("categories");
      if (stored) return JSON.parse(stored);
      const fromProducts = Array.from(
        new Set(SAMPLE_PRODUCTS.map((p) => p.category))
      );
      return Array.from(new Set([...DEFAULT_CATEGORIES, ...fromProducts]));
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem("categories", JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredProducts = useMemo(() => {
    const term = debouncedSearchTerm.toLowerCase();
    if (!term) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
  }, [products, debouncedSearchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleAddProduct = (formData) => {
    const newProduct = {
      ...formData,
      id:
        editingProduct?.id ??
        (products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1),
      price: parseFloat(formData.price),
      stock:
        formData.stock === "" || formData.stock === null
          ? 0
          : parseInt(formData.stock, 10),
    };

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? newProduct : p))
      );
      setShowSuccessMessage("Product updated successfully!");
    } else {
      setProducts((prev) => [...prev, newProduct]);
      setShowSuccessMessage("Product added successfully!");
    }

    setIsFormOpen(false);
    setEditingProduct(null);
    setTimeout(() => setShowSuccessMessage(""), 3000);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setShowSuccessMessage("Product deleted successfully!");
      setTimeout(() => setShowSuccessMessage(""), 3000);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleAddCategory = (newCategoryName) => {
    setCategories((prev) => {
      const set = new Set(prev);
      set.add(newCategoryName);
      return Array.from(set);
    });
  };

  const totalStock = useMemo(
    () => products.reduce((sum, p) => sum + (p.stock || 0), 0),
    [products]
  );
  const uniqueCategoriesCount = useMemo(
    () => new Set(products.map((p) => p.category)).size,
    [products]
  );

  return (
    <>
      <header className="app-header mb-4">
        <div className="container py-4 text-white">
          <h1 className="h3 fw-semibold mb-1">
            📦 Product Management System
          </h1>
          <p className="mb-0 small opacity-75">
            Manage your product inventory with ease - Add, Edit, Search, and
            Organize
          </p>
        </div>
      </header>

      <main className="container pb-5">
        <section className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="stat-card p-3 rounded-3 bg-white shadow-sm h-100">
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">Total Products</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card p-3 rounded-3 bg-white shadow-sm h-100">
              <div className="stat-value">{filteredProducts.length}</div>
              <div className="stat-label">Filtered Results</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card p-3 rounded-3 bg-white shadow-sm h-100">
              <div className="stat-value">{totalStock}</div>
              <div className="stat-label">Total Stock</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card p-3 rounded-3 bg-white shadow-sm h-100">
              <div className="stat-value">{uniqueCategoriesCount}</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
        </section>

        <section className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          <div className="flex-grow-1">
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="🔍 Search by product name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            <div className="btn-group" role="group">
              <button
                className={`btn btn-outline-light text-dark px-3 ${
                  viewMode === "list" ? "active" : ""
                }`}
                onClick={() => setViewMode("list")}
              >
                📋 List
              </button>
              <button
                className={`btn btn-outline-light text-dark px-3 ${
                  viewMode === "card" ? "active" : ""
                }`}
                onClick={() => setViewMode("card")}
              >
                🎴 Cards
              </button>
            </div>
            <button
              className="btn btn-primary shadow-sm"
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
            >
              + Add Product
            </button>
          </div>
        </section>

        <section className="mb-2 text-muted small">
          Showing {paginatedProducts.length} of {filteredProducts.length} products
        </section>

        {filteredProducts.length === 0 ? (
          <section className="text-center py-5 bg-white rounded-3 shadow-sm">
            <div className="fs-1 mb-2">📭</div>
            <h5 className="fw-semibold mb-1">No Products Found</h5>
            <p className="text-muted mb-3">
              Try adjusting your search or add a new product to get started.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
            >
              + Add First Product
            </button>
          </section>
        ) : (
          <>
            {viewMode === "list" && (
              <div className="table-responsive shadow-sm rounded-3 bg-white">
                <table className="table mb-0 table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Product Name</th>
                      <th>Price (₹)</th>
                      <th>Category</th>
                      <th>Stock</th>
                      <th>Description</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="fw-semibold">{product.name}</td>
                        <td>{product.price.toLocaleString("en-IN")}</td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary-emphasis border border-primary-subtle">
                            {product.category}
                          </span>
                        </td>
                        <td>{product.stock || 0}</td>
                        <td className="text-muted small" style={{ maxWidth: "230px" }}>
                          {product.description
                            ? `${product.description.substring(0, 60)}...`
                            : "-"}
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {viewMode === "card" && (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>

      <ProductForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleAddProduct}
        editingProduct={editingProduct}
        categories={categories}
        onAddCategory={handleAddCategory}
      />

      {showSuccessMessage && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show align-items-center text-bg-success border-0 shadow">
            <div className="d-flex">
              <div className="toast-body">{showSuccessMessage}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
