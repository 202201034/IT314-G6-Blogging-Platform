import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { auth } from "../firebase/firebase";
import {GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";

const provider = new GoogleAuthProvider();


export default function Login() {

  const [email, setEmail] = useState("null");
  const [password, setPassword] = useState("null");

    const loginHandler = async ()=> {
        if(!email || !password)
            return;
        try {
        const user = await signInWithEmailAndPassword(auth,email,password)
        console.log(user);
        }
        catch(error){
            console.error("An error occured",error); 
        }
    }
  const signInWithGoogle = async () => {
    try{
    const user = await signInWithPopup(auth,provider)
    console.log(user);
    }
    catch (error){
        console.error("An error occured",error);
    }
  }
  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-black to-black">
    <div className="bg-white shadow-lg rounded-lg overflow-hidden flex max-w-4xl w-full">
      {/* Left side - image section */}
      <div className="hidden md:flex w-1/2 bg-black items-center justify-center relative">
        <Image 
          src="/black_img.png" 
          alt="Blogging site welcome image"
          layout="fill" // This will make the image cover the entire container
          objectFit="cover" // This ensures the image covers the div without distortion
          className="opacity-60" // Optional: adjust opacity if you want a more subtle image
        />
        <div className="text-white p-8 absolute z-10">
          <h1 className="text-4xl font"><strong>Welcome to</strong> <br/> blogging site</h1>
          <p className="mt-4">Start sharing your thoughts with the world!</p>
        </div>
      </div>
  
        {/* Right side - form section */}
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-semibold text-gray-700">Login</h2>
          
          <form onSubmit={(e) => e.preventDefault()} className="mt-6">

            <div className="mt-4">
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 p-2 border rounded-lg"
                placeholder="Enter your Email"
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-2 border rounded-lg"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full p-3 bg-gradient-to-r from-gray-800 to-gray-600 text-white font-semibold rounded-lg"
              onClick={loginHandler}>
              Log in
            </button>
          </form>

          <div className="flex items-center justify-between mt-6">
            <hr className="w-full border-gray-300" />
            <span className="mx-2 text-gray-500">Or</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Signup with Google */}

          <div
            className="bg-black/[0.05] text-white w-full py-4 mt-10 rounded-full transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
            onClick={signInWithGoogle}>
            <FcGoogle size={18} />
            <span className="font-medium text-black group-hover:text-white">
            Login in with Google
            </span>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
