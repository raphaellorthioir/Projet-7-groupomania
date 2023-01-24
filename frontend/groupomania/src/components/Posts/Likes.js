import axios from 'axios';
import { useEffect, useState } from 'react';

const Likes = (props) => {
  const postId = props.post._id;
  const [like, setLike] = useState(props.post.usersLiked.length);
  const [disLike, setDisLike] = useState(props.post.usersDisliked.length);
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
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {});
  return (
    <div className="flex row space-around likes-container">
      <div>
        <i
          onClick={() => {
            handleLike(1);
          }}
          class="fa-regular fa-thumbs-up"
        ></i>
        {like}
      </div>
      <div>
        <i
          i
          onClick={() => {
            handleLike(-1);
          }}
          class="fa-regular fa-thumbs-down"
        ></i>
        {disLike}
      </div>
    </div>
  );
};

export default Likes;
