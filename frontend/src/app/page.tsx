"use client";

import { Provider, useSelector } from "react-redux";
import { RootState, store } from "../store/index"; // Make sure the store is imported correctly
import BookCard from "../components/BookCard";
import { useState } from "react";
import { useBookListQuery } from "@/store/slices/userSlice";

export default function Home() {

  const isUserAuthenticated = useSelector(
    (state: RootState) => state.auth.isUserAuthenticated
  );

      const [page, setPage] = useState(1);
      const [limit, setLimit] = useState(8);
      
      const {
        data: bookData,
        isLoading,
        error
      } = useBookListQuery({ page, limit });
    
      const books = bookData?.book || [];
      const totalBooks = bookData?.total || 0;

  return (
    <Provider store={store}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Welcome to My Book App
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Discover amazing books and manage your reading list.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book:any) => (
            <BookCard
              key={book.isbn}
              title={book.title}
              isbn={book.isbn}
              author={book.author}
              imageUrl={book.thumbnail}
            />
          ))}
        </div>
      </div>
    </Provider>
  );
}
