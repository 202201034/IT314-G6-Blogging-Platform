import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import logo from './logo.png';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faSearch, faBell,faTrash } from '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import { useAuth } from '/firebase/auth.js';
import { collection, query, where, getDocs,orderBy, doc, getDoc,updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { format } from 'date-fns'; // If using date-fns

// Inside your notifications rendering section:


export default function Navbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { authUser, signOut } = useAuth();
  const searchRef = useRef(null);
  const profileMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const [notifications, setNotifications] = useState([]); // For storing notifications



  const handleLogout = async () => {
    try {
      await signOut(auth);
      Router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error.message);
    }
  };

  const handleCreateBlogClick = () => {
    if (authUser) {
      Router.push('/blog_write');
    } else {
      Router.push('/login');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      // Remove the notification with the given ID from the state
      const updatedNotifications = notifications.filter(
        (notification) => notification.id !== notificationId
      );
      setNotifications(updatedNotifications);
  
      // If there are no notifications left, close the notification menu
      if (updatedNotifications.length === 0) {
        setIsNotificationMenuOpen(false);
      }
  
      // Optionally, update Firestore if you're storing notifications there
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        notifications: updatedNotifications,
      });
  
      console.log('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  
  


  

  const handleProfileClick = () => {
    Router.push('/profile');
  };

  const stripHTML = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };
  
  const handleSearch = async (e) => {
    if (!searchTerm) return;
  
    try {
      console.log("Searching for:", searchTerm);
  
      // Query for users by username
      const userQuery = query(
        collection(db, 'users'),
        where('username', '>=', searchTerm),
        where('username', '<=', searchTerm + '\uf8ff')
      );
      const userSnap = await getDocs(userQuery);
      const users = userSnap.docs.map(doc => ({
        id: doc.id,
        username: doc.data().username,
        profileImage: doc.data().profileImage || '/default-avatar.png',
        type: 'user'
      }));
  
      console.log("Users found:", users);
  
      // Query for blogs by title
      const blogQuery = query(collection(db, 'blogs'));
      const blogSnap = await getDocs(blogQuery);
  
      // Filter blogs by converting title to plain text
      const blogs = blogSnap.docs
        .map(doc => {
          const title = doc.data().title;
          const plainTitle = stripHTML(title);
          return {
            id: doc.id,
            title, // HTML-formatted title
            plainTitle,
            type: 'blog'
          };
        })
        .filter(blog => blog.plainTitle.toLowerCase().includes(searchTerm.toLowerCase()));
  
      console.log("Blogs found:", blogs);
  
      // Combine results
      setSearchResults([...users, ...blogs]);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  


  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsNotificationMenuOpen(false);
  };

  const toggleNotificationMenu = async () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
    setIsProfileMenuOpen(false);
    console.log('notification');
  
    // Fetch notifications from Firestore when menu is opened
    if (!isNotificationMenuOpen && authUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          let notifications = userDoc.data().notifications || [];
  
          // Sort notifications by timestamp in descending order (latest first)
          notifications = notifications.sort((a, b) => b.timestamp - a.timestamp);
          console.log('notification');
          console.log(notifications);
  
          setNotifications(notifications);
        } else {
          console.log("No such user document.");
          return [];
        }
      } catch (error) {
        console.error("Error retrieving notifications:", error);
        return [];
      }
    }
  };
  

  const navItems = [
    { label: 'Explore', href: '#' },
    { label: 'Pricing', href: '#' },
  ];

  const handleSignIn = () => {
    Router.push('/login');
    setIsProfileMenuOpen(false);
  };

  let profileMenu;
  if (authUser) {
    profileMenu = (
      <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-md shadow-lg py-1 z-10 cursor-pointer">
        <button onClick={handleProfileClick} className="block w-full px-4 py-2 text-sm text-white text-left hover:bg-neutral-700 focus:outline-none">
          Profile
        </button>
        <button onClick={handleLogout} className="block w-full px-4 py-2 text-sm text-white text-left hover:bg-neutral-700 focus:outline-none">
          Sign Out
        </button>
      </div>
    );
  } else {
    profileMenu = (
      <div onClick={handleSignIn} className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-md shadow-lg py-1 z-10 cursor-pointer">
        <button className="block w-full px-4 py-2 text-sm text-white text-left hover:bg-neutral-700 focus:outline-none">
          Sign In
        </button>
      </div>
    );
  }


  // Close the menus when clicking outside
  useEffect(() => {

    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
        setIsNotificationMenuOpen(false);
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);


  return (
    <nav className="sticky bg-black top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/">
            <div className="flex items-center flex-shrink-0">
              <Image src={logo} alt="Logo" width={70} quality={100} placeholder="blur" />
              <span className="text-2xl tracking-tight">blogX</span>
            </div>
          </Link>

          {/* Search Field */}
          <div
            className="hidden lg:flex flex-grow mx-4 max-w-xl relative"
            ref={searchRef}
          >
            <input
              type="text"
              placeholder="Search Blog..."
              className="w-full py-2 pl-10 pr-4 text-white bg-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-neutral-800 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 mt-1">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => {
                      setSearchTerm(''); // Clear search input
                      setSearchResults([]);
                      Router.push(result.type === 'user' ? `/profile/${result.username}` : `/blog/${result.id}`);
                    }}
                    className="flex items-center p-2 hover:bg-neutral-700 cursor-pointer"
                  >
                    {result.type === 'user' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-2">


                        <Image
                          src={result.profileImage}
                          alt={result.username}
                          width={32}
                          height={32}
                          quality={100}
                          className="object-cover object-center w-full h-full "

                        />
                      </div>
                    )}
                    <p className="text-sm text-white">
                      {result.type === 'user' ? `${result.username}` : `Blog: ${result.plainTitle}`}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>


          {/* Nav Items */}
          <ul className="hidden lg:flex space-x-8 text-lg items-center">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            {/* Notification Bell (only show if user is authenticated) */}
            {authUser && (
              <div ref={notificationMenuRef} className="relative">
              <FontAwesomeIcon
                icon={faBell}
                onClick={toggleNotificationMenu}
                className="text-white text-xl cursor-pointer"
              />
              
              {isNotificationMenuOpen && (
                <div className="absolute top-full right-0 w-80 bg-neutral-800 rounded-md shadow-lg max-h-64 overflow-y-auto z-10 mt-2">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-neutral-700 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-white">{notification.message}</p>
                        <p className='text-xs'>
                          {notification.timestamp ? format(notification.timestamp.toDate(), 'MMM dd, yyyy HH:mm') : 'No timestamp'}
                        </p>
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}
          </ul>

          {/* Create New Blog Button and Profile Icon */}
          <div className="hidden lg:flex justify-center space-x-6 items-center">
            <button onClick={handleCreateBlogClick} className="create-new-blog-btn">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create New Blog
            </button>
            <div
              className="relative"
              ref={profileMenuRef}
            >
              <button onClick={toggleProfileMenu} className="focus:outline-none">
                <FontAwesomeIcon icon={faUser} className="text-white hover:text-orange-500" />
              </button>
              {isProfileMenuOpen && profileMenu}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
