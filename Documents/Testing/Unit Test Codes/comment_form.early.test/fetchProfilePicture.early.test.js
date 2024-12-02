import { fetchProfilePicture, getUserByUsername } from '../comment_form';

// Mock the `getUserByUsername` function
jest.mock('../comment_form', () => ({
  getUserByUsername: jest.fn(),
  fetchProfilePicture: jest.requireActual('../comment_form').fetchProfilePicture, // Keep the actual fetchProfilePicture
}));

describe('fetchProfilePicture() fetchProfilePicture method', () => {
  let setProfilePictures;
  let setLoadingUsernames;
  let profilePictures;
  let loadingUsernames;

  beforeEach(() => {
    // Reset mock functions and initial states
    setProfilePictures = jest.fn();
    setLoadingUsernames = jest.fn();
    profilePictures = {};
    loadingUsernames = new Set();
    getUserByUsername.mockReset();
  });

  it('should fetch and set the profile picture for a user', async () => {
    const username = 'testUser';
    const profileImage = 'http://example.com/profile.jpg';
    
    // Mock getUserByUsername to return a user with a profile image
    getUserByUsername.mockResolvedValue({ profileImage });

    await fetchProfilePicture(username, profilePictures, loadingUsernames, setLoadingUsernames, setProfilePictures);

    expect(setProfilePictures).toHaveBeenCalled();
    const updateFunction = setProfilePictures.mock.calls[0][0];
    expect(updateFunction({})).toEqual({ [username]: profileImage });
  });

  it('should use default profile picture if user has no profile image', async () => {
    const username = 'testUser';
    
    // Mock getUserByUsername to return a user without a profile image
    getUserByUsername.mockResolvedValue({ profileImage: null });

    await fetchProfilePicture(username, profilePictures, loadingUsernames, setLoadingUsernames, setProfilePictures);

    expect(setProfilePictures).toHaveBeenCalled();
    const updateFunction = setProfilePictures.mock.calls[0][0];
    expect(updateFunction({})).toEqual({ [username]: 'default-profile-pic-url' });
  });

  it('should not fetch profile picture if already loaded', async () => {
    const username = 'testUser';
    profilePictures[username] = 'http://example.com/profile.jpg';  // Simulate already loaded profile picture

    await fetchProfilePicture(username, profilePictures, loadingUsernames, setLoadingUsernames, setProfilePictures);

    expect(setProfilePictures).not.toHaveBeenCalled();  // Since the profile is already loaded, it should not be called
  });

  it('should not fetch profile picture if username is loading', async () => {
    const username = 'testUser';
    loadingUsernames.add(username);  // Simulate the username is already in the loading set

    await fetchProfilePicture(username, profilePictures, loadingUsernames, setLoadingUsernames, setProfilePictures);

    expect(setProfilePictures).not.toHaveBeenCalled();  // Since the username is in loading set, it should not be called
  });

  it('should handle case where user data is not found', async () => {
    const username = 'nonExistentUser';
    
    // Mock getUserByUsername to return null (user not found)
    getUserByUsername.mockResolvedValue(null);

    await fetchProfilePicture(username, profilePictures, loadingUsernames, setLoadingUsernames, setProfilePictures);

    expect(setProfilePictures).not.toHaveBeenCalled();  // Since no user was found, it should not be called
  });
});
