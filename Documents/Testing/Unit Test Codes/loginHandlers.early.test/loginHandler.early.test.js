import { signInWithEmailAndPassword } from "firebase/auth";
import { loginHandler } from '../loginHandlers';
import assert from 'assert';

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

describe('loginHandler() loginHandler method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should successfully log in a user with valid email and password', async () => {
      // Arrange: Mock the signInWithEmailAndPassword to resolve with a user object
      const mockUser = { user: { email: 'test@example.com' } };
      signInWithEmailAndPassword.mockResolvedValue(mockUser);

      const auth = {}; // Mock auth object
      const email = 'test@example.com';
      const password = 'validPassword';

      // Act: Call the loginHandler function
      const result = await loginHandler(auth, email, password);

      // Assert: Verify the result is the mock user
      assert.deepStrictEqual(result, mockUser);
      assert(signInWithEmailAndPassword.mock.calls[0][0] === auth);
      assert(signInWithEmailAndPassword.mock.calls[0][1] === email);
      assert(signInWithEmailAndPassword.mock.calls[0][2] === password);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should throw an error if email is missing', async () => {
      // Arrange: Define the inputs
      const auth = {};
      const email = '';
      const password = 'validPassword';

      // Act & Assert: Call the loginHandler and expect an error
      await assert.rejects(
        async () => await loginHandler(auth, email, password),
        { message: 'Please enter both email and password.' }
      );
    });

    it('should throw an error if password is missing', async () => {
      // Arrange: Define the inputs
      const auth = {};
      const email = 'test@example.com';
      const password = '';

      // Act & Assert: Call the loginHandler and expect an error
      await assert.rejects(
        async () => await loginHandler(auth, email, password),
        { message: 'Please enter both email and password.' }
      );
    });

    it('should throw an error if signInWithEmailAndPassword fails', async () => {
      // Arrange: Mock the signInWithEmailAndPassword to reject with an error
      signInWithEmailAndPassword.mockRejectedValue(new Error('Auth error'));

      const auth = {};
      const email = 'test@example.com';
      const password = 'invalidPassword';

      // Act & Assert: Call the loginHandler and expect an error
      await assert.rejects(
        async () => await loginHandler(auth, email, password),
        { message: 'Invalid email or password. Please try again.' }
      );
    });

    it('should throw an error if both email and password are missing', async () => {
      // Arrange: Define the inputs
      const auth = {};
      const email = '';
      const password = '';

      // Act & Assert: Call the loginHandler and expect an error
      await assert.rejects(
        async () => await loginHandler(auth, email, password),
        { message: 'Please enter both email and password.' }
      );
    });

    it('should throw an error if email is invalid format', async () => {
      // Arrange: Define the inputs
      const auth = {};
      const email = 'invalid-email';
      const password = 'validPassword';

      // Act & Assert: Call the loginHandler and expect an error
      await assert.rejects(
        async () => await loginHandler(auth, email, password),
        { message: 'Invalid email or password. Please try again.' }
      );
    });

    it('should throw an error if password is too short', async () => {
      // Arrange: Define the inputs
      const auth = {};
      const email = 'test@example.com';
      const password = '123';

      // Act & Assert: Call the loginHandler and expect an error
      await assert.rejects(
        async () => await loginHandler(auth, email, password),
        { message: 'Invalid email or password. Please try again.' }
      );
    });
  });
});
