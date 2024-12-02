import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase.js";
import { signupHandler } from '../registerHandlers';
import assert from 'assert';

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("../../firebase/firebase.js", () => ({
  auth: {},
  db: {},
}));

describe('signupHandler() signupHandler method', () => {
  let setErrorMock;

  beforeEach(() => {
    setErrorMock = jest.fn();
  });

  describe('Happy Paths', () => {
    it('should create a user and save data to Firestore when valid inputs are provided', async () => {
      // Arrange
      const email = 'test123@example.com';
      const password = 'password123';
      const username = 'testuser';
      const userCredentialMock = { user: { uid: '12345' } };

      createUserWithEmailAndPassword.mockResolvedValue(userCredentialMock);
      updateProfile.mockResolvedValue();
      setDoc.mockResolvedValue();

      // Act
      await signupHandler(email, password, username, setErrorMock);

      // Assert
      assert.strictEqual(createUserWithEmailAndPassword.mock.calls.length, 1);
      assert.strictEqual(updateProfile.mock.calls.length, 1);
      assert.strictEqual(setDoc.mock.calls.length, 1);
      assert.strictEqual(setErrorMock.mock.calls.length, 0);
    });
  });

  describe('Edge Cases', () => {
    it('should not proceed if email is missing', async () => {
      // Arrange
      const email = '';
      const password = 'password123';
      const username = 'testuser';

      // Act
      await signupHandler(email, password, username, setErrorMock);

      assert.strictEqual(setErrorMock.mock.calls.length, 1);
      assert.strictEqual(setErrorMock.mock.calls[0][0], 'Email is required.');
    });

    it('should not proceed if password is missing', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = '';
      const username = 'testuser';

      // Act
      await signupHandler(email, password, username, setErrorMock);

      assert.strictEqual(setErrorMock.mock.calls.length, 1);
      assert.strictEqual(setErrorMock.mock.calls[0][0], 'Password is required.');
    });

    it('should not proceed if username is missing', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const username = '';

      // Act
      await signupHandler(email, password, username, setErrorMock);

      assert.strictEqual(setErrorMock.mock.calls.length, 1);
      assert.strictEqual(setErrorMock.mock.calls[0][0], 'Username is required.');
    });

    it('should set error message for weak password', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = '123';
      const username = 'testuser';
      const error = { code: 'auth/weak-password' };

      createUserWithEmailAndPassword.mockRejectedValue(error);

      // Act
      await signupHandler(email, password, username, setErrorMock);

      // Assert
      assert.strictEqual(setErrorMock.mock.calls.length, 1);
      assert.strictEqual(setErrorMock.mock.calls[0][0], 'Password must be at least 6 characters long.');
    });

    it('should set error message for email already in use', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const username = 'testuser';
      const error = { code: 'auth/email-already-in-use' };

      createUserWithEmailAndPassword.mockRejectedValue(error);

      // Act
      await signupHandler(email, password, username, setErrorMock);

      // Assert
      assert.strictEqual(setErrorMock.mock.calls.length, 1);
      assert.strictEqual(setErrorMock.mock.calls[0][0], 'This email is already registered. Please use another email.');
    });

    it('should set error message for invalid email format', async () => {
      // Arrange
      const email = 'invalid-email';
      const password = 'password123';
      const username = 'testuser';
      const error = { code: 'auth/invalid-email' };

      createUserWithEmailAndPassword.mockRejectedValue(error);

      // Act
      await signupHandler(email, password, username, setErrorMock);

      // Assert
      assert.strictEqual(setErrorMock.mock.calls.length, 1);
      assert.strictEqual(setErrorMock.mock.calls[0][0], 'Invalid email format. Please check your email.');
    });

    it('should set a generic error message for unexpected errors', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const username = 'testuser';
      const error = { code: 'auth/unknown-error' };

      createUserWithEmailAndPassword.mockRejectedValue(error);

      // Act
      await signupHandler(email, password, username, setErrorMock);

      // Assert
      assert.strictEqual(setErrorMock.mock.calls.length, 1);
      assert.strictEqual(setErrorMock.mock.calls[0][0], 'An unexpected error occurred. Please try again.');
    });
  });
});

// End of unit tests for: signupHandler
