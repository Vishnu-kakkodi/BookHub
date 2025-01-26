'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { User, Book, PlusCircle } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useBookListQuery, useCreateBookMutation } from '../../../store/slices/userSlice';
import { hydrateUser } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/store/hook';

const ProfileSection = () =>{ 

  const userdata = useAppSelector((state) => state.auth.userInfo);
  
  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Profile</h1>
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        <div>
          <h2 className="text-xl text-gray-600 font-semibold">{userdata?.userName}</h2>
          <p className="text-gray-600">{userdata?.email}</p>
        </div>
      </div>
      <div className="space-y-2">
        <p><strong>Username:</strong>{userdata?.userName}</p>
        <p><strong>Member Since:</strong> </p>
        <p><strong>Books Published:</strong> 5</p>
      </div>
    </div>
  </div>
);

}

export default ProfileSection;


