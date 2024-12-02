import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import { updateUserProfile } from '../../utils/profile';

jest.mock("firebase/firestore", () => ({
  updateDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("../../firebase/firebase", () => ({
  db: {},
}));

describe('updateUserProfile() updateUserProfile method', () => {
  const userId = 'testUserId';
  const name = 'Test User';
  const bio = 'This is a test bio';
  const profileImage = 'http://example.com/image.jpg';
  const username = 'testuser';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy paths', () => {
    it('should update user profile successfully with valid inputs', async () => {
      // Arrange
      const userDocRef = {};
      doc.mockReturnValue(userDocRef);

      // Act
      await updateUserProfile(userId, name, bio, profileImage, username);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'users', userId);
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, {
        name,
        bio,
        profileImage,
        username,
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty name gracefully', async () => {
      // Arrange
      const emptyName = '';
      const userDocRef = {};
      doc.mockReturnValue(userDocRef);

      // Act
      await updateUserProfile(userId, emptyName, bio, profileImage, username);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'users', userId);
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, {
        name: emptyName,
        bio,
        profileImage,
        username,
      });
    });

    it('should handle empty bio gracefully', async () => {
      // Arrange
      const emptyBio = '';
      const userDocRef = {};
      doc.mockReturnValue(userDocRef);

      // Act
      await updateUserProfile(userId, name, emptyBio, profileImage, username);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'users', userId);
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, {
        name,
        bio: emptyBio,
        profileImage,
        username,
      });
    });

    it('should handle empty profileImage gracefully', async () => {
      // Arrange
      const emptyProfileImage = '';
      const userDocRef = {};
      doc.mockReturnValue(userDocRef);

      // Act
      await updateUserProfile(userId, name, bio, emptyProfileImage, username);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'users', userId);
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, {
        name,
        bio,
        profileImage: emptyProfileImage,
        username,
      });
    });

    it('should handle empty username gracefully', async () => {
      // Arrange
      const emptyUsername = '';
      const userDocRef = {};
      doc.mockReturnValue(userDocRef);

      // Act
      await updateUserProfile(userId, name, bio, profileImage, emptyUsername);

      // Assert
      expect(doc).toHaveBeenCalledWith(db, 'users', userId);
      expect(updateDoc).toHaveBeenCalledWith(userDocRef, {
        name,
        bio,
        profileImage,
        username: emptyUsername,
      });
    });
    
    it('should throw an error if updateDoc fails', async () => {
      // Arrange
      const errorMessage = 'Failed to update document';
      updateDoc.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(updateUserProfile(userId, name, bio, profileImage, username))
        .rejects
        .toThrow(errorMessage);
    });

    it('should throw an error if userId is missing', async () => {
      await expect(updateUserProfile(null, name, bio, profileImage, username))
        .rejects
        .toThrow('Invalid userId');
    });

    it('should throw an error if all fields are empty', async () => {
      await expect(updateUserProfile(userId, '', '', '', ''))
        .rejects
        .toThrow('All fields are empty');
    });
  });
});
