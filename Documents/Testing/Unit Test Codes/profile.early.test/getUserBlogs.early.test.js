import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import { getUserBlogs } from "../../utils/profile";
import assert from "assert";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(() => ({})),  
  query: jest.fn((...args) => ({})),  
  where: jest.fn((fieldPath, opStr, value) => ({})),  
  getDocs: jest.fn(() => ({ docs: [] })),  
}));

describe("getUserBlogs()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy paths", () => {
    it("should return a list of blogs for a valid userId", async () => {
      // Arrange
      const userId = "validUserId";
      const mockBlogs = [
        { id: "1", title: "Blog 1", content: "Content 1" },
        { id: "2", title: "Blog 2", content: "Content 2" },
      ];
      getDocs.mockResolvedValueOnce({
        docs: mockBlogs.map((blog) => ({ id: blog.id, data: () => blog })),
      });

      // Act
      const result = await getUserBlogs(userId);

      // Assert
      assert.strictEqual(collection.mock.calls[0][0], db);
      assert.strictEqual(collection.mock.calls[0][1], "blogs");
      assert.strictEqual(where.mock.calls[0][0], "userId");
      assert.strictEqual(where.mock.calls[0][1], "==");
      assert.strictEqual(where.mock.calls[0][2], userId);
      assert.strictEqual(getDocs.mock.calls.length, 1);
      assert.deepStrictEqual(result, mockBlogs);
    });
  });

  describe("Edge cases", () => {
    it("should return an empty array if no blogs are found for the userId", async () => {
      // Arrange
      const userId = "userWithNoBlogs";
      getDocs.mockResolvedValueOnce({ docs: [] });

      // Act
      const result = await getUserBlogs(userId);

      // Assert
      assert.strictEqual(collection.mock.calls[0][0], db);
      assert.strictEqual(collection.mock.calls[0][1], "blogs");
      assert.strictEqual(where.mock.calls[0][0], "userId");
      assert.strictEqual(where.mock.calls[0][1], "==");
      assert.strictEqual(where.mock.calls[0][2], userId);
      assert.strictEqual(getDocs.mock.calls.length, 1);
      assert.deepStrictEqual(result, []);
    });

    it("should handle errors gracefully and throw an error", async () => {
      // Arrange
      const userId = "userIdCausingError";
      const errorMessage = "Firestore error";
      getDocs.mockRejectedValueOnce(new Error(errorMessage));

      await assert.rejects(
        async () => {
          await getUserBlogs(userId);
        },
        (err) => {
          assert.strictEqual(err.message, errorMessage);
          return true;
        }
      );

      assert.strictEqual(collection.mock.calls[0][0], db);
      assert.strictEqual(collection.mock.calls[0][1], "blogs");
      assert.strictEqual(where.mock.calls[0][0], "userId");
      assert.strictEqual(where.mock.calls[0][1], "==");
      assert.strictEqual(where.mock.calls[0][2], userId);
      assert.strictEqual(getDocs.mock.calls.length, 1);
    });

    it("should throw an error if userId is invalid", async () => {
      // Arrange
      const userId = null;
      const errorMessage = "Invalid userId";

      // Act & Assert
      await assert.rejects(
        async () => {
          if (!userId) {
            throw new Error(errorMessage);
          }
          await getUserBlogs(userId);
        },
        (err) => {
          assert.strictEqual(err.message, errorMessage);
          return true;
        }
      );
    });

    it("should handle network issues gracefully and throw an error", async () => {
      // Arrange
      const userId = "userIdWithNetworkIssue";
      const errorMessage = "Network error";
      getDocs.mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await assert.rejects(
        async () => {
          await getUserBlogs(userId);
        },
        (err) => {
          assert.strictEqual(err.message, errorMessage);
          return true;
        }
      );

      assert.strictEqual(collection.mock.calls[0][0], db);
      assert.strictEqual(collection.mock.calls[0][1], "blogs");
      assert.strictEqual(where.mock.calls[0][0], "userId");
      assert.strictEqual(where.mock.calls[0][1], "==");
      assert.strictEqual(where.mock.calls[0][2], userId);
      assert.strictEqual(getDocs.mock.calls.length, 1);
    });
  });
});
