import { useLocation } from 'react-router-dom';
import useUserProfileInfo from '../../../../hooks/useUserProfileInfo';
import './index.css';
import useUserContext from '../../../../hooks/useUserContext';

/**
 * UserProfile component renders the user's profile information.
 * If the user is the current user:
 * It includes edit buttons on some fields so the user can update their profile information.
 */
const UserProfileInfo = () => {
  const location = useLocation();
  const isCurrentUserPage = location.pathname === '/currentUser';
  const { user } = useUserContext();

  const {
    displayedUser,
    isEditing,
    isImageUploadVisible,
    imageUrl,
    loading,
    editableName,
    setEditableName,
    editablePassword,
    setEditablePassword,
    isPasswordVisible,
    setIsPasswordVisible,
    editablePronouns,
    setEditableCustomPronouns,
    editableCustomPronouns,
    handleEditClick,
    handleImageChange,
    handlePronounsChange,
    handleUpload,
    handleSave,
    postNotification,
    handleLogout,
    isDisabled,
  } = useUserProfileInfo();

  if (!displayedUser) {
    return <div>Loading...</div>;
  }

  let imageSrc =
    'https://project905bucket.s3.us-east-2.amazonaws.com/1732429190349-profilePicture.png';

  if (imageUrl !== '') {
    imageSrc = imageUrl;
  } else if (displayedUser && displayedUser.image !== ' ') {
    imageSrc = displayedUser.image;
  }

  return (
    <>
      {isEditing && <div className='overlay'></div>}

      <div className='userProfileInfoWrapper'>
        <div className='userProfileInfo'>
          <div className='profileHeader'>
            <div className='profilePicContainer'>
              <img src={imageSrc} alt={displayedUser.username} className='profilePic' />
              {isImageUploadVisible && (
                <div className='uploadContainer'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='fileInput'
                  />
                  <button onClick={handleUpload} disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              )}
            </div>

            {!isEditing ? (
              <div className='profileDetails'>
                <h2>{displayedUser.name}</h2>
                <p className='detail'>{displayedUser.username}</p>
                <p className='detail'>{displayedUser.email}</p>
                <p className='detail'>Pronouns: {displayedUser.pronouns}</p>
              </div>
            ) : (
              <form className='profileDetails'>
                <input
                  type='text'
                  value={editableName}
                  onChange={e => setEditableName(e.target.value)}
                  placeholder='Enter your full name'
                  required
                  className='input-text'
                  id={'nameInput'}
                />
                <div className='passwordContainer'>
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    value={editablePassword}
                    onChange={e => setEditablePassword(e.target.value)}
                    placeholder='Enter your password'
                    required
                    className='input-text'
                    id='passwordInput'
                  />
                  <button
                    type='button'
                    className='togglePasswordButton'
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                    {isPasswordVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className='detail'>{displayedUser.username}</p>
                <p className='detail'>{displayedUser.email}</p>
                <select
                  value={editablePronouns}
                  onChange={handlePronounsChange}
                  required
                  className='input-text'
                  id='pronounsInput'>
                  <option value='' disabled>
                    Select your pronouns
                  </option>
                  <option value='She/Her'>She/Her</option>
                  <option value='He/Him'>He/Him</option>
                  <option value='They/Them'>They/Them</option>
                  <option value='Other'>Other</option>
                </select>
                {editablePronouns === 'Other' && (
                  <input
                    type='text'
                    value={editableCustomPronouns}
                    onChange={e => setEditableCustomPronouns(e.target.value)}
                    placeholder='Enter your pronouns ex.(ze/zir)'
                    required
                    className='input-text'
                  />
                )}
              </form>
            )}

            {isCurrentUserPage ? (
              <div className='saveCancel'>
                {isEditing && (
                  <button onClick={handleSave} className='editButton'>
                    Save
                  </button>
                )}
                <button className='editButton' onClick={handleEditClick}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
            ) : (
              <button
                disabled={displayedUser.friends.includes(user.username) || isDisabled}
                className='addFriendButton'
                onClick={postNotification}>
                Add Friend
              </button>
            )}
          </div>

          <button className='logoutButton' disabled={isEditing} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfileInfo;
