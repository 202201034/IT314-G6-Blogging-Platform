import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Router from 'next/router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '/firebase/auth.js';
import { db } from '@/firebase/firebase';
import { auth } from '@/firebase/firebase';
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  getDoc,
  getDocs,
  limit,
} from 'firebase/firestore';
import Loader from './components/Loader';

export default function Home() {
  const { authUser, signOut } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedBlogs, setSavedBlogs] = useState([]);


  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      easing: 'ease-in-out', // Animation easing
      once: false, // Set to false to allow repeated animations
    });
  }, []);

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      let saveBlogs = [];
      if (authUser) {
        // Assuming the saved blog IDs are stored in the 'savedBlogs' field of the user's document
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userSnapshot = await getDoc(userDocRef);
        const userData = userSnapshot.data();
        console.log(userData.savedBlogs);
        console.log(userData?.savedBlogs?.length);
    
        // If there are saved blogs, fetch their details
        if (userData?.savedBlogs?.length > 0) {
          const savedBlogIds = userData.savedBlogs;
          console.log(savedBlogs.length);
          
          // Fetch blogs one by one
          for (let i = 0; i < savedBlogIds.length; i++) {
            try {
              const blogRef = doc(db, 'blogs', savedBlogIds[i]);
              const blogSnap = await getDoc(blogRef);
              
              if (blogSnap.exists()) {
                saveBlogs.push({ id: blogSnap.id, ...blogSnap.data() });
              }
            } catch (error) {
              console.error('Error fetching saved blog with ID:', savedBlogIds[i], error);
            }
          }
        }
        }
      return saveBlogs;
    };
    
    const fetchBlogsAndProfiles = async () => {
      try {
        setLoading(true); // Start loading
        const userInterests = authUser?.interests || [];
        
        const fetchBlogs = async () => {
          let blogs = [];
          if (userInterests.length > 0) {
            const interestQuery = query(
              collection(db, 'blogs'),
              where('hashtags', 'array-contains-any', userInterests)
            );
            const querySnapshot = await getDocs(interestQuery);
            blogs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          }
    
          if (blogs.length < 10) {
            const popularQuery = query(collection(db, 'blogs'), orderBy('likes', 'desc'), limit(10));
            const querySnapshot = await getDocs(popularQuery);
            blogs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          }
    
          if (blogs.length < 10) {
            const randomQuery = query(collection(db, 'blogs'), limit(10));
            const querySnapshot = await getDocs(randomQuery);
            blogs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          }
    
          return Promise.all(
            blogs.map(async (blog) => {
              if (blog.userId) {
                const userQuery = query(collection(db, 'users'), where('uid', '==', blog.userId));
                const userSnapshot = await getDocs(userQuery);
                const userData = userSnapshot.docs[0]?.data();
                return { ...blog, username: userData?.username || 'Unknown' };
              }
              return blog;
            })
          );
        };
    
        const fetchProfiles = async () => {
          let profiles = [];
          if (userInterests.length > 0) {
            const profilesQuery = query(
              collection(db, 'users'),
              where('interests', 'array-contains-any', userInterests),
              limit(10)
            );
            const profilesSnapshot = await getDocs(profilesQuery);
            profiles = profilesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          } 
          if (profiles.length < 10) {
            const profilesCollection = collection(db, 'users');
            
            // Step 1: Fetch all profiles
            const snapshot = await getDocs(profilesCollection);
            const allProfiles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        
            // Step 2: Shuffle the profiles
            const shuffledProfiles = allProfiles.sort(() => Math.random() - 0.5);
        
            // Step 3: Add random profiles to the existing list
            profiles = [...profiles, ...shuffledProfiles.slice(0, 10 - profiles.length)];
          }
                   
          return profiles;
        };
    
        const [blogs, profiles, savedBlogs] = await Promise.all([fetchBlogs(), fetchProfiles(), fetchSavedBlogs()]);
        setBlogs(blogs.sort(() => 0.5 - Math.random()));
        setProfiles(profiles.sort(() => 0.5 - Math.random()));
        setSavedBlogs(savedBlogs);
      } catch (error) {
        console.error('Error in fetchBlogsAndProfiles:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    
  
    if (authUser !== undefined) { // Ensure auth state is resolved
      fetchBlogsAndProfiles();
      fetchSavedBlogs();
    }
  }, [authUser]);
  

  if (loading) {
    return <Loader />;
  }

  const handleCreateBlogClick = () => {
    if (authUser) {
      Router.push('/blog_write');
    } else {
      Router.push('/login');
    }
  };

  return (
    <div className={styles.container}>
      {/*Header Section*/}
      <header className={styles.header}>
        <h1 className={styles.tagline}>Be informed with daily updates and explore.</h1>
      </header>

      {/*Image Wrapper*/}
      <div className={styles.headerImageWrapper}>
        <div className={styles.overlay}>
          <div className={styles.overlayText}>
            <p className={styles.headerSubtext} data-aos="fade-in">
              Have something valuable to say? Share your thoughts, ideas, and expertise with the world! Writing a blog is more than just words.
            </p>
            <button className={styles.writeButton} onClick={handleCreateBlogClick}>
              Write Blog
            </button>
          </div>
        </div>
      </div>

      {/*Main Content*/}
      <main className={styles.mainContent}>
        {/*Top Blogs Section*/}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading} data-aos="fade-up">
            Top Blogs
          </h2>
          <div className={styles.cardContainer}>
            {blogs.map((blog) => (
              <div key={blog.id} className={styles.card}>
                <h3 className={styles.cardTitle} dangerouslySetInnerHTML={{ __html: blog.title }} />
                <h3 className={styles.cardDescription} dangerouslySetInnerHTML={{ __html: blog.username }} />
                <Link href={`/blog/${blog.id}`} className={styles.readMore}>
                  Read more
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/*Recommended Profiles Section*/}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading1} data-aos="fade-up">
            Recommended Profiles
          </h2>
          <div className={styles.cardContainer}>
            {profiles.map((profile) => (
              <div key={profile.id} className={styles.card}>
                <h3 className={styles.cardTitle}>{profile.username}</h3>
                <p className={styles.cardDescription}>{profile.bio || 'No bio available'}</p>
                <Link href={`/profile/${profile.username}`} className={styles.readMore}>
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/*Recent Blogs Section*/}
        {savedBlogs.length > 0 && (
  <section className={styles.section}>
    <h2 className={styles.sectionHeading1} data-aos="fade-up">
      Saved Blogs
    </h2>
    <div className={styles.cardContainer}>
      {savedBlogs.map((blog) => (
        <div key={blog.id} className={styles.card}>
          <h3 className={styles.cardTitle} dangerouslySetInnerHTML={{ __html: blog.title }} />
          <h3 className={styles.cardDescription} dangerouslySetInnerHTML={{ __html: blog.username }} />
          <Link href={`/blog/${blog.id}`} className={styles.readMore}>
            Read more
          </Link>
        </div>
      ))}
    </div>
  </section>
)}
      </main>
    </div>
  );
}
