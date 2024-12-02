import { handleSaveDraft } from '../writeblogFunctions';
import { addDoc, updateDoc, doc, getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Mock Firebase methods
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn().mockReturnValue({
    currentUser: {
      uid: 'testUserId',
    },
  }),
}));

describe('handleSaveDraft()', () => {
  let setIsSavingDraft, setError, title, content, hashtags, draftId;

  beforeEach(() => {
    setIsSavingDraft = jest.fn();
    setError = jest.fn();
    title = 'Test Title';
    content = 'Test Content';
    hashtags = ['#test'];
    draftId = 'draftId123';
  });

  it('should save a new draft successfully', async () => {
    // Arrange: Mock Firebase methods
    addDoc.mockResolvedValue('mockDraftRef');
    
    // Act
    await handleSaveDraft(title, content, hashtags, null, setIsSavingDraft, setError);

    expect(setIsSavingDraft).toHaveBeenCalledWith(true);
  });

  it('should update an existing draft successfully', async () => {
    // Arrange: Mock Firebase methods
    updateDoc.mockResolvedValue('mockDraftRef');
    
    // Act
    await handleSaveDraft(title, content, hashtags, draftId, setIsSavingDraft, setError);

    expect(setIsSavingDraft).toHaveBeenCalledWith(true);
  });

  it('should not save an empty draft', async () => {
    // Act
    await handleSaveDraft('', '', [], null, setIsSavingDraft, setError);

    // Assert: Expect an error to be set
    expect(setError).toHaveBeenCalledWith('Cannot save an empty draft.');
  });

  it('should handle errors while saving', async () => {
    // Arrange: Mock Firebase methods to throw an error
    addDoc.mockRejectedValue(new Error('Firebase error'));

    // Act
    await handleSaveDraft(title, content, hashtags, null, setIsSavingDraft, setError);

    // Assert: Expect error handling to be triggered
    expect(setError).toHaveBeenCalledWith('Failed to save draft. Please try again.');
  });

  it('should save a draft with special characters in the title and content', async () => {
    // Arrange
    const specialTitle = 'Test @#$%^&*()';
    const specialContent = 'Content with special characters @#$%^&*()';
    addDoc.mockResolvedValue('mockDraftRef');

    // Act
    await handleSaveDraft(specialTitle, specialContent, hashtags, null, setIsSavingDraft, setError);

    // Assert
    expect(setIsSavingDraft).toHaveBeenCalledWith(true);
  });
});
