import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUpdateBookMutation } from '@/store/slices/userSlice';
import { BookType } from '@/types/bookTypes';

// Define form values type
interface BookFormValues {
  title: string;
  author: string;
  description: string;
  genre: string;
  isbn: string;
}

interface BookEditModalProps {
  book: BookType;
  onClose: () => void;
}

const BookEditModal: React.FC<BookEditModalProps> = ({ book, onClose }) => {
  const [updateBook] = useUpdateBookMutation();
  const modalRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    author: Yup.string().required('Author is required'),
    description: Yup.string(),
    genre: Yup.string(),
    isbn: Yup.string(),
  });

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Focus the first input on mount
    initialFocusRef.current?.focus();

    // Add event listeners
    document.addEventListener('keydown', handleEsc);
    document.addEventListener('mousedown', handleClickOutside);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleSubmit = async (
    values: BookFormValues,
    { setSubmitting }: FormikHelpers<BookFormValues>
  ): Promise<void> => {
    try {
      await updateBook({
        id: book._id,
        values
      });
      toast.success('Book updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update book');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out" />
        
        {/* Modal position helper */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div
          ref={modalRef}
          className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative animate-in fade-in duration-200 ease-out"
        >
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Book</h2>
          
          <Formik<BookFormValues>
            initialValues={{
              title: book.title || '',
              author: book.author || '',
              description: book.description || '',
              genre: book.genre || '',
              isbn: book.isbn || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Field
                    innerRef={initialFocusRef}
                    type="text"
                    name="title"
                    id="title"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter book title"
                  />
                  <ErrorMessage 
                    name="title" 
                    component="div" 
                    className="mt-1 text-sm text-red-600" 
                  />
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                    Author
                  </label>
                  <Field
                    type="text"
                    name="author"
                    id="author"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter author name"
                  />
                  <ErrorMessage 
                    name="author" 
                    component="div" 
                    className="mt-1 text-sm text-red-600" 
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter book description"
                  />
                </div>

                <div>
                  <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                    Genre
                  </label>
                  <Field
                    as="select"
                    name="genre"
                    id="genre"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select a genre</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Thriller">Thriller</option>
                  </Field>
                </div>

                <div>
                  <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                    ISBN
                  </label>
                  <Field
                    type="text"
                    name="isbn"
                    id="isbn"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter ISBN"
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default BookEditModal;