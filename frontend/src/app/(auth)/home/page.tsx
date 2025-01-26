"use client";

import { Provider } from "react-redux";
import { store } from "../../../store/index"; // Make sure the store is imported correctly
import BookCard from "../../../components/BookCard";
import { useState } from "react";
import { useBookListQuery } from "@/store/slices/userSlice";

export default function HomePage() {
  const book = [
    {
      title: "The Great Gatsby",
      isbn: "9780743273565",
      author: "F. Scott Fitzgerald",
      imageUrl: "https://picsum.photos/seed/gatsby/200/300",
    },
    {
      title: "To Kill a Mockingbird",
      isbn: "9780446310789",
      author: "Harper Lee",
      imageUrl: "https://picsum.photos/seed/mockingbird/200/300",
    },
    {
      title: "1984",
      isbn: "9780451524935",
      author: "George Orwell",
      imageUrl: "https://picsum.photos/seed/1984/200/300",
    },
    {
      title: "Pride and Prejudice",
      isbn: "9780141439518",
      author: "Jane Austen",
      imageUrl: "https://picsum.photos/seed/pride/200/300",
    },
    {
      title: "The Catcher in the Rye",
      isbn: "9780316769174",
      author: "J.D. Salinger",
      imageUrl: "https://picsum.photos/seed/catcher/200/300",
    },
    {
      title: "The Hobbit",
      isbn: "9780547928227",
      author: "J.R.R. Tolkien",
      imageUrl: "https://picsum.photos/seed/hobbit/200/300",
    },
    {
      title: "Brave New World",
      isbn: "9780060850524",
      author: "Aldous Huxley",
      imageUrl: "https://picsum.photos/seed/brave/200/300",
    },
    {
      title: "The Alchemist",
      isbn: "9780062315007",
      author: "Paulo Coelho",
      imageUrl: "https://picsum.photos/seed/alchemist/200/300",
    },
    {
      title: "The Little Prince",
      isbn: "9780156012195",
      author: "Antoine de Saint-Exupéry",
      imageUrl: "https://picsum.photos/seed/prince/200/300",
    },
  ];

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
