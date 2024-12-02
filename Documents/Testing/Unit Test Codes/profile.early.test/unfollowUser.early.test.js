import { deleteDoc, doc, increment, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import { unfollowUser } from '../../utils/profile';
import assert from 'assert';

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  deleteDoc: jest.fn(),
  setDoc: jest.fn(),
  increment: jest.fn((value) => value),
}));

jest.mock("../../firebase/firebase", () => ({
  db: {},
}));

describe('unfollowUser() unfollowUser method', () => {
  const userId = 'user123';
  const targetUsername = 'targetUser';
  const currentUserId = 'currentUser456';
  const followersCount = 10;
  const followingCount = 5;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should successfully unfollow a user and update follower and following counts', async () => {
      // Arrange
      const followRef = `follows/${currentUserId}_${userId}`;
      doc.mockReturnValue(followRef);

      // Act
      await unfollowUser(userId, targetUsername, currentUserId, followersCount, followingCount);

      // Assert
      assert.strictEqual(doc.mock.calls[0][1], 'follows');
      assert.strictEqual(doc.mock.calls[0][2], `${currentUserId}_${userId}`);
      assert.strictEqual(deleteDoc.mock.calls[0][0], followRef);
      assert.strictEqual(setDoc.mock.calls[0][0], doc(db, 'users', userId));
      assert.deepStrictEqual(setDoc.mock.calls[0][1], {
        followersCount: increment(-1),
      });
      assert.strictEqual(setDoc.mock.calls[1][0], doc(db, 'users', currentUserId));
      assert.deepStrictEqual(setDoc.mock.calls[1][1], {
        followingCount: increment(-1),
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle the case where userId is undefined', async () => {
      // Arrange
      const invalidUserId = undefined;

      // Act & Assert
      await assert.rejects(
        async () => {
          await unfollowUser(invalidUserId, targetUsername, currentUserId, followersCount, followingCount);
        },
        { message: 'User ID and Current User ID must be provided' }
      );
    });

    it('should handle the case where currentUserId is undefined', async () => {
      // Arrange
      const invalidCurrentUserId = undefined;

      // Act & Assert
      await assert.rejects(
        async () => {
          await unfollowUser(userId, targetUsername, invalidCurrentUserId, followersCount, followingCount);
        },
        { message: 'User ID and Current User ID must be provided' }
      );
    });

    it('should handle the case where followersCount and followingCount are zero', async () => {
      // Arrange
      const zeroFollowersCount = 0;
      const zeroFollowingCount = 0;

      // Act
      await unfollowUser(userId, targetUsername, currentUserId, zeroFollowersCount, zeroFollowingCount);

      // Assert
      assert.strictEqual(setDoc.mock.calls[0][0], doc(db, 'users', userId));
      assert.deepStrictEqual(setDoc.mock.calls[0][1], {
        followersCount: increment(-1),
      });
      assert.strictEqual(setDoc.mock.calls[1][0], doc(db, 'users', currentUserId));
      assert.deepStrictEqual(setDoc.mock.calls[1][1], {
        followingCount: increment(-1),
      });
    });
  });
});
