import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { getUserByUsername } from '../comment_form';

// Mock Firebase functions
jest.mock("firebase/firestore", () => ({
  getDocs: jest.fn(),
  getFirestore: jest.fn(),
  collection: jest.fn(() => 'usersCollection'), // Mock collection to return 'usersCollection'
  query: jest.fn(() => 'mockQuery'), // Mock query to return 'mockQuery'
  where: jest.fn(),
}));

describe('getUserByUsername() getUserByUsername method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy paths', () => {
    it('should return user data when a user with the given username exists', async () => {
      // Arrange
      const mockUsername = 'testuser';
      const mockUserData = { username: mockUsername, profileImage: 'image-url' };
      const mockDoc = { data: () => mockUserData };
      const mockQuerySnapshot = { empty: false, docs: [mockDoc] };

      // Mock Firebase Firestore methods
      getDocs.mockResolvedValue(mockQuerySnapshot);

      // Act
      const result = await getUserByUsername(mockUsername);
      
      expect(query).toHaveBeenCalledWith('usersCollection', where('username', '==', mockUsername));
      expect(getDocs).toHaveBeenCalledWith('mockQuery');
      expect(result).toEqual(mockUserData);
    });
  });

  describe('Edge cases', () => {
    it('should return null when no user with the given username exists', async () => {
      // Arrange
      const mockUsername = 'nonexistentuser';
      const mockQuerySnapshot = { empty: true, docs: [] };

      // Mock Firebase Firestore methods
      getDocs.mockResolvedValue(mockQuerySnapshot);

      // Act
      const result = await getUserByUsername(mockUsername);

      expect(query).toHaveBeenCalledWith('usersCollection', where('username', '==', mockUsername));
      expect(getDocs).toHaveBeenCalledWith('mockQuery');
      expect(result).toBeNull();
    });

    it('should return null and log an error when an exception occurs', async () => {
      // Arrange
      const mockUsername = 'erroruser';
      getDocs.mockRejectedValue(new Error('Firestore error'));

      // Act
      const result = await getUserByUsername(mockUsername);

      // Assert
      expect(collection).toHaveBeenCalledWith(expect.anything(), 'users');
      expect(query).toHaveBeenCalledWith(expect.anything(), where('username', '==', mockUsername));
      expect(getDocs).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  // Additional Tests
  it('should handle empty username input gracefully', async () => {
    // Arrange
    const mockUsername = '';
    const mockQuerySnapshot = { empty: true, docs: [] };

    // Mock Firebase Firestore methods
    getDocs.mockResolvedValue(mockQuerySnapshot);

    // Act
    const result = await getUserByUsername(mockUsername);

    expect(query).toHaveBeenCalledWith('usersCollection', where('username', '==', mockUsername));
    expect(getDocs).toHaveBeenCalledWith('mockQuery');
    expect(result).toBeNull();
  });

  it('should handle special characters in username input', async () => {
    // Arrange
    const mockUsername = 'user@name!';
    const mockUserData = { username: mockUsername, profileImage: 'image-url' };
    const mockDoc = { data: () => mockUserData };
    const mockQuerySnapshot = { empty: false, docs: [mockDoc] };

    // Mock Firebase Firestore methods
    getDocs.mockResolvedValue(mockQuerySnapshot);

    // Act
    const result = await getUserByUsername(mockUsername);

    expect(query).toHaveBeenCalledWith('usersCollection', where('username', '==', mockUsername));
    expect(getDocs).toHaveBeenCalledWith('mockQuery');
    expect(result).toEqual(mockUserData);
  });

  it('should return null when username is null', async () => {
    // Arrange
    const mockUsername = null;
    const mockQuerySnapshot = { empty: true, docs: [] };

    // Mock Firebase Firestore methods
    getDocs.mockResolvedValue(mockQuerySnapshot);

    // Act
    const result = await getUserByUsername(mockUsername);

    expect(query).toHaveBeenCalledWith('usersCollection', where('username', '==', mockUsername));
    expect(getDocs).toHaveBeenCalledWith('mockQuery');
    expect(result).toBeNull();
  });

  it('should return null when username is undefined', async () => {
    // Arrange
    const mockUsername = undefined;
    const mockQuerySnapshot = { empty: true, docs: [] };

    // Mock Firebase Firestore methods
    getDocs.mockResolvedValue(mockQuerySnapshot);

    // Act
    const result = await getUserByUsername(mockUsername);

    expect(query).toHaveBeenCalledWith('usersCollection', where('username', '==', mockUsername));
    expect(getDocs).toHaveBeenCalledWith('mockQuery');
    expect(result).toBeNull();
  });
});
