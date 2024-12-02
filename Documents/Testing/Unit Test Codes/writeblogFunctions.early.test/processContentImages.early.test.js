import { getDownloadURL, ref, uploadString, getStorage } from 'firebase/storage';
import { processContentImages } from '../writeblogFunctions';

jest.mock('firebase/storage', () => {
  return {
    getDownloadURL: jest.fn(),
    ref: jest.fn(),
    uploadString: jest.fn(),
    getStorage: jest.fn(() => 'mockStorage'),  // Mock getStorage to return 'mockStorage'
  };
});

describe('processContentImages() processContentImages method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should replace base64 image src with Firebase URL', async () => {
      // Arrange
      const htmlContent = '<p>Test</p><img src="data:image/png;base64,abc123" />';
      const mockImageUrl = 'https://firebase.storage/image.png';
      const mockStorage = 'mockStorage';  // The mocked storage object
      ref.mockReturnValue('mockRef');
      uploadString.mockResolvedValue();
      getDownloadURL.mockResolvedValue(mockImageUrl);
      getStorage.mockReturnValue(mockStorage);

      // Act
      const result = await processContentImages(htmlContent);

      // Assert
      expect(ref).toHaveBeenCalledWith(mockStorage, expect.stringContaining('images/'));  // Ensure it's called with mockStorage and path containing 'images/'
      expect(uploadString).toHaveBeenCalledWith('mockRef', 'data:image/png;base64,abc123', 'data_url');
      expect(getDownloadURL).toHaveBeenCalledWith('mockRef');
      expect(result).toBe('<p>Test</p><img src="https://firebase.storage/image.png" />');
    });

    it('should return the same content if no base64 images are present', async () => {
      // Arrange
      const htmlContent = '<p>Test</p><img src="https://example.com/image.png" />';

      // Act
      const result = await processContentImages(htmlContent);

      // Assert
      expect(result).toBe(htmlContent);
      expect(ref).not.toHaveBeenCalled();
      expect(uploadString).not.toHaveBeenCalled();
      expect(getDownloadURL).not.toHaveBeenCalled();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle empty content gracefully', async () => {
      // Arrange
      const htmlContent = '';

      // Act
      const result = await processContentImages(htmlContent);

      // Assert
      expect(result).toBe('');
    });

    it('should handle content with no images gracefully', async () => {
      // Arrange
      const htmlContent = '<p>Test content with no images</p>';

      // Act
      const result = await processContentImages(htmlContent);

      // Assert
      expect(result).toBe(htmlContent);
    });

    it('should return original content if image upload fails', async () => {
      // Arrange
      const htmlContent = '<p>Test</p><img src="data:image/png;base64,abc123" />';
      ref.mockReturnValue('mockRef');
      uploadString.mockRejectedValue(new Error('Upload failed'));

      // Act
      const result = await processContentImages(htmlContent);

      // Assert
      expect(result).toBe(htmlContent);
      expect(ref).toHaveBeenCalled();
      expect(uploadString).toHaveBeenCalled();
      expect(getDownloadURL).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: processContentImages
