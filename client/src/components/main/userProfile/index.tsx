import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCircle } from 'react-icons/fa6';
import useUserContext from '../../../hooks/useUserContext';
import UserProfileInfo from './userInfo';
import UserProfileNotifications from './userNotifications';
import UserProfileFriends from './userFriends';
import './index.css';
import { User } from '../../../types';
import { getUserByUsername } from '../../../services/userService';

/**
 * UserProfile component renders a page displaying the logged in user's profile.
 */
const UserProfile = () => {
  const location = useLocation();
  const { user: currentUser } = useUserContext();

  const [currUser, setCurrUser] = useState<User>(currentUser);

  const fetchCurrUser = async () => {
    const fetchedUser = await getUserByUsername(currentUser.username);

    if (currUser) {
      setCurrUser(fetchedUser);
    }
  };

  fetchCurrUser();

  const [activeTab, setActiveTab] = useState('friends');

  const isCurrentUserPage = location.pathname === '/currentUser';

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <UserProfileInfo />
      <div className='tabs'>
        <div
          className={`profileTab ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => handleTabClick('friends')}>
          <h3>Friends</h3>
        </div>
        {isCurrentUserPage && (
          <div
            className={`profileTab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => handleTabClick('notifications')}>
            <div className='notifTab'>
              <h3>Notifications</h3>
              {currUser.notifications.length > 0 && <FaCircle />}
            </div>
          </div>
        )}
      </div>
      {activeTab === 'friends' && <UserProfileFriends />}
      {activeTab === 'notifications' && <UserProfileNotifications />}
    </div>
  );
};

export default UserProfile;
