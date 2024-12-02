
// Unit tests for: removeHashtag


import { removeHashtag } from '../writeblogFunctions';


// utils/writeblogFunctions.test.js
describe('removeHashtag() removeHashtag method', () => {
  let hashtags;
  let setHashtags;

  beforeEach(() => {
    // Initialize the hashtags array and mock setHashtags function before each test
    hashtags = ['#javascript', '#coding', '#webdev'];
    setHashtags = jest.fn();
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should remove a hashtag that exists in the array', () => {
      // Test removing an existing hashtag
      const hashtagToRemove = '#coding';
      removeHashtag(hashtagToRemove, hashtags, setHashtags);

      // Verify that setHashtags is called with the correct updated array
      expect(setHashtags).toHaveBeenCalledWith(['#javascript', '#webdev']);
    });

    it('should not modify the array if the hashtag does not exist', () => {
      // Test attempting to remove a non-existent hashtag
      const hashtagToRemove = '#nonexistent';
      removeHashtag(hashtagToRemove, hashtags, setHashtags);

      // Verify that setHashtags is called with the original array
      expect(setHashtags).toHaveBeenCalledWith(['#javascript', '#coding', '#webdev']);
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle an empty array gracefully', () => {
      // Test removing a hashtag from an empty array
      hashtags = [];
      const hashtagToRemove = '#javascript';
      removeHashtag(hashtagToRemove, hashtags, setHashtags);

      // Verify that setHashtags is called with an empty array
      expect(setHashtags).toHaveBeenCalledWith([]);
    });

    it('should handle removing a hashtag when it is the only element in the array', () => {
      // Test removing the only hashtag in the array
      hashtags = ['#javascript'];
      const hashtagToRemove = '#javascript';
      removeHashtag(hashtagToRemove, hashtags, setHashtags);

      // Verify that setHashtags is called with an empty array
      expect(setHashtags).toHaveBeenCalledWith([]);
    });

    it('should handle case sensitivity correctly', () => {
      // Test removing a hashtag with different case
      const hashtagToRemove = '#JavaScript';
      removeHashtag(hashtagToRemove, hashtags, setHashtags);

      // Verify that setHashtags is called with the original array since case does not match
      expect(setHashtags).toHaveBeenCalledWith(['#javascript', '#coding', '#webdev']);
    });

    it('should not throw an error if the hashtag to remove is undefined', () => {
      // Test removing an undefined hashtag
      const hashtagToRemove = undefined;
      expect(() => removeHashtag(hashtagToRemove, hashtags, setHashtags)).not.toThrow();

      // Verify that setHashtags is called with the original array
      expect(setHashtags).toHaveBeenCalledWith(['#javascript', '#coding', '#webdev']);
    });

    it('should not throw an error if the hashtag to remove is null', () => {
      // Test removing a null hashtag
      const hashtagToRemove = null;
      expect(() => removeHashtag(hashtagToRemove, hashtags, setHashtags)).not.toThrow();

      // Verify that setHashtags is called with the original array
      expect(setHashtags).toHaveBeenCalledWith(['#javascript', '#coding', '#webdev']);
    });
  });
});

// End of unit tests for: removeHashtag
