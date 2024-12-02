import { addHashtag } from "../writeblogFunctions";

describe('addHashtag() addHashtag method', () => {
  // Happy Path Tests
  describe('Happy Path', () => {
    it('should add a new hashtag to the list when it is not already present', () => {
      const hashtagInput = 'newTag';
      const hashtags = ['#existingTag'];
      const setHashtags = jest.fn();
      const setHashtagInput = jest.fn();

      addHashtag(hashtagInput, hashtags, setHashtags, setHashtagInput);

      expect(setHashtags).toHaveBeenCalledWith(['#existingTag', '#newTag']);
      expect(setHashtagInput).toHaveBeenCalledWith('');
    });

    it('should not add a hashtag if it is already present in the list', () => {
      const hashtagInput = 'existingTag';
      const hashtags = ['#existingTag'];
      const setHashtags = jest.fn();
      const setHashtagInput = jest.fn();

      addHashtag(hashtagInput, hashtags, setHashtags, setHashtagInput);

      expect(setHashtags).not.toHaveBeenCalled();
      expect(setHashtagInput).not.toHaveBeenCalled();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should not add a hashtag if the input is an empty string', () => {
      const hashtagInput = '';
      const hashtags = ['#existingTag'];
      const setHashtags = jest.fn();
      const setHashtagInput = jest.fn();

      addHashtag(hashtagInput, hashtags, setHashtags, setHashtagInput);

      expect(setHashtags).not.toHaveBeenCalled();
      expect(setHashtagInput).not.toHaveBeenCalled();
    });

    it('should handle case sensitivity and add a hashtag if it differs in case', () => {
      const hashtagInput = 'NewTag';
      const hashtags = ['#newtag'];
      const setHashtags = jest.fn();
      const setHashtagInput = jest.fn();

      addHashtag(hashtagInput, hashtags, setHashtags, setHashtagInput);

      expect(setHashtags).toHaveBeenCalledWith(['#newtag', '#NewTag']);
      expect(setHashtagInput).toHaveBeenCalledWith('');
    });

    it('should not add a hashtag if the input is null', () => {
      const hashtagInput = null;
      const hashtags = ['#existingTag'];
      const setHashtags = jest.fn();
      const setHashtagInput = jest.fn();

      addHashtag(hashtagInput, hashtags, setHashtags, setHashtagInput);

      expect(setHashtags).not.toHaveBeenCalled();
      expect(setHashtagInput).not.toHaveBeenCalled();
    });

    it('should not add a hashtag if the input is undefined', () => {
      const hashtagInput = undefined;
      const hashtags = ['#existingTag'];
      const setHashtags = jest.fn();
      const setHashtagInput = jest.fn();

      addHashtag(hashtagInput, hashtags, setHashtags, setHashtagInput);

      expect(setHashtags).not.toHaveBeenCalled();
      expect(setHashtagInput).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: addHashtag
