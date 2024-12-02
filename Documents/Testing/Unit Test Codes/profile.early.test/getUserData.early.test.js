import { doc, getDoc } from 'firebase/firestore';
import { getUserData } from '../../utils/profile';
import assert from 'assert';
import { get } from 'http';

// Mock Firestore methods
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn((db, collection, id) => ({ id })),
  getDoc: jest.fn(),
}));

describe('getUserData() method', () => {
  let mockUserId;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('Happy Paths', () => {
    it('should return user data when the document exists', async () => {
      // Arrange
      mockUserId = 'user123';
      const mockUserData = { username: 'testuser', email: 'test@example.com' };
      const mockDoc = { exists: () => true, data: () => mockUserData };

      // Mock return values for `doc` and `getDoc`
      getDoc.mockResolvedValueOnce(mockDoc);

      // Act
      const result = await getUserData(mockUserId);

      // Assert
      assert.deepStrictEqual(result, mockUserData);
      expect(getDoc).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should throw an error when the document does not exist', async () => {
      // Arrange
      mockUserId = 'nonexistentUser';
      const mockDoc = { exists: () => false };
      getDoc.mockResolvedValueOnce(mockDoc);

      // Act & Assert
      await assert.rejects(async () => {
        await getUserData(mockUserId);
      }, { message: 'User document does not exist.' });

      expect(getDoc).toHaveBeenCalledTimes(1);
    });

    it('should handle errors thrown by getDoc gracefully', async () => {
      // Arrange
      mockUserId = 'userWithError';
      const mockError = new Error('Firestore error');
      getDoc.mockRejectedValueOnce(mockError);

      // Act & Assert
      await assert.rejects(async () => {
        await getUserData(mockUserId);
      }, { message: 'Error getting user data' });

      expect(getDoc).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if Firestore is not initialized', async () => {
      // Arrange
      mockUserId = 'user123';
      const mockError = new Error('Firestore not initialized');
      getDoc.mockImplementationOnce(() => {
        throw mockError;
      });

      // Act & Assert
      await assert.rejects(async () => {
        await getUserData(mockUserId);
      }, { message: 'Error getting user data' });

      expect(getDoc).toHaveBeenCalledTimes(1);
    });
  });
});
