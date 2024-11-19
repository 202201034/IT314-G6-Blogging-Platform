import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase"; // Adjust based on your firebase config
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import CommentForm from "./comment_form"; // The comment form component

const CommentsSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Set to true if a user is logged in, false otherwise
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const q = query(
        collection(db, "blogs", blogId, "comments"),
        orderBy("timestamp")
      );
  
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Group comments by their parentId
      const repliesMap = {};
      commentsData.forEach((comment) => {
        const parentId = comment.parentId || "root"; // Use "root" for top-level comments
        if (!repliesMap[parentId]) {
          repliesMap[parentId] = [];
        }
        repliesMap[parentId].push(comment);
      });
  
      // Recursive function to nest replies
      const nestReplies = (parentId = "root") => {
        return (repliesMap[parentId] || []).map((comment) => ({
          ...comment,
          replies: nestReplies(comment.id), // Recursively find replies
        }));
      };
  
      const nestedComments = nestReplies(); // Start nesting from root-level comments
      setComments(nestedComments); // Update state with deeply nested comments
    };
  
    fetchComments();
  }, [blogId]);
  

  const renderComments = (commentsList) => {
    return (
      <div
        style={{
          maxHeight: "380px", // Set the max height for the comment section
          overflowY: "auto", // Enable vertical scrolling when content overflows
          paddingRight: "10px",
        }}
      >
        {commentsList.map((comment) => (
          <div
            key={comment.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              backgroundColor: "black", // Light bluish background
              borderRadius: "8px", // Rounded corners
              padding: "5px",
              marginBottom: "5px",
              marginLeft: comment.parentId ? "20px" : "0",
            }}
          >
            <div
              style={{
                fontSize: "20px", // Avatar size
                marginRight: "10px", // Space between avatar and text
              }}
            >
              👤
            </div>
            <div style={{ flexGrow: 1 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#3797ef", // Dark blue for contrast
                    margin: 0,
                  }}
                >
                  @{comment.username}
                </p>
              </div>
              <p
                style={{
                  marginTop: "5px", // Space between username and comment text
                  marginBottom: "5px",
                  color: "white", // Dark gray for readability
                }}
              >
                {comment.content}
              </p>
              {/* Render reply form only if authenticated */}
              {isAuthenticated && <CommentForm blogId={blogId} parentId={comment.id} />}
              {comment.replies && renderComments(comment.replies)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div>{renderComments(comments)}</div> {/* Render all comments */}
      {/* Render top-level comment form only if authenticated */}
      {isAuthenticated ? (
        <CommentForm blogId={blogId} />
      ) : (
        <p style={{ color: "#999", textAlign: "center", marginTop: "10px" }}>
          Please <strong>sign in</strong> to leave a comment.
        </p>
      )}
    </div>
  );
};

export default CommentsSection;
