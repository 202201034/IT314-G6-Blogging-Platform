"use client";

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; 
import { db, storage } from '../firebase/firebase'; 
import { useRouter } from 'next/router';
import { auth } from '../firebase/firebase';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null); 
  const [userBlogs, setUserBlogs] = useState([]);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch user data
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData);
            setName(userData.name);
            setBio(userData.bio || '');
            setUsername(userData.username);
            setProfileImage(userData.profileImage || '');

            // Fetch blogs by user
            const blogsQuery = query(collection(db, 'blogs'), where('userId', '==', currentUser.uid));
            const blogsSnapshot = await getDocs(blogsQuery);
            const blogsData = blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserBlogs(blogsData);

            // Get follower and following counts from the users table
            setFollowersCount(userData.followersCount || 0);
            setFollowingCount(userData.followingCount || 0);
          } else {
            setError("User document does not exist.");
          }
        } catch (error) {
          setError('Failed to fetch data: ' + error.message);
        }
      } else {
        setError("User not authenticated.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setImageFile(file); 
  };

  const uploadProfileImage = async () => {
    if (!imageFile) return;

    const imageRef = ref(storage, `profileImages/${auth.currentUser.uid}/${imageFile.name}`);

    if (profileImage) {
      const oldImageRef = ref(storage, profileImage);
      await deleteObject(oldImageRef).catch((error) => {
        console.error('Error deleting old image: ', error);
      });
    }

    await uploadBytes(imageRef, imageFile);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  };

  const checkUsernameAvailability = async (newUsername) => {
    const usernameQuery = query(collection(db, 'usernames'), where('username', '==', newUsername));
    const querySnapshot = await getDocs(usernameQuery);
    return querySnapshot.empty; // Return true if username is available
  };

  const handleSave = async () => {
    try {
      const currentUserUid = auth.currentUser.uid;

      // Check if the new username is available
      const usernameAvailable = await checkUsernameAvailability(username);
      if (!usernameAvailable) {
        setError('Username is already taken.');
        return;
      }

      // Remove old username from usernames collection if it exists
      const oldUsername = user.username;
      if (oldUsername) {
        await deleteDoc(doc(db, 'usernames', oldUsername));
      }

      // Upload profile image if it has changed
      let updatedProfileImage = profileImage;
      if (imageFile) {
        updatedProfileImage = await uploadProfileImage();
      }

      // Update user document
      await updateDoc(doc(db, 'users', currentUserUid), {
        name,
        bio,
        profileImage: updatedProfileImage,
        username, // Update username
      });

      // Add new username to usernames collection
      await setDoc(doc(db, 'usernames', username), {
        uid: currentUserUid,
      });

      setUser({ ...user, name, bio, profileImage: updatedProfileImage, username });
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(user.name);
    setBio(user.bio || '');
    setUsername(user.username);
  };

  const viewFollowers = async () => {
    // Redirect to followers page or show followers modal
    console.log('Followers:', followersCount);
  };

  const viewFollowing = async () => {
    // Redirect to following page or show following modal
    console.log('Following:', followingCount);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Profile</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
            {error}
          </div>
        )}
        {user ? (
          <div className="mb-6">
            <div className="flex items-center mb-8">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
              <h2 className="text-xl font-semibold m-auto text-gray-700">@{username}</h2>
            </div>
  
            <div className="flex justify-center mb-4">
              <div className="mx-2 text-center">
                <button onClick={viewFollowers} className="text-blue-500">{followersCount}</button>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div className="mx-2 text-center">
                <button onClick={viewFollowing} className="text-blue-500">{followingCount}</button>
                <p className="text-sm text-gray-500">Following</p>
              </div>
              <div className="mx-2 text-center">
                <p className="text-blue-500">{userBlogs.length}</p>
                <p className="text-sm text-gray-500">Blogs</p>
              </div>
            </div>
  
            {isEditing ? (
              <div>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={async (e) => {
                      setUsername(e.target.value);
                      const isAvailable = await checkUsernameAvailability(e.target.value);
                      setIsUsernameAvailable(isAvailable);
                    }}
                    className={`w-full px-4 py-2 border ${isUsernameAvailable ? 'border-gray-300' : 'border-red-500'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {!isUsernameAvailable && <p className="text-red-500">Username is taken.</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                  <input
                    type="file"
                    id="profileImage"
                    onChange={handleImageUpload}
                    className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Save</button>
                  <button onClick={handleCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="mb-2 font-bold text-xl text-black">{name}</h1>

                <p className="mb-2 text-gray-700">{bio}</p>
                <button onClick={handleEdit} className="text-blue-500">Edit Profile</button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">Loading...</p>
        )}
  
        <h2 className="text-xl font-bold mt-8 mb-4">Your Blogs ({userBlogs.length})</h2>
        {userBlogs.length > 0 ? (
          <ul className="space-y-4">
            {userBlogs.map((blog) => (
              <li key={blog.id} className="border border-gray-300 rounded-md p-4">
                <h3 className="text-xl font-semibold">{blog.title}</h3>
                <p className="text-gray-600">{blog.content.substring(0, 100)}...</p>
                <a href={`/blog/${blog.id}`} className="text-blue-500 hover:underline">Read More</a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No blogs found.</p>
        )}
      </div>
    </div>
  );
}
