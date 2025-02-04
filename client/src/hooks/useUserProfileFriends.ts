import { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { User } from '../types';
import useUserContext from './useUserContext';
import { getUserByUsername, removeFriend } from '../services/userService';

/**
 * Custom hook to manage fetching and updating user friends.
 */
const useUserProfileFriends = () => {
  const [userfriends, setUserFriends] = useState<User[]>([]);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [errText, setErrText] = useState<string>('');
  const { user: currentUser, socket } = useUserContext();
  const location = useLocation();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const { username } = useParams();

  const isCurrentUserPage = location.pathname === '/currentUser';
  const isUserProfilePage = location.pathname.includes('/user');

  const displayedUser = isCurrentUserPage ? currentUser : otherUser;

  // Function to fetch and update the displayed user's friends list.
  const fetchFriends = useCallback(
    async (friendsUsernames: string[]) => {
      try {
        const friendsData = await Promise.all(
          friendsUsernames.map(async (friendUsername: string) => {
            const friend = await getUserByUsername(friendUsername);
            return friend;
          }),
        );

        // Filter out the displayed user from the friends list.
        const filteredFriends = friendsData.filter(
          friend => friend.username !== displayedUser?.username,
        );

        setUserFriends(filteredFriends);
      } catch (error) {
        setErrText('An error occurred while fetching friend data');
        setUserFriends([]);
      }
    },
    [displayedUser?.username],
  );

  useEffect(() => {
    if (isUserProfilePage && username) {
      // Fetch another user's data by their username.
      const fetchUser = async () => {
        try {
          const fetchedUser = await getUserByUsername(username);
          setOtherUser(fetchedUser || null);
        } catch (error) {
          setErrText('An error occurred while fetching the data');
        }
      };

      fetchUser();
    }
  }, [username, isUserProfilePage, errText]);

  useEffect(() => {
    const fetchDisplayedUserFriends = async () => {
      if (displayedUser) {
        try {
          // Fetch the updated displayed user's data to get their latest friends list.
          const updatedDisplayedUser = await getUserByUsername(displayedUser.username);

          if (updatedDisplayedUser?.friends) {
            // Fetch the friends details using the updated friends list.
            fetchFriends(updatedDisplayedUser.friends);
          } else {
            setUserFriends([]);
          }
        } catch (error) {
          setErrText('An error occurred while fetching the data');
          setUserFriends([]);
        }
      }
    };

    fetchDisplayedUserFriends();

    // Handle real-time friend removal via socket events.
    const handleRemoveFriendSocket = ({ friend }: { user: User; friend: User }) => {
      setUserFriends(prevFriends => prevFriends.filter(f => f.username !== friend.username));
    };

    // Handle real-time friend adding via socket events.
    const handleAddFriendSocket = ({ user, friend }: { user: User; friend: User }) => {
      if (user.username === displayedUser?.username) {
        setUserFriends(prevFriends => [friend, ...prevFriends]);
      }
      if (friend.username === displayedUser?.username) {
        setUserFriends(prevFriends => [user, ...prevFriends]);
      }
    };

    socket.on('removeFriend', handleRemoveFriendSocket);
    socket.on('addFriend', handleAddFriendSocket);

    return () => {
      socket.off('removeFriend', handleRemoveFriendSocket);
      socket.off('addFriend', handleAddFriendSocket);
    };
  }, [displayedUser, socket, fetchFriends]);

  const handleRemoveFriend = async (friend: User) => {
    if (!displayedUser) return;

    try {
      setIsRemoving(friend.username);
      await removeFriend(displayedUser, friend);

      // Re-fetch the updated user's data to get the new friends list.
      const updatedUser = await getUserByUsername(displayedUser.username);
      if (updatedUser?.friends) {
        fetchFriends(updatedUser.friends);
      } else {
        setUserFriends([]);
      }
    } catch (error) {
      setErrText('An error occurred while fetching the data');
    } finally {
      setIsRemoving(null);
    }
  };

  return {
    displayedUser,
    userfriends,
    isRemoving,
    isCurrentUserPage,
    handleRemoveFriend,
  };
};

export default useUserProfileFriends;
