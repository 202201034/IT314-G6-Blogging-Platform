import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Router from 'next/router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '/firebase/auth.js';
import { db } from '@/firebase/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from 'firebase/firestore';
import Loader from './components/Loader';

export default function Home() {
  const { authUser, signOut } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      easing: 'ease-in-out', // Animation easing
      once: false, // Set to false to allow repeated animations
    });
  }, []);

  useEffect(() => {
    const fetchBlogsAndProfiles = async () => {
      try {
        setLoading(true); // Start loading
        const userInterests = authUser?.interests || [];
        let fetchedBlogs = [];
  
        console.log('User Interests:', userInterests);
  
        if (userInterests.length > 0) {
          const interestQuery = query(
            collection(db, 'blogs'),
            where('hashtags', 'array-contains-any', userInterests)
          );
          const querySnapshot = await getDocs(interestQuery);
          fetchedBlogs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
  
        if (fetchedBlogs.length === 0) {
          const popularQuery = query(
            collection(db, 'blogs'),
            orderBy('likes', 'desc'),
            limit(10)
          );
          const querySnapshot = await getDocs(popularQuery);
          fetchedBlogs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
  
        if (fetchedBlogs.length === 0) {
          const randomQuery = query(collection(db, 'blogs'), limit(10));
          const querySnapshot = await getDocs(randomQuery);
          fetchedBlogs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }
  
        const enrichedBlogs = await Promise.all(
          fetchedBlogs.map(async (blog) => {
            if (blog.userId) {
              const userQuery = query(
                collection(db, 'users'),
                where('uid', '==', blog.userId)
              );
              const userSnapshot = await getDocs(userQuery);
              const userData = userSnapshot.docs[0]?.data();
              return {
                ...blog,
                username: userData?.username || 'Unknown',
              };
            }
            return blog;
          })
        );
  
        setBlogs(enrichedBlogs.sort(() => 0.5 - Math.random()));
  
        if (userInterests.length > 0) {
          const profilesQuery = query(
            collection(db, 'users'),
            where('interests', 'array-contains-any', userInterests),
            limit(10)
          );
          const profilesSnapshot = await getDocs(profilesQuery);
          setProfiles(
            profilesSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        } else {
          const randomProfilesQuery = query(
            collection(db, 'users'),
            limit(10)
          );
          const profilesSnapshot = await getDocs(randomProfilesQuery);
          setProfiles(
            profilesSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      } catch (error) {
        console.error('Error in fetchBlogsAndProfiles:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    if (authUser !== undefined) { // Ensure auth state is resolved
      fetchBlogsAndProfiles();
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
        <section className={styles.section}>
          <h2 className={styles.sectionHeading1} data-aos="fade-up">
            Recent Blogs
          </h2>
          <div className={styles.cardContainer}>
            {[1, 2, 3].map((index) => (
              <div key={index} className={styles.card}>
                <h3 className={styles.cardTitle}>Blog {index}</h3>
                <p className={styles.cardDescription}>About blog {index}...</p>
                <Link href={`/blog/${index}`} className={styles.readMore}>
                  Read more
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
