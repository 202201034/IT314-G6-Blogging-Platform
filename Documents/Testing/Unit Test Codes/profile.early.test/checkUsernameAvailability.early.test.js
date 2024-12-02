import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";
import { checkUsernameAvailability } from '../profile';
import assert from 'assert';

jest.mock("../../firebase/firebase.js", () => ({
  db: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

describe('checkUsernameAvailability() checkUsernameAvailability method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy paths', () => {
    it('should return true when the username is available', async () => {
      const newUsername = 'availableUsername';
      const mockQuerySnapshot = { empty: true };

      // Mock Firestore methods
      collection.mockReturnValue('usersCollectionRef');
      where.mockReturnValue({ fieldPath: 'username', opStr: '==', value: newUsername });
      query.mockReturnValue('queryRef');
      getDocs.mockResolvedValue(mockQuerySnapshot);

      // Act
      const result = await checkUsernameAvailability(newUsername);

      // Assert
      assert.strictEqual(collection.mock.calls[0][0], db);
      assert.strictEqual(collection.mock.calls[0][1], 'users');
      assert.strictEqual(query.mock.calls[0][1][1].fieldPath, 'username');
      assert.strictEqual(query.mock.calls[0][1][1].opStr, '==');
      assert.strictEqual(query.mock.calls[0][1][1].value, newUsername);
      assert.strictEqual(result, true);
    });

    it('should return false when the username is not available', async () => {
      const newUsername = 'takenUsername';
      const mockQuerySnapshot = { empty: false };

      // Mock Firestore methods
      collection.mockReturnValue('usersCollectionRef');
      where.mockReturnValue({ fieldPath: 'username', opStr: '==', value: newUsername });
      query.mockReturnValue('queryRef');
      getDocs.mockResolvedValue(mockQuerySnapshot);

      // Act
      const result = await checkUsernameAvailability(newUsername);

      // Assert
      assert.strictEqual(collection.mock.calls[0][0], db);
      assert.strictEqual(collection.mock.calls[0][1], 'users');
      assert.strictEqual(query.mock.calls[0][1][1].fieldPath, 'username');
      assert.strictEqual(query.mock.calls[0][1][1].opStr, '==');
      assert.strictEqual(query.mock.calls[0][1][1].value, newUsername);
      assert.strictEqual(result, false);
    });
  });

  describe('Edge cases', () => {
    it('should return false when an error occurs during the query', async () => {
      const newUsername = 'errorUsername';
      getDocs.mockRejectedValue(new Error('Firestore error'));

      // Mock Firestore methods
      collection.mockReturnValue('usersCollectionRef');
      where.mockReturnValue({ fieldPath: 'username', opStr: '==', value: newUsername });
      query.mockReturnValue('queryRef');

      // Act
      const result = await checkUsernameAvailability(newUsername);

      // Assert
      assert.strictEqual(collection.mock.calls[0][0], db);
      assert.strictEqual(collection.mock.calls[0][1], 'users');
      assert.strictEqual(query.mock.calls[0][1][1].fieldPath, 'username');
      assert.strictEqual(query.mock.calls[0][1][1].opStr, '==');
      assert.strictEqual(query.mock.calls[0][1][1].value, newUsername);
      assert.strictEqual(result, false);
    });

    it('should trim the username before checking availability', async () => {
      const newUsername = '  trimmedUsername  ';
      const trimmedUsername = 'trimmedUsername';
      const mockQuerySnapshot = { empty: true };

      // Mock Firestore methods
      collection.mockReturnValue('usersCollectionRef');
      where.mockReturnValue({ fieldPath: 'username', opStr: '==', value: trimmedUsername });
      query.mockReturnValue('queryRef');
      getDocs.mockResolvedValue(mockQuerySnapshot);

      // Act
      const result = await checkUsernameAvailability(newUsername);

      // Assert
      assert.strictEqual(collection.mock.calls[0][0], db);
      assert.strictEqual(collection.mock.calls[0][1], 'users');
      assert.strictEqual(query.mock.calls[0][1][1].fieldPath, 'username');
      assert.strictEqual(query.mock.calls[0][1][1].opStr, '==');
      assert.strictEqual(query.mock.calls[0][1][1].value, trimmedUsername);
      assert.strictEqual(result, true);
    });

    it('should handle empty username input gracefully', async () => {
      const newUsername = '';
      const mockQuerySnapshot = { empty: true };

      // Mock Firestore methods
      collection.mockReturnValue('usersCollectionRef');
      where.mockReturnValue({ fieldPath: 'username', opStr: '==', value: newUsername });
      query.mockReturnValue('queryRef');
      getDocs.mockResolvedValue(mockQuerySnapshot);

      // Act
      const result = await checkUsernameAvailability(newUsername);

      // Assert
      assert.strictEqual(collection.mock.calls[0][0], db);
      assert.strictEqual(collection.mock.calls[0][1], 'users');
      assert.strictEqual(query.mock.calls[0][1][1].fieldPath, 'username');
      assert.strictEqual(query.mock.calls[0][1][1].opStr, '==');
      assert.strictEqual(query.mock.calls[0][1][1].value, newUsername);
      assert.strictEqual(result, true);
    });
  });
});
