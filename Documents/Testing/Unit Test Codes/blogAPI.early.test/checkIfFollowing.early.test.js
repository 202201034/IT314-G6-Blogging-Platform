import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { checkIfFollowing } from '../blogAPI';

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})), // Returns a mock Firestore instance
  doc: jest.fn((db, collection, id) => ({ db, collection, id })), // Mock function returning doc reference
  getDoc: jest.fn(), // Setup as a jest.fn() to allow mockResolvedValue
}));

describe('checkIfFollowing() checkIfFollowing method', () => {
  let setIsFollowing;

  beforeEach(() => {
    setIsFollowing = jest.fn(); // Mock callback
    jest.clearAllMocks(); // Reset mocks before each test
  });

  describe('Happy Paths', () => {
    it('should set isFollowing to true if the follow document exists', async () => {
      const currentUserId = 'user123';
      const blogAuthorId = 'author456';

      getDoc.mockResolvedValue({ exists: () => true }); // Simulate existing document

      await checkIfFollowing(currentUserId, blogAuthorId, setIsFollowing);

      expect(doc).toHaveBeenCalledWith(undefined, 'follows', `${currentUserId}_${blogAuthorId}`);
      expect(getDoc).toHaveBeenCalledWith({ db: undefined, collection: 'follows', id: 'user123_author456' });
      expect(setIsFollowing).toHaveBeenCalledWith(true);
    });

    it('should set isFollowing to false if the follow document does not exist', async () => {
      const currentUserId = 'user123';
      const blogAuthorId = 'author456';

      getDoc.mockResolvedValue({ exists: () => false });

      await checkIfFollowing(currentUserId, blogAuthorId, setIsFollowing);

      expect(doc).toHaveBeenCalledWith(undefined, 'follows', `${currentUserId}_${blogAuthorId}`);
      expect(getDoc).toHaveBeenCalled();
      expect(setIsFollowing).toHaveBeenCalledWith(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors gracefully and not set isFollowing', async () => {
      const currentUserId = 'user123';
      const blogAuthorId = 'author456';

      getDoc.mockRejectedValue(new Error('Firestore error'));

      await checkIfFollowing(currentUserId, blogAuthorId, setIsFollowing);

      expect(setIsFollowing).not.toHaveBeenCalled(); // Ensure setIsFollowing is not called on error
    });
  });
});
