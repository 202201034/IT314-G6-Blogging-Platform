import { handleShare } from '../blogAPI';

describe('handleShare() handleShare method', () => {
    let originalClipboard;
    let originalAlert;

    beforeAll(() => {
        // Save the original implementations
        originalClipboard = { ...navigator.clipboard };
        originalAlert = window.alert;

        // Mock the global window object and navigator only for these tests
        global.window = Object.create(window);  // Create a new window object
        global.navigator = { clipboard: { writeText: jest.fn() } }; // Mock the clipboard API
        global.alert = jest.fn();  // Mock the alert function
    });

    afterAll(() => {
        // Restore original implementations after all tests are done
        global.window = undefined;
        global.navigator = undefined;
        global.alert = undefined;
    });

    beforeEach(() => {
        // Reset mocks before each test
        navigator.clipboard.writeText.mockReset();
        alert.mockReset();
    });

    describe('Happy paths', () => {
        it('should copy the blog URL to the clipboard and show a success alert', async () => {
            // Arrange
            const blogId = '12345';
            const expectedUrl = `${window.location.origin}/blog/${blogId}`;

            // Act
            await handleShare(blogId);

            // Assert
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedUrl);
            expect(window.alert).toHaveBeenCalledWith('Blog URL copied to clipboard!');
        });
    });

    describe('Edge cases', () => {
        it('should handle clipboard write failure gracefully and show an error alert', async () => {
            // Arrange
            const blogId = '12345';
            navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard error'));

            // Act
            await handleShare(blogId);

            // Assert
            expect(navigator.clipboard.writeText).toHaveBeenCalled();
            expect(window.alert).toHaveBeenCalledWith('Failed to copy URL. Please try again.');
        });

        it('should handle an empty blogId gracefully', async () => {
            // Arrange
            const blogId = '';

            // Act
            await handleShare(blogId);

            // Assert
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${window.location.origin}/blog/`);
            expect(window.alert).toHaveBeenCalledWith('Blog URL copied to clipboard!');
        });
    });
});
