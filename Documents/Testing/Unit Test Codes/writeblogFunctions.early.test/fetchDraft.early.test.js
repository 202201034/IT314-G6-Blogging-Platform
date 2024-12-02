import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase.js';
import { fetchDraft } from '../writeblogFunctions';

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock("../../firebase/firebase.js", () => ({
  db: {},
}));

describe('fetchDraft() fetchDraft method', () => {
  let setTitle, setContent, setHashtagInput, setError;

  beforeEach(() => {
    setTitle = jest.fn();
    setContent = jest.fn();
    setHashtagInput = jest.fn();
    setError = jest.fn();
  });

  describe('Happy paths', () => {
    it('should fetch and set draft data correctly when draft exists', async () => {
      // Arrange
      const draftId = '123';
      const draftData = {
        title: 'Test Title',
        content: 'Test Content',
        hashtags: ['#test', '#example'],
      };
      const draftDoc = {
        exists: jest.fn().mockReturnValue(true),
        data: jest.fn().mockReturnValue(draftData),
      };

      // Mock Firestore methods
      doc.mockReturnValue('mockDraftRef'); // Mock doc function to return a reference
      getDoc.mockResolvedValue(draftDoc); // Mock getDoc function to return draftDoc

      // Act
      await fetchDraft(draftId, setTitle, setContent, setHashtagInput, setError);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'drafts', draftId); // Expect doc to be called correctly
      expect(getDoc).toHaveBeenCalledWith('mockDraftRef'); // Ensure getDoc receives the mock reference
      expect(setTitle).toHaveBeenCalledWith(draftData.title);
      expect(setContent).toHaveBeenCalledWith(draftData.content);
      expect(setHashtagInput).toHaveBeenCalledWith(['test', 'example']);
      expect(setError).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle non-existent draft gracefully', async () => {
      // Arrange
      const draftId = 'nonExistentId';
      const draftDoc = {
        exists: jest.fn().mockReturnValue(false),
      };

      // Mock Firestore methods
      doc.mockReturnValue('mockDraftRef');
      getDoc.mockResolvedValue(draftDoc);

      // Act
      await fetchDraft(draftId, setTitle, setContent, setHashtagInput, setError);

      // Assert
      expect(setError).toHaveBeenCalledWith('Draft not found.');
      expect(setTitle).not.toHaveBeenCalled();
      expect(setContent).not.toHaveBeenCalled();
      expect(setHashtagInput).not.toHaveBeenCalled();
    });

    it('should handle errors during fetching draft', async () => {
      // Arrange
      const draftId = '123';
      const errorMessage = 'Network error';
      getDoc.mockRejectedValue(new Error(errorMessage));

      // Act
      await fetchDraft(draftId, setTitle, setContent, setHashtagInput, setError);

      // Assert
      expect(setError).toHaveBeenCalledWith(`Failed to fetch draft: ${errorMessage}`);
      expect(setTitle).not.toHaveBeenCalled();
      expect(setContent).not.toHaveBeenCalled();
      expect(setHashtagInput).not.toHaveBeenCalled();
    });

    it('should return early if draftId is not provided', async () => {
      // Act
      await fetchDraft(null, setTitle, setContent, setHashtagInput, setError);
    
      // Assert: No calls should be made
      expect(doc).not.toHaveBeenCalled();
      expect(getDoc).not.toHaveBeenCalled();
      expect(setTitle).not.toHaveBeenCalled();
      expect(setContent).not.toHaveBeenCalled();
      expect(setHashtagInput).not.toHaveBeenCalled();
      expect(setError).not.toHaveBeenCalled();
    });
  });
});
