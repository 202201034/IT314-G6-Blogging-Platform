import { doc, setDoc, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebase';


import { getAuth } from "firebase/auth";

export const isLoggedIn = () => {
  const auth = getAuth();
  return !!auth.currentUser;
};


// Function to follow a user
export const followUser = async (userId, targetUsername, currentUserId, followersCount, followingCount) => {
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
