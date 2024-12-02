// Unit tests for: fetchUsername


import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import { fetchUsername } from '../comment_form';



jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock("../../firebase/firebase.js", () => ({
  db: {},
}));

describe('fetchUsername() fetchUsername method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return the username when the user document exists', async () => {
      // Arrange
      const userId = 'testUserId';
      const mockUsername = 'testUser';
      const mockUserDocSnap = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue({ username: mockUsername }),
      };
      getDoc.mockResolvedValue(mockUserDocSnap);
      doc.mockReturnValue('mockDocRef');

      // Act
      const result = await fetchUsername(userId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'users', userId);
      expect(getDoc).toHaveBeenCalledWith('mockDocRef');
      expect(result).toBe(mockUsername);
    });

    it('should return an empty string if the username is not present in the user document', async () => {
      // Arrange
      const userId = 'testUserId';
      const mockUserDocSnap = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue({}),
      };
      getDoc.mockResolvedValue(mockUserDocSnap);
      doc.mockReturnValue('mockDocRef');

      // Act
      const result = await fetchUsername(userId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'users', userId);
      expect(getDoc).toHaveBeenCalledWith('mockDocRef');
      expect(result).toBe('');
    });
  });

  // Additional Edge Case Tests
  describe('Additional Edge Cases', () => {
    it('should return an empty string if userId is null', async () => {
      // Arrange
      const userId = null;

      // Act
      const result = await fetchUsername(userId);

      // Assert
      expect(result).toBe('');
    });

    it('should return an empty string if userId is undefined', async () => {
      // Arrange
      const userId = undefined;

      // Act
      const result = await fetchUsername(userId);

      // Assert
      expect(result).toBe('');
    });

    it('should return an empty string if userId is an empty string', async () => {
      // Arrange
      const userId = '';

      // Act
      const result = await fetchUsername(userId);

      // Assert
      expect(result).toBe('');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should return an empty string when the user document does not exist', async () => {
      // Arrange
      const userId = 'nonExistentUserId';
      const mockUserDocSnap = {
        exists: jest.fn().mockReturnValue(false),
      };
      getDoc.mockResolvedValue(mockUserDocSnap);
      doc.mockReturnValue('mockDocRef');

      // Act
      const result = await fetchUsername(userId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'users', userId);
      expect(getDoc).toHaveBeenCalledWith('mockDocRef');
      expect(result).toBe('');
    });

    it('should throw an error if there is an issue fetching the user document', async () => {
      // Arrange
      const userId = 'testUserId';
      const mockError = new Error('Firestore error');
      getDoc.mockRejectedValue(mockError);
      doc.mockReturnValue('mockDocRef');

      // Act & Assert
      await expect(fetchUsername(userId)).rejects.toThrow('Firestore error');
      expect(doc).toHaveBeenCalledWith(db, 'users', userId);
      expect(getDoc).toHaveBeenCalledWith('mockDocRef');
    });
  });
});
