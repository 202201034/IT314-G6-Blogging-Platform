import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase"; // Adjust based on your firebase config
import { collection, query, orderBy, getDocs, onSnapshot, where } from "firebase/firestore";
import CommentForm from "./comment_form"; // The comment form component
import { addDoc,deleteDoc,doc } from "firebase/firestore";

const CommentsSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profilePictures, setProfilePictures] = useState({}); // Cache for profile pictures
  const [loadingUsernames, setLoadingUsernames] = useState(new Set()); // Track which users are being fetched

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Set true if user is logged in
    });

    return () => unsubscribe();
  }, []);

  // Fetch comments in real-time
  useEffect(() => {
    const q = query(collection(db, "blogs", blogId, "comments"), orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const repliesMap = {};
      commentsData.forEach((comment) => {
        const parentId = comment.parentId || "root";
        if (!repliesMap[parentId]) repliesMap[parentId] = [];
        repliesMap[parentId].push(comment);
      });

      const nestReplies = (parentId = "root") => {
        return (repliesMap[parentId] || []).map((comment) => ({
          ...comment,
          replies: nestReplies(comment.id),
        }));
      };

      const nestedComments = nestReplies();
      setComments(nestedComments);
    });

    return () => unsubscribe();
  }, [blogId]);

  // Function to fetch user data by username
  const getUserByUsername = async (username) => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log(username);

        return userData;
      } else {
        console.log("No user found with this username.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Fetch profile picture only if it's not already fetched
  const fetchProfilePicture = async (username) => {
    if (profilePictures[username] || loadingUsernames.has(username)) return; // Skip if already fetched or loading
    setLoadingUsernames((prev) => new Set(prev).add(username)); // Mark as loading

    const userData = await getUserByUsername(username);
    if (userData) {
      setProfilePictures((prev) => ({
        ...prev,
        [username]: userData.profileImage || "/profile_picture.png",
      }));
    }
    setLoadingUsernames((prev) => {
      const newSet = new Set(prev);
      newSet.delete(username); // Mark as loaded
      return newSet;
    });
  };
  const deleteComment = async (commentId) => {
    try {
      // Remove the comment from Firestore
      await deleteDoc(doc(db, "blogs", blogId, "comments", commentId));
  
      // Update the local comments state
      const removeComment = (commentsList) => {
        return commentsList
          .filter((comment) => comment.id !== commentId) // Remove the comment with the matching ID
          .map((comment) => ({
            ...comment,
            replies: comment.replies ? removeComment(comment.replies) : [],
          }));
      };
  
      setComments((prevComments) => removeComment(prevComments));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  

  // Fetch profile pictures for all comments' usernames
  useEffect(() => {
    const usernamesToFetch = [...new Set(comments.map((c) => c.username))];
    if (auth.currentUser) {
      usernamesToFetch.push(auth.currentUser.displayName); // Add the current user's username
    }
    usernamesToFetch.forEach((username) => fetchProfilePicture(username));
  }, [comments]); // Trigger when comments change

  // Render the comments with profile pictures
  const renderComments = (commentsList) => {
    return (
      <div style={{ maxHeight: "460px", overflowY: "auto", paddingRight: "10px" }}>
        {commentsList.map((comment) => (
          <div
            key={comment.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              backgroundColor: "black",
              borderRadius: "8px",
              padding: "5px",
              marginBottom: "5px",
              marginLeft: comment.parentId ? "20px" : "0",
            }}
          >
            <div style={{ marginRight: "10px",  width: "32px"}}>
              <img
                src={profilePictures[comment.username] || "/profile_picture.png"}
                alt={comment.username}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontWeight: "bold", color: "#3797ef", margin: 0 }}>
                  @{comment.username}
                </p>
                {isAuthenticated && auth.currentUser.uid === comment.userId && (
                  <button
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => deleteComment(comment.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p style={{ marginTop: "5px", marginBottom: "5px", color: "white" }}>
                {comment.content}
              </p>
              {isAuthenticated && <CommentForm blogId={blogId} parentId={comment.id} addComment={addComment} />}
              {comment.replies && renderComments(comment.replies)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const addComment = async (content, parentId = "root") => {
    try {
      const newComment = {
        content,
        username: auth.currentUser.displayName || "Anonymous",
        userId: auth.currentUser.uid, // Add user ID here
        timestamp: new Date(),
        parentId,
      };
  
      const docRef = await addDoc(collection(db, "blogs", blogId, "comments"), newComment);
      setComments((prevComments) => {
        const newCommentWithId = { id: docRef.id, ...newComment };
  
        const addReply = (commentsList) => {
          for (let comment of commentsList) {
            if (comment.id === parentId) {
              comment.replies = comment.replies || [];
              comment.replies.push(newCommentWithId);
              return true;
            } else if (comment.replies) {
              if (addReply(comment.replies)) return true;
            }
          }
          return false;
        };
  
        if (parentId === "root") {
          return [...prevComments, newCommentWithId];
        } else {
          addReply(prevComments);
          return [...prevComments];
        }
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  

  return (
    <div>
      <div>{renderComments(comments)}</div>
      {isAuthenticated ? (
        <CommentForm blogId={blogId} addComment={addComment} />
      ) : (
        <p style={{ color: "#999", textAlign: "center", marginTop: "10px" }}>
          Please <strong>sign in</strong> to leave a comment.
        </p>
      )}
    </div>
  );
};

export default CommentsSection;
