import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signInWithGoogle } from '../loginHandlers';
import assert from 'assert';

jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

describe('signInWithGoogle() signInWithGoogle method', () => {
  let auth;
  let db;

  beforeEach(() => {
    auth = {};
    db = {};
  });

  describe('Happy paths', () => {
    it('should sign in successfully with Google and return user data', async () => {
      // Mocking successful sign-in with Google
      const mockUser = { email: 'test@example.com' };
      signInWithPopup.mockResolvedValueOnce({ user: mockUser });

      // Mocking Firestore query to find the user
      const mockQuerySnapshot = { empty: false };
      getDocs.mockResolvedValueOnce(mockQuerySnapshot);

      const user = await signInWithGoogle(auth, db);

      assert(signInWithPopup.mock.calls.length > 0);
      assert(signInWithPopup.mock.calls[0][0] === auth);
      assert(signInWithPopup.mock.calls[0][1] instanceof GoogleAuthProvider);
      assert(collection.mock.calls.length > 0);
      assert(collection.mock.calls[0][1] === 'users');
      assert(query.mock.calls.length > 0);
      assert(where.mock.calls.length > 0);
      assert(where.mock.calls[0][0] === 'email');
      assert(where.mock.calls[0][1] === '==');
      assert(where.mock.calls[0][2] === mockUser.email);
      assert(getDocs.mock.calls.length > 0);
      assert(user === mockUser);
    });
  });

  describe('Edge cases', () => {
    it('should throw an error if the email does not exist in the database', async () => {
      // Mocking successful sign-in with Google
      const mockUser = { email: 'nonexistent@example.com' };
      signInWithPopup.mockResolvedValueOnce({ user: mockUser });

      // Mocking Firestore query to not find the user
      const mockQuerySnapshot = { empty: true };
      getDocs.mockResolvedValueOnce(mockQuerySnapshot);

      await assert.rejects(
        async () => await signInWithGoogle(auth, db),
        { message: 'This email does not exist. Please register first.' }
      );

      assert(signOut.mock.calls.length > 0);
      assert(signOut.mock.calls[0][0] === auth);
    });

    it('should throw a generic error if signInWithPopup fails', async () => {
      // Mocking sign-in failure
      signInWithPopup.mockRejectedValueOnce(new Error('Popup failed'));

      await assert.rejects(
        async () => await signInWithGoogle(auth, db),
        { message: 'An error occurred while signing in with Google.' }
      );
    });

    it('should throw a generic error if getDocs fails', async () => {
      // Mocking successful sign-in with Google
      const mockUser = { email: 'test@example.com' };
      signInWithPopup.mockResolvedValueOnce({ user: mockUser });

      // Mocking Firestore query failure
      getDocs.mockRejectedValueOnce(new Error('Firestore error'));

      await assert.rejects(
        async () => await signInWithGoogle(auth, db),
        { message: 'An error occurred while signing in with Google.' }
      );
    });

    it('should throw an error if auth is not provided', async () => {
      await assert.rejects(
        async () => await signInWithGoogle(null, db),
        { message: 'auth is required' }
      );
    });

    it('should throw an error if db is not provided', async () => {
      await assert.rejects(
        async () => await signInWithGoogle(auth, null),
        { message: 'db is required' }
      );
    });

    it('should throw an error if both auth and db are not provided', async () => {
      await assert.rejects(
        async () => await signInWithGoogle(null, null),
        { message: 'auth and db are required' }
      );
    });
  });
});
