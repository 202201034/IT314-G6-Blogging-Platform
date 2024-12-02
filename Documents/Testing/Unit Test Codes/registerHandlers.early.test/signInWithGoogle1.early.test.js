import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase.js";
import { signInWithGoogle } from '../registerHandlers';

jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

jest.mock("../../firebase/firebase", () => ({
  auth: {},
  db: {},
}));

describe('signInWithGoogle() signInWithGoogle method', () => {
  let setError;

  beforeEach(() => {
    setError = jest.fn();
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  describe('Happy Paths', () => {
    it('should sign in a user with Google and store data in Firestore if the user is new', async () => {
      // Arrange
      const mockUser = { uid: '123', displayName: 'Test User', email: 'test@example.com' };
      signInWithPopup.mockResolvedValueOnce({ user: mockUser });
      getDoc.mockResolvedValueOnce({ exists: () => false });

      // Act
      await signInWithGoogle(setError);

      // Assert
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
      expect(getDoc).toHaveBeenCalledWith(doc(db, 'users', mockUser.uid));
      expect(setDoc).toHaveBeenCalledWith(doc(db, 'users', mockUser.uid), {
        name: mockUser.displayName,
        email: mockUser.email,
        uid: mockUser.uid,
      });
      expect(setError).not.toHaveBeenCalled();
    });

    it('should sign in a user with Google and not store data if the user already exists', async () => {
      // Arrange
      const mockUser = { uid: '123', displayName: 'Test User', email: 'test@example.com' };
      signInWithPopup.mockResolvedValueOnce({ user: mockUser });
      getDoc.mockResolvedValueOnce({ exists: () => true });

      // Act
      await signInWithGoogle(setError);

      // Assert
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
      expect(getDoc).toHaveBeenCalledWith(doc(db, 'users', mockUser.uid));
      expect(setDoc).not.toHaveBeenCalled();
      expect(setError).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors during Google sign-in and set an error message', async () => {
      // Arrange
      const mockError = new Error('Sign-in failed');
      signInWithPopup.mockRejectedValueOnce(mockError);

      // Act
      await signInWithGoogle(setError);

      // Assert
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
      expect(setError).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
    });

    it('should handle errors when checking if a user exists in Firestore', async () => {
      // Arrange
      const mockUser = { uid: '123', displayName: 'Test User', email: 'test@example.com' };
      signInWithPopup.mockResolvedValueOnce({ user: mockUser });
      getDoc.mockRejectedValueOnce(new Error('Firestore error'));

      // Act
      await signInWithGoogle(setError);

      // Assert
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
      expect(getDoc).toHaveBeenCalledWith(doc(db, 'users', mockUser.uid));
      expect(setError).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
    });

    it('should handle errors when storing new user data in Firestore', async () => {
      // Arrange
      const mockUser = { uid: '123', displayName: 'Test User', email: 'test@example.com' };
      signInWithPopup.mockResolvedValueOnce({ user: mockUser });
      getDoc.mockResolvedValueOnce({ exists: () => false });
      setDoc.mockRejectedValueOnce(new Error('Firestore error'));

      // Act
      await signInWithGoogle(setError);

      // Assert
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
      expect(getDoc).toHaveBeenCalledWith(doc(db, 'users', mockUser.uid));
      expect(setDoc).toHaveBeenCalledWith(doc(db, 'users', mockUser.uid), {
        name: mockUser.displayName,
        email: mockUser.email,
        uid: mockUser.uid,
      });
      expect(setError).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
    });

    it('should handle case where user cancels Google sign-in', async () => {
      // Arrange
      const mockError = { code: 'auth/popup-closed-by-user' };
      signInWithPopup.mockRejectedValueOnce(mockError);

      // Act
      await signInWithGoogle(setError);

      // Assert
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
      expect(setError).toHaveBeenCalledWith('Google sign-in was canceled. Please try again.');
    });

    it('should handle case where user denies Google sign-in permissions', async () => {
      // Arrange
      const mockError = { code: 'auth/user-disabled' };
      signInWithPopup.mockRejectedValueOnce(mockError);

      // Act
      await signInWithGoogle(setError);

      // Assert
      expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
      expect(setError).toHaveBeenCalledWith('Google sign-in permissions were denied. Please try again.');
    });
  });
});
