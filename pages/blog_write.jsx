"use client";

import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { db, storage } from '../firebase/firebase';
import { collection, addDoc , doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, } from 'firebase/storage';
import 'react-quill/dist/quill.bubble.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId'); // Get the draftId from the URL
  const blogId = searchParams.get('blogId');
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);
  const [error, setError] = useState('');
  const auth = getAuth();
  const router = useRouter();
  const [draftIsHovered, setDraftIsHovered] = useState(false);
  const [publishIsHovered, setPublishIsHovered] = useState(false);
  const [addIsHovered, setAddIsHovered] = useState(false);


    //Quill Bubble Editor
    const handleTitleChange = (value) => {
      // Strip any block-level formatting like headers
      setTitle(value);
    };

  useEffect(() => {
    const fetchDraft = async () => {
      if (draftId) {
        try {
          const draftRef = doc(db, 'drafts', draftId);
          const draftDoc = await getDoc(draftRef);

          if (draftDoc.exists()) {
            const draftData = draftDoc.data();
            setTitle(draftData.title || '');
            setContent(draftData.content || '');

            // Remove only the first # at index 0 from each hashtag in the array
            const hashtagContent = draftData.hashtags;
            setHashtags(hashtagContent);

          } else {
            setError('Draft not found.');
          }
        } catch (error) {
          setError('Failed to fetch draft: ' + error.message);
        }
      }
      
    };

    fetchDraft();
  }, [draftId]);

  // Edit Blog

  useEffect(() => {
    const fetchBlog = async () => {
      
      if (blogId) {
        try {
          console.log("Fetching blog with ID:", blogId);
          const blogRef = doc(db, 'blogs', blogId);
          const blogDoc = await getDoc(blogRef);
  
          if (blogDoc.exists()) {
            const blogData = blogDoc.data();
            console.log("Fetched Blog Data:", blogData);
  
            // Safely set state to avoid null/undefined errors
            setTitle(blogData.title || '');
            console.log("Fetched Blog Data:", blogData);

            setContent(blogData.content || ''); // Ensure this is correctly set

            const hashtagContent = blogData.hashtags;
            setHashtags(hashtagContent);

          } else {
            console.error('No blog found with the given ID.');
            setError('Blog not found.');
          }
        } catch (error) {
          console.error('Error fetching blog:', error);
          setError('Failed to fetch blog: ' + error.message);
        }
      }
    };
  
    fetchBlog();
  }, [blogId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();  
    setIsSubmittingBlog(true);  
    setError('');

    try {


      if (!title.trim()) {
        setError('Title cannot be empty.');
        // Clear the error after 3 seconds
    setTimeout(() => {
      setError('');
    }, 3000);
        setIsSubmittingBlog(false);
        return;
      }
      if (!content.trim()) {
        setError('Content cannot be empty.')
        // Clear the error after 3 seconds
    setTimeout(() => {
      setError('');
    }, 3000);;
        setIsSubmittingBlog(false);
        return;
      }

      // Process content images before saving to Firestore
      const updatedContent = await processContentImages(content);

      const blogData = {
        title,
        content: updatedContent,
        hashtags,
        userId: auth.currentUser.uid,
        timestamp: new Date(),
      };
      

      if (blogId) {
        // Update existing blog
        const blogRef = doc(db, 'blogs', blogId);
        await updateDoc(blogRef, blogData);
        alert('Blog updated successfully!');
      } else {
          // Create a new blog
          await addDoc(collection(db, 'blogs'), blogData);
          alert('Blog submitted successfully!');
        }

      if (draftId) {
        // Delete the draft after publishing
        const draftRef = doc(db, 'drafts', draftId);
        await deleteDoc(draftRef);
      }

      setTitle('');
      setContent('');
      setHashtags([]);
    } catch (error) {
      console.error('Error submitting blog:', error);
      setError('Failed to submit blog. Please try again.');
    } finally {
      setIsSubmittingBlog(false); // Always stop submitting state
    }
  };

  const handleSaveDraft = async () => {

    

  // Check for empty fields
  if (!title.trim() && !content.trim()) {
    setError('Cannot save an empty draft.');
    
    // Clear the error after 3 seconds
    setTimeout(() => {
      setError('');
    }, 3000);
    
    return; // Exit function if validation fails
  }

    setIsSavingDraft(true);
    setError('');

    try {
      const updatedContent = await processContentImages(content);

      const draftData = {
        title,
        content: updatedContent,
        hashtags,
        userId: auth.currentUser.uid,
        timestamp: new Date(),
      };

      if (draftId) {
        // Update existing draft
        const draftRef = doc(db, 'drafts', draftId);
        await updateDoc(draftRef, draftData); // Use updateDoc instead of update
        alert('Draft updated successfully!');
      } else {
        // Create new draft
        await addDoc(collection(db, 'drafts'), draftData);
        alert('Draft saved successfully!');
      }
      setTitle('');
      setContent('');
      setHashtags([]);
    } catch (error) {
      console.error('Error saving draft:', error);
        setError('Failed to save draft. Please try again.');
      
        // Clear the error after 3 seconds
        setTimeout(() => {
        setError('');
        }, 3000);

    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (!draftId) return; // Safety check
  
    try {
      const draftRef = doc(db, 'drafts', draftId);
      await deleteDoc(draftRef);
  
      // Clear the editor and reset the draft state
      setTitle('');
      setContent('');
      setHashtags([]);
      router.push('/profile');
      alert('Draft deleted successfully!');
    } catch (error) {
      console.error('Error deleting draft:', error);
      setError('Failed to delete draft. Please try again.');
  
      // Clear the error after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
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



  return (
    <div className="p-6 flex items-center justify-center" style={{ backgroundColor: '#e9f0f5' }}>
      {error && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-md shadow-md z-50">
          {error}
        </div>
      )}
      
      <div className="pl-10 mx-auto">
        
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 mx-auto justify-center bg-black rounded-md">
            <div>
            <ReactQuill
                theme="bubble"
                value={title}
                onChange={handleTitleChange}
                className="bubble-editor"
                placeholder="Title"
                modules={bubbleModules}
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
                  style={{
                    backgroundColor: addIsHovered ? '#007acc' : '#008AFF', 
                    transition: 'background-color 0.3s ease', 
                  }}
                  onMouseEnter={() => setAddIsHovered(true)}
                  onMouseLeave={() => setAddIsHovered(false)} 
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


        <div className="flex justify-between items-center mt-10 mb-40">
          <div className="flex items-center space-x-2 mt-4">
            { !blogId && (<button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-transparent"
              style={{
                backgroundColor: draftIsHovered ? '#218838' : '#28a745', 
                transition: 'background-color 0.3s ease' 
              }}
              disabled={isSavingDraft}
              onMouseEnter={() => setDraftIsHovered(true)}  // Trigger hover effect
              onMouseLeave={() => setDraftIsHovered(false)}
            >
            {isSavingDraft ? 'Saving...' : 'Save Draft'}
            </button>
            )}
                
            {/* Conditionally Render Delete Draft Button */}
            {draftId && (
            <button
              type="button"
              onClick={handleDeleteDraft}
              className="px-4 py-2 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-transparent"
              style={{ backgroundColor: '#dc3545' }} // Red color for the "Delete Draft" button
            >
              Delete Draft
            </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-transparent"
            style={{
              backgroundColor: publishIsHovered ? '#007acc' : '#008AFF', // Darker blue on hover
              transition: 'background-color 0.3s ease', // Smooth transition
            }}
            disabled={isSubmittingBlog}
            onMouseEnter={() => setPublishIsHovered(true)}  // Trigger hover effect
              onMouseLeave={() => setPublishIsHovered(false)} // Reset hover effect
          >
          {isSubmittingBlog ? (blogId ? 'Saving Changes...' : 'Publishing...') : (blogId ? 'Save Changes' : 'Publish Blog')}
          </button>
        </div>
          </form>
      </div>
    </div>
  );
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

const bubbleModules = {
  toolbar: [
    ['bold', 'italic', 'underline','strike',{ 'header': 1 }, { 'header': 2 }], // Inline formatting options
  ],
  clipboard: {
    matchVisual: false // Prevents extra spacing on paste
  },
};
