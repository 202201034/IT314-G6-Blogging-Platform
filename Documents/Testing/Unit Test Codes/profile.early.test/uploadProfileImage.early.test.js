import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { uploadProfileImage } from '../../utils/profile';

jest.mock("firebase/storage", () => {
  return {
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
    deleteObject: jest.fn(),
  };
});

const storage = getStorage();
describe('uploadProfileImage() uploadProfileImage method', () => {
  const userId = 'testUserId';
  const imageFile = new File(['dummy content'], 'testImage.png', { type: 'image/png' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should upload the image and return the download URL', async () => {
      // Arrange
      const mockDownloadURL = 'https://example.com/testImage.png';
      ref.mockReturnValue('mockRef');
      uploadBytes.mockResolvedValue();
      getDownloadURL.mockResolvedValue(mockDownloadURL);

      // Act
      const result = await uploadProfileImage(userId, imageFile);

      // Assert
      expect(ref).toHaveBeenCalledWith(storage, `profileImages/${userId}/${imageFile.name}`);
      expect(uploadBytes).toHaveBeenCalledWith('mockRef', imageFile);
      expect(getDownloadURL).toHaveBeenCalledWith('mockRef');
      expect(result).toBe(mockDownloadURL);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle an error during uploadBytes gracefully', async () => {
      // Arrange
      const mockError = new Error('Upload failed');
      ref.mockReturnValue('mockRef');
      uploadBytes.mockRejectedValue(mockError);

      // Act & Assert
      await expect(uploadProfileImage(userId, imageFile)).rejects.toThrow('Upload failed');
      expect(ref).toHaveBeenCalledWith(storage, `profileImages/${userId}/${imageFile.name}`);
      expect(uploadBytes).toHaveBeenCalledWith('mockRef', imageFile);
      expect(getDownloadURL).not.toHaveBeenCalled();
    });

    it('should handle an error during getDownloadURL gracefully', async () => {
      // Arrange
      const mockError = new Error('Failed to get download URL');
      ref.mockReturnValue('mockRef');
      uploadBytes.mockResolvedValue();
      getDownloadURL.mockRejectedValue(mockError);

      // Act & Assert
      await expect(uploadProfileImage(userId, imageFile)).rejects.toThrow('Failed to get download URL');
      expect(ref).toHaveBeenCalledWith(storage, `profileImages/${userId}/${imageFile.name}`);
      expect(uploadBytes).toHaveBeenCalledWith('mockRef', imageFile);
      expect(getDownloadURL).toHaveBeenCalledWith('mockRef');
    });

    it('should handle an empty file name gracefully', async () => {
      // Arrange
      const emptyFile = new File(['dummy content'], '', { type: 'image/png' });
      ref.mockReturnValue('mockRef');
      uploadBytes.mockResolvedValue();
      getDownloadURL.mockResolvedValue('https://example.com/emptyFile.png');

      // Act
      const result = await uploadProfileImage(userId, emptyFile);

      // Assert
      expect(ref).toHaveBeenCalledWith(storage, `profileImages/${userId}/`);
      expect(uploadBytes).toHaveBeenCalledWith('mockRef', emptyFile);
      expect(getDownloadURL).toHaveBeenCalledWith('mockRef');
      expect(result).toBe('https://example.com/emptyFile.png');
    });

    it('should handle an invalid imageFile gracefully', async () => {
      // Arrange
      const invalidImageFile = null;
      ref.mockReturnValue('mockRef');
      uploadBytes.mockResolvedValue();
      getDownloadURL.mockResolvedValue('https://example.com/testImage.png');

      // Act & Assert
      await expect(uploadProfileImage(userId, invalidImageFile)).rejects.toThrow();
      expect(ref).not.toHaveBeenCalled();
      expect(uploadBytes).not.toHaveBeenCalled();
      expect(getDownloadURL).not.toHaveBeenCalled();
    });
  });
});
