import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import { getUserDrafts } from "../profile.js";
import assert from "assert";  // Import assert module

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(() => ({})),  
  query: jest.fn((...args) => ({})),  
  where: jest.fn((fieldPath, opStr, value) => ({})),  
  getDocs: jest.fn(() => ({ docs: [] })),  
}));

describe('getUserDrafts() getUserDrafts method', () => {
  const userId = 'testUserId';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy paths', () => {
    it('should return an array of drafts when drafts exist for the user', async () => {
      // Mock Firestore response
      const mockDrafts = [
        { id: 'draft1', data: () => ({ title: 'Draft 1', content: 'Content 1' }) },
        { id: 'draft2', data: () => ({ title: 'Draft 2', content: 'Content 2' }) },
      ];
      getDocs.mockResolvedValueOnce({ docs: mockDrafts });

      // Call the function
      const drafts = await getUserDrafts(userId);

      // Assertions
      assert.strictEqual(collection.mock.calls[0][1], 'drafts');
      assert.strictEqual(getDocs.mock.calls.length, 1);
      assert.deepStrictEqual(drafts, [
        { id: 'draft1', title: 'Draft 1', content: 'Content 1' },
        { id: 'draft2', title: 'Draft 2', content: 'Content 2' },
      ]);
    });

    it('should return an empty array when no drafts exist for the user', async () => {
      // Mock Firestore response
      getDocs.mockResolvedValueOnce({ docs: [] });

      // Call the function
      const drafts = await getUserDrafts(userId);

      // Assertions
      assert.deepStrictEqual(drafts, []);
    });
  });

  describe('Edge cases', () => {
    it('should handle Firestore errors gracefully', async () => {
      // Mock Firestore error
      const errorMessage = 'Firestore error';
      getDocs.mockRejectedValueOnce(new Error(errorMessage));

      // Act & Assert
      await assert.rejects(
        async () => await getUserDrafts(userId),
        (err) => {
          assert.strictEqual(err.message, errorMessage); // Check the error message
          return true; // Ensure the error is caught
        }
      );
    });

    it('should handle a null userId gracefully', async () => {
      await assert.rejects(
        async () => await getUserDrafts(null),
        (err) => {
          assert.strictEqual(err.message, "Invalid userId");
          return true; // Ensure the error is caught
        }
      );
    });

    it('should handle an empty string userId gracefully', async () => {
      await assert.rejects(
        async () => await getUserDrafts(''),
        (err) => {
          assert.strictEqual(err.message, "Invalid userId");
          return true; // Ensure the error is caught
        }
      );
    });
  });
});
