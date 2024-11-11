import React from "react";

const PaginationComponent = ({ page, totalPages, setPage }) => {
  return (
    <div className="flex items-center justify-center mt-8 space-x-2 text-[#4B657B]">
      {/* Prev Button */}
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        className="px-4 py-2 rounded-full hover:bg-[#4B657B] hover:text-white disabled:opacity-50"
      >
        &laquo; Prev
      </button>

      {/* Sayfa Numaraları */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => setPage(index + 1)}
          className={`px-3 py-1 rounded-full ${
            page === index + 1 ? "bg-[#4B657B] text-white" : "text-[#4B657B]"
          } hover:bg-[#4B657B] hover:text-white`}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-full hover:bg-[#4B657B] hover:text-white disabled:opacity-50"
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default PaginationComponent;
