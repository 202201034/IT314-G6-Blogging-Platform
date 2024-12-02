import { jest } from '@jest/globals';
import { deleteDoc, doc } from 'firebase/firestore';
import { handleDeleteDraft } from '../writeblogFunctions';
import { get } from 'http';

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

describe('handleDeleteDraft() handleDeleteDraft method', () => {
  let setTitle, setContent, setHashtags, router, setError, mockTimeout;

  beforeEach(() => {
    setTitle = jest.fn();
    setContent = jest.fn();
    setHashtags = jest.fn();
    router = { push: jest.fn() };
    setError = jest.fn();
    mockTimeout = jest.fn();
  });

  describe('Happy paths', () => {
    it('should delete the draft and reset the editor state', async () => {
      // Arrange
      const draftId = '12345';
      const draftRef = { id: draftId };
      doc.mockReturnValueOnce(draftRef);

      // Act
      await handleDeleteDraft(draftId, setTitle, setContent, setHashtags, router, setError, mockTimeout);

      expect(deleteDoc).toHaveBeenCalledWith(draftRef);
      expect(setTitle).toHaveBeenCalledWith('');
      expect(setContent).toHaveBeenCalledWith('');
      expect(setHashtags).toHaveBeenCalledWith([]);
      expect(router.push).toHaveBeenCalledWith('/profile');
    });
  });

  describe('Edge cases', () => {
    it('should not attempt to delete if draftId is not provided', async () => {
      // Arrange
      const draftId = null;

      // Act
      await handleDeleteDraft(draftId, setTitle, setContent, setHashtags, router, setError, mockTimeout);

      expect(setTitle).not.toHaveBeenCalled();
      expect(setContent).not.toHaveBeenCalled();
      expect(setHashtags).not.toHaveBeenCalled();
      expect(router.push).not.toHaveBeenCalled();
    });

    it('should handle errors during draft deletion', async () => {
      // Arrange
      const draftId = '12345';
      const errorMessage = 'Failed to delete draft';
      const draftRef = { id: draftId };
      doc.mockReturnValueOnce(draftRef);
      deleteDoc.mockRejectedValueOnce(new Error(errorMessage));

      // Act
      await handleDeleteDraft(draftId, setTitle, setContent, setHashtags, router, setError, mockTimeout);

      // Assert
      expect(setError).toHaveBeenCalledWith('Failed to delete draft. Please try again.');
      expect(mockTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
    });
  });

  describe('Additional test cases', () => {
    it('should delete a draft with special characters in the ID', async () => {
      // Arrange
      const specialDraftId = 'draft@#$%^&*()';
      const draftRef = { id: specialDraftId };
      doc.mockReturnValueOnce(draftRef);

      // Act
      await handleDeleteDraft(specialDraftId, setTitle, setContent, setHashtags, router, setError, mockTimeout);

      // Assert
      expect(deleteDoc).toHaveBeenCalledWith(draftRef);
      expect(setTitle).toHaveBeenCalledWith('');
      expect(setContent).toHaveBeenCalledWith('');
      expect(setHashtags).toHaveBeenCalledWith([]);
      expect(router.push).toHaveBeenCalledWith('/profile');
    });
  });
});

