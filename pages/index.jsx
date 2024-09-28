import localFont from "next/font/local";
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
  return (
    <main>
      <h1 className="text-center py-4 text-xl">Welcome to Our Blogging Website!</h1>
    </main>
  )
}

