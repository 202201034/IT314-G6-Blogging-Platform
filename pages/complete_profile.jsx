'use client';

import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { auth, db } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { getDocs,query,collection,where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Loader from './components/Loader';

const ProfileSetup = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");

  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeInBytes = 1048487; // Approx. 1 MB
      if (file.size > maxSizeInBytes) {
        setImageError("Image size should be less than 1 MB.");
        setImagePreview(null); // Clear preview if invalid
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkUsernameAvailability = async (newUsername) => {
    try {
      newUsername = newUsername.trim();
      const usernameQuery = query(collection(db, "users"), where("username", "==", newUsername));
      const querySnapshot = await getDocs(usernameQuery);
      return (querySnapshot.empty); // Return true if username is available
    } catch (error) {
      console.error("Error checking username availability:", error);
      return false; // In case of error, return false (username might be taken or error occurred)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !age ) return;

    if (username.startsWith(" ")) {
      setError("Name cannot start with a space.");
      return;
    }

    const user = auth.currentUser;

    if (user) {
      try {
        const userDoc = doc(db, "users", user.uid);

        await setDoc(userDoc, {
          username: username,
          email: user.email,
          age,
          bio,
          location,
          interests,
          profileImage: imagePreview,
        }, { merge: true });

        router.push('/');
      } catch (error) {
        console.error("Error saving profile: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

// Same imports and code structure, just updating the return JSX:
return (
    <div className="min-h-screen flex">
      {/* Left Panel - Static Content */}
      <div className="hidden lg:flex lg:w-1/3 bg-gray-900 text-white flex-col justify-between p-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Welcome to the Community</h1>
          <p className="text-gray-400">Complete your profile to get started and connect with others.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">✨</div>
            <p className="text-sm text-gray-300">Personalize your profile</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">🤝</div>
            <p className="text-sm text-gray-300">Connect with others</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">🎯</div>
            <p className="text-sm text-gray-300">Share your interests</p>
          </div>
        </div>
      </div>
  
      {/* Right Panel - Form */}
      <div className="flex-1 bg-white">
        <div className="max-w-2xl mx-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center 
                              ${imagePreview ? 'bg-gray-100' : 'bg-gray-50 border-2 border-dashed border-gray-300'}`}>
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profilePicture"
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full 
                           cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </label>
              </div>
            </div>

            {imageError && (
                <div className="mt-4 text-red-500 border border-red-500 p-2 rounded">
                {imageError}
                </div>
            )}         
            {/* Form Fields with Modern Styling */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={async (e) => {
                    const newUsername = e.target.value;
                    setUsername(newUsername);
                    const isAvailable = await checkUsernameAvailability(newUsername);
                    setIsUsernameAvailable(isAvailable);
                  }}
                  className={`block w-full px-4 py-3 bg-gray-50 border ${isUsernameAvailable ? 'border-gray-300' : 'border-red-500'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black`}
                  placeholder="Choose your username"
                />
                {!isUsernameAvailable && <p className="text-red-500">Username is taken.</p>}
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  min="13"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  placeholder="Your age"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="mt-2 text-sm text-gray-500">Brief description for your profile.</p>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black pl-10"
                    placeholder="City, Country"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📍
                  </span>
                </div>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                <div className="relative">
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black pl-10"
                    placeholder="e.g. Technology, Travel, Food"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🏷️
                  </span>
                </div>
              </div>
            </div>

            {error && (
            <div className="mt-4 text-red-500 border border-red-500 p-2 rounded">
              {error}
            </div>
            )}
  
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 
                       transition-colors font-medium text-lg"
            >
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
