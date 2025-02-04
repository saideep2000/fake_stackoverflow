import { useLocation, Link } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import useHeader from '../../hooks/useHeader';
import useUserContext from '../../hooks/useUserContext';
import './index.css';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown, handleGoToUserProfile } = useHeader();
  const { user } = useUserContext();
  const location = useLocation();

  const isCurrentUserPage = location.pathname === '/currentUser';
  const isUserProfilePage = location.pathname.includes('/user');

  return (
    <div id='header' className='header'>
      <div
        className={isCurrentUserPage ? 'userHeader hidden' : 'userHeader'}
        onClick={() => {
          handleGoToUserProfile();
        }}>
        <div className='profileContainer'>
          <img src={user.image} alt='Profile Picture' className='profilePicture' />
        </div>
        <h3>{user.name}</h3>
      </div>
      <div className='title'>
        <Link to='/home'>
          <div>Fake Stack Overflow</div>
          <AiFillHome />
        </Link>
      </div>
      <input
        id='searchBar'
        placeholder='Search ...'
        className={isCurrentUserPage || isUserProfilePage ? 'searchBar hidden' : 'searchBar'}
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Header;
