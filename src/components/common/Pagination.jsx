import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// Button component for pagination actions
const PaginationButton = ({ children, onClick, active = false, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex items-center justify-center w-10 h-10 rounded-lg
        transition-all duration-300 ease-in-out
        ${active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300/50 scale-110 z-10' 
          : 'bg-slate-800 text-slate-300 hover:text-white'}
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-indigo-500 hover:scale-105 hover:shadow-md hover:shadow-indigo-300/30'}
        backdrop-filter backdrop-blur-sm
      `}
    >
      {children}
    </button>
  );
};

// Number indicator that shows current page status
const PageIndicator = ({ currentPage, totalPages }) => {
  return (
    <div className="bg-slate-800/80 text-white px-4 py-2 rounded-lg backdrop-filter backdrop-blur-sm border border-slate-700/50 flex items-center gap-2">
      <span className="text-indigo-400 font-mono">{currentPage}</span>
      <span className="text-slate-400">/</span>
      <span className="text-slate-400 font-mono">{totalPages}</span>
    </div>
  );
};

// Main pagination component
const Pagination = ({ 
  totalPages = 10, 
  initialPage = 1,
  maxVisiblePages = 5,
  onPageChange = () => {}
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange(page);
  };

  // Calculate visible page range
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = currentPage - halfVisible;
    let end = currentPage + halfVisible;
    
    if (start < 1) {
      end = Math.min(totalPages, end + (1 - start));
      start = 1;
    }
    
    if (end > totalPages) {
      start = Math.max(1, start - (end - totalPages));
      end = totalPages;
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Pagination controls */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl backdrop-filter backdrop-blur-lg border border-slate-800 shadow-xl">
        {/* First page button */}
        <PaginationButton 
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="w-5 h-5" />
        </PaginationButton>
        
        {/* Previous page button */}
        <PaginationButton 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-5 h-5" />
        </PaginationButton>
        
        {/* Page numbers */}
        <div className="flex gap-2 mx-2">
          {visiblePages.map(page => (
            <PaginationButton
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </PaginationButton>
          ))}
        </div>
        
        {/* Next page button */}
        <PaginationButton 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-5 h-5" />
        </PaginationButton>
        
        {/* Last page button */}
        <PaginationButton 
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="w-5 h-5" />
        </PaginationButton>
      </div>
      
      {/* Current page indicator */}
      <PageIndicator currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default Pagination;