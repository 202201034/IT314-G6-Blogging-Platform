import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import { deleteComment } from '../comment_section';

jest.mock("firebase/firestore", () => ({
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("../../firebase/firebase", () => ({
  db: {},
}));

describe('deleteComment() deleteComment method', () => {
  // Happy path tests
  describe('Happy Paths', () => {
    it('should successfully delete a comment given valid blogId and commentId', async () => {
      // Arrange
      const blogId = 'testBlogId';
      const commentId = 'testCommentId';
      const mockDocRef = {};
      doc.mockReturnValue(mockDocRef);

      // Act
      await deleteComment(blogId, commentId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'blogs', blogId, 'comments', commentId);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should handle the case where blogId is an empty string', async () => {
      // Arrange
      const blogId = '';
      const commentId = 'testCommentId';
      const mockDocRef = {};
      doc.mockReturnValue(mockDocRef);

      // Act
      await deleteComment(blogId, commentId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'blogs', blogId, 'comments', commentId);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('should handle the case where commentId is an empty string', async () => {
      // Arrange
      const blogId = 'testBlogId';
      const commentId = '';
      const mockDocRef = {};
      doc.mockReturnValue(mockDocRef);

      // Act
      await deleteComment(blogId, commentId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'blogs', blogId, 'comments', commentId);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('should handle the case where both blogId and commentId are empty strings', async () => {
      // Arrange
      const blogId = '';
      const commentId = '';
      const mockDocRef = {};
      doc.mockReturnValue(mockDocRef);

      // Act
      await deleteComment(blogId, commentId);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'blogs', blogId, 'comments', commentId);
      expect(deleteDoc).toHaveBeenCalledWith(mockDocRef);
    });

    it('should handle the case where deleteDoc throws an error', async () => {
      // Arrange
      const blogId = 'testBlogId';
      const commentId = 'testCommentId';
      const mockDocRef = {};
      doc.mockReturnValue(mockDocRef);
      deleteDoc.mockRejectedValue(new Error('Failed to delete document'));

      // Act & Assert
      await expect(deleteComment(blogId, commentId)).rejects.toThrow('Failed to delete document');
    });
  });
});
