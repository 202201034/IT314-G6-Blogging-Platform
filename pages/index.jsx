import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Router from 'next/router';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '/firebase/auth.js';


export default function Home() {
  const { authUser, signOut } = useAuth();
  
  useEffect(() => {

    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      easing: 'ease-in-out', // Animation easing
      once: false, // Set to false to allow repeated animations
    });

  }, []);

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
          <p 
            className={styles.headerSubtext} 
            data-aos="fade-in"
          >
            Have something valuable to say? Share your thoughts, ideas, and expertise with the world! Writing a blog is more than just words.
          </p>
          <button 
            className={styles.writeButton} 
            onClick={handleCreateBlogClick} 
          >
            Write Blog
          </button>
        </div>
      </div>
      </div>

      {/*Main Content*/}
      <main className={styles.mainContent}>
        {/*Top Blogs Section*/}
        <section className={styles.section}>
          <h2 
            className={styles.sectionHeading} 
            data-aos="fade-up"
          >
            Top Blogs
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

        {/*People You Know Section*/}
        <section className={styles.section}>
          <h2 
            className={styles.sectionHeading1} 
            data-aos="fade-up"
          >
            People You Know
          </h2>
          <div className={styles.cardContainer}>
            {[1, 2, 3].map((index) => (
              <div key={index} className={styles.card}>
                <h3 className={styles.cardTitle}>Person {index}</h3>
                <p className={styles.cardDescription}>Details about person {index}...</p>
                <Link href={`/profile/${index}`} className={styles.readMore}>
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/*Recent Blogs Section*/}
        <section className={styles.section}>
          <h2 
            className={styles.sectionHeading1} 
            data-aos="fade-up"
          >
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


/*
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      { First Container }
      <div className={styles.firstContainer}>
        <h2>First Container</h2>
        <p>This is the first container content.</p>
      </div>

      { Centered Image with Overlay Text and Button }
      <div className={styles.imageWrapper}>
        <div className={styles.overlay}>
          <div className={styles.overlayText}>
            <h3 className={styles.overlayTitle}>Overlay Text</h3>
            <p className={styles.overlayDescription}>
              Some description about the image or its context.
            </p>
            <Link href="/write_blog" className={styles.overlayButton}>
              Go to Page
            </Link>
          </div>
        </div>
        { Image Container }
        <div className={styles.imageContainer}>
          <Image
            src="/home.jpg" // Replace with your image path
            alt="Image Description"
            layout="fill"
            objectFit="cover" // Ensures the image covers the container area
            className={styles.image}
          />
        </div>
      </div>

      { Second Container }
      <div className={styles.secondContainer}>
        <h2>Second Container</h2>
        <p>This is the second container content.</p>
      </div>
    </div>
  );
}
*/