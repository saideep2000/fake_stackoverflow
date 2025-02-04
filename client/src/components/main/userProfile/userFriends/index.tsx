import useUserProfileFriends from '../../../../hooks/useUserProfileFriends';
import './index.css';

/**
 * UserProfileFriends component renders the user's friends,
 * and if the user is the current user, there will be a remove button present.
 */
const UserProfileFriends = () => {
  const { displayedUser, userfriends, isRemoving, isCurrentUserPage, handleRemoveFriend } =
    useUserProfileFriends();

  return (
    <div className='friendsList'>
      {displayedUser && displayedUser.friends && (
        <div className='friendListContainer'>
          {userfriends.map(friend => (
            <div className='friendCard' key={friend.username}>
              <img src={friend.image} alt={friend.username} className='friendProfilePic' />
              <div className='friendDetails'>
                <h4>{friend.username}</h4>
              </div>
              {isCurrentUserPage && (
                <button
                  className='removeFriendButton'
                  onClick={() => handleRemoveFriend(friend)}
                  disabled={isRemoving === friend.username}>
                  Remove Friend
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfileFriends;
