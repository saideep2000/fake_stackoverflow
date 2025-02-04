import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { isAxiosError } from 'axios';
import useLoginContext from './useLoginContext';
import { loginUser } from '../services/userService';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns handleInputChange - Function to handle changes in the input field.
 * @returns handleSubmit - Function to handle login submission
 */
const useLogin = () => {
  // State variables for managing input fields and user data
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null); // To handle login error messages
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to handle the input change event for the username field.
   *
   * @param e - the event object.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Call the loginUser service to handle the login request
      const res = await loginUser(username, password);

      if (res?.status === 200) {
        const { user } = res.data;
        setUser(user);
        navigate('/home');
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        // If the error is an AxiosError, we can safely access the response
        if (error.response) {
          if (error.response.status === 400) {
            setLoginError('Invalid username or password');
          } else {
            setLoginError('An error occurred during login. Please try again.');
          }
        }
      } else {
        // For any non-Axios error, show a generic error message
        setLoginError('An error occurred during login. Please try again.');
      }
    }
  };

  return { username, password, loginError, handleInputChange, handlePasswordChange, handleSubmit };
};

export default useLogin;
