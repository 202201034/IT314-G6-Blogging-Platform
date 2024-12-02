import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.js';
import { handleSubmit, processContentImages } from '../writeblogFunctions.js';

jest.mock("firebase/firestore");
jest.mock("firebase/auth");
jest.mock("../writeblogFunctions", () => ({
  ...jest.requireActual("../writeblogFunctions"),
  processContentImages: jest.fn(),
}));

describe('handleSubmit() handleSubmit method', () => {
  let e, setIsSubmittingBlog, setError, auth, router;

  beforeEach(() => {
    e = { preventDefault: jest.fn() };
    setIsSubmittingBlog = jest.fn();
    setError = jest.fn();
    auth = { currentUser: { uid: 'user123' } };
    router = { push: jest.fn() };
  });

  describe('Happy paths', () => {
    it('should submit a new blog successfully', async () => {
      const title = 'Test Blog';
      const content = '<p>Test Content</p>';
      const hashtags = ['#test'];
      const blogId = null;
      const draftId = null;
      
      // Mocking processContentImages to resolve with the same content
      processContentImages.mockResolvedValue(content);
      addDoc.mockResolvedValue({});

      // Call the handleSubmit function
      await handleSubmit(e, title, content, hashtags, blogId, draftId, setIsSubmittingBlog, setError, auth, router);

      // Debugging calls to ensure proper function execution
      console.log('processContentImages calls:', processContentImages.mock.calls);
      console.log('router.push calls:', router.push.mock.calls);
      
      // Assert function calls
      expect(e.preventDefault).toHaveBeenCalled();
      expect(setIsSubmittingBlog).toHaveBeenCalledWith(true);
      expect(addDoc).toHaveBeenCalledWith(collection(db, 'blogs'), {
        title,
        content,
        hashtags,
        userId: auth.currentUser.uid,
        timestamp: expect.any(Date),
      });
      expect(setIsSubmittingBlog).toHaveBeenCalledWith(false);
    });

    it('should update an existing blog successfully', async () => {
      const title = 'Updated Blog';
      const content = '<p>Updated Content</p>';
      const hashtags = ['#update'];
      const blogId = 'blog123';
      const draftId = null;

      processContentImages.mockResolvedValue(content);
      updateDoc.mockResolvedValue({});

      await handleSubmit(e, title, content, hashtags, blogId, draftId, setIsSubmittingBlog, setError, auth, router);

      // Debugging calls to ensure proper function execution
      console.log('router.push calls:', router.push.mock.calls);
      
      expect(updateDoc).toHaveBeenCalledWith(doc(db, 'blogs', blogId), {
        title,
        content,
        hashtags,
        userId: auth.currentUser.uid,
        timestamp: expect.any(Date),
      });
    });

    it('should delete a draft after publishing a blog', async () => {
      const title = 'Test Blog';
      const content = '<p>Test Content</p>';
      const hashtags = ['#test'];
      const blogId = null;
      const draftId = 'draft123';

      processContentImages.mockResolvedValue(content);
      addDoc.mockResolvedValue({});
      deleteDoc.mockResolvedValue({});

      await handleSubmit(e, title, content, hashtags, blogId, draftId, setIsSubmittingBlog, setError, auth, router);

      // Debugging calls to ensure proper function execution
      console.log('deleteDoc calls:', deleteDoc.mock.calls);

      expect(deleteDoc).toHaveBeenCalledWith(doc(db, 'drafts', draftId));
    });
  });

  describe('Edge cases', () => {
    it('should handle submission failure gracefully', async () => {
      const title = 'Test Blog';
      const content = '<p>Test Content</p>';
      const hashtags = ['#test'];
      const blogId = null;
      const draftId = null;
      processContentImages.mockResolvedValue(content);
      addDoc.mockRejectedValue(new Error('Submission failed'));

      await handleSubmit(e, title, content, hashtags, blogId, draftId, setIsSubmittingBlog, setError, auth, router);

      expect(setError).toHaveBeenCalledWith('Failed to submit blog. Please try again.');
      expect(setIsSubmittingBlog).toHaveBeenCalledWith(false);
    });

    it('should handle empty title and content gracefully', async () => {
      const title = '';
      const content = '';
      const hashtags = [];
      const blogId = null;
      const draftId = null;

      await handleSubmit(e, title, content, hashtags, blogId, draftId, setIsSubmittingBlog, setError, auth, router);

      expect(setError).toHaveBeenCalledWith('Failed to submit blog. Please try again.');
      expect(setIsSubmittingBlog).toHaveBeenCalledWith(false);
    });
  });
});
