"use client";

import { useState } from "react";
import { useBookListQuery } from "../../../store/slices/userSlice";
import BookCard from "@/components/BookCard";
import { Pagination } from "../../../components/Pagination";
import useDebouncedValue from "@/hooks/debounceHook";

export default function HomePage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('');
    const debouncedSearchTerm = useDebouncedValue(search, 1000);


    const {
        data: bookData,
        isLoading,
        error
    } = useBookListQuery({ 
        page, 
        limit, 
        search: debouncedSearchTerm,
    });

    const books = bookData?.book || [];
    const totalBooks = bookData?.total || 0;
    const totalPages = bookData?.totalPages || 1;

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on new search
    };

    const handleDepartmentFilter = (dept: string) => {
        setDepartment(dept);
        setPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex space-x-4 mb-6">
                <input
                    type="text"
                    placeholder="Search books..."
                    value={search}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 border rounded-md"
                />
            </div>

                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {books.map((book: any) => (
                            <BookCard
                                key={book._id}
                                title={book.title}
                                isbn={book.isbn}
                                author={book.author}
                                imageUrl={book.thumbnail}
                            />
                        ))}
                    </div>

                    <Pagination 
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
        </div>
    );
}