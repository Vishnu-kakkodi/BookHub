'use client';
import React from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useCreateBookMutation } from '../../../store/slices/userSlice';
import { useAppSelector } from '@/store/hook';
import withAuth from '@/hoc/withAuth';


// Create Book Section Component
const CreateBookSection = () => {
  const [createBook] = useCreateBookMutation();
  const [submitError, setSubmitError] = useState<string>('');
  const userdata = useAppSelector((state) => state.auth.userInfo);


  // useEffect(() => {
  //   dispatch(hydrateUser());
  // }, [dispatch]);

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
      // .test(
      //   'fileType', 
      //   'Unsupported file type', 
      //   value => !value || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
      // )
      .required("Book thumbnail is required"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ): Promise<void> => {
    try {
        console.log(userdata?._id)
      const formData = new FormData();

      // Append all text fields
      (Object.keys(values) as Array<keyof typeof values>).forEach(key => {
        if (key !== 'thumbnail' && values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key]?.toString() || '');
        }
      });

      // Append thumbnail file
      if (values.thumbnail) {
        formData.append('thumbnail', values.thumbnail);
      }

      if (userdata) {
        formData.append('userId', userdata._id);
      }

      const response = await createBook({
        body: formData
      }).unwrap();

      console.log(response);
      // Handle successful book creation (e.g., show success message, reset form)
    } catch (error: any) {
      setSubmitError(error.message || 'An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-6  ">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="bg-white shadow-md rounded-lg p-6 space-y-4">
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
              <div className="text-red-500 text-sm mb-4">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Book'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};


export default withAuth(CreateBookSection)