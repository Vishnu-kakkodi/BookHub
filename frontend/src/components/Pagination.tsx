"use client";

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
}) => {
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);

            if (currentPage <= 3) {
                startPage = 1;
                endPage = maxVisiblePages;
            }

            if (currentPage > totalPages - 3) {
                startPage = totalPages - 4;
                endPage = totalPages;
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex justify-center items-center space-x-2 mt-6">
            <button 
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
            >
                Previous
            </button>

            {pageNumbers.map(page => (
                <button 
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2 border rounded ${
                        currentPage === page 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-black'
                    }`}
                >
                    {page}
                </button>
            ))}

            <button 
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};