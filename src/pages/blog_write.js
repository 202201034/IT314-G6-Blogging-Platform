"use client";

import { useState } from 'react';
import Navbar from './nav';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import Quill's styles
import { XIcon } from '@heroicons/react/solid'; // Import Heroicons XIcon for the delete button

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Blog submitted with:', { title, content, hashtags });
    // You would typically send the data to your server here using an API call
  };

  const addHashtag = () => {
    if (hashtagInput && !hashtags.includes(`#${hashtagInput}`)) {
      setHashtags([...hashtags, `#${hashtagInput}`]);
      setHashtagInput(''); // Clear input after adding
    }
  };

  const removeHashtag = (hashtagToRemove) => {
    setHashtags(hashtags.filter(hashtag => hashtag !== hashtagToRemove));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <Navbar />
      <div className="pl-10 mx-auto"> {/* Adjust margin to accommodate the fixed navbar */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create a Blog Post</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your blog title"
                required
              />
            </div>

            {/* React Quill Editor */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Blog Content
              </label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="h-auto mb-8"
                placeholder="Write your blog content here..."
                modules={modules} // Pass the modules configuration
              />
            </div>

            {/* Hashtag Input */}
            <div>
              <label htmlFor="hashtags" className="block text-sm font-medium text-gray-700 mb-1">
                Hashtags
              </label>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  id="hashtags"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  className="w-full px-4 py-2 border text-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter a hashtag"
                />
                <button
                  type="button"
                  onClick={addHashtag}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
              {/* Display hashtags */}
              <div className="flex flex-wrap space-x-2 ">
                {hashtags.map((hashtag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 mx-3 px-3 py-2 my-1 rounded-full text-sm flex items-center space-x-2">
                    <span>{hashtag}</span>
                    <button
                      type="button"
                      onClick={() => removeHashtag(hashtag)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Publish Blog
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Configure the Quill editor toolbar with font sizes from 1 to 6
const modules = {
  toolbar: [
    [{ 'font': [] }], // Include font options
    [{ 'size': ['small', 'medium', 'large', 'huge'] }], // Font sizes: small, medium, large, huge
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Headers (H1 to H6)
    ['bold', 'italic', 'underline', 'strike'], // Basic text formatting
    [{ 'list': 'ordered' }, { 'list': 'bullet' }], // List options
    [{ 'align': [] }], // Text alignment
    ['link', 'image', 'video'], // Include link, image, and video options
    [{ 'color': [] }, { 'background': [] }], // Text color and background color
    ['clean'] // Clear formatting
  ],
};
