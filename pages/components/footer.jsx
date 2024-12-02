import Image from 'next/image';
import logo from './logo.png';

export default function footer() {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <footer class="bg-white rounded-lg shadow dark:bg-gray-900 m-0 w-full">
      <div class="w-full p-4 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <a onClick={scrollToTop} class="hover:cursor-pointer flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <Image 
              src={logo} 
              alt="Logo" 
              width={70} 
              quality={100} 
              placeholder="blur" 
            />
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              blogX
            </span>
          </a>
          <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400 gap-x-64">
            <li>
              <a href="#" class="hover:underline me-4 md:me-6 text-xl md:text-xl">
                About
              </a>
            </li>
            <li>
              <a href="#" class="hover:underline me-4 md:me-6 text-xl md:text-xl">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" class="hover:underline me-4 md:me-6 text-xl md:text-xl">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" class="hover:underline text-xl md:text-xl m-16">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <p class="block text-sm text-gray-500 sm:text-center dark:text-gray-400 mb-4">
          Welcome to our blogging platform, where ideas meet creativity. Explore insightful articles, share your thoughts, and connect with a community of thinkers.
        </p>
        <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024 <a onClick={scrollToTop} class="hover:underline cursor-pointer">blogX™</a>. @DAIICT
        </span>
      </div>
    </footer>
  );
}
