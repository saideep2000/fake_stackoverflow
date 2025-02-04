import React, { useState } from 'react';
import './index.css';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';
import { getUserByUsername } from '../../../services/userService';
import { User } from '../../../types';

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  const { titleText, qlist, setQuestionOrder, questionOrder, user } = useQuestionPage();

  const [currUser, setCurrUser] = useState<User>(user);

  const fetchCurrUser = async () => {
    const fetchedUser = await getUserByUsername(user.username);

    if (currUser) {
      setCurrUser(fetchedUser);
    }
  };

  fetchCurrUser();

  return (
    <>
      <QuestionHeader
        titleText={titleText}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
      />
      <div id='question_list' className='question_list'>
        {qlist.map(
          (q, idx) =>
            (q.public ||
              questionOrder === 'friends' ||
              currUser.friends.includes(q.askedBy) ||
              currUser.username === q.askedBy) && <QuestionView q={q} key={idx} />,
        )}
      </div>
      {titleText === 'Search Results' && !qlist.length && (
        <div className='bold_title right_padding'>No Questions Found</div>
      )}
    </>
  );
};

export default QuestionPage;
