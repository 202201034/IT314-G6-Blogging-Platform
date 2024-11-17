import { useState,useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import Loader from "./components/Loader";

const provider = new GoogleAuthProvider();
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {authUser, isLoading, setAuthUser} = useAuth();
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/complete_profile");
    }
  }, [authUser,isLoading]);

  const signupHandler = async () => {
    if (!email || !password || !username) return;
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name in Firebase Authentication profile
      await updateProfile(user, {
        displayName: username,
      });

      // Add user data to Firestore 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: username,
        email: email,
        followersCount: 0,       // Initialize followers count
        followingCount: 0,      // Initialize following count

      });

      console.log("User registered and data saved in Firestore:", user);
    } catch (error) {
      if (error.code === "auth/weak-password") {
        setError("Password must be at least 6 characters long.");
      } else if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please use another email.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format. Please check your email.");
      } else {
        console.error("An error occurred:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user already exists in Firestore
      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        // Save new Google user data to Firestore
        await setDoc(userDoc, {
          name: user.displayName,
          email: user.email,
          uid: user.uid
        });
      }

      console.log("User signed in with Google and data stored in Firestore if new");
    } catch (error) {
      console.error("An error occurred while Signing in", error);
    }
  };

  return isLoading || (!isLoading && authUser) ? <Loader /> : (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-black to-black">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex max-w-4xl w-full">
        {/* Left side - image section */}
        <div className="hidden md:flex w-1/2 bg-black items-center justify-center relative">
          <Image
            src="/img.png"
            alt="Blogging site welcome image"
            layout="fill"
            objectFit="cover"
            className="opacity-60"
          />
          <div className="text-white p-8 absolute z-10">
            <h1 className="text-4xl font"><strong>Welcome to</strong> <br/> blogging site</h1>
            <p className="mt-4">Start sharing your thoughts with the world!</p>
          </div>
        </div>

        {/* Right side - form section */}
        <div className="flex-1 p-8 bg-white rounded-tr-lg rounded-br-lg">
          <h2 className="text-3xl font-semibold text-gray-700">Signup</h2>

          <form onSubmit={(e) => e.preventDefault()} className="mt-6">
            <div className="mt-4" >
              <label className="block text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                required
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-2 p-2 text-black bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 p-2 text-black bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full mt-2 p-2 text-black bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            {error && (
            <div className="mt-4 text-red-500 border border-red-500 p-2 rounded">
              {error}
            </div>
          )}

            <button
              type="submit"
              className="mt-6 w-full p-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-lg hover:shadow-xl transition duration-300"
              onClick={signupHandler}
            >
              Signup
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
            onClick={signInWithGoogle}
          >
            <FcGoogle size={18} />
            <span className="font-medium text-black group-hover:text-white">
              Sign Up with Google
            </span>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}