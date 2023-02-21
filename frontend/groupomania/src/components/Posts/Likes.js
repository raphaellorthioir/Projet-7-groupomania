import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const Likes = (props) => {
  const user = useContext(UserContext);
  const postId = props.post._id;
  const navigate = useNavigate();
  const [like, setLike] = useState(props.post.usersLiked);
  const [disLike, setDisLike] = useState(props.post.usersDisliked);
  const handleLike = (e) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}api/post/like/${postId}`,
        {
          like: e,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setLike(res.data.usersLikes);
        setDisLike(res.data.usersDislikes);
      })
      .catch(() => {
        navigate('/logout');
      });
  };

  useEffect(() => {});
  return (
    <div className="flex row space-around likes-container">
      <div className="like-icon flex row ai-center ac-center">
        <i
          style={like.includes(user?.userId) ? { color: 'green' } : {}}
          onClick={() => {
            handleLike(1);
          }}
          className="fa-regular fa-thumbs-up"
        ></i>
        {like.length}
      </div>
      <div className="like-icon flex row ac-center ai-center">
        <i
          style={disLike.includes(user?.userId) ? { color: 'red' } : {}}
          onClick={() => {
            handleLike(-1);
          }}
          className="fa-regular fa-thumbs-down"
        ></i>
        {disLike.length}
      </div>
    </div>
  );
};

export default Likes;
