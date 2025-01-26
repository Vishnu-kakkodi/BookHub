'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { User, Book, PlusCircle } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useBookDeleteMutation, useBookListQuery, useCreateBookMutation } from '../../../store/slices/userSlice';
import { hydrateUser } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hook';
import Link from 'next/link';
import { toast } from 'react-toastify';
import BookEditModal from '@/components/BookEditModal';


// My Books Section Component
const MyBooksSection = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [bookDelete] = useBookDeleteMutation();
    const [bookToEdit, setBookToEdit] = useState<any>(null);



    const {
        data: bookData,
        isLoading,
        error
    } = useBookListQuery({ page, limit });

    const books = bookData?.book || [];
    const totalBooks = bookData?.total || 0;

    if (isLoading) return <div>Loading books...</div>;
    if (error) return <div>Error loading books</div>;

    const handleDelete = async (bookId: string) => {
        try {
            if (bookId) {
                await bookDelete({ bookId })
                toast.success("Module Deleted");
            }

        } catch (error) {

        }
    };

    return (
        <div className="p-6">
            <div className='flex justify-between items-center'>
                <h1 className="text-2xl font-bold mb-4">My Books</h1>
                <Link
                    href="/add-book"
                    className="text-2xl font-bold mb-4"
                >
                    Add Book
                </Link>
            </div>
            {books.length === 0 ? (
                <p>No books found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book: any, index: number) => (
                        <div
                            key={`book-${book._id || book.isbn || index}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden border"
                        >
                            {book.thumbnail && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={book.thumbnail}
                                        alt={book.title}
                                        className="w-full h-full object-fit"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="text-lg font-bold mb-2 truncate">{book.title}</h3>
                                <p className="text-gray-600 mb-4">{book.author}</p>
                                <div className="flex justify-between space-x-2">
                                    <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm">
                                        View
                                    </button>
                                    <button
                                        onClick={() => setBookToEdit(book)}
                                        className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(book._id)}
                                        className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {bookToEdit && (
                <BookEditModal
                    book={bookToEdit}
                    onClose={() => setBookToEdit(null)}
                />
            )}
        </div>
    );
};


export default MyBooksSection;

