import './index.css';

import { Link } from 'react-router-dom';
import useCreateUser from '../../hooks/useCreateUser';

/**
 * CreateUser Component contains a form that allows a new user their desired account information, which is then submitted
 * to the application's context through the useLoginContext hook.
 *
 */
const CreateUser = () => {
  const {
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
  } = useCreateUser();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h3>Create an account to get started.</h3>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={name}
          onChange={handleNameChange}
          placeholder='Enter your full name'
          required
          className='input-text'
          id={'nameInput'}
        />
        <input
          type='text'
          value={username}
          onChange={handleUsernameChange}
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
          id={'passwordInput'}
        />
        <input
          type='email'
          value={email}
          onChange={handleEmailChange}
          placeholder='Enter your email'
          required
          className='input-text'
          id={'emailInput'}
        />
        <select
          value={pronouns}
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
        {pronouns === 'Other' && (
          <input
            type='text'
            value={customPronouns}
            onChange={e => setCustomPronouns(e.target.value)}
            placeholder='Enter your pronouns ex.(ze/zir)'
            required
            className='input-text'
          />
        )}
        <button type='submit' className='login-button'>
          Submit
        </button>
      </form>

      {createAccountError && <p className='error-message'>{createAccountError}</p>}

      <p>
        Already have an account? <Link to='/'>Sign in here</Link>
      </p>
    </div>
  );
};
export default CreateUser;
