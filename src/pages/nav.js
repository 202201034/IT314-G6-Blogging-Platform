"use client";

import Link from 'next/link';
import { HomeIcon, SearchIcon, GlobeAltIcon, UserIcon, PencilAltIcon } from '@heroicons/react/solid';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white pb-4 w-auto fixed top-4 left-4 bottom-4 flex flex-col p-1 space-y-4 rounded-lg shadow-lg">
      <div className="flex flex-col mb-auto">
        {/* Logo and Title */}
        <div className="flex flex-col items-start mt-4 mb-40 ml-auto mr-auto">
          <h1 className="text-2xl text-indigo-600 font-bold mx-auto">Blog</h1>
          <h1 className="text-2xl font-bold mx-auto">Me</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-5">
          <Link href="/" className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded flex items-center space-x-2">
            <HomeIcon className="h-8 w-8" />
          </Link>
          <Link href="/home" className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded flex items-center space-x-2">
            <SearchIcon className="h-8 w-8" />
          </Link>
          <Link href="/home" className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded flex items-center space-x-2">
            <GlobeAltIcon className="h-8 w-8" />
          </Link>
          <Link href="/home" className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded flex items-center space-x-2">
            <UserIcon className="h-8 w-8" />
          </Link>
        </div>
      </div>

      {/* Create Blog Post Button */}
      <Link href="/blog_write" className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded flex items-center space-x-2">
        <PencilAltIcon className="h-8 w-8" />
      </Link>
    </nav>
  );
}
