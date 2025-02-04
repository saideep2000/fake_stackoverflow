import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { User, Notification } from '../types';
import useUserContext from './useUserContext';
import { getUserByUsername, updateUser } from '../services/userService';
import { addNotification } from '../services/notificationService';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to manage user profile information logic.
 */
const useUserProfileInfo = () => {
  const { user: currentUser } = useUserContext();
  const location = useLocation();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const { username } = useParams();

  const isCurrentUserPage = location.pathname === '/currentUser';
  const isUserProfilePage = location.pathname.includes('/user');

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [errText, setErrText] = useState<string>('');

  const displayedUser = isCurrentUserPage ? currentUser : otherUser;

  useEffect(() => {
    if (isUserProfilePage && username) {
      /**
       * Fetch the user data for another user based on the username.
       */
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

  const [isEditing, setIsEditing] = useState(false);
  const [isImageUploadVisible, setIsImageUploadVisible] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [editableName, setEditableName] = useState(displayedUser ? displayedUser.name : '');
  const [editablePassword, setEditablePassword] = useState(
    displayedUser ? displayedUser.password : '',
  );
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [editablePronouns, setEditablePronouns] = useState(
    displayedUser ? displayedUser.pronouns : '',
  );
  const [editableCustomPronouns, setEditableCustomPronouns] = useState(
    displayedUser ? displayedUser.pronouns : '',
  );
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (displayedUser) {
      setEditableName(displayedUser.name);
      setEditablePassword(displayedUser.password);
      setEditablePronouns(displayedUser.pronouns);
      setEditableCustomPronouns(displayedUser.pronouns);
    }
  }, [displayedUser]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setIsImageUploadVisible(!isEditing);
    if (isEditing) {
      setImageUrl('');
      setEditableName(displayedUser?.name || '');
      setEditablePronouns(displayedUser?.pronouns || '');
      setEditableCustomPronouns(displayedUser?.pronouns || '');
      setEditablePassword(displayedUser?.password || '');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handlePronounsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue !== 'other') {
      setEditableCustomPronouns(selectedValue);
      setEditablePronouns(selectedValue);
    } else {
      setEditablePronouns(selectedValue);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!image) {
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImageUrl(response.data.imageUrl);
    } catch (error) {
      // handles image upload error
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (displayedUser) {
      displayedUser.name = editableName;
      displayedUser.pronouns = editableCustomPronouns;
      displayedUser.password = editablePassword;
      displayedUser.image = imageUrl || displayedUser.image; // Use the uploaded image if available
      setIsEditing(false);
      setIsImageUploadVisible(false);
      updateUser(currentUser.username, displayedUser);
    }
  };

  const handleLogout = async () => {
    // set user to null
    setUser(null);
    navigate('/home');
    // Log out the user
    // Redirect to the login page
  };

  useEffect(() => {
    if (!['She/Her', 'He/Him', 'They/Them'].includes(editablePronouns)) {
      setEditablePronouns('Other');
    }
  }, [editablePronouns]);

  useEffect(() => {
    if (isEditing) {
      document.body.classList.add('editing');
    } else {
      document.body.classList.remove('editing');
    }
  }, [isEditing]);

  /**
   * Function to post an answer to a question.
   * It validates the answer text and posts the answer if it is valid.
   */
  const postNotification = async () => {
    let isValid = true;

    if (!username) {
      isValid = false;
      return;
    }

    if (!isValid) {
      return;
    }

    const notification: Notification = {
      sender: currentUser.username,
      receiver: username,
      type: 'request',
    };

    const recieverUser = await getUserByUsername(username);

    await addNotification(recieverUser._id, notification);

    setIsDisabled(true);
  };

  return {
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
  };
};

export default useUserProfileInfo;
