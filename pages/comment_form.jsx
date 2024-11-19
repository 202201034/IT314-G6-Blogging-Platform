import { useState } from "react";
import { db,auth } from "../firebase/firebase";  // Adjust the import based on your firebase config
import { collection, addDoc,doc, getDoc,Timestamp } from "firebase/firestore";

const CommentForm = ({ blogId, parentId = null }) => {
  const [content, setContent] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.trim()) {
      try {
        const user = auth.currentUser; // Get the current authenticated user
      
        if (user) {
          const userId = user.uid; // Get the current user ID
          console.log(userId)
          let username = ""; // Initialize username variable
      
          try {
            // Reference to the 'users' collection and the document for the current user
            const userDocRef = doc(db, "users", userId);
            
            // Fetch the document for the user
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              username = userData.username; // Assuming 'name' is a field in the 'users' document
            } else {
              console.log("No such user document!");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
      
          // After fetching the username, add the comment
          await addDoc(collection(db, "blogs", blogId, "comments"), {
            content,
            username: username,  // Use the fetched username
            timestamp: Timestamp.now(),
            parentId,  // If it's a reply, it will be set as the parent comment's ID
          });
      
          setContent("");  // Clear the input field after submission
        } else {
          console.log("No user is signed in.");
          
        }
      } catch (error) {
        console.error("Error adding comment: ", error);
      }
    }      
  };

  return (
    <form
  onSubmit={handleSubmit}
  style={{
    display: "flex",
    flexDirection: "row", // Align items in a row (side by side)
    marginTop: "10px", // Space above the form
    backgroundColor: "black", // Same light bluish background as the comment
    borderRadius: "8px", // Rounded corners
    padding: "8px", // Space inside the form
    gap: "8px", // Space between textarea and button
  }}
>
<textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  placeholder="Write a comment..."
  required
  style={{
    padding: "4px",  // Further reduce padding
    fontSize: "10px", // Smaller font size
    border: "1px solid #ccc", // Light border for the textarea
    borderRadius: "4px", // Rounded corners for the textarea
    resize: "none", // Disable resizing
    marginBottom: "0", // No margin below the textarea
    minHeight: "30px", // Minimum height for the textarea (adjusted)
    maxHeight: "50px", // Maximum height for the textarea (adjusted)
    overflowY: "auto", // Add vertical scrollbar when content overflows
    flexGrow: 1, // Let the textarea grow and take available space
  }}
/>
  <button
    type="submit"
    style={{
      padding: "3px 7px",  // Even smaller padding for the button
      fontSize: "11px", // Smaller font size for the button text
      backgroundColor: "#3797ef", // Dark blue background for the button
      color: "#fff", // White text color for the button
      border: "none", // Remove border
      borderRadius: "3px", // Rounded corners for the button
      cursor: "pointer", // Pointer cursor on hover
      alignSelf: "flex-end", // Align button to the bottom of the textarea
    }}
  >
    Post
  </button>
</form>



  );
};

export default CommentForm;
