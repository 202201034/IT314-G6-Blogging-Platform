import { deleteObject, ref, getStorage } from "firebase/storage";
import { deleteOldProfileImage } from '../../utils/profile';

jest.mock("firebase/storage", () => {
  return {
    getStorage: jest.fn(),
    ref: jest.fn(),
    deleteObject: jest.fn(),
  };
});

const storage = getStorage();

describe('deleteOldProfileImage() deleteOldProfileImage method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should successfully delete the old profile image', async () => {
      // Arrange
      const profileImageUrl = 'path/to/old/image.jpg';
      const mockRef = {};
      ref.mockReturnValue(mockRef);
      deleteObject.mockResolvedValue();

      // Act
      await deleteOldProfileImage(profileImageUrl);

      // Assert
      expect(ref).toHaveBeenCalledWith(storage, profileImageUrl);
      expect(deleteObject).toHaveBeenCalledWith(mockRef);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle error when deleting a non-existent image', async () => {
      // Arrange
      const profileImageUrl = 'path/to/non-existent/image.jpg';
      const mockRef = {};
      ref.mockReturnValue(mockRef);
      const error = new Error('Image not found');
      deleteObject.mockRejectedValue(error);

      // Act
      await deleteOldProfileImage(profileImageUrl);

      // Assert
      expect(ref).toHaveBeenCalledWith(storage, profileImageUrl);
      expect(deleteObject).toHaveBeenCalledWith(mockRef);
      // No need to assert console.error as per instructions
    });

    it('should handle empty profile image URL gracefully', async () => {
      // Arrange
      const profileImageUrl = '';
      const mockRef = {};
      ref.mockReturnValue(mockRef);
      deleteObject.mockResolvedValue();

      // Act
      await deleteOldProfileImage(profileImageUrl);

      // Assert
      expect(ref).not.toHaveBeenCalled();
      expect(deleteObject).not.toHaveBeenCalled();
    });

    it('should handle null profile image URL gracefully', async () => {
      // Arrange
      const profileImageUrl = null;
      const mockRef = {};
      ref.mockReturnValue(mockRef);
      deleteObject.mockResolvedValue();

      // Act
      await deleteOldProfileImage(profileImageUrl);

      // Assert
      expect(ref).not.toHaveBeenCalled();
      expect(deleteObject).not.toHaveBeenCalled();
    });

    it('should handle undefined profile image URL gracefully', async () => {
      // Arrange
      const profileImageUrl = undefined;
      const mockRef = {};
      ref.mockReturnValue(mockRef);
      deleteObject.mockResolvedValue();

      // Act
      await deleteOldProfileImage(profileImageUrl);

      // Assert
      expect(ref).not.toHaveBeenCalled();
      expect(deleteObject).not.toHaveBeenCalled();
    });

    it('should handle profile image URL with only spaces gracefully', async () => {
      // Arrange
      const profileImageUrl = '   ';
      const mockRef = {};
      ref.mockReturnValue(mockRef);
      deleteObject.mockResolvedValue();

      // Act
      await deleteOldProfileImage(profileImageUrl);

      // Assert
      expect(ref).not.toHaveBeenCalled();
      expect(deleteObject).not.toHaveBeenCalled();
    });

    it('should handle profile image URL with special characters gracefully', async () => {
      // Arrange
      const profileImageUrl = 'path/to/image@#$%.jpg';
      const mockRef = {};
      ref.mockReturnValue(mockRef);
      deleteObject.mockResolvedValue();

      // Act
      await deleteOldProfileImage(profileImageUrl);

      // Assert
      expect(ref).toHaveBeenCalledWith(storage, profileImageUrl);
      expect(deleteObject).toHaveBeenCalledWith(mockRef);
    });

    it('should handle profile image URL with very long string gracefully', async () => {
      // Arrange
      const profileImageUrl = 'a'.repeat(1000);
      const mockRef = {};
      ref.mockReturnValue(mockRef);
      deleteObject.mockResolvedValue();

      // Act
      await deleteOldProfileImage(profileImageUrl);

      // Assert
      expect(ref).toHaveBeenCalledWith(storage, profileImageUrl);
      expect(deleteObject).toHaveBeenCalledWith(mockRef);
    });

    it('should handle profile image URL with non-string type gracefully', async () => {
      // Arrange
      const profileImageUrl = 12345;
      const mockRef = {};
      ref.mockReturnValue(mockRef);
      deleteObject.mockResolvedValue();

      // Act
      await deleteOldProfileImage(profileImageUrl);

      // Assert
      expect(ref).not.toHaveBeenCalled();
      expect(deleteObject).not.toHaveBeenCalled();
    });
  });
});
