// 'use client';
// import React from 'react';
// import { useState } from 'react';
// import { useBookDeleteMutation, useBookListQuery } from '../../../store/slices/userSlice';
// import Link from 'next/link';
// import { toast } from 'react-toastify';
// import BookEditModal from '@/components/BookEditModal';


// // My Books Section Component
// const MyBooksSection = () => {
//     // const [page, setPage] = useState(1);
//     // const [limit, setLimit] = useState(8);
//     const page = 1;
//     const limit = 4;
//     const [bookDelete] = useBookDeleteMutation();
//     const [bookToEdit, setBookToEdit] = useState<any>(null);



//     const {
//         data: bookData,
//         isLoading,
//         error
//     } = useBookListQuery({ page, limit });

//     const books = bookData?.book || [];

//     if (isLoading) return <div>Loading books...</div>;
//     if (error) return <div>Error loading books</div>;

//     const handleDelete = async (bookId: string) => {
//         try {
//             if (bookId) {
//                 await bookDelete({ bookId })
//                 toast.success("Module Deleted");
//             }

//         } catch (error) {

//         }
//     };

//     return (
//         <div className="p-6">
//             <div className='flex justify-between items-center'>
//                 <h1 className="text-2xl font-bold mb-4">My Books</h1>
//                 <Link
//                     href="/add-book"
//                     className="text-2xl font-bold mb-4"
//                 >
//                     Add Book
//                 </Link>
//             </div>
//             {books.length === 0 ? (
//                 <p>No books found.</p>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {books.map((book: any, index: number) => (
//                         <div
//                             key={`book-${book._id || book.isbn || index}`}
//                             className="bg-white rounded-lg shadow-md overflow-hidden border"
//                         >
//                             {book.thumbnail && (
//                                 <div className="h-48 overflow-hidden">
//                                     <img
//                                         src={book.thumbnail}
//                                         alt={book.title}
//                                         className="w-full h-full object-fit"
//                                     />
//                                 </div>
//                             )}
//                             <div className="p-4">
//                                 <h3 className="text-lg font-bold mb-2 truncate">{book.title}</h3>
//                                 <p className="text-gray-600 mb-4">{book.author}</p>
//                                 <div className="flex justify-between space-x-2">
//                                     <button className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm">
//                                         View
//                                     </button>
//                                     <button
//                                         onClick={() => setBookToEdit(book)}
//                                         className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 text-sm"
//                                     >
//                                         Edit
//                                     </button>
//                                     <button
//                                         onClick={() => handleDelete(book._id)}
//                                         className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm">
//                                         Delete
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {bookToEdit && (
//                 <BookEditModal
//                     book={bookToEdit}
//                     onClose={() => setBookToEdit(null)}
//                 />
//             )}
//         </div>
//     );
// };


// export default MyBooksSection;



'use client';
import React, { useState } from 'react';
import { useBookDeleteMutation, useCreateBookMutation, useMyBookListQuery } from '../../../store/slices/userSlice';
import Link from 'next/link';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import BookEditModal from '@/components/BookEditModal';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { PlusCircle, Book, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { Badge } from "../../../components/ui/Badge";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useAppSelector } from '@/store/hook';
import { Pagination } from '@/components/Pagination';
import withAuth from '@/hoc/withAuth';

const MyBooksSection = () => {
    const limit = 4;
    const [page, setPage] = useState(1);
    const [bookDelete] = useBookDeleteMutation();
    const [createBook] = useCreateBookMutation();

    const [bookToEdit, setBookToEdit] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitError, setSubmitError] = useState<string>('');

    const userdata = useAppSelector((state) => state.auth.userInfo);
    const userId = userdata?._id;




    const {
        data: bookData,
        isLoading,
        error
    } = useMyBookListQuery({ page, limit, userId });

    const books = bookData?.book || [];
    const totalPages = bookData?.totalPages || 1;


    const initialValues = {
        title: "",
        description: "",
        author: "",
        year: "",
        isbn: "",
        genre: "",
        thumbnail: null as File | null,
    };

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        author: Yup.string().required("Author is required"),
        year: Yup.number()
            .typeError("Year must be a number")
            .min(1800, "Year must be after 1800")
            .max(new Date().getFullYear(), "Year cannot be in the future")
            .required("Year is required"),
        isbn: Yup.string().required("ISBN is required"),
        genre: Yup.string().required("Genre is required"),
        thumbnail: Yup.mixed()
            .nullable()
            .test(
                'fileSize',
                'File is too large',
                value => !value || (value instanceof File && value.size <= 10 * 1024 * 1024)
            )
            .required("Book thumbnail is required"),
    });

    const handleDelete = async (bookId: string) => {
        try {
            if (bookId) {
                await bookDelete({ bookId });
                toast.success("Book successfully deleted");
                setDeleteId(null);
            }
        } catch (error) {
            toast.error("Failed to delete book");
        }
    };

    const handleAddBook = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            const formData = new FormData();

            Object.keys(values).forEach(key => {
                if (key !== 'thumbnail' && values[key as keyof typeof values] !== null) {
                    formData.append(key, values[key as keyof typeof values]?.toString() || '');
                }
            });

            if (values.thumbnail) {
                formData.append('thumbnail', values.thumbnail);
            }

            if (userdata) {
                formData.append('userId', userdata._id);
            }


            await createBook({ body: formData }).unwrap();
            toast.success("Book created successfully");
            setIsAddModalOpen(false);
        } catch (error: any) {
            setSubmitError(error.message || 'An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading your books...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-500">Error Loading Books</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            There was a problem loading your books. Please try again later.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">My Books</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your published books and drafts
                        </p>
                    </div>
                    <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
                        <PlusCircle className="h-4 w-4" />
                        Add New Book
                    </Button>
                </div>

                {books.length === 0 ? (
                    <Card className="w-full">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Book className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Books Yet</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                You haven't published any books yet. Start by adding your first book.
                            </p>
                            <Link href="/add-book">
                                <Button>
                                    Add Your First Book
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.map((book: any, index: number) => (
                            <Card
                                key={`book-${book._id || book.isbn || index}`}
                                className="group hover:shadow-lg transition-shadow duration-200"
                            >
                                <div className="relative">
                                    {book.thumbnail ? (
                                        <img
                                            src={book.thumbnail}
                                            alt={book.title}
                                            className="w-full h-48 object-cover rounded-t-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
                                            <Book className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="opacity-90">
                                            Published
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader>
                                    <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
                                    <p className="text-muted-foreground text-sm">{book.author}</p>
                                </CardHeader>

                                <CardFooter className="grid grid-cols-3 gap-2">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Eye className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => setBookToEdit(book)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Book</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete "{book.title}"? This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(book._id)}
                                                    className="bg-red-500 hover:bg-red-600"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>

            {bookToEdit && (
                <BookEditModal
                    book={bookToEdit}
                    onClose={() => setBookToEdit(null)}
                />
            )}

            <AlertDialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Add New Book</AlertDialogTitle>
                    </AlertDialogHeader>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleAddBook}
                    >
                        {({ setFieldValue, isSubmitting }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block mb-2">Book Title</label>
                                    <Field
                                        name="title"
                                        type="text"
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Enter book title"
                                    />
                                    <ErrorMessage
                                        name="title"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2">Description</label>
                                    <Field
                                        name="description"
                                        as="textarea"
                                        className="w-full p-2 border rounded-md"
                                        placeholder="Enter book description"
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2">Author</label>
                                        <Field
                                            name="author"
                                            type="text"
                                            className="w-full p-2 border rounded-md"
                                            placeholder="Enter author name"
                                        />
                                        <ErrorMessage
                                            name="author"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Year of Publication</label>
                                        <Field
                                            name="year"
                                            as="select"
                                            className="w-full p-2 border rounded-md"
                                        >
                                            <option value="" label="Select Publication Year" />
                                            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                                <option key={year} value={year} label={year.toString()} />
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="year"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2">ISBN</label>
                                        <Field
                                            name="isbn"
                                            type="text"
                                            className="w-full p-2 border rounded-md"
                                            placeholder="Enter ISBN"
                                        />
                                        <ErrorMessage
                                            name="isbn"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2">Genre</label>
                                        <Field
                                            name="genre"
                                            as="select"
                                            className="w-full p-2 border rounded-md"
                                        >
                                            <option value="" label="Select genre" />
                                            <option value="Fiction" label="Fiction" />
                                            <option value="Non-Fiction" label="Non-Fiction" />
                                            <option value="Science Fiction" label="Science Fiction" />
                                            <option value="Mystery" label="Mystery" />
                                        </Field>
                                        <ErrorMessage
                                            name="genre"
                                            component="div"
                                            className="text-red-500 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2">Upload Image</label>
                                    <input
                                        name="thumbnail"
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif"
                                        className="w-full p-2 border rounded-md"
                                        onChange={(event) => {
                                            const files = event.currentTarget.files;
                                            if (files && files.length > 0) {
                                                setFieldValue("thumbnail", files[0]);
                                            }
                                        }}
                                    />
                                    <ErrorMessage
                                        name="thumbnail"
                                        component="div"
                                        className="text-red-500 text-sm"
                                    />
                                </div>

                                {submitError && (
                                    <div className="text-red-500 text-sm">
                                        {submitError}
                                    </div>
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsAddModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Book'}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default withAuth(MyBooksSection);