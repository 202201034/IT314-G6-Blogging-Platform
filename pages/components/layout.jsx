import { Rubik } from 'next/font/google'
import Router from 'next/router';
import { useRouter } from 'next/router';
import { useEffect, useState} from 'react';
//components
import Navbar from './navbar'

const rubik = Rubik({ subsets: ['latin'] })
  
export default function RootLayout({ children }) {
  const router = useRouter();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    // Check if the current route is the login page
    const isLoginPage = router.pathname === '/login';
    const isregisterPage = router.pathname === '/register';

    setShowNavbar((!isLoginPage) && (!isregisterPage));
  }, [router.pathname]);

  return (
    <>
      <div className={rubik.className}>
      {showNavbar && <Navbar />}
        {children}
      </div>
    </>
  )
}