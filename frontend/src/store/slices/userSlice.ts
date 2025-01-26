
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { googleSign, ReviewResponse, User, UserLogin } from '../../types/userTypes';
import { RootState } from '..';
import { ApiResponse } from '../../types/responseType';


export type UserRole = 'user' | 'admin' | 'institute' | 'tutor';


interface RegisterResponse {
  userDetails: User;
  data:any;
  status: number;
  message: string;
}

const baseQueryWithRole = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    
    let role: UserRole | null = 'user';
    if (role) {
      headers.set('role', role);
    }

    return headers;
  },
  credentials: 'include',
});
export const userSlice = createApi({
  reducerPath: 'userApi', 
  baseQuery: baseQueryWithRole as BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    initiateSignup: builder.mutation<RegisterResponse, Partial<User>>({
      query: (data) => ({
        url: '/users/initiate-register',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      transformResponse: (response: RegisterResponse) => {
        console.log("Transform response:", response);
        return response;
      },
      transformErrorResponse: (error: FetchBaseQueryError) => {
        console.log('Transform Error:', error);
        return error;
      },
      invalidatesTags: [{ type: 'User' }],
    }),

    verifyUser: builder.mutation({
      query: (data: { otp: string }) => ({
        url: '/users/verify-user',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      transformResponse: (response: RegisterResponse) => {
        console.log("Transform response:", response);
        return response;
      },
      transformErrorResponse: (error: FetchBaseQueryError) => {
        console.log('Transform Error:', error);
        return error;
      },

    }),

    resendOtp: builder.mutation<void, void>({
      query: () => ({
        url: '/users/resend-otp',
        method: 'POST',
        credentials: 'include'
      }),
      invalidatesTags: [{ type: 'User' }],
    }),
    

    register: builder.mutation<RegisterResponse, Partial<User>>({
      query: (data) => ({
        url: '/users/signup',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      transformResponse: (response: RegisterResponse) => {
        console.log("Transform response:", response);
        return response;
      },
      transformErrorResponse: (error: FetchBaseQueryError) => {
        console.log('Transform Error:', error);
        return error;
      },
      invalidatesTags: [{ type: 'User' }],
    }),
    login: builder.mutation<RegisterResponse, Partial<UserLogin>>({
      query: (data) => ({
        url: '/users/login',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      transformResponse: (response: RegisterResponse) => {
        console.log("Transform response:", response);
        return response;
      },
      transformErrorResponse: (error: FetchBaseQueryError) => {
        console.log('Transform Error:', error);
        return error;
      },
      invalidatesTags: [{ type: 'User' }],
    }),

    googleSign: builder.mutation({
      query: (data) => ({
        url: '/users/googleSign',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      transformResponse: (response: RegisterResponse) => {
        console.log("Transform response:", response);
        return response;
      },
      transformErrorResponse: (error: FetchBaseQueryError) => {
        console.log('Transform Error:', error);
        return error;
      },
      invalidatesTags: [{ type: 'User' }],
    }),


    createBook: builder.mutation<ApiResponse<null>, { body: FormData }>({
      query: ( payload ) => ({
        url: '/users/create-book', 
        method: 'POST',
        body: payload.body
      }),
      invalidatesTags: ['User']
    }),

    bookList: builder.query({
      query: ({ page = 1, limit = 4, search = '', filter='all', sort='newest' }) => ({
        url: '/users/book-list',
        params:{ page, limit, search, filter, sort },
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['User'],
     }),

     bookDelete: builder.mutation<any, {bookId:any}>({
      query: ({bookId}) => ({
          url: `/users/book-delete/?bookId=${bookId}`,
          method: 'DELETE',
          credentials: 'include'  
      }),
      invalidatesTags: ['User'],
    }),

    updateBook: builder.mutation<ApiResponse<null>, {values:any, id:any}>({
      query: ({values,id}) => ({
          url: `/users/book-update/?bookId=${id}`, 
          method: 'POST',
          body: values,
          credentials: 'include'  
      }),
      invalidatesTags: ['User'],
  }),

    

  }),

});

export const 
  { 
   useGoogleSignMutation,
   useRegisterMutation,
   useLoginMutation,
   useCreateBookMutation,
   useBookListQuery,
   useBookDeleteMutation,
   useUpdateBookMutation
  } = userSlice;

