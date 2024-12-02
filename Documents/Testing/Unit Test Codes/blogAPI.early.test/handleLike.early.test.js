import { arrayRemove, arrayUnion, getDoc, getFirestore, increment, updateDoc } from 'firebase/firestore';
import { handleLike } from '../blogAPI';


jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  increment: jest.fn((value) => value),
  arrayUnion: jest.fn((value) => value),
  arrayRemove: jest.fn((value) => value),
}));

describe('handleLike() handleLike method', () => {
  let setIsLiked, setLikeCount, router;

  beforeEach(() => {
    setIsLiked = jest.fn();
    setLikeCount = jest.fn();
    router = { push: jest.fn() };
  });

  describe('Happy paths', () => {
    it('should like a blog if not already liked', async () => {
      const blogId = 'blog123';
      const currentUser = 'user123';
      const currentLikeCount = 5;

      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ likedBlogIds: [] }),
      }).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ likeCount: currentLikeCount }),
      });

      await handleLike(blogId, currentUser, setIsLiked, setLikeCount, router);

      expect(setIsLiked).toHaveBeenCalledWith(true);
      expect(setLikeCount).toHaveBeenCalledWith(currentLikeCount + 1);
    });

    it('should unlike a blog if already liked', async () => {
      const blogId = 'blog123';
      const currentUser = 'user123';
      const currentLikeCount = 5;

      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ likedBlogIds: [blogId] }),
      }).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ likeCount: currentLikeCount }),
      });

      await handleLike(blogId, currentUser, setIsLiked, setLikeCount, router);
      
      expect(setIsLiked).toHaveBeenCalledWith(false);
      expect(setLikeCount).toHaveBeenCalledWith(currentLikeCount - 1);
    });
  });

  describe('Edge cases', () => {
    it('should redirect to login if no current user', async () => {
      const blogId = 'blog123';
      const currentUser = null;

      await handleLike(blogId, currentUser, setIsLiked, setLikeCount, router);

      expect(router.push).toHaveBeenCalledWith('/login');
    });

    it('should handle non-existent user document gracefully', async () => {
      const blogId = 'blog123';
      const currentUser = 'user123';

      getDoc.mockResolvedValueOnce({
        exists: () => false,
      });

      await handleLike(blogId, currentUser, setIsLiked, setLikeCount, router);

      expect(setIsLiked).not.toHaveBeenCalled();
      expect(setLikeCount).not.toHaveBeenCalled();
    });

    it('should handle non-existent blog document gracefully', async () => {
      const blogId = 'blog123';
      const currentUser = 'user123';

      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ likedBlogIds: [] }),
      }).mockResolvedValueOnce({
        exists: () => false,
      });

      await handleLike(blogId, currentUser, setIsLiked, setLikeCount, router);

      expect(setIsLiked).not.toHaveBeenCalled();
      expect(setLikeCount).not.toHaveBeenCalled();
    });

    it('should handle errors during Firestore operations', async () => {
      const blogId = 'blog123';
      const currentUser = 'user123';

      getDoc.mockRejectedValue(new Error('Firestore error'));

      await handleLike(blogId, currentUser, setIsLiked, setLikeCount, router);

      expect(setIsLiked).not.toHaveBeenCalled();
      expect(setLikeCount).not.toHaveBeenCalled();
    });

    it('should handle invalid blogId gracefully', async () => {
      const blogId = null;
      const currentUser = 'user123';

      await handleLike(blogId, currentUser, setIsLiked, setLikeCount, router);

      expect(setIsLiked).not.toHaveBeenCalled();
      expect(setLikeCount).not.toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();
    });

    it('should handle invalid currentUser gracefully', async () => {
      const blogId = 'blog123';
      const currentUser = '';

      await handleLike(blogId, currentUser, setIsLiked, setLikeCount, router);

      expect(setIsLiked).not.toHaveBeenCalled();
      expect(setLikeCount).not.toHaveBeenCalled();
      expect(router.push).toHaveBeenCalledWith('/login');
    });

    it('should handle Firestore updateDoc errors gracefully', async () => {
      const blogId = 'blog123';
      const currentUser = 'user123';
      const currentLikeCount = 5;

      getDoc.mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ likedBlogIds: [] }),
      }).mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ likeCount: currentLikeCount }),
      });

      updateDoc.mockRejectedValue(new Error('Firestore update error'));

      await handleLike(blogId, currentUser, setIsLiked, setLikeCount, router);

      expect(setIsLiked).not.toHaveBeenCalled();
      expect(setLikeCount).not.toHaveBeenCalled();
    });
  });
});
