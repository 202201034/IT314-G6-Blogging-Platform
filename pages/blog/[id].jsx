import styles from '../../styles/showBlog.module.css';

// libraries for like,share,... icon
import { HeartIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/outline';
import { FaHeart,FaRegHeart,FaBookBookmark,FaRegBookmark, FaBookmark, FaShare, FaShareNodes } from 'react-icons/fa6';
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi";
import { isLoggedIn } from '@/firebase/firebaseutils';
import { db } from '../../firebase/firebase';
import { doc, getDoc,writeBatch, userDoc, getDocs, collection, deleteDoc,setDoc,updateDoc,increment,arrayUnion,arrayRemove } from 'firebase/firestore';
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import Loader from '../components/Loader';
import CommentsSection from '../comment_section';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import { addNotificationToUser } from '@/firebase/firebaseutils';

const showBlog = ({ blog,username,profileImage }) => {

    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [error, setError] = useState('');
    const [currentusername, setcurrentusername] = useState('');
    const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
    const [savedBlogs, setSavedBlogs] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [blogusername, setBlogUserName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);


    // Fetch the current user's ID
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            setCurrentUser(user.uid); // Set current user's ID
            fetchSavedBlogs(user.uid);
            fetchBlogDetails(user.uid);
            fetchCurrentUsername(user.uid);
        } else {
            setCurrentUser(null); // No user is logged in
            setLoading(false); // Set loading false when the user is not logged in




        }
        });

        return () => unsubscribe();
    }, []);



    const fetchCurrentUsername = async (uid) => {
      try {
        const userRef = doc(db, 'users', uid); // Reference to the user document
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setcurrentusername(userDoc.data().username); // Set the current username
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    if (router.isFallback) {
        return <Loader />;
    }

    const name = 'name';
    const blogTitle = blog.title;
    const blogContent = blog.content;
    const blogId = blog.id;

    const [isLiked, setIsLiked] = useState(false); // Track like state
  const [likeCount, setLikeCount] = useState(0); // Track like count


  // Function to check if the current user has liked the blog
  const checkIfLiked = async () => {
    try {
      const userRef = doc(db, 'users', currentUser);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const likedBlogIds = userDoc.data().likedBlogIds || [];
        setIsLiked(likedBlogIds.includes(blogId)); // Set isLiked based on user data
        console.log('liked blog');
      }
    } catch (error) {
      console.error('Error checking if blog is liked:', error);
    }
  };

  useState(() => {
    if (currentUser) {
      checkIfLiked(); // Check if the current user has liked the blog
    }
  }, [currentUser]);

  const fetchBlogDetails = async (userId) => {
    setLoading(true);
    try {
      const blogRef = doc(db, "blogs", blogId);
      const blogDoc = await getDoc(blogRef);

      if (blogDoc.exists()) {
        setLikeCount(blogDoc.data().likeCount || 0);
      }

      if (userId) {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const likedBlogIds = userDoc.data().likedBlogIds || [];
          setIsLiked(likedBlogIds.includes(blogId));
        }
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
    }finally{
      setLoading(false);
    }
  };

  // Function to handle like/unlike
  //Optimized code for like unlike
  //Batch function used
  //Local states updated first
  const handleLike = async () => {
    console.log(currentUser);
    if (!currentUser) {
        router.push("/login");
        return;
    }

    setIsProcessing(true); // Prevent multiple clicks

    // Log blogId and currentUser.uid to check if they are valid
    console.log("blogId:", blogId);
    console.log("currentUser.uid:", currentUser?.uid);

    if (!blogId || !currentUser) {
        console.error("Invalid blogId or currentUser.uid");
        setIsProcessing(false);
        return;
    }

    try {
        const blogRef = doc(db, 'blogs', blogId); // Make sure blogId is valid
        const userRef = doc(db, 'users', currentUser); // Use currentUser.uid

        // Fetch user data to check likedBlogIds
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            console.error("User data not found");
            return;
        }

        const likedBlogIds = userDoc.data()?.likedBlogIds || []; // Safe access with optional chaining

        const currentLikeCount = likeCount; // Use local state

        if (likedBlogIds.includes(blogId)) {
            // Optimistic UI update
            setIsLiked(false);
            setLikeCount(currentLikeCount - 1);

            // Database operation in the background
            const batch = writeBatch(db);
            batch.update(blogRef, { likeCount: increment(-1) });
            batch.update(userRef, { likedBlogIds: arrayRemove(blogId) });
            await batch.commit();
        } else {
            setIsLiked(true);
            setLikeCount(currentLikeCount + 1);

            const batch = writeBatch(db);
            batch.update(blogRef, { likeCount: increment(1) });
            batch.update(userRef, { likedBlogIds: arrayUnion(blogId) });
            await batch.commit();

            const title = DOMPurify.sanitize(blog.title).replace(/<[^>]*>/g, '');
            const message = `${currentusername} liked your blog ${title}.`;
            const metadata = { type: "like", blogId: blogId };

            await addNotificationToUser(blog.userId, message, metadata);
        }
    } catch (error) {
        console.error('Error liking/unliking blog:', error);
        // Revert optimistic update if necessary
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } finally {
        setIsProcessing(false); // Re-enable the button
    }
};





  // Fetch the initial like status and count when component mounts

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/blog/${blogId}`; // Construct the URL
      await navigator.clipboard.writeText(url); // Copy to clipboard
      alert("Blog URL copied to clipboard!"); // Notify user
    } catch (error) {
      console.error("Failed to copy URL:", error);
      alert("Failed to copy URL. Please try again.");
    }
  };

    const fetchSavedBlogs = async (userId) => {
      try {
          const savedBlogsRef = doc(db, 'users', userId);
          const savedBlogsDoc = await getDoc(savedBlogsRef);
          if (savedBlogsDoc.exists()) {
              setSavedBlogs(savedBlogsDoc.data().savedBlogs || []);
          }
      } catch (error) {
          console.error('Error fetching saved blogs:', error);
      }
  };

  const handleSave = async () => {
      if (!currentUser) {
          router.push("/login");
          return;
      }

      const blogId = blog.id;
      const updatedSavedBlogs = savedBlogs.includes(blogId)
          ? savedBlogs.filter(id => id !== blogId) // Remove from saved if already saved
          : [...savedBlogs, blogId]; // Add to saved if not saved

      // Update the saved blogs in Firestore
      try {
          const userRef = doc(db, 'users', currentUser);
          await updateDoc(userRef, {
              savedBlogs: updatedSavedBlogs
          });
          setSavedBlogs(updatedSavedBlogs); // Update the state locally
      } catch (error) {
          console.error('Error updating saved blogs:', error);
          setError('Failed to save blog. Please try again.');
      }
  };

  const isSaved = savedBlogs.includes(blog.id); // Check if the blog is saved


    const handleCommentSend = () => {

    };

    const handleDotBtn = () => {

    };

    const followUser = async (userId, currentUserId) => {
        try {
          // Create a follow document in Firestore
          await setDoc(doc(db, 'follows', `${currentUserId}_${userId}`), {
            followerId: currentUserId,
            followingId: userId,
          });
      
          // Update follower and following counts
          const targetUserRef = doc(db, 'users', userId);
          const currentUserRef = doc(db, 'users', currentUserId);
      
          await updateDoc(targetUserRef, {
            followersCount: increment(1),
          });
      
          await updateDoc(currentUserRef, {
            followingCount: increment(1),
          });

          const metadata = { type: "follow" }; // Add relevant metadata

        const message = `${currentusername} followed you.`;


        await addNotificationToUser(userId, message, metadata);
      
          console.log("Successfully followed the user.");
        } catch (err) {
          console.error("Error following user: ", err);
          throw err;
        }
      };
      
      // Function to unfollow a user
    const unfollowUser = async (userId, currentUserId) => {
        try {
          // Unfollow user by deleting the follow document
          await deleteDoc(doc(db, 'follows', `${currentUserId}_${userId}`));
      
          // Update follower and following counts
          const targetUserRef = doc(db, 'users', userId);
          const currentUserRef = doc(db, 'users', currentUserId);
      
          await updateDoc(targetUserRef, {
            followersCount: increment(-1),
          });
      
          await updateDoc(currentUserRef, {
            followingCount: increment(-1),
          });
      
          console.log("Successfully unfollowed the user.");
        } catch (err) {
          console.error("Error unfollowing user: ", err);
          throw err;
        }
      };
      

    const checkIfFollowing = async (currentUserId, blogAuthorId) => {
        const followDocRef = doc(db, "follows", `${currentUserId}_${blogAuthorId}`);
        const followDoc = await getDoc(followDocRef);
        setIsFollowing(followDoc.exists());
      };

      useEffect(() => {
        if (currentUser && blog.userId) {
            checkIfFollowing(currentUser, blog.userId);
        }
    }, [currentUser, blog.userId]);
    
    
      const handleFollow = async () => {
        console.log('pressed');
        if (!isLoggedIn()) {
          router.push("/login");
          return;
        }
        console.log(currentUser);
        console.log(blog.userId);
        console.log(checkIfFollowing(currentUser,blog.userId));
        console.log(isFollowing);
    
        if (isFollowing) {
          setShowUnfollowConfirm(true);
        } else {
          try {
            console.log('pressed1');
            await followUser(blog.userId, currentUser);
            setIsFollowing(true);
          } catch (err) {
            setError(`Error following user: ${err.message}`);
          }
        }
      };
    
      const handleUnfollow = async () => {
        try {
          await unfollowUser(blog.userId, currentUser);
          setIsFollowing(false);
          setShowUnfollowConfirm(false);
        } catch (err) {
          setError(`Error unfollowing user: ${err.message}`);
        }
      };
    
      const cancelUnfollow = () => {
        setShowUnfollowConfirm(false);
      };
    
    const sanitizedContent = typeof window !== "undefined" ? DOMPurify.sanitize(blog.content) : blog.content;
    
    
    const handleDeleteBlog = async () => {
        console.log('handleDeleteBlog is called');
        if (!blogId) return; // Safety check
    
        try {
            const blogRef = doc(db, 'blogs', blogId);
            await deleteDoc(blogRef);
        
            // Clear the editor and reset the draft state
            console.log("I'm here");
            router.push('/profile');
            alert('Blog deleted successfully!');
        } catch (error) {
            console.error('Error deleting blog:', error);
            setError('Failed to delete blog. Please try again.');
        
            // Clear the error after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };
    if(loading){
      return(
        <Loader/>
      );
    }

    return (
        <div className={styles.blogContainer}>

            {/* scrollable section */}
            <div className={styles.leftSection}>
                <div className={styles.blogSection}>
                    <h1 className={styles.blogTitle}
                dangerouslySetInnerHTML={{
                    __html: blog.title, // Assume content is HTML stored in the database
                }}
                    />
                    <div
                className="ql-editor"
                dangerouslySetInnerHTML={{
                    __html: blog.content, // Assume content is HTML stored in the database
                }}
            />


                    {/* Render hashtags */}
                        {blog.hashtags && blog.hashtags.length > 0 && (
                        <div className="mt-5">
                            {blog.hashtags.map((tag, index) => (
                                <span key={index} className="bg-gray-200 text-gray-800 px-4 py-2 mt-2 rounded-full text-sm font-semibold">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {currentUser === blog.userId && (
                        <button onClick={() => router.push(`/blog_write?blogId=${blog.id}`)}
                        className="px-4 py-2 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-transparent"
                        style={{ backgroundColor: '#28a745',marginRight: 15,marginTop: 12}}
                        >
                            Edit blog
                        </button>
                    )}

                    {currentUser === blog.userId && (<button
                        type="button"
                        onClick={handleDeleteBlog}
                        className="px-4 py-2 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-0 focus:ring-transparent"
                        style={{ backgroundColor: '#dc3545' }} // Red color for the "Delete Draft" button
                        >
                            Delete Blog
                        </button>
                    )}

                </div>
            </div>


            {/* Static Section */}
            <div className={styles.rightSection}>
                <div className={styles.aboutBlog}>

                    <div className={styles.authorInfo}>
                    {profileImage
                     ? (
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                        <Image
      src={profileImage}  // URL of the profile picture
      alt="Author's Avatar"
      layout="fill"  // This will make the image fill the parent container
      objectFit="cover"  // Maintains aspect ratio while filling the container
      sizes="(max-width: 768px) 100vw, 300px"  // Adjust based on viewport width
    />
                    </div>
                    
                  
                ) : (
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                        <Image
      src="/profile_picture.png"  // URL of the profile picture
      alt="Author's Avatar"
      layout="fill"  // This will make the image fill the parent container
      objectFit="cover"  // Maintains aspect ratio while filling the container
      sizes="(max-width: 768px) 100vw, 300px"  // Adjust based on viewport width
    />
                    </div>
                )}
                        <div className={styles.authorDetails}>
                            <p>@{username}</p>
                        </div>
                        <div className={styles.btnSection}>
                        {currentUser !== blog.userId && (
            <button onClick={handleFollow} className={styles.followBtn}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
                        </div>
                       {/* Unfollow Confirmation Modal */}

                    </div>

                    {/* Comments Section */}
                    <div className={styles.commentsSection}>
                        <CommentsSection blogId={blog.id} />
                    </div>

                    {/* Blog Footer like share save other option */}
                    <div className={styles.likeSave}>
                        {/* Like icon */}
                        <button
                            // className="p-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-600"
                            aria-label="Like"
                            onClick={handleLike}
                        >
                            {isLiked ? (
          <FaHeart size={24} color="red" /> // Show filled heart if liked
        ) : (
          <FaRegHeart size={24} /> // Show outlined heart if not liked
        )}
                        </button>

                        {/* count a blogLike */}
                        <p>{likeCount} likes</p>

                        {/* Share icon */}
                        <button
                            // className="p-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-600"
                            aria-label="Share"
                            onClick={handleShare}
                        >
                            <FaShareNodes className="h-6 w-6 text-white" />
                        </button>

                        {/* Save icon */}
                        <button
                    aria-label="Bookmark"
                    onClick={handleSave}
                >
                    {isSaved ? (
                        <FaBookmark className="h-6 w-6 text-white" /> // Filled icon when saved
                    ) : (
                        <FaRegBookmark className="h-6 w-6 text-white" /> // Outline icon when not saved
                    )}
                </button>
                    </div>

                </div>

            </div>

            {showUnfollowConfirm && (
  <div className={styles.unfollowModal}>
    <div className={styles.unfollowModalContent}>
      <p>Are you sure you want to unfollow?</p>
      <div>
        <button 
          onClick={handleUnfollow} 
          className={`${styles.unfollowModalButton} ${styles.yesBtn}`}
        >
          Yes
        </button>
        <button 
          onClick={cancelUnfollow} 
          className={`${styles.unfollowModalButton} ${styles.noBtn}`}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
        </div>
    );
}

    export async function getStaticPaths() {
        // Fetch all blog IDs from Firestore
        const blogsSnapshot = await getDocs(collection(db, "blogs"));
        const paths = blogsSnapshot.docs.map((doc) => ({
        params: { id: doc.id },
        }));
    
        return {
        paths,
        fallback: true, // Enable fallback for dynamic generation
        };
    }

    export async function getStaticProps({ params }) {
        // Fetch the blog document from Firestore
        const docRef = doc(db, "blogs", params.id);
        const docSnap = await getDoc(docRef);
    
        if (!docSnap.exists()) {
            return {
                notFound: true, // Show a 404 page if the blog doesn't exist
            };
        }
    
        const blogData = docSnap.data();
        
        // Fetch user details using the userId from the blog data
        const userRef = doc(db, 'users', blogData.userId);  // Get the user document by userId
        const userSnapshot = await getDoc(userRef);
        
        let username = '';
        let profileImage = ''; // Declare a variable to hold the author's profile image
        if (userSnapshot.exists()) {
            username = userSnapshot.data().username;  // Get the username from the user document
            profileImage = userSnapshot.data().profileImage || ''; // Get the author's profile image URL
        }
    
        // Convert the Firestore timestamp to a string
        const blog = {
            id: params.id,
            ...blogData,
            timestamp: blogData.timestamp ? blogData.timestamp.toDate().toISOString() : null,
        };
    
        return {
            props: {
                blog,
                username,
                profileImage, // Pass the profileImage to the component
            },
            revalidate: 10, // Revalidate at most every 10 seconds
        };
    }
    

export default showBlog;