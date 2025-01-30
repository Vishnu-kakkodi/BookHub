'use client';
import React, { useState } from 'react';
import { useAppSelector } from '@/store/hook';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/Badge";
import { Camera, Calendar, Mail, User, Clock, Award, BookOpen, Star, Eye } from "lucide-react";
import { useProfilePhotoMutation } from '@/store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { updateUserField } from '@/store/slices/authSlice';
import withAuth from '@/hoc/withAuth';

interface FileEvent extends React.ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}

const ProfileSection = () => {
  const userdata = useAppSelector((state) => state.auth.userInfo);
  console.log(userdata?.userName)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePhoto] = useProfilePhotoMutation();
  const dispatch = useDispatch();

  const handleFileChange = (event: FileEvent) => {
    const file = event.target.files[0];
    
    // Reset states
    setError(null);
    setSuccess(null);
    
    // Validate file type
    if (file && !file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file && file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    if (!userdata?._id) {
      setError('User ID is missing.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('profileImage', selectedFile);
    formData.append('userId', userdata._id);

    try {
      const response = await profilePhoto({ body: formData }).unwrap();
      if (response.data?.profilePhoto) {
        dispatch(updateUserField({
          field: 'profilePhoto',
          value: response.data.profilePhoto
        }));
        setSuccess('Profile photo updated successfully!');
      } else {
        throw new Error('Profile photo URL not received');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      return;
    } finally {
      setIsUploading(false);
    }
  };

  const StatCard = ({ value, label, icon: Icon }: { value: string | number, label: string, icon: React.ElementType }) => (
    <div className="p-4 bg-gray-50 rounded-lg text-center">
      <div className="flex items-center justify-center mb-2">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative group">
              {/* Profile Image Container */}
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : userdata?.profilePhoto ? (
                  <img
                    src={userdata.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>

              {/* Camera Button */}
              <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg cursor-pointer">
                <label className="cursor-pointer">
                  <Camera className="w-4 h-4 text-gray-600" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 text-green-600 text-sm rounded">
                  {success}
                </div>
              )}

              {/* Upload Button */}
              {selectedFile && (
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed w-full transition-colors duration-200"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{userdata?.userName}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {userdata?.email}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Member since 2024
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Premium Author
                </Badge>
              </div>
              <p className="text-gray-600 max-w-2xl">
                {userdata?.bio || "No bio provided yet. Tell us about yourself!"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
          {/* <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-500">Personal Info</h3>
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Username:</span> {userdata?.userName}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Email:</span> {userdata?.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-500">Activity</h3>
                  <p className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Published Books:</span> 5
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Last Active:</span> Today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="publications">
          <Card>
            <CardHeader>
              <CardTitle>Recent Publications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {[1, 2, 3].map((book) => (
                  <div key={book} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Book Title {book}</h3>
                      <p className="text-sm text-gray-600">Published on January {book}, 2024</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Author Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  value={5}
                  label="Published Books"
                  icon={BookOpen}
                />
                <StatCard
                  value="1.2K"
                  label="Total Views"
                  icon={Eye}
                />
                <StatCard
                  value={4.8}
                  label="Average Rating"
                  icon={Star}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default withAuth(ProfileSection);