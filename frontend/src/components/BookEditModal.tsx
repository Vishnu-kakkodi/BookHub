import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useUpdateBookMutation } from '@/store/slices/userSlice';

interface BookEditModalProps {
  book: any;
  onClose: () => void;
}

const BookEditModal: React.FC<BookEditModalProps> = ({ book, onClose }) => {
  const [updateBook] = useUpdateBookMutation();

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    author: Yup.string().required('Author is required'),
    description: Yup.string(),
    genre: Yup.string(),
    isbn: Yup.string(),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
        console.log(values);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-96 p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Edit Book</h2>
        
        <Formik
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
            <Form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <Field
                  type="text"
                  name="title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
                <ErrorMessage 
                  name="title" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
                />
              </div>

              <div className="mb-4">
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <Field
                  type="text"
                  name="author"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
                <ErrorMessage 
                  name="author" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                  Genre
                </label>
                <Field
                  type="text"
                  name="genre"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                  ISBN
                </label>
                <Field
                  type="text"
                  name="isbn"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BookEditModal;