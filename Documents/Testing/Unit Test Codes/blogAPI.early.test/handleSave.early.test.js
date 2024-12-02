// Unit tests for: handleSave

import { doc, updateDoc } from 'firebase/firestore';
import { handleSave } from '../../utils/blogAPI';
import assert from 'assert';

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn(),
  })),
  getDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(), // Add this line to mock updateDoc
}));

describe('handleSave() handleSave method', () => {
  let mockRouter;
  let setSavedBlogs;
  let setError;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    setSavedBlogs = jest.fn();
    setError = jest.fn();
    updateDoc.mockClear(); // Clear mock calls before each test
    doc.mockClear(); // Clear mock calls before each test
  });

  describe('Happy paths', () => {
    it('should save a blog when the user is logged in and the blog is not already saved', async () => {
      const blogId = 'blog123';
      const currentUser = 'user123';
      const savedBlogs = ['blog456'];
      const expectedSavedBlogs = ['blog456', 'blog123'];

      await handleSave(blogId, currentUser, savedBlogs, setSavedBlogs, setError, mockRouter);

      expect(doc).toHaveBeenCalledTimes(1);
      expect(setSavedBlogs).toHaveBeenCalledWith(expectedSavedBlogs);
    });

    it('should remove a blog from saved when the user is logged in and the blog is already saved', async () => {
      const blogId = 'blog123';
      const currentUser = 'user123';
      const savedBlogs = ['blog123', 'blog456'];
      const expectedSavedBlogs = ['blog456'];

      await handleSave(blogId, currentUser, savedBlogs, setSavedBlogs, setError, mockRouter);

      expect(doc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledTimes(1);
      expect(setSavedBlogs).toHaveBeenCalledWith(expectedSavedBlogs);
    });
  });

  describe('Edge cases', () => {
    it('should redirect to login if no user is logged in', async () => {
      const blogId = 'blog123';
      const currentUser = null;
      const savedBlogs = ['blog456'];

      await handleSave(blogId, currentUser, savedBlogs, setSavedBlogs, setError, mockRouter);

      expect(mockRouter.push).toHaveBeenCalledWith('/login');
      expect(doc).not.toHaveBeenCalled();
      expect(updateDoc).not.toHaveBeenCalled();
      expect(setSavedBlogs).not.toHaveBeenCalled();
      expect(setError).not.toHaveBeenCalled();
    });

    it('should handle errors when updating saved blogs', async () => {
      const blogId = 'blog123';
      const currentUser = 'user123';
      const savedBlogs = ['blog456'];
      const errorMessage = 'Failed to save blog. Please try again.';
      updateDoc.mockRejectedValueOnce(new Error('Firestore error'));

      await handleSave(blogId, currentUser, savedBlogs, setSavedBlogs, setError, mockRouter);

      expect(doc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledTimes(1);
      expect(setSavedBlogs).not.toHaveBeenCalled();
      expect(setError).toHaveBeenCalledWith('Failed to save blog. Please try again.');
    });

    it('should handle Firestore updateDoc errors gracefully', async () => {
      const blogId = 'blog123';
      const currentUser = 'user123';
      const savedBlogs = ['blog456'];
      updateDoc.mockRejectedValueOnce(new Error('Firestore error'));

      await handleSave(blogId, currentUser, savedBlogs, setSavedBlogs, setError, mockRouter);

      expect(doc).toHaveBeenCalledTimes(1);
      expect(updateDoc).toHaveBeenCalledTimes(1);
      expect(setSavedBlogs).not.toHaveBeenCalled();
      expect(setError).toHaveBeenCalledWith('Failed to save blog. Please try again.');
    });
  });
});
