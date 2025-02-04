import { IoClose } from 'react-icons/io5';
import useUserProfileNotifications from '../../../../hooks/useUserProfileNotifications';
import './index.css';

const UserProfileNotifications = () => {
  const { userNotifications, handleClearNotification, handleAcceptNotification } =
    useUserProfileNotifications();

  return (
    <div className='notifList'>
      {userNotifications && (
        <div className='notifListContainer'>
          {userNotifications.map((notif, idx) => (
            <div key={idx}>
              {notif.type === 'request' && (
                <div className='notifCard'>
                  <div className='notifDetails'>
                    {notif.sender} is requesting to be friends with you. Please indicate your
                    response:
                  </div>
                  <div className='adButtons'>
                    <button
                      className='acceptButton'
                      onClick={() => handleAcceptNotification(notif)}>
                      Accept
                    </button>
                    <button
                      className='declineButton'
                      onClick={() => handleClearNotification(notif)}>
                      Decline
                    </button>
                  </div>
                </div>
              )}
              {notif.type === 'accept' && (
                <div className='notifCard'>
                  <div className='notifDetails'>
                    {notif.sender} has accepted your friend request! You can now view any private
                    posts they make.
                  </div>
                  <button className='clearButton' onClick={() => handleClearNotification(notif)}>
                    <IoClose />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfileNotifications;
