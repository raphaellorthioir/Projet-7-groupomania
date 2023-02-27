import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../AppContext';
import axios from 'axios';

const Comments = (props) => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [oneUser, setUser] = useState();
  useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get(
          `${process.env.REACT_APP_API_URL}api/auth/${props.comment.userId}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setUser(res.data.docs);
        })
        .catch((err) => {
          if (err.response.status === 404) navigate('/error-page');
        });
    };
    fetchUsers();
  }, []);

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

    <article>
      <div className="flex cl space-around comments-container">
        <div className="flex row sb ac-center ai-center">
          <NavLink className=" flex row ai-center ac-center pseudo-container">
            {oneUser?._id === comment.userId && (
              <img
                className="profilPicture"
                src={oneUser?.profilPicture}
                alt={oneUser?.pseudo}
              />
            )}

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
    </article>
  );
};

export default Comments;
