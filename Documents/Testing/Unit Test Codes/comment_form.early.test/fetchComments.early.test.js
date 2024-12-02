import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { fetchComments } from '../comment_form';
import { db } from "../../firebase/firebase.js";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock("../../firebase/firebase.js", () => ({
  db: {},
}));

describe('fetchComments() fetchComments method', () => {
  let setCommentsMock;

  beforeEach(() => {
    jest.clearAllMocks();
    setCommentsMock = jest.fn();
  });

  describe('Happy paths', () => {
    it('should fetch and set comments correctly for a given blogId', async () => {
      // Arrange
      const blogId = 'testBlogId';
      const mockComments = [
        { id: 'comment1', content: 'Comment 1', parentId: 'root' },
        { id: 'comment2', content: 'Comment 2', parentId: 'comment1' },
      ];
      const mockQuerySnapshot = {
        docs: mockComments.map(comment => ({
          id: comment.id,
          data: () => comment,
        })),
      };
      onSnapshot.mockImplementation((q, callback) => {
        callback(mockQuerySnapshot);
      });

      // Act
      fetchComments(blogId, setCommentsMock);

      // Assert
      expect(collection).toHaveBeenCalledWith(db, 'blogs', blogId, 'comments');
      expect(onSnapshot).toHaveBeenCalled();
      expect(setCommentsMock).toHaveBeenCalledWith([
        {
          id: 'comment1',
          content: 'Comment 1',
          parentId: 'root',
          replies: [
            {
              id: 'comment2',
              content: 'Comment 2',
              parentId: 'comment1',
              replies: [],
            },
          ],
        },
      ]);
    });
  });

  describe('Edge cases', () => {
    it('should handle no comments gracefully', async () => {
      // Arrange
      const blogId = 'testBlogId';
      const mockQuerySnapshot = {
        docs: [],
      };
      onSnapshot.mockImplementation((q, callback) => {
        callback(mockQuerySnapshot);
      });

      // Act
      fetchComments(blogId, setCommentsMock);

      // Assert
      expect(setCommentsMock).toHaveBeenCalledWith([]);
    });

    it('should handle comments with missing parentId', async () => {
      // Arrange
      const blogId = 'testBlogId';
      const mockComments = [
        { id: 'comment1', content: 'Comment 1' },
      ];
      const mockQuerySnapshot = {
        docs: mockComments.map(comment => ({
          id: comment.id,
          data: () => comment,
        })),
      };
      onSnapshot.mockImplementation((q, callback) => {
        callback(mockQuerySnapshot);
      });

      // Act
      fetchComments(blogId, setCommentsMock);

      // Assert
      expect(setCommentsMock).toHaveBeenCalledWith([
        {
          id: 'comment1',
          content: 'Comment 1',
          parentId: undefined,
          replies: [],
        },
      ]);
    });

    it('should handle nested comments correctly', async () => {
      // Arrange
      const blogId = 'testBlogId';
      const mockComments = [
        { id: 'comment1', content: 'Comment 1', parentId: 'root' },
        { id: 'comment2', content: 'Comment 2', parentId: 'comment1' },
        { id: 'comment3', content: 'Comment 3', parentId: 'comment2' },
      ];
      const mockQuerySnapshot = {
        docs: mockComments.map(comment => ({
          id: comment.id,
          data: () => comment,
        })),
      };
      onSnapshot.mockImplementation((q, callback) => {
        callback(mockQuerySnapshot);
      });

      // Act
      fetchComments(blogId, setCommentsMock);

      // Assert
      expect(setCommentsMock).toHaveBeenCalledWith([
        {
          id: 'comment1',
          content: 'Comment 1',
          parentId: 'root',
          replies: [
            {
              id: 'comment2',
              content: 'Comment 2',
              parentId: 'comment1',
              replies: [
                {
                  id: 'comment3',
                  content: 'Comment 3',
                  parentId: 'comment2',
                  replies: [],
                },
              ],
            },
          ],
        },
      ]);
    });

    it('should handle comments with invalid data gracefully', async () => {
      // Arrange
      const blogId = 'testBlogId';
      const mockComments = [
        { id: 'comment1', content: null, parentId: 'root' },
      ];
      const mockQuerySnapshot = {
        docs: mockComments.map(comment => ({
          id: comment.id,
          data: () => comment,
        })),
      };
      onSnapshot.mockImplementation((q, callback) => {
        callback(mockQuerySnapshot);
      });

      // Act
      fetchComments(blogId, setCommentsMock);

      // Assert
      expect(setCommentsMock).toHaveBeenCalledWith([
        {
          id: 'comment1',
          content: null,
          parentId: 'root',
          replies: [],
        },
      ]);
    });
  });
});
