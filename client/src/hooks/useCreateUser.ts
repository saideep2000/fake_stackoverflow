import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { isAxiosError } from 'axios';
import { createUser } from '../services/userService';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle creating an account input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns handleInputChange - Function to handle changes in the input field.
 * @returns handleSubmit - Function to handle create account submission
 */
const useCreateUser = () => {
  // State variables for managing input fields and user data
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [pronouns, setPronouns] = useState<string>('');
  const [customPronouns, setCustomPronouns] = useState('');
  const [createAccountError, setCreateAccountError] = useState<string | null>(null);
  const { setUser } = useLoginContext();

  const navigate = useNavigate();

  /**
   * Function to handle the input change event for the name field.
   *
   * @param e - the event object.
   */
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  /**
   * Function to handle the input change event for the username field.
   *
   * @param e - the event object.
   */
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  /**
   * Function to handle the input change event for the password field.
   *
   * @param e - the event object.
   */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * Function to handle the input change event for the email field.
   *
   * @param e - the event object.
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  /**
   * Function to handle the input change event for the pronouns field.
   *
   * @param e - the event object.
   */
  const handlePronounsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setPronouns(selectedValue);

    // Clear custom pronouns if not "Other"
    if (selectedValue !== 'other') {
      setCustomPronouns('');
    }
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Call the createUser service to handle the create account request
      const selectedPronouns = pronouns === 'other' ? customPronouns : pronouns;
      const res = await createUser(
        username,
        password,
        name,
        email,
        selectedPronouns,
        'https://project905bucket.s3.us-east-2.amazonaws.com/1732429190349-profilePicture.png',
        [],
        [],
      );

      if (res?.status === 200) {
        const { user } = res.data; // Assuming the response contains the user data
        setUser(user); // once the user is created, set the user context or state with the new user's data
        navigate('/home'); // Redirect to home after successful accoutn creation
      } else {
        setCreateAccountError('Account creation failed');
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        // If the error is an AxiosError, we can safely access the response
        if (error.response) {
          if (error.response.status === 400) {
            setCreateAccountError(error.response.data);
          } else {
            setCreateAccountError('An error occurred during account creation. Please try again.');
          }
        }
      } else {
        // For any non-Axios error, show a generic error message
        setCreateAccountError('An error occurred during account creation. Please try again.');
      }
    }
  };

  return {
    name,
    username,
    password,
    email,
    pronouns,
    customPronouns,
    createAccountError,
    handleNameChange,
    handleUsernameChange,
    handlePasswordChange,
    handleEmailChange,
    handlePronounsChange,
    setCustomPronouns,
    handleSubmit,
  };
};

export default useCreateUser;
