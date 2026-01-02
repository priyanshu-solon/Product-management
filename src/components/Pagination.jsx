import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4 d-flex flex-wrap justify-content-center align-items-center gap-2">
      <ul className="pagination mb-0">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
          >
            ← Previous
          </button>
        </li>

        {start > 1 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(1)}>
                1
              </button>
            </li>
            {start > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}

        {pageNumbers.map((num) => (
          <li
            key={num}
            className={`page-item ${currentPage === num ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => onPageChange(num)}>
              {num}
            </button>
          </li>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </li>
          </>
        )}

        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next →
          </button>
        </li>
      </ul>
      <span className="text-muted small">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  );
};

export default Pagination;
