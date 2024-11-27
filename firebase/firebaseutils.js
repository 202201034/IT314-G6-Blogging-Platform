import { doc, setDoc,getDoc, deleteDoc, updateDoc, increment,arrayUnion,Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';



import { getAuth } from "firebase/auth";
// Function to create a notification for a user


export const fetchUserDetails = async (userId) => {
    try {
        // Get a reference to the user's document in the 'users' collection
        const userRef = doc(db, "users", userId);
        
        // Fetch the user document
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            throw new Error("User not found");
        }
        
        // Extract the user data (username, profileImage, etc.)
        const userData = userDoc.data();
        console.log(userData);
        // Return the user details including profile image
        return {
            username: userData.username,
            profileImage: userData.profileImage || null,  // Handle case where profileImage might be null
        };
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;  // In case of an error, return null
    }
};

export const isLoggedIn = () => {
  const auth = getAuth();
  return !!auth.currentUser;
};


// Function to follow a user
export const followUser = async (userId, targetUsername, currentUserId, followersCount, followingCount) => {
  const[currentUsername,setCurrentUsername] = useState('');
  const auth = getAuth();

  try {
    // Create a follow document in Firestore
    await setDoc(doc(db, 'follows', `${currentUserId}_${userId}`), {
      followerId: currentUserId,
      followingId: userId,
    });

    // Update follower and following counts
    const targetUserRef = doc(db, 'users', userId);
    const currentUserRef = doc(db, 'users', currentUserId);

    await updateDoc(targetUserRef, {
      followersCount: increment(1),
    });

    await updateDoc(currentUserRef, {
      followingCount: increment(1),
    });
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDetails = await fetchUserDetails(currentUser.uid);
        if (userDetails && userDetails.username) {
          setCurrentUsername(userDetails.username);
          console.log(userDetails);
        }
      }
    const metadata = { type: "follow" }; // Add relevant metadata

    const message = `${currentUsername} followed you.`;
    console.log(message);


    await addNotificationToUser(user.uid, message, metadata);

    console.log("Successfully followed the user.");
  } catch (err) {
    console.error("Error following user: ", err);
    throw err;
  }
};

// Function to unfollow a user
export const unfollowUser = async (userId, targetUsername, currentUserId, followersCount, followingCount) => {
  try {
    // Unfollow user by deleting the follow document
    await deleteDoc(doc(db, 'follows', `${currentUserId}_${userId}`));

    // Update follower and following counts
    const targetUserRef = doc(db, 'users', userId);
    const currentUserRef = doc(db, 'users', currentUserId);

    await updateDoc(targetUserRef, {
      followersCount: increment(-1),
    });

    await updateDoc(currentUserRef, {
      followingCount: increment(-1),
    });

    console.log("Successfully unfollowed the user.");
  } catch (err) {
    console.error("Error unfollowing user: ", err);
    throw err;
  }
};
// Add notification to a user's notifications array
export const addNotificationToUser = async (userId, message, metadata = {}) => {
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      notifications: arrayUnion({
        id: uuidv4(),
        message,
        timestamp: new Date(),
        ...metadata,
      }),
    });

    console.log("Notification added to user:", userId);
  } catch (error) {
    console.error("Error adding notification:", error);
  }
};
