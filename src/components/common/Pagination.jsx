// Pagination controls, driven by the backend's pagination meta object
function Pagination({ pagination, onPageChange }) {
  if (!pagination) return null;

  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button disabled={!hasPrevPage} onClick={() => onPageChange(currentPage - 1)}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button disabled={!hasNextPage} onClick={() => onPageChange(currentPage + 1)}>
        Next
      </button>
    </div>
  );
}

export default Pagination;