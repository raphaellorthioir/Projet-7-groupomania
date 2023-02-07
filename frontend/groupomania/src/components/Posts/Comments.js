import React from 'react';
import { NavLink } from 'react-router-dom';

const Comments = (props) => {
  const comment = props.comment;
  console.log(props);
  const date = comment.timestamp;
  const formatUpdateDate = (date) => {
    const options = {
      weekday: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  const formatedDate = formatUpdateDate(date);
  return (
    // essai import create comments

    <div>
      <div className="flex cl space-around comments-container">
          <NavLink className="pseudo-link flex row ai-center ac-center pseudo-container">
            <img
              className="profilPicture"
              src={`${props.comment.profilPicture}`}
              alt=""
            />
            <div>{props.comment.pseudo}</div>
          </NavLink>
        
        <div className="date">{formatedDate}</div>
        <p className='text'>{comment.text}</p>
      </div>
    </div>
  );
};

export default Comments;
