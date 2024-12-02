import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase.js";
import { addComment } from '../comment_section';
import assert from 'assert';  // Importing the assert module

jest.mock("../../firebase/firebase", () => ({
  db: {},
  auth: {
    currentUser: {
      displayName: 'TestUser',
      uid: '12345',
    },
  },
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

describe('addComment() addComment method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should add a comment with the current user details', async () => {
      // Arrange
      const blogId = 'blog123';
      const content = 'This is a test comment';
      const parentId = 'root';
      const mockDocRef = { id: 'comment123' };
      addDoc.mockResolvedValue(mockDocRef);

      // Act
      const result = await addComment(blogId, content, parentId);

      // Assert
      assert.strictEqual(collection.mock.calls.length, 1);
      assert.deepEqual(collection.mock.calls[0], [db, 'blogs', blogId, 'comments']);

      assert.strictEqual(addDoc.mock.calls.length, 1);
      assert.deepEqual(addDoc.mock.calls[0][1], {
        content,
        username: 'TestUser',
        userId: '12345',
        timestamp: addDoc.mock.calls[0][1].timestamp, // Match the timestamp
        parentId,
      });

      assert.deepEqual(result, {
        id: 'comment123',
        content,
        username: 'TestUser',
        userId: '12345',
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId,
      });
    });

    it('should add a comment with "Anonymous" username if no user is logged in', async () => {
      // Arrange
      auth.currentUser = null;
      const blogId = 'blog123';
      const content = 'This is a test comment';
      const parentId = 'root';
      const mockDocRef = { id: 'comment123' };
      addDoc.mockResolvedValue(mockDocRef);

      // Act
      const result = await addComment(blogId, content, parentId);

      // Assert
      assert.strictEqual(addDoc.mock.calls.length, 1);
      assert.deepEqual(addDoc.mock.calls[0][1], {
        content,
        username: 'Anonymous',
        userId: undefined,
        timestamp: addDoc.mock.calls[0][1].timestamp, // Match the timestamp
        parentId,
      });

      assert.deepEqual(result, {
        id: 'comment123',
        content,
        username: 'Anonymous',
        userId: undefined,
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId,
      });
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle adding a comment with an empty content', async () => {
      // Arrange
      auth.currentUser = null;
      const blogId = 'blog123';
      const content = '';
      const parentId = 'root';
      const mockDocRef = { id: 'comment123' };
      addDoc.mockResolvedValue(mockDocRef);
    
      // Act
      const result = await addComment(blogId, content, parentId);
    
      // Assert
      assert.strictEqual(addDoc.mock.calls.length, 1);
      assert.deepEqual(addDoc.mock.calls[0][1], {
        content: '',
        username: 'Anonymous',
        userId: undefined,
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId,
      });
    
      assert.deepEqual(result, {
        id: 'comment123',
        content: '',
        username: 'Anonymous',
        userId: undefined,
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId,
      });
    });
    
    it('should handle adding a comment with a null parentId', async () => {
      // Arrange
      auth.currentUser = { displayName: 'TestUser', uid: '12345' };
      const blogId = 'blog123';
      const content = 'This is a test comment';
      const parentId = null;
      const mockDocRef = { id: 'comment123' };
      addDoc.mockResolvedValue(mockDocRef);
    
      // Act
      const result = await addComment(blogId, content, parentId);
    
      // Assert
      assert.strictEqual(addDoc.mock.calls.length, 1);
      assert.deepEqual(addDoc.mock.calls[0][1], {
        content,
        username: 'TestUser',
        userId: '12345',
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId: 'root',
      });
    
      assert.deepEqual(result, {
        id: 'comment123',
        content,
        username: 'TestUser',
        userId: '12345',
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId: 'root',
      });
    });
        
    
    it('should throw an error if addDoc fails', async () => {
      // Arrange
      const blogId = 'blog123';
      const content = 'This is a test comment';
      const parentId = 'root';
      const errorMessage = 'Failed to add document';
      addDoc.mockRejectedValue(new Error(errorMessage));
    
      // Act & Assert
      await assert.rejects(
        async () => {
          await addComment(blogId, content, parentId);
        },
        {
          name: 'Error',
          message: errorMessage,
        }
      );
    });

    it('should handle adding a comment with a very long content', async () => {
      // Arrange
      auth.currentUser = { displayName: 'TestUser', uid: '12345' };
      const blogId = 'blog123';
      const content = 'a'.repeat(1000); // Very long content
      const parentId = 'root';
      const mockDocRef = { id: 'comment123' };
      addDoc.mockResolvedValue(mockDocRef);
  
      // Act
      const result = await addComment(blogId, content, parentId);
  
      // Assert
      assert.strictEqual(addDoc.mock.calls.length, 1);
      assert.deepEqual(addDoc.mock.calls[0][1], {
        content,
        username: 'TestUser',
        userId: '12345',
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId,
      });
  
      assert.deepEqual(result, {
        id: 'comment123',
        content,
        username: 'TestUser',
        userId: '12345',
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId,
      });
    });
  
    it('should handle adding a comment with special characters in content', async () => {
      // Arrange
      auth.currentUser = { displayName: 'TestUser', uid: '12345' };
      const blogId = 'blog123';
      const content = '!@#$%^&*()_+{}:"<>?';
      const parentId = 'root';
      const mockDocRef = { id: 'comment123' };
      addDoc.mockResolvedValue(mockDocRef);
  
      // Act
      const result = await addComment(blogId, content, parentId);
  
      // Assert
      assert.strictEqual(addDoc.mock.calls.length, 1);
      assert.deepEqual(addDoc.mock.calls[0][1], {
        content,
        username: 'TestUser',
        userId: '12345',
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId,
      });
  
      assert.deepEqual(result, {
        id: 'comment123',
        content,
        username: 'TestUser',
        userId: '12345',
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId,
      });
    });
  
    it('should handle adding a comment with a non-string content', async () => {
      // Arrange
      auth.currentUser = { displayName: 'TestUser', uid: '12345' };
      const blogId = 'blog123';
      const content = 12345; // Non-string content
      const parentId = 'root';
      const mockDocRef = { id: 'comment123' };
      addDoc.mockResolvedValue(mockDocRef);
  
      // Act
      const result = await addComment(blogId, content, parentId);
  
      // Assert
      assert.strictEqual(addDoc.mock.calls.length, 1);
      assert.deepEqual(addDoc.mock.calls[0][1], {
        content: content.toString(), // Ensure content is converted to string
        username: 'TestUser',
        userId: '12345',
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId,
      });
  
      assert.deepEqual(result, {
        id: 'comment123',
        content: content.toString(),
        username: 'TestUser',
        userId: '12345',
        timestamp: addDoc.mock.calls[0][1].timestamp,
        parentId,
      });
    });
  });
});