"use client";

import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import dynamic from 'next/dynamic';
import Loader from "./components/Loader";
import { db, storage } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();  
    setLoading(true);  // Start loading state
    setError('');

    try {
      const idToken = await auth.currentUser.getIdToken();
      
      // Process content images before saving to Firestore
      const updatedContent = await processContentImages(content);

      await addDoc(collection(db, 'blogs'), {
        title,
        content: updatedContent, // Save content with Firebase image URLs
        hashtags,
        userId: auth.currentUser.uid,
        timestamp: new Date(),
      });

      alert('Blog submitted successfully!');
      setTitle('');
      setContent('');
      setHashtags([]);
    } catch (error) {
      console.error('Error submitting blog:', error);
      setError('Failed to submit blog. Please try again.');
    } finally {
      setLoading(false); // Always stop loading state
    }
  };

  const processContentImages = async (htmlContent) => {
    const imgTagRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    let updatedContent = htmlContent;

    while ((match = imgTagRegex.exec(htmlContent)) !== null) {
      const imgSrc = match[1]; // Get the src value

      // If the image is base64-encoded, upload it to Firebase
      if (imgSrc.startsWith('data:image/')) {
        try {
          const imageRef = ref(storage, `images/${Date.now()}`);
          await uploadString(imageRef, imgSrc, 'data_url');
          const imageUrl = await getDownloadURL(imageRef);

          // Replace the base64 image with the Firebase URL in the content
          updatedContent = updatedContent.replace(imgSrc, imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          setError('Failed to upload images. Please try again.');
          return htmlContent; // Return the original content in case of error
        }
      }
    }

    return updatedContent; // Return the updated content with Firebase image URLs
  };

  const addHashtag = () => {
    if (hashtagInput && !hashtags.includes(`#${hashtagInput}`)) {
      setHashtags([...hashtags, `#${hashtagInput}`]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (hashtagToRemove) => {
    setHashtags(hashtags.filter(hashtag => hashtag !== hashtagToRemove));
  };

  if(isLoading) return <Loader />;
  else{
  return (
    <div className="p-6 flex items-center justify-center" style={{ backgroundColor: '#e9f0f5' }}>
      <div className="pl-10 mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
            <div>
              <textarea
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onInput={(e) => {
                  // Reset height to auto to get the new scroll height
                  e.target.style.height = 'auto';
                  // Setting the height to the scroll height to allow vertical expansion
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className="w-full px-4 py-2 bg-transparent rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-transparent sm:text-4xl"
                placeholder="Title"
                rows = "1"
                resize = "none"
                required
              />
            </div>

            <div>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="h-auto mb-8"
                placeholder="Write your blog content here..."
                modules={modules}
              />
            </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  id="hashtags"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  className="w-full px-3 py-2 p-1 mx-auto justify-center bg-black rounded-md focus:outline-none focus:ring-0 focus:ring-transparent"
                  placeholder="Add your hastags here"
                />
                <button
                  type="button"
                  onClick={addHashtag}
                  className="px-4 py-2 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-transparent"
                  style={{ backgroundColor: '#008AFF' }}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap space-x-2">
                {hashtags.map((hashtag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 mx-3 px-3 py-2 my-1 rounded-full text-sm flex items-center space-x-2">
                    <span>{hashtag}</span>
                    <button
                      type="button"
                      onClick={() => removeHashtag(hashtag)}
                      className="text-blue-500 hover:text-blue-500 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 101.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-transparent"
              style={{ backgroundColor: '#008AFF' }}
              disabled={loading} // Disable the button while loading
            >
              {loading ? 'Submitting...' : 'Publish Blog'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
      </div>
    </div>
  );
  }
}

const modules = {
  toolbar: [
    [{ 'font': [] }],
    [{ 'size': ['small', 'medium', 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ],
};
