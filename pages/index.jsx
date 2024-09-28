import localFont from "next/font/local";
import { GoSignOut } from "react-icons/go";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import Loader from "./components/Loader";
import { useEffect } from "react";
require('dotenv').config();

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Index() {
  const {authUser, isLoading, signOut} = useAuth();

    const router = useRouter();

  return (
    <main>
      <h1 className="text-center py-4 text-xl">Welcome to Our Blogging Website!</h1>

      {!authUser && (
        <div className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer" onClick={()=>router.push('../login')}>
          <GoSignOut size={18} />
          <span>Login</span>
        </div>
      )}

      {authUser && (
        <div className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer" onClick={signOut}>
          <GoSignOut size={18} />
          <span>Logout</span>
        </div>
      )}
    </main>
  )
}

