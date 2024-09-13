
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [followingBlogs, setFollowingBlogs] = useState([]);
  const [topBlogs, setTopBlogs] = useState([]);
  const [publicBlogs, setPublicBlogs] = useState([]);

  // Dummy blog data
  const dummyData = {
    following: [
      { id: 1, title: "Following Blog 1", excerpt: "This is a blog from someone you follow." },
      { id: 2, title: "Following Blog 2", excerpt: "Another blog from someone you follow." },
    ],
    top: [
      { id: 3, title: "Top Blog 1", excerpt: "This is a top-rated blog." },
      { id: 4, title: "Top Blog 2", excerpt: "Another top-rated blog." },
    ],
    public: [
      { id: 5, title: "Public Blog 1", excerpt: "This is a blog from a public account." },
      { id: 6, title: "Public Blog 2", excerpt: "Another public blog." },
    ]
  };

  useEffect(() => {
    // Instead of fetching from API, use dummy data for now
    setFollowingBlogs(dummyData.following);
    setTopBlogs(dummyData.top);
    setPublicBlogs(dummyData.public);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Home</h1>

        {/* Top Blogs Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">Top Blogs</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topBlogs.map(blog => (
              <div key={blog.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{blog.title}</h3>
                <p className="text-gray-600">{blog.excerpt}</p>
                <a href={`/blog/${blog.id}`} className="text-indigo-600 hover:underline">Read more</a>
              </div>
            ))}
          </div>
        </section>

        {/* Blogs from People You Follow */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">Blogs from People You Follow</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {followingBlogs.map(blog => (
              <div key={blog.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{blog.title}</h3>
                <p className="text-gray-600">{blog.excerpt}</p>
                <a href={`/blog/${blog.id}`} className="text-indigo-600 hover:underline">Read more</a>
              </div>
            ))}
          </div>
        </section>

        {/* Other Public Blogs */}
        <section>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">Other Public Blogs</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publicBlogs.map(blog => (
              <div key={blog.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">{blog.title}</h3>
                <p className="text-gray-600">{blog.excerpt}</p>
                <a href={`/blog/${blog.id}`} className="text-indigo-600 hover:underline">Read more</a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
