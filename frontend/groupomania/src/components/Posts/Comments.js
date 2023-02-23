import React from 'react';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../AppContext';

const Comments = (props) => {
  const user = useContext(UserContext);

  const comment = props.comment;

  const date = comment.timestamp;
  const formatUpdateDate = (date) => {
    const options = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  const formatedDate = formatUpdateDate(date);

  const deleteComment = () => {
    props.deleteComment(comment._id);
  };
  return (
    // essai import create comments

    <div>
      <div className="flex cl space-around comments-container">
        <div className="flex row sb ac-center ai-center">
          <NavLink className=" flex row ai-center ac-center pseudo-container">
            <img
              className="profilPicture"
              src={`${comment.profilPicture}`}
              alt=""
            />
            <div>{props.comment.pseudo}</div>
          </NavLink>
          {(user.userId === props.comment.userId || user.isAdmin) && (
            <div onClick={deleteComment} className="delete-comment-btn">
              <i className="fa-solid fa-xmark"></i>
            </div>
          )}
        </div>

        <div className="date">{formatedDate}</div>
        <p className="text">{comment.text}</p>
      </div>
    </div>
  );
};

export default Comments;
