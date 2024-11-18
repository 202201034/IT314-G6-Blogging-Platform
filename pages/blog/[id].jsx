import styles from '../../styles/showBlog.module.css';

// libraries for like,share,... icon
import { FaHeart, FaBookmark, FaEllipsisV } from 'react-icons/fa';
import { HeartIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/outline';
import { db } from '../../firebase/firebase';
import { doc, getDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import Loader from '../components/Loader';

// can use this after like = {red heart}

// <button
// style={{ border: 'none', background: 'none', cursor: 'pointer' }}
// >
// <FaHeart size={24} color="red" />
// </button>


// can use this after save = {saved}

// <button
// style={{ border: 'white', background: 'black', cursor: 'pointer' }}
// >
// <FaBookmark size={24} />
// </button>


const showBlog = ({ blog }) => {

    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [hashtags, setHashtags] = useState([]);

    // Fetch the current user's ID
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            setCurrentUser(user.uid); // Set current user's ID
        } else {
            setCurrentUser(null); // No user is logged in
        }
        });

    // console.log("Blog Id: ",blog.id);

        return () => unsubscribe();
    }, []);

    if (router.isFallback) {
        return <Loader />;
    }

    if (currentUser !== null) {
        if (currentUser === blog.userId) {
        console.log('I am the author');
        } else {
        console.log('You are not the author');
        console.log("Current User: ",currentUser);
        console.log(blog.authorId);
        }
    } else {
        console.log('Checking authentication status...');
    }

    const userName = 'userName';
    const name = 'name';
    const blogTitle = 'First Blog';
    const blogContent = 'Hello, my name is user\nDA-IICT\nHello, my name is user\nDA-IICT\nHello, my name is user\nDA-IICT\nHello, my name is user\nDA-IICT\nHello, my name is user\nDA-IICT\n';
    const likeCount = 0;
    const blogId = blog.id;

    const handleLike = () => {

    };

    const handleShare = () => {
    };

    const handleSave = () => {

    };

    const handleCommentSend = () => {

    };

    const handleDotBtn = () => {

    };
    
    const handleDeleteBlog = async () => {
        console.log('handleDeleteBlog is called');
        if (!blogId) return; // Safety check
    
        try {
            const blogRef = doc(db, 'blogs', blogId);
            await deleteDoc(blogRef);
        
            // Clear the editor and reset the draft state
            setTitle('');
            setContent('');
            setHashtags([]);
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

    const comments = [
        { user: "user1", comment: "comment1" },
        { user: "user2", comment: "comment2" },
        { user: "user3", comment: "comment3" },
        { user: "user4", comment: "comment4" },
        { user: "user5", comment: "comment5" },
    ];

    return (
        <div className={styles.blogContainer}>

            {/* scrollable section */}
            <div className={styles.leftSection}>
                <div className={styles.blogSection}>
                    <h1 className={styles.blogTitle}>
                        {blogTitle}
                    </h1>
                    <p className={styles.blogContent}>
                        {blogContent}
                    </p>

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
                    <div className={styles.authorName}>
                        <h2>Author</h2>
                    </div>
                    <div className={styles.authorInfo}>
                        <div className={styles.authorAvatar}>
                            👤
                        </div>
                        <div className={styles.authorDetails}>
                            <p>@{userName}</p>
                            <p>{name}</p>
                        </div>
                        <div className={styles.btnSection}>
                            <button className={styles.followBtn}>
                                Follow
                            </button>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className={styles.commentsSection}>
                        <div className={styles.barSection}>
                            {comments.map((item, index) => (
                                <div key={index} className={styles.commentInfo}>
                                    <div className={styles.cntAvatar}>
                                        👤
                                    </div>
                                    <div className={styles.comment}>
                                        <p className={styles.uName}>
                                            @{item.user}
                                        </p>
                                        <p className={styles.uComment}>
                                            {item.comment}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comment Input */}
                        <div className={styles.commentInput}>
                            <input type="text" placeholder="Comment..." />
                            <button className={styles.sendBtn}
                                onClick={handleCommentSend}
                            >
                                send
                            </button>
                        </div>
                    </div>

                    {/* Blog Footer like share save other option */}
                    <div className={styles.likeSave}>
                        {/* Like icon */}
                        <button
                            // className="p-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-600"
                            aria-label="Like"
                            onClick={handleLike}
                        >
                            <HeartIcon className="h-9 w-9 text-white" />
                        </button>

                        {/* count a blogLike */}
                        <p>{likeCount} likes</p>

                        {/* Share icon */}
                        <button
                            // className="p-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-600"
                            aria-label="Share"
                            onClick={handleShare}
                        >
                            <ShareIcon className="h-8 w-8 text-white" />
                        </button>

                        {/* Save icon */}
                        <button
                            // className="p-2 bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-gray-600"
                            aria-label="Bookmark"
                            onClick={handleSave}
                        >
                            <BookmarkIcon className="h-8 w-8 text-white" />
                        </button>
                    </div>

                    {/* Dot icon */}
                    <button
                        style={{
                            border: 'white',
                            cursor: 'pointer',
                            fontSize: '28px',
                            marginTop: '15px',
                        }}
                        onClick={handleDotBtn}
                    >
                        <FaEllipsisV />
                    </button>

                </div>

            </div>
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
    
        // Convert the Firestore timestamp to a string
        const blog = {
          id: params.id,
          ...blogData,
          timestamp: blogData.timestamp ? blogData.timestamp.toDate().toISOString() : null,
        };
    
    
        return {
            props: {
              blog,
            },
            revalidate: 10, // Revalidate at most every 10 seconds
        };
    }

export default showBlog;
