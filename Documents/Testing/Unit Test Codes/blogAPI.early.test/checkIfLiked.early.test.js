import { getDoc } from 'firebase/firestore';
import { checkIfLiked } from '../blogAPI';
import assert from 'assert';  // Import the assert module

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

describe('checkIfLiked() checkIfLiked method', () => {
  let setIsLikedMock;

  beforeEach(() => {
    setIsLikedMock = jest.fn();
  });

  describe('Happy paths', () => {
    it('should set isLiked to true if the blog is liked by the user', async () => {
      const currentUserId = 'user123';
      const blogId = 'blog456';
      const likedBlogIds = [blogId, 'blog789'];
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ likedBlogIds }),
      });

      await checkIfLiked(currentUserId, blogId, setIsLikedMock);

      assert.strictEqual(setIsLikedMock.mock.calls.length, 1);
      assert.strictEqual(setIsLikedMock.mock.calls[0][0], true);
    });

    it('should set isLiked to false if the blog is not liked by the user', async () => {
      const currentUserId = 'user123';
      const blogId = 'blog456';
      const likedBlogIds = ['blog789'];
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ likedBlogIds }),
      });

      await checkIfLiked(currentUserId, blogId, setIsLikedMock);

      assert.strictEqual(setIsLikedMock.mock.calls.length, 1);
      assert.strictEqual(setIsLikedMock.mock.calls[0][0], false);
    });
  });

  describe('Edge cases', () => {
    it('should set isLiked to false if the user document does not exist', async () => {
      const currentUserId = 'user123';
      const blogId = 'blog456';
      getDoc.mockResolvedValueOnce({
        exists: () => false,
      });

      await checkIfLiked(currentUserId, blogId, setIsLikedMock);

      assert.strictEqual(setIsLikedMock.mock.calls.length, 1);
      assert.strictEqual(setIsLikedMock.mock.calls[0][0], false);
    });

    it('should handle errors gracefully and not throw', async () => {
      const currentUserId = 'user123';
      const blogId = 'blog456';
      getDoc.mockRejectedValueOnce(new Error('Firestore error'));

      await checkIfLiked(currentUserId, blogId, setIsLikedMock);

      assert.strictEqual(setIsLikedMock.mock.calls.length, 0);
    });

    it('should set isLiked to false if likedBlogIds is undefined', async () => {
      const currentUserId = 'user123';
      const blogId = 'blog456';
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({}), // No likedBlogIds field
      });

      await checkIfLiked(currentUserId, blogId, setIsLikedMock);

      assert.strictEqual(setIsLikedMock.mock.calls.length, 1);
      assert.strictEqual(setIsLikedMock.mock.calls[0][0], false);
    });

    it('should set isLiked to false if likedBlogIds is an empty array', async () => {
      const currentUserId = 'user123';
      const blogId = 'blog456';
      const likedBlogIds = [];
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ likedBlogIds }),
      });

      await checkIfLiked(currentUserId, blogId, setIsLikedMock);

      assert.strictEqual(setIsLikedMock.mock.calls.length, 1);
      assert.strictEqual(setIsLikedMock.mock.calls[0][0], false);
    });

    it('should set isLiked to false if the user document exists but has no likedBlogIds field', async () => {
      const currentUserId = 'user123';
      const blogId = 'blog456';
      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({}), // No likedBlogIds field
      });

      await checkIfLiked(currentUserId, blogId, setIsLikedMock);

      assert.strictEqual(setIsLikedMock.mock.calls.length, 1);
      assert.strictEqual(setIsLikedMock.mock.calls[0][0], false);
    });
  });
});
