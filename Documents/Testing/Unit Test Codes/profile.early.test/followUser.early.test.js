import { doc, increment, setDoc, updateDoc } from "firebase/firestore";
import { followUser } from "../../utils/profile";
import assert from 'assert';

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  increment: jest.fn(() => ({ incrementValue: 1 })),
  updateDoc: jest.fn(), // Add this line
}));

describe("followUser() method", () => {
  const userId = "targetUserId";
  const targetUsername = "targetUser";
  const currentUserId = "currentUserId";
  const followersCount = 10;
  const followingCount = 5;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should successfully follow a user and update follower and following counts", async () => {
      // Arrange
      const followRef = { id: `${currentUserId}_${userId}` };
      doc.mockReturnValueOnce(followRef);

      // Act
      await followUser(userId, targetUsername, currentUserId, followersCount, followingCount);

      // Assert
      assert.strictEqual(doc.mock.calls[0][1], "follows");
      assert.strictEqual(doc.mock.calls[0][2], `${currentUserId}_${userId}`);
      assert.deepStrictEqual(setDoc.mock.calls[0][0], followRef);
      assert.deepStrictEqual(setDoc.mock.calls[0][1], { userId, followerId: currentUserId });
      assert.strictEqual(setDoc.mock.calls[1][1].followersCount.incrementValue, 1);
      assert.strictEqual(setDoc.mock.calls[2][1].followingCount.incrementValue, 1);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should throw an error if userId is undefined", async () => {
      // Arrange
      const invalidUserId = undefined;

      // Act & Assert
      await assert.rejects(
        followUser(invalidUserId, targetUsername, currentUserId, followersCount, followingCount),
        { message: "Invalid userId" }
      );
    });

    it("should throw an error if currentUserId is undefined", async () => {
      // Arrange
      const invalidCurrentUserId = undefined;

      // Act & Assert
      await assert.rejects(
        followUser(userId, targetUsername, invalidCurrentUserId, followersCount, followingCount),
        { message: "Invalid currentUserId" }
      );
    });

    it("should throw an error if targetUsername is undefined", async () => {
      // Arrange
      const invalidTargetUsername = undefined;

      // Act & Assert
      await assert.rejects(
        followUser(userId, invalidTargetUsername, currentUserId, followersCount, followingCount),
        { message: "Invalid targetUsername" }
      );
    });

    it('should throw an error if updateDoc for targetUserRef fails', async () => {
      // Arrange
      const followDocRef = {};
      const targetUserRef = {};
      const currentUserRef = {};

      doc.mockReturnValueOnce(followDocRef)
         .mockReturnValueOnce(targetUserRef)
         .mockReturnValueOnce(currentUserRef);

      setDoc.mockResolvedValueOnce();
      updateDoc.mockRejectedValueOnce(new Error('Failed to update target user'));

      // Act & Assert
      await expect(followUser(userId, currentUserId)).rejects.toThrow('Failed to update target user');
    });

    it('should throw an error if updateDoc for currentUserRef fails', async () => {
      // Arrange
      const followDocRef = {};
      const targetUserRef = {};
      const currentUserRef = {};

      doc.mockReturnValueOnce(followDocRef)
         .mockReturnValueOnce(targetUserRef)
         .mockReturnValueOnce(currentUserRef);

      setDoc.mockResolvedValueOnce();
      updateDoc.mockResolvedValueOnce();
      updateDoc.mockRejectedValueOnce(new Error('Failed to update current user'));

      // Act & Assert
      await expect(followUser(userId, currentUserId)).rejects.toThrow('Failed to update current user');
    });

    it("should throw an error if followersCount is not a number", async () => {
      // Arrange
      const invalidFollowersCount = "notANumber";

      // Act & Assert
      await assert.rejects(
        followUser(userId, targetUsername, currentUserId, invalidFollowersCount, followingCount),
        { message: "Invalid followersCount" }
      );
    });

    it("should throw an error if followingCount is not a number", async () => {
      // Arrange
      const invalidFollowingCount = "notANumber";

      // Act & Assert
      await assert.rejects(
        followUser(userId, targetUsername, currentUserId, followersCount, invalidFollowingCount),
        { message: "Invalid followingCount" }
      );
    });

    it("should throw an error if setDoc fails", async () => {
      // Arrange
      const errorMessage = "Firestore error";
      setDoc.mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await assert.rejects(
        followUser(userId, targetUsername, currentUserId, followersCount, followingCount),
        { message: errorMessage }
      );
    });
  });
});
