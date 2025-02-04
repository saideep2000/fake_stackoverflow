import './index.css';
import { Link } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const { username, password, loginError, handleSubmit, handleInputChange, handlePasswordChange } =
    useLogin();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>Please enter your username and password.</h4>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          onChange={handleInputChange}
          placeholder='Enter your username'
          required
          className='input-text'
          id={'usernameInput'}
        />
        <input
          type='password'
          value={password}
          onChange={handlePasswordChange}
          placeholder='Enter your password'
          required
          className='input-text'
          id='passwordInput'
        />
        <button type='submit' className='login-button'>
          Submit
        </button>
      </form>

      {loginError && <p className='error-message'>{loginError}</p>}

      <p>
        Don&apos;t have an account? <Link to='/create-account'>Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
