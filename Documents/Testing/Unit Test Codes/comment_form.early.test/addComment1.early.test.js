import { addDoc, getFirestore, collection } from "firebase/firestore";
import { addComment1 } from "../../utils/comment_form";
import { useState } from "react";
import assert from 'assert';
import { get } from "http";

jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  getFirestore: jest.fn(() => ({})), // Mock getFirestore to return an empty object
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(() => ({})), // Mock collection to return an empty object
}));

jest.mock("react", () => ({
  useState: jest.fn(),
}));

describe("addComment1() addComment1 method", () => {
  const mockSetComments = jest.fn();
  const useStateMock = (initialState) => [initialState, mockSetComments];
  const currentUser = { displayName: "TestUser", uid: "12345" };

  beforeEach(() => {
    jest.clearAllMocks();
    useState.mockImplementation(useStateMock);
  });

  // Happy Paths
  it("should add a new comment to the root level", async () => {
    // Arrange
    const commentData = {
      content: "This is a test comment",
      parentId: "root",
      timestamp: new Date(),
      userId: currentUser.uid,
      username: currentUser.displayName,
    };
    addDoc.mockResolvedValueOnce();

    // Act
    await addComment1(commentData, currentUser);

    // Assert
    assert.strictEqual(addDoc.mock.calls.length, 1);
    assert.deepStrictEqual(addDoc.mock.calls[0][1], commentData);
  });

  it("should add a reply to an existing comment", async () => {
    // Arrange
    const commentData = {
      content: "This is a reply",
      parentId: "comment123",
      timestamp: new Date(),
      userId: currentUser.uid,
      username: currentUser.displayName,
    };
    addDoc.mockResolvedValueOnce();

    // Act
    await addComment1(commentData, currentUser);

    // Assert
    assert.strictEqual(addDoc.mock.calls.length, 1);
    assert.deepStrictEqual(addDoc.mock.calls[0][1], commentData);
  });

  // Edge Cases
  it("should handle missing currentUser gracefully", async () => {
    // Arrange
    const commentData = {
      content: "This is a test comment",
      parentId: "root",
      timestamp: new Date(),
      userId: "12345",
      username: "TestUser",
    };

    // Act
    await addComment1(commentData, null);

    // Assert
    assert.strictEqual(addDoc.mock.calls.length, 0);
  });

  it("should handle Firestore addDoc failure gracefully", async () => {
    // Arrange
    const commentData = {
      content: "This is a test comment",
      parentId: "root",
      timestamp: new Date(),
      userId: currentUser.uid,
      username: currentUser.displayName,
    };
    const errorMessage = "Firestore error";
    addDoc.mockRejectedValueOnce(new Error(errorMessage));

    // Act
    await addComment1(commentData, currentUser);

    // Assert
    assert.strictEqual(addDoc.mock.calls.length, 1);
    assert.deepStrictEqual(addDoc.mock.calls[0][1], commentData);
  });
  
  // Additional Tests
  it("should not add a comment if content is empty", async () => {
    // Arrange
    const commentData = {
      content: "",
      parentId: "root",
      timestamp: new Date(),
      userId: currentUser.uid,
      username: currentUser.displayName,
    };

    // Act
    await addComment1(commentData, currentUser);

    // Assert
    assert.strictEqual(addDoc.mock.calls.length, 0);
  });

  it("should add a comment with a different parentId", async () => {
    // Arrange
    const commentData = {
      content: "This is a test comment with different parentId",
      parentId: "parent123",
      timestamp: new Date(),
      userId: currentUser.uid,
      username: currentUser.displayName,
    };
    addDoc.mockResolvedValueOnce();

    // Act
    await addComment1(commentData, currentUser);

    // Assert
    assert.strictEqual(addDoc.mock.calls.length, 1);
    assert.deepStrictEqual(addDoc.mock.calls[0][1], commentData);
  });

  it("should add a comment with a different timestamp", async () => {
    // Arrange
    const commentData = {
      content: "This is a test comment with different timestamp",
      parentId: "root",
      timestamp: new Date("2023-01-01T00:00:00Z"),
      userId: currentUser.uid,
      username: currentUser.displayName,
    };
    addDoc.mockResolvedValueOnce();

    // Act
    await addComment1(commentData, currentUser);

    // Assert
    assert.strictEqual(addDoc.mock.calls.length, 1);
    assert.deepStrictEqual(addDoc.mock.calls[0][1], commentData);
  });

  it("should handle special characters in comment content", async () => {
    // Arrange
    const commentData = {
      content: "This is a test comment with special characters !@#$%^&*()",
      parentId: "root",
      timestamp: new Date(),
      userId: currentUser.uid,
      username: currentUser.displayName,
    };
    addDoc.mockResolvedValueOnce();

    // Act
    await addComment1(commentData, currentUser);

    // Assert
    assert.strictEqual(addDoc.mock.calls.length, 1);
    assert.deepStrictEqual(addDoc.mock.calls[0][1], commentData);
  });

  it("should handle very long comment content", async () => {
    // Arrange
    const longContent = "a".repeat(1000); // 1000 characters long
    const commentData = {
      content: longContent,
      parentId: "root",
      timestamp: new Date(),
      userId: currentUser.uid,
      username: currentUser.displayName,
    };
    addDoc.mockResolvedValueOnce();

    // Act
    await addComment1(commentData, currentUser);

    // Assert
    assert.strictEqual(addDoc.mock.calls.length, 1);
    assert.deepStrictEqual(addDoc.mock.calls[0][1], commentData);
  });
});
