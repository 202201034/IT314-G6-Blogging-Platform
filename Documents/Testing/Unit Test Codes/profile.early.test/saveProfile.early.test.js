import { setDoc, doc } from "firebase/firestore";
import { saveProfile } from '../../utils/profile';
import assert from 'assert';

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  increment: jest.fn(() => ({ incrementValue: 1 })),
}));

describe('saveProfile() saveProfile method', () => {
  const mockUser = { uid: '123', email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should save profile successfully with valid data', async () => {
      // Arrange
      const profileData = {
        username: 'validUsername',
        age: 25,
        bio: 'This is a bio',
        location: 'Location',
        interests: ['coding', 'music'],
        imagePreview: 'image_url',
      };

      // Act
      await saveProfile(mockUser, profileData);

      const docCall = doc.mock.calls[0];
      assert(docCall[1] === 'users', 'Second argument of doc call should be "users"');
      assert(docCall[2] === mockUser.uid, `Third argument of doc call should be user's uid`);

      // Check that setDoc was called with the correct arguments
      const setDocCall = setDoc.mock.calls[0];
      assert.deepEqual(setDocCall[1], {
        username: 'validUsername',
        email: 'test@example.com',
        age: 25,
        bio: 'This is a bio',
        location: 'Location',
        interests: ['coding', 'music'],
        profileImage: 'image_url',
      }, 'setDoc should be called with correct data');
      assert.deepEqual(setDocCall[2], { merge: true }, 'setDoc should be called with { merge: true }');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should throw an error if username is missing', async () => {
      // Arrange
      const profileData = {
        age: 25,
        bio: 'This is a bio',
        location: 'Location',
        interests: ['coding', 'music'],
        imagePreview: 'image_url',
      };

      // Act & Assert
      await assert.rejects(async () => {
        await saveProfile(mockUser, profileData);
      }, {
        message: 'Username and age are required.',
      });
    });

    it('should throw an error if age is missing', async () => {
      // Arrange
      const profileData = {
        username: 'validUsername',
        bio: 'This is a bio',
        location: 'Location',
        interests: ['coding', 'music'],
        imagePreview: 'image_url',
      };

      // Act & Assert
      await assert.rejects(async () => {
        await saveProfile(mockUser, profileData);
      }, {
        message: 'Username and age are required.',
      });
    });

    it('should throw an error if username starts with a space', async () => {
      // Arrange
      const profileData = {
        username: ' invalidUsername',  // Leading space
        age: 25,
        bio: 'This is a bio',
        location: 'Location',
        interests: ['coding', 'music'],
        imagePreview: 'image_url',
      };
    
      // Act & Assert
      await assert.rejects(async () => {
        await saveProfile(mockUser, profileData);
      }, {
        message: 'Username cannot start with a space.',
      });
    });

    it('should throw an error if user is not authenticated', async () => {
      // Arrange
      const profileData = {
        username: 'validUsername',
        age: 25,
        bio: 'This is a bio',
        location: 'Location',
        interests: ['coding', 'music'],
        imagePreview: 'image_url',
      };

      // Act & Assert
      await assert.rejects(async () => {
        await saveProfile(null, profileData);
      }, {
        message: 'User is not authenticated.',
      });
    });

    it('should handle errors from setDoc gracefully', async () => {
      // Arrange
      const profileData = {
        username: 'validUsername',
        age: 25,
        bio: 'This is a bio',
        location: 'Location',
        interests: ['coding', 'music'],
        imagePreview: 'image_url',
      };
      setDoc.mockRejectedValue(new Error('Firestore error'));

      // Act & Assert
      await assert.rejects(async () => {
        await saveProfile(mockUser, profileData);
      }, {
        message: 'Error saving profile',
      });
    });
  });
});
