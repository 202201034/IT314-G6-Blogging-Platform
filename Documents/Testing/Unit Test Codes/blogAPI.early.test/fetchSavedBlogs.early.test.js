import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.js';
import { fetchSavedBlogs } from '../blogAPI';
import assert from 'assert';

jest.mock("../../firebase/firebase.js", () => ({
  getFirestore: jest.fn(),
  db: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe('fetchSavedBlogs() fetchSavedBlogs method', () => {
  let setSavedBlogsMock;
  let consoleErrorMock;

  beforeEach(() => {
    setSavedBlogsMock = jest.fn();
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  describe('Happy Paths', () => {
    it('should set saved blogs when user document exists', async () => {
      // Arrange
      const userId = 'user123';
      const savedBlogs = ['blog1', 'blog2'];
      const savedBlogsDoc = { exists: () => true, data: () => ({ savedBlogs }) };
      getDoc.mockResolvedValue(savedBlogsDoc);
      doc.mockReturnValue('mockDocRef');

      // Act
      await fetchSavedBlogs(userId, setSavedBlogsMock);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'users', userId);
      expect(getDoc).toHaveBeenCalledWith('mockDocRef');
      expect(setSavedBlogsMock).toHaveBeenCalledWith(savedBlogs);
    });

    it('should set an empty array if savedBlogs field is not present', async () => {
      // Arrange
      const userId = 'user123';
      const savedBlogsDoc = { exists: () => true, data: () => ({}) };
      getDoc.mockResolvedValue(savedBlogsDoc);
      doc.mockReturnValue('mockDocRef');

      // Act
      await fetchSavedBlogs(userId, setSavedBlogsMock);

      // Assert
      expect(setSavedBlogsMock).toHaveBeenCalledWith([]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle non-existent user document gracefully', async () => {
      // Arrange
      const userId = 'user123';
      const savedBlogsDoc = { exists: () => false };
      getDoc.mockResolvedValue(savedBlogsDoc);
      doc.mockReturnValue('mockDocRef');

      // Act
      await fetchSavedBlogs(userId, setSavedBlogsMock);

      // Assert
      expect(setSavedBlogsMock).not.toHaveBeenCalled();
    });

    it('should handle errors during fetching gracefully', async () => {
      // Arrange
      const userId = 'user123';
      getDoc.mockRejectedValue(new Error('Firestore error'));
      doc.mockReturnValue('mockDocRef');

      // Act
      await fetchSavedBlogs(userId, setSavedBlogsMock);

      // Assert
      expect(setSavedBlogsMock).not.toHaveBeenCalled();
    });

    it('should handle null userId gracefully', async () => {
      // Act
      await fetchSavedBlogs(null, setSavedBlogsMock);

      // Assert
      expect(setSavedBlogsMock).not.toHaveBeenCalled();
    });

    it('should handle undefined userId gracefully', async () => {
      // Act
      await fetchSavedBlogs(undefined, setSavedBlogsMock);

      // Assert
      expect(setSavedBlogsMock).not.toHaveBeenCalled();
    });

    it('should handle empty userId gracefully', async () => {
      // Act
      await fetchSavedBlogs('', setSavedBlogsMock);

      // Assert
      expect(setSavedBlogsMock).not.toHaveBeenCalled();
    });

    it('should handle non-string userId gracefully', async () => {
      // Act
      await fetchSavedBlogs(12345, setSavedBlogsMock);

      // Assert
      expect(setSavedBlogsMock).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: fetchSavedBlogs
