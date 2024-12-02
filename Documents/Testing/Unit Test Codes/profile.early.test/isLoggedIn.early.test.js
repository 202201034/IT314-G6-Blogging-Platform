import { auth } from "../../firebase/firebase.js";
import { isLoggedIn } from '../profile';
import assert from 'assert';

// utils/profile.test.js
jest.mock("../../firebase/firebase", () => ({
  auth: {
    currentUser: null,
  },
}));

describe('isLoggedIn() isLoggedIn method', () => {
  beforeEach(() => {
    // Reset the mock before each test
    auth.currentUser = null;
  });

  describe('Happy paths', () => {
    it('should return true when a user is logged in', () => {
      // Arrange: Set up the currentUser to simulate a logged-in user
      auth.currentUser = { uid: '12345', email: 'test@example.com' };

      // Act: Call the function
      const result = isLoggedIn();

      // Assert: Verify the result is true
      assert.strictEqual(result, true);
    });

    it('should return false when no user is logged in', () => {
      // Arrange: Ensure currentUser is null to simulate no user logged in
      auth.currentUser = null;

      // Act: Call the function
      const result = isLoggedIn();

      // Assert: Verify the result is false
      assert.strictEqual(result, false);
    });
  });

  describe('Edge cases', () => {
    it('should return false when currentUser is undefined', () => {
      // Arrange: Set currentUser to undefined
      auth.currentUser = undefined;

      // Act: Call the function
      const result = isLoggedIn();

      // Assert: Verify the result is false
      assert.strictEqual(result, false);
    });

    it('should return false when currentUser is an empty object', () => {
      // Arrange: Set currentUser to an empty object
      auth.currentUser = {};

      // Act: Call the function
      const result = isLoggedIn();

      // Assert: Verify the result is false
      assert.strictEqual(result, false);
    });

    it('should return false when currentUser is null', () => {
      // Arrange: Set currentUser to null
      auth.currentUser = null;

      // Act: Call the function
      const result = isLoggedIn();

      // Assert: Verify the result is false
      assert.strictEqual(result, false);
    });
  });
});
