import React, { useState, useEffect} from 'react';
import Image from 'next/image';
import logo from './logo.png';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import { useAuth } from "/firebase/auth.js";

export default function Navbar() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const { authUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      Router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    { label: "Explore", href: "#" },
    { label: "Pricing", href: "#" },
  ];

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsNotificationMenuOpen(false);
  };

  const toggleNotificationMenu = () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Search submitted');
  };

  const handleSignIn = () => {
    Router.push('../login');
    setIsProfileMenuOpen(false);
  };
  const handleProfileClick = () => {
    Router.push('/profile'); // Redirect to the profile page
  };

  let navitem;
  if(authUser){
    navitem=(
    <div  className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-md shadow-lg py-1 z-10 cursor-pointer">
      <button onClick={handleProfileClick} className="block w-full px-4 py-2 text-sm text-white text-left hover:bg-neutral-700 focus:outline-none">
        Profile
      </button>
      <button onClick={handleSignOut} className="block w-full px-4 py-2 text-sm text-white text-left hover:bg-neutral-700 focus:outline-none">
        Sign Out
      </button>

    </div>);
  }
  else{
    navitem=(
      <div onClick={handleSignIn} className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-md shadow-lg py-1 z-10 cursor-pointer">
        <button className="block w-full px-4 py-2 text-sm text-white text-left hover:bg-neutral-700 focus:outline-none">
          Sign In
        </button>
      </div>)
  }

  return (
    <nav className="sticky bg-black top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80" >
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link href="/">
          <div className="flex items-center flex-shrink-0">
            <Image
              src={logo}
              alt="Logo"
              width={70}
              quality={100}
              placeholder="blur"
            />
            <span className="text-2xl tracking-tight">blogX</span>
          </div>
          </Link>

          {/* Search Field */}
          <div className="hidden lg:flex flex-grow mx-4 max-w-xl">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Blog..."
                  className="w-full py-2 pl-10 pr-4 text-white bg-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
              </div>
            </form>
          </div>

          {/* Nav Items */}
          <ul className="hidden lg:flex space-x-8 text-lg items-center">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            {/* Notification Bell */}
            <li className="relative">
              <button onClick={toggleNotificationMenu} className="focus:outline-none">
                <FontAwesomeIcon icon={faBell} className="text-white hover:text-orange-500" />
              </button>
              {isNotificationMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-neutral-800 rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 font-semibold text-white border-b border-neutral-700">Notifications</div>
                  <div className="max-h-64 overflow-y-auto">
                    {/* Example notifications */}
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-neutral-700">New comment on your blog</a>
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-neutral-700">You have a new follower</a>
                    {/* Add more notifications as needed */}
                  </div>
                </div>
              )}
            </li>
          </ul>

          {/* Create New Blog Button and Profile Icon */}
          <div className="hidden lg:flex justify-center space-x-6 items-center">
            <a href="/blog_write" className="create-new-blog-btn">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create New Blog
            </a>
            <div className="relative">
              <button onClick={toggleProfileMenu} className="focus:outline-none">
                <FontAwesomeIcon icon={faUser} className="text-white hover:text-orange-500" />
              </button>
              {isProfileMenuOpen && (navitem)}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}