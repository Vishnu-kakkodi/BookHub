
'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  UserCredential 
} from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { auth, googleProvider } from '../../../firebase/firebaseConfig';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useGoogleSignMutation, useRegisterMutation } from '@/store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import withAuth from '@/hoc/withAuth';
import backIMg from '../../../../public/library-book-bookshelf-read-thumbnail.jpg'


const RegisterPage = () => {
  const router = useRouter();
  const [googleSign] = useGoogleSignMutation();
  const [register] = useRegisterMutation();
  const dispatch = useDispatch();


  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must include at least one letter and one number'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (
    values: { userName: string; email: string; password: string; confirmPassword: string }, 
    { setSubmitting, setErrors }: FormikHelpers<{ userName: string, email: string; password: string; confirmPassword: string }>
  ) => {
    try {
      const response = await register(values).unwrap();
      toast.success(response.message)
      dispatch(setCredentials({ ...response.data?.data }));  
      router.push('/home');
    } catch (error: any) {
      setErrors({ email: error.message || 'Sign up failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider as GoogleAuthProvider);
      const email = result.user.email;
      const userName = result.user.displayName;
      const phoneNumber = result.user.phoneNumber;
      if (email) {
        const response = await googleSign({ email, userName, phoneNumber });
        console.log(response);
        localStorage.setItem('email', email);
        toast.success('Google sign-in successful!');
        dispatch(setCredentials({ ...response.data?.data }));
        router.push('/home');
      }
    } catch (error) {
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
    style={{
      backgroundImage: `url(${backIMg.src})`, // Fix: Use template literal and access .src property
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backgroundBlendMode: 'overlay' // Fixed property name
    }}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        
        <Formik
          initialValues={{ userName: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <Field
                  type="userName"
                  name="userName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage 
                  name="userName" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage 
                  name="email" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage 
                  name="password" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage 
                  name="confirmPassword" 
                  component="div" 
                  className="text-red-500 text-sm mt-1" 
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 font-semibold"
              >
                Sign Up
              </button>
            </Form>
          )}
        </Formik>

        <div className="my-4 flex items-center justify-center">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 bg-white">or</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center"
          >
            <FcGoogle size={20} className="mr-5" />
            Sign Up with Google
          </button>

          <button 
            onClick={() => router.push('/login')}
            className="w-full text-blue-500 hover:bg-blue-50 py-2 rounded-lg transition duration-300"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(RegisterPage);
