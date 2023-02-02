import React, { useContext } from 'react';
import { UserContext } from '../AppContext';
const EditPost = (props) => {
  const user = useContext(UserContext);
  console.log(props);
  return (
    <div>
      <div className="flex cl space-around post ">
        <div className="flex row sb">
          <div>
            <div className="flex row ai-center ">
              <img
                className="profilPicture"
                src={props.post.profilPicture}
                alt="Profil"
              />
              <div>{props.post.pseudo}</div>
            </div>
          </div>
          {(user.userId === props.post.userId || user.isAdmin) && (
            <div className="edit-box">
              <div className="icon-box">
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </div>
            </div>
          )}
          <div className="title">{props.post.title}</div>
          <div className="text">{props.post.text}</div>

          <div className="postImg">
            {props.post.imageUrl && (
              <img src={props.post.imageUrl} loading="lazy" alt="Post"></img>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
