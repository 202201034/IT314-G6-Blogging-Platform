import { doc, deleteDoc } from 'firebase/firestore';
import { handleDeleteBlog } from '../../utils/blogAPI';
import assert from 'assert';

// Mock Firestore methods
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn((db, collection, id) => ({ id })),
  deleteDoc: jest.fn(),
}));

describe('handleDeleteBlog() method', () => {
  let mockBlogId;
  let setError;
  let router;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    setError = jest.fn();
    router = { push: jest.fn() };
  });

  it('should delete the blog and navigate to profile when blogId is valid', async () => {
    // Arrange
    mockBlogId = 'validBlogId';
    const mockedDocRef = { id: mockBlogId };
    doc.mockReturnValueOnce(mockedDocRef);
    deleteDoc.mockResolvedValueOnce({});

    // Act
    await handleDeleteBlog(mockBlogId, setError, router);

    // Assert
    console.log('doc.mock.calls:', doc.mock.calls); // Debug statement
    assert.strictEqual(doc.mock.calls[0][0], undefined);
    assert.strictEqual(doc.mock.calls[0][1], 'blogs');
    assert.strictEqual(doc.mock.calls[0][2], mockBlogId);
    assert.strictEqual(deleteDoc.mock.calls[0][0], mockedDocRef);
    expect(router.push).toHaveBeenCalledWith('/profile');
  });

  it('should handle errors during deletion and set error message', async () => {
    // Arrange
    mockBlogId = 'validBlogId';
    const mockedDocRef = { id: mockBlogId };
    const mockError = new Error('Deletion failed');
    doc.mockReturnValueOnce(mockedDocRef);
    deleteDoc.mockRejectedValueOnce(mockError);

    // Act
    await handleDeleteBlog(mockBlogId, setError, router);

    // Assert
    assert.strictEqual(doc.mock.calls[0][0], undefined);
    assert.strictEqual(doc.mock.calls[0][1], 'blogs');
    assert.strictEqual(doc.mock.calls[0][2], mockBlogId);
    assert.strictEqual(deleteDoc.mock.calls[0][0], mockedDocRef);
    expect(setError).toHaveBeenCalledWith('Failed to delete blog. Please try again.');
  });

  it('should not call router.push if deletion fails', async () => {
    // Arrange
    mockBlogId = 'validBlogId';
    const mockedDocRef = { id: mockBlogId };
    const mockError = new Error('Deletion failed');
    doc.mockReturnValueOnce(mockedDocRef);
    deleteDoc.mockRejectedValueOnce(mockError);

    // Act
    await handleDeleteBlog(mockBlogId, setError, router);

    // Assert
    expect(router.push).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors gracefully', async () => {
    // Arrange
    mockBlogId = 'validBlogId';
    const mockedDocRef = { id: mockBlogId };
    const mockError = new Error('Unexpected error');
    doc.mockReturnValueOnce(mockedDocRef);
    deleteDoc.mockImplementationOnce(() => {
      throw mockError;
    });

    // Act
    await handleDeleteBlog(mockBlogId, setError, router);

    // Assert
    expect(setError).toHaveBeenCalledWith('Failed to delete blog. Please try again.');
    expect(router.push).not.toHaveBeenCalled();
  });
});
