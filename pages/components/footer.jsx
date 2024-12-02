"use client";
import Image from 'next/image';
import logo from './logo.png';

export default function Footer() {

  const scrollToTop = () => {
    console.log("scroll");
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-0 w-full">
      <div className="w-full p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-center">
          <a onClick={scrollToTop} className="hover:cursor-pointer flex items-center mb-4 sm:mb-0 space-x-auto rtl:space-x-reverse">
            <Image 
              src={logo} 
              alt="Logo" 
              width={70} 
              quality={100} 
              placeholder="blur" 
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              blogX
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 gap-x-8">
            <li>
              <button onClick={scrollToTop} className="hover:scale-120 text-xl md:text-xl">
                About
              </button>
            </li>
            <li>
              <button onClick={scrollToTop} className="hover:scale-120 text-xl md:text-xl">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={scrollToTop} className="hover:scale-120 text-xl md:text-xl">
                Licensing
              </button>
            </li>
            <li>
              <button onClick={scrollToTop} className="hover:scale-120 text-xl md:text-xl">
                Contact
              </button>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <p className="block text-sm text-gray-500 sm:text-center dark:text-gray-400 mb-4">
          Welcome to our blogging platform, where ideas meet creativity. Explore insightful articles, share your thoughts, and connect with a community of thinkers.
        </p>
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024 <a onClick={scrollToTop} className="hover:scale-120 cursor-pointer">blogX™</a>. @DAIICT
        </span>
      </div>
    </footer>
  );
}
