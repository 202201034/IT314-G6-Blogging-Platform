import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { fetchBlog } from '../writeblogFunctions';

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn().mockReturnValue('mockFirestore'), // Mock Firestore instance
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe('fetchBlog() fetchBlog method', () => {
  let setTitle, setContent, setError;

  beforeEach(() => {
    setTitle = jest.fn();
    setContent = jest.fn();
    setError = jest.fn();
  });

  describe('Happy paths', () => {
    it('should fetch and set blog data when blog exists', async () => {
      // Arrange
      const blogId = '123';
      const blogData = { title: 'Test Blog', content: 'This is a test blog content.' };
      const blogDoc = { exists: () => true, data: () => blogData };
      getDoc.mockResolvedValue(blogDoc);

      // Act
      await fetchBlog(blogId, setTitle, setContent, setError);

      // Assert
      expect(doc).toHaveBeenCalledWith('mockFirestore', 'blogs', blogId); 
      expect(setTitle).toHaveBeenCalledWith(blogData.title);
      expect(setContent).toHaveBeenCalledWith(blogData.content);
      expect(setError).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should set error when blog does not exist', async () => {
      // Arrange
      const blogId = 'nonexistent';
      const blogDoc = { exists: () => false };
      getDoc.mockResolvedValue(blogDoc);

      // Act
      await fetchBlog(blogId, setTitle, setContent, setError);

      // Assert
      expect(setError).toHaveBeenCalledWith('Blog not found.');
      expect(setTitle).not.toHaveBeenCalled();
      expect(setContent).not.toHaveBeenCalled();
    });

    it('should set error when an exception occurs', async () => {
      // Arrange
      const blogId = '123';
      const errorMessage = 'Network error';
      getDoc.mockRejectedValue(new Error(errorMessage));

      // Act
      await fetchBlog(blogId, setTitle, setContent, setError);

      // Assert
      expect(setError).toHaveBeenCalledWith(`Failed to fetch blog: ${errorMessage}`);
      expect(setTitle).not.toHaveBeenCalled();
      expect(setContent).not.toHaveBeenCalled();
    });

    it('should not attempt to fetch blog if blogId is not provided', async () => {
      // Act
      await fetchBlog(null, setTitle, setContent, setError);

      // Assert: No calls should be made
      expect(setTitle).not.toHaveBeenCalled();
      expect(setContent).not.toHaveBeenCalled();
      expect(setError).not.toHaveBeenCalled();
    });
  });
});
