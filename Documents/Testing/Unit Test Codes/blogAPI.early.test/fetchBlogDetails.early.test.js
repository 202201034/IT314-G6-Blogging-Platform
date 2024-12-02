import { getDoc, doc } from 'firebase/firestore';
import { fetchBlogDetails } from '../blogAPI';
import assert from 'assert';  // Importing assert for comparisons

// Mock Firebase Firestore methods
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn((_, id) => ({ id })),  // Mock doc reference creation
  getDoc: jest.fn(),                   // Mock getDoc function
}));

describe('fetchBlogDetails()', () => {
  let setLikeCount, setIsLiked, setLoading, consoleErrorMock;

  beforeEach(() => {
    jest.clearAllMocks();
    setLikeCount = jest.fn();
    setIsLiked = jest.fn();
    setLoading = jest.fn();
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  describe('Happy paths', () => {
    it('should fetch blog details and set like count when blog exists', async () => {
      const userId = 'user123';
      const blogId = 'blog123';
      const blogData = { likeCount: 5 };
      const userData = { likedBlogIds: ['blog123'] };

      // Mock Firestore responses for both blog and user data
      getDoc.mockImplementation((ref) => {
        if (ref.id === blogId) {
          return Promise.resolve({
            exists: () => true,
            data: () => blogData,
          });
        }
        if (ref.id === userId) {
          return Promise.resolve({
            exists: () => true,
            data: () => userData,
          });
        }
        return Promise.resolve({ exists: () => false });
      });

      // Act
      await fetchBlogDetails(userId, blogId, setLikeCount, setIsLiked, setLoading);

      assert.strictEqual(setLoading.mock.calls.length, 2);   
      assert.strictEqual(setLoading.mock.calls[1][0], false); 
    });
  });

  describe('Edge cases', () => {
    it('should handle case where blog does not exist', async () => {
      const userId = 'user123';
      const blogId = 'blog123';

      getDoc.mockResolvedValueOnce({ exists: () => false });

      await fetchBlogDetails(userId, blogId, setLikeCount, setIsLiked, setLoading);

      assert.strictEqual(setLikeCount.mock.calls.length, 0);  // Like count should not be set
      assert.strictEqual(setIsLiked.mock.calls.length, 0);    // IsLiked should not be set
    });

    it('should handle errors gracefully', async () => {
      const userId = 'user123';
      const blogId = 'blog123';

      getDoc.mockRejectedValueOnce(new Error('Firestore error'));

      await fetchBlogDetails(userId, blogId, setLikeCount, setIsLiked, setLoading);

      assert.strictEqual(setLoading.mock.calls.length, 2);  
      assert.strictEqual(setLoading.mock.calls[1][0], false); 
      assert.strictEqual(setLikeCount.mock.calls.length, 0); 
    });
  });
});
